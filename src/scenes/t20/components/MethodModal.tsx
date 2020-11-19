import {Button, Dimmer, DropdownProps, Form, InputOnChangeData, Loader, Message, Modal} from 'semantic-ui-react';
import {EMethodType} from '../../../core/model/rtm/modelling/RTModelling.type';
import {IRtm} from '../../../core/model/rtm/monitoring/Rtm.type';
import {ISensor} from '../../../core/model/rtm/monitoring/Sensor.type';
import {IToolInstance} from '../../dashboard/defaults/tools';
import {Rtm} from '../../../core/model/rtm/monitoring';
import {fetchApiWithToken} from '../../../services/api';
import RTModellingMethod from '../../../core/model/rtm/modelling/RTModellingMethod';
import React, {ChangeEvent, SyntheticEvent, useEffect, useState} from 'react';
import uuid from 'uuid';

interface IError {
    id: string;
    message: string;
}

interface IProps {
    method: RTModellingMethod;
    onClose: () => void;
    onSave: (value: RTModellingMethod) => void;
    t10Instances: IToolInstance[];
}

const MethodModal = (props: IProps) => {
    const [activeInput, setActiveInput] = useState<string>();
    const [activeValue, setActiveValue] = useState<string>('');
    const [errors, setErrors] = useState<IError[]>([]);
    const [func, setFunc] = useState<string>(props.method.function || '');
    const [isFetching, setIsFetching] = useState<boolean>(false);

    const [rtmId, setRtmId] = useState<string>(props.method.monitoringId);

    const [rtm, setRtm] = useState<IRtm>();
    const [sensor, setSensor] = useState<ISensor>();
    const [parameterId, setParameterId] = useState<string | null>(props.method.parameterId);

    console.log({parameterId})

    useEffect(() => {
        if (!rtmId) {
            return;
        }

        const fetchRtm = async (id: string) => {
            try {
                setIsFetching(true);
                const res = await fetchApiWithToken(`tools/T10/${id}`);
                setRtm(res.data);

                if (props.method.sensorId) {
                    const s = Rtm.fromObject(res.data).sensors.all.filter((s) => s.id === props.method.sensorId);
                    if (s.length > 0) {
                        setSensor(s[0].toObject());
                    }
                }
                if (props.method.parameterId) {
                    setParameterId(props.method.parameterId);
                }
            } catch (err) {
                setErrors([{id: uuid.v4(), message: `Fetching t10 instance ${id} failed.`}]);
            } finally {
                setIsFetching(false);
            }
        };

        fetchRtm(rtmId);

    }, [rtmId]);

    const handleBlurInput = () => {
        if (activeInput === 'func') {
            setFunc(activeValue);
        }
        setActiveInput(undefined);
    }

    const handleChangeInput = (e: ChangeEvent<HTMLInputElement>, {name, value}: InputOnChangeData) => {
        setActiveInput(name);
        setActiveValue(value);
    };

    const handleChangeRtm = (e: SyntheticEvent<HTMLElement, Event>, {value}: DropdownProps) => {
        if (typeof value !== 'string') {
            return null;
        }
        setRtmId(value);
        setParameterId(null);
        setSensor(undefined);
    };

    const handleChangeSensor = (e: SyntheticEvent<HTMLElement, Event>, {value}: DropdownProps) => {
        if (typeof value !== 'string' || !rtm) {
            return null;
        }
        const s = Rtm.fromObject(rtm).findSensor(value);

        if (!s) {
            return null;
        }

        setSensor(s.toObject());
        setParameterId(null);
    };

    const handleChangeParameter = (e: SyntheticEvent<HTMLElement, Event>, {value}: DropdownProps) => {
        if (typeof value !== 'string' || !rtm) {
            return null;
        }
        console.log('HANDLE CHANGE', value);
        setParameterId(value);
    }

    const handleSave = () => {
        const nMethod = props.method.toObject();
        if (props.method.type === EMethodType.FUNCTION && func) {
            nMethod.function = func;
        }
        if (props.method.type === EMethodType.SENSOR && rtmId && sensor && parameterId) {
            nMethod.monitoring_id = rtmId;
            nMethod.sensor_id = sensor.id;
            nMethod.parameter_id = parameterId;
        }
        props.onSave(RTModellingMethod.fromObject(nMethod));
    };

    const renderForm = () => {
        if (props.method.type === EMethodType.SENSOR) {
            return (
                <Form>
                    <Form.Field>
                        <Form.Select
                            label="T10 Instance"
                            placeholder="Select instance"
                            fluid={true}
                            selection={true}
                            value={rtmId}
                            options={props.t10Instances.map((i) => ({
                                key: i.id,
                                text: `${i.name} (${i.user_name})`,
                                value: i.id
                            }))}
                            onChange={handleChangeRtm}
                        />
                    </Form.Field>
                    {rtm &&
                    <Form.Field>
                        <Form.Select
                            disabled={!rtm || rtm.data.sensors.length === 0}
                            label="Sensor"
                            placeholder="Select sensor"
                            fluid={true}
                            selection={true}
                            value={sensor ? sensor.id : undefined}
                            options={Rtm.fromObject(rtm).sensors.all.map((sensor) => {
                                return {
                                    key: sensor.id,
                                    value: sensor.id,
                                    text: sensor.name
                                }
                            })}
                            onChange={handleChangeSensor}
                        />
                    </Form.Field>
                    }
                    {rtm && sensor && sensor.parameters &&
                    <Form.Field>
                        <Form.Select
                            disabled={!sensor}
                            label="Parameter"
                            placeholder="Select parameter"
                            fluid={true}
                            selection={true}
                            value={parameterId ? parameterId : undefined}
                            options={sensor.parameters.map((param) => {
                                console.log(
                                    sensor.parameters
                                );
                                return {
                                    key: param.id,
                                    value: param.id,
                                    text: param.type
                                }
                            })}
                            onChange={handleChangeParameter}
                        />
                    </Form.Field>
                    }
                </Form>
            );
        }

        return (
            <Form>
                <Form.Field>
                    <Form.Input
                        label="Function"
                        name="func"
                        onBlur={handleBlurInput}
                        onChange={handleChangeInput}
                        placeholder='Enter function ...'
                        value={activeInput === 'func' ? activeValue : func}
                    />
                </Form.Field>
            </Form>
        );
    }

    return (
        <Modal
            open={true}
        >
            <Modal.Header>Edit Method Details</Modal.Header>
            <Modal.Content>
                <Modal.Description>
                    {isFetching && <Dimmer active><Loader active={true} inline='centered'/></Dimmer>}
                    {renderForm()}
                    {errors.map((error) => (
                        <Message negative={true} key={error.id}>
                            <Message.Header>Error</Message.Header>
                            <p>{error.message}</p>
                        </Message>
                    ))}
                </Modal.Description>
            </Modal.Content>
            <Modal.Actions>
                <Button color='black' onClick={props.onClose}>
                    Cancel
                </Button>
                <Button
                    content="Yep, that's me"
                    labelPosition='right'
                    icon='checkmark'
                    onClick={handleSave}
                    positive
                />
            </Modal.Actions>
        </Modal>
    );
};

export default MethodModal;

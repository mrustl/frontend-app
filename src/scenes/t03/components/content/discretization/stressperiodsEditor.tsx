import moment from 'moment';
import React, {ChangeEvent, useEffect, useState} from 'react';
import {Form, Grid, InputOnChangeData, Message} from 'semantic-ui-react';
import {ModflowModel, Stressperiods} from '../../../../../core/model/modflow';
import {BoundaryCollection} from '../../../../../core/model/modflow/boundaries';
import ContentToolBar from '../../../../shared/ContentToolbar2';
import {StressperiodsImport} from './index';
import StressPeriodsDataTable from './stressperiodsDatatable';

interface IProps {
    boundaries: BoundaryCollection;
    model: ModflowModel;
    onChange: (modflowModel: ModflowModel) => void;
    onSave: () => void;
    onUndo: () => void;
}

const stressperiodsEditor = (props: IProps) => {
    const [endDateTime, setEndDateTime] = useState<string>(props.model.stressperiods.endDateTime.format('YYYY-MM-DD'));

    useEffect(() => {
        setEndDateTime(props.model.stressperiods.endDateTime.format('YYYY-MM-DD'));
    }, [props.model]);

    const handleChangeEndDateTime = (e: ChangeEvent<HTMLInputElement>, {value}: InputOnChangeData) => {
        if (value && value !== '') {
            setEndDateTime(value);
        }
    };

    const handleBlurEndDateTime = () => {
        const date = moment.utc(endDateTime);
        if (!date.isValid()) {
            return;
        }
        const sp = props.model.stressperiods.toObject();
        sp.end_date_time = date.format();
        handleChange(Stressperiods.fromObject(sp));
    };

    const handleChange = (result: ModflowModel | Stressperiods) => {
        if (result instanceof ModflowModel) {
            return props.onChange(result);
        }

        const model = props.model.getClone();
        model.stressperiods = result;
        return props.onChange(model);
    };

    const datesInvalid = moment.utc(endDateTime)
        .diff(moment.utc(props.model.stressperiods.last().startDateTime)) <= 0;

    return (
        <Grid>
            {!props.model.readOnly &&
            <Grid.Row>
                <Grid.Column width={16}>
                    <ContentToolBar
                        buttonSave={true}
                        buttonImport={
                            <StressperiodsImport
                                onChange={handleChange}
                                stressperiods={props.model.stressperiods}
                            />
                        }
                        onSave={props.onSave}
                        onUndo={props.onUndo}
                    />
                </Grid.Column>
            </Grid.Row>
            }
            <Grid.Row>
                <Grid.Column width={16}>
                    <Form color={'grey'}>
                        <Form.Group>
                            <Form.Input
                                type="date"
                                label="Start Date"
                                name={'startDateTime'}
                                value={moment.utc(props.model.stressperiods.startDateTime).format('YYYY-MM-DD')}
                                readOnly={true}
                            />
                            <Form.Input
                                error={datesInvalid}
                                type="date"
                                label="End Date"
                                name="endDateTime"
                                value={endDateTime}
                                onBlur={handleBlurEndDateTime}
                                onChange={handleChangeEndDateTime}
                                readOnly={props.model.readOnly}
                            />
                            <Form.Select
                                label="Time unit"
                                options={[{key: 4, text: 'days', value: 4}]}
                                value={4}
                                width={16}
                                disabled={props.model.readOnly}
                            />
                            <Form.Input
                                type="number"
                                label="Total time"
                                value={props.model.stressperiods.totim}
                                readOnly={true}
                            />
                        </Form.Group>
                    </Form>
                </Grid.Column>
            </Grid.Row>
            {datesInvalid &&
            <Grid.Row>
                <Grid.Column width={6}>
                    <Message color={'red'}>
                        <strong>Error: </strong>Start date of last stress period is greater than end date.
                    </Message>
                </Grid.Column>
            </Grid.Row>
            }
            <Grid.Row>
                <Grid.Column width={16}>
                    <StressPeriodsDataTable
                        readOnly={props.model.readOnly}
                        stressperiods={props.model.stressperiods}
                        onChange={handleChange}
                    />
                </Grid.Column>
            </Grid.Row>
        </Grid>
    );
};

export default stressperiodsEditor;

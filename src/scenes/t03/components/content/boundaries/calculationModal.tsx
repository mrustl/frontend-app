import React from 'react';
import {Button, Form, Header, Modal} from 'semantic-ui-react';
import {ISpValues, IValueProperty} from '../../../../../core/model/modflow/boundaries/Boundary.type';

interface IProps {
    onCancel: () => void;
    onSave: () => void;
    spValues: ISpValues;
    valueProperties: IValueProperty[];
}

const calculationModal = (props: IProps) => {
    return (
        <Modal centered={false} open={true} dimmer={'blurring'}>
            <Modal.Content>
                <Header>Calculate columns</Header>
                <Form>
                {props.valueProperties.map((v, key) => (
                    <Form.Input key={key} label={`${v.name} (${v.unit})`} type="text"/>
                ))}
                </Form>
            </Modal.Content>
            <Modal.Actions>
                <Button negative={true} onClick={props.onCancel}>Cancel</Button>
                <Button positive={true} onClick={props.onSave}>Apply</Button>
            </Modal.Actions>
        </Modal>
    );
};

export default calculationModal;
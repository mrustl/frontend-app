import React from 'react';
import {pure} from 'recompose';
import PropTypes from 'prop-types';
import {Form, Grid, Header, Radio} from 'semantic-ui-react';
import {SETTINGS_SELECTED_H0, SETTINGS_SELECTED_HL} from '../defaults/T13B';
import {calculateXwd} from '../calculations';
import {getParameterValues} from "../../shared/simpleTools/helpers";

const style = {
    text: {
        padding: '0 20px'
    }
};

const Settings = ({settings, onChange, parameters}) => {

    const {W, K, L, hL, h0} = getParameterValues(parameters);
    const {selected} = settings;

    const xwd = calculateXwd(L, K, W, hL, h0).toFixed(1);

    const handleChange = (e, {name, value}) => {
        onChange({...settings, [name]: value});
    };

    return (
        <Grid padded>
            <Grid.Row centered>
                <Header as='h2'>Settings</Header>
            </Grid.Row>
            <Grid.Row centered>
                <Header as='h3'>Select flow domain:</Header>
            </Grid.Row>
            <Grid.Row centered>
                <p style={style.text}>
                    The regional system is divided into the two subdomains on either side of the water divide.
                    The water divide is located at <strong>{xwd} m</strong>.
                </p>
            </Grid.Row>
            <Grid.Row centered>
                <Form>
                    <Form.Group>
                        <Form.Field>
                            <Radio
                                label='Left'
                                value={SETTINGS_SELECTED_H0}
                                name='selected'
                                checked={selected === SETTINGS_SELECTED_H0}
                                onChange={handleChange}
                            />
                        </Form.Field>
                        <Form.Field>
                            <Radio
                                label='Right'
                                value={SETTINGS_SELECTED_HL}
                                name='selected'
                                checked={selected === SETTINGS_SELECTED_HL}
                                onChange={handleChange}
                            />
                        </Form.Field>
                    </Form.Group>
                </Form>
            </Grid.Row>
        </Grid>
    );
};

Settings.propTypes = {
    onChange: PropTypes.func.isRequired,
    parameters: PropTypes.array.isRequired,
    settings: PropTypes.object.isRequired,
};

export default pure(Settings);
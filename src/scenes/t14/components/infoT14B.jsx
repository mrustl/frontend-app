import {Icon, Message} from 'semantic-ui-react';
import {calcDQ} from '../calculations/calculationT14B';
import {getParameterValues} from '../../shared/simpleTools/helpers';
import PropTypes from 'prop-types';
import React from 'react';

const Info = ({parameters}) => {
    const {d, S, T, t, K, Kdash, bdash, Qw} = getParameterValues(parameters);
    const L = K * bdash / Kdash;
    const dQ = calcDQ(d, S, T, t, L, Qw);
    return (
        <Message icon info>
            <Icon name='info circle' color='blue' />
            <Message.Content>
                <p>
                    The calculated river drawdown is <strong>{dQ.toFixed(1)} m³/d</strong>.
                </p>
            </Message.Content>
        </Message>
    );
};

Info.propTypes = {
    parameters: PropTypes.array.isRequired
};

export default Info;

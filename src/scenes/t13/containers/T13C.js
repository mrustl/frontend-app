import PropTypes from 'prop-types';
import React from 'react';
import {withRouter} from 'react-router-dom';

import image from '../images/T13C.png';
import {Background, ChartT13C as Chart, InfoT13C as Info, Parameters} from '../components/index';

import {defaults} from '../defaults/T13C';

import SliderParameter from 'scenes/shared/simpleTools/parameterSlider/SliderParameter';

import {fetchTool, sendCommand} from 'services/api';
import {createToolInstanceCommand, updateToolInstanceCommand} from 'services/commandFactory';
import AppContainer from '../../shared/AppContainer';
import ToolMetaData from '../../shared/simpleTools/ToolMetaData';
import ToolGrid from "../../shared/simpleTools/ToolGrid";

import {navigation} from './T13';
import {includes} from 'lodash';
import {buildPayload, deepMerge} from "../../shared/simpleTools/helpers";

class T13C extends React.Component {
    constructor() {
        super();
        this.state = {
            tool: defaults(),
            isLoading: false,
            isDirty: false,
            error: false
        };
    }

    componentDidMount() {
        if (this.props.match.params.id) {
            this.setState({isLoading: true});
            fetchTool(
                this.state.tool.type,
                this.props.match.params.id,
                tool => {
                    return this.setState({
                        tool: deepMerge(this.state.tool, tool),
                        isLoading: false
                    })
                },
                error => this.setState({error, isLoading: false})
            )
        }
    }

    save = () => {
        const {id} = this.props.match.params;
        const {tool} = this.state;

        if (id) {
            sendCommand(
                updateToolInstanceCommand(buildPayload(tool)),
                () => this.setState({dirty: false}),
                () => this.setState({error: true})
            );
            return;
        }

        sendCommand(
            createToolInstanceCommand(buildPayload(tool)),
            () => this.props.history.push(`${this.props.location.pathname}/${tool.id}`),
            () => this.setState({error: true})
        );
    };

    handleChangeParameters = (parameters) => {
        this.setState(prevState => {
            return {
                ...prevState,
                tool: {
                    ...prevState.tool,
                    data: {
                        ...prevState.tool.data,
                        parameters: parameters.map(p => p.toObject)
                    }
                }
            };
        });
    };

    handleReset = () => {
        this.setState({
            tool: defaults(),
            isLoading: false,
            isDirty: false
        });
    };

    update = (tool) => this.setState({tool});


    render() {
        const {tool, isLoading} = this.state;
        if (isLoading) {
            return (
                <AppContainer navBarItems={navigation} loader/>
            );
        }

        const {data, permissions} = tool;
        const {parameters} = data;
        const readOnly = !includes(permissions, 'w');

        return (
            <AppContainer navbarItems={navigation}>
                <ToolMetaData tool={tool} readOnly={readOnly} onChange={this.update} onSave={this.save}/>
                <ToolGrid rows={2}>
                    <Background
                        image={image}
                        title={'T13C. Aquifer system with a flow divide outside of the system'}
                    />
                    <Chart parameters={parameters}/>
                    <Info parameters={parameters}/>
                    <Parameters
                        parameters={parameters.map(p => SliderParameter.fromObject(p))}
                        handleChange={this.handleChangeParameters}
                        handleReset={this.handleReset}
                    />
                </ToolGrid>
            </AppContainer>
        );
    }
}

T13C.propTypes = {
    history: PropTypes.object.isRequired,
    location: PropTypes.object.isRequired,
    match: PropTypes.object.isRequired,
};

export default withRouter(T13C);
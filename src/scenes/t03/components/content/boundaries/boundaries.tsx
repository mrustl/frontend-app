import React from 'react';
import {connect} from 'react-redux';
import {withRouter} from 'react-router-dom';
import {Grid, Segment} from 'semantic-ui-react';

import {ModflowModel, Soilmodel} from '../../../../../core/model/modflow';
import {Boundary, BoundaryCollection, BoundaryFactory} from '../../../../../core/model/modflow/boundaries';

import {BoundaryType, IBoundary} from '../../../../../core/model/modflow/boundaries/Boundary.type';
import ContentToolBar from '../../../../../scenes/shared/ContentToolbar';

import {fetchUrl, sendCommand} from '../../../../../services/api';
import {updateBoundaries, updateModel} from '../../../actions/actions';
import ModflowModelCommand from '../../../commands/modflowModelCommand';
import BoundaryDetails from './boundaryDetails';
import BoundariesImport from './boundaryImport';
import BoundaryList from './boundaryList';

const baseUrl = '/tools/T03';

interface IOwnProps {
    history: any;
    location: any;
    match: any;
    readOnly: boolean;
    types: BoundaryType[];
}

interface IStateProps {
    boundaries: BoundaryCollection;
    model: ModflowModel;
    soilmodel: Soilmodel;
}

interface IDispatchProps {
    updateBoundaries: (packages: BoundaryCollection) => any;
    updateModel: (model: ModflowModel) => any;
}

type Props = IStateProps & IDispatchProps & IOwnProps;

interface IState {
    selectedBoundary: IBoundary | null;
    isLoading: boolean;
    isDirty: boolean;
    error: boolean;
    state: null;
}

class Boundaries extends React.Component<Props, IState> {
    constructor(props: Props) {
        super(props);
        this.state = {
            selectedBoundary: null,
            isLoading: true,
            isDirty: false,
            error: false,
            state: null
        };
    }

    public componentDidMount() {
        const {id, pid} = this.props.match.params;
        if (this.props.boundaries.length === 0) {
            return this.setState({
                isLoading: false
            });
        }

        if (!pid && this.props.boundaries.length > 0) {
            return this.redirectToFirstBoundary(this.props);
        }

        if (pid) {
            return this.fetchBoundary(id, pid);
        }
    }

    public componentWillReceiveProps(nextProps: Props) {
        const {id, pid, property} = nextProps.match.params;

        if (!pid && nextProps.boundaries.length > 0) {
            return this.redirectToFirstBoundary(nextProps);
        }

        if ((this.props.match.params.id !== id)
            || (this.props.match.params.pid !== pid)
            || (this.props.match.params.property !== property)
        ) {
            if (nextProps.boundaries.length === 0) {
                return this.setState({
                    selectedBoundary: null
                });
            }

            return this.setState({
                isLoading: true,
            }, () => this.fetchBoundary(id, pid));
        }
    }

    public redirectToFirstBoundary = (props: Props) => {
        const {id, property} = props.match.params;

        if (props.boundaries.length > 0) {
            const bid = props.boundaries.first.id;
            return this.props.history.push(`${baseUrl}/${id}/${property}/!/${bid}`);
        }

        return this.props.history.push(`${baseUrl}/${id}/${property}`);
    };

    public fetchBoundary = (modelId: string, boundaryId: string) =>
        fetchUrl(`modflowmodels/${modelId}/boundaries/${boundaryId}`,
            (boundary: IBoundary) => {
                return this.setState({
                    isLoading: false,
                    selectedBoundary: boundary
                });
            }
        );

    public onChangeBoundary = (boundary: Boundary) => {
        return this.setState({
            selectedBoundary: boundary.toObject(),
            isDirty: true
        });
    };

    public handleBoundaryClick = (bid: string) => {
        const {id, property} = this.props.match.params;
        this.props.history.push(`${baseUrl}/${id}/${property}/${'!'}/${bid}`);
    };

    public onAdd = (type: BoundaryType) => {
        const {id, property} = this.props.match.params;
        if (BoundaryFactory.availableTypes.indexOf(type) >= 0) {
            this.props.history.push(`${baseUrl}/${id}/${property}/${type}`);
        }
    };

    public onClone = (boundaryId: string) => {
        const model = this.props.model;
        fetchUrl(`modflowmodels/${model.id}/boundaries/${boundaryId}`,
            (boundary: IBoundary) => {
                const b = BoundaryFactory.fromObject(boundary);
                if (b) {
                    const clonedBoundary = b.clone();
                    sendCommand(ModflowModelCommand.addBoundary(model.id, clonedBoundary),
                        () => {
                            const boundaries = this.props.boundaries;
                            boundaries.addBoundary(clonedBoundary);
                            this.props.updateBoundaries(boundaries);
                            this.handleBoundaryClick(clonedBoundary.id);
                        },
                        () => this.setState({error: true})
                    );
                }
            }
        );
    };

    public onRemove = (boundaryId: string) => {
        const model = this.props.model;
        return sendCommand(ModflowModelCommand.removeBoundary(model.id, boundaryId),
            () => {
                const boundaries = this.props.boundaries.removeById(boundaryId);
                this.props.updateBoundaries(boundaries);
                this.redirectToFirstBoundary(this.props);
            },
            () => this.setState({error: true})
        );
    };

    public onUpdate = () => {
        if (!this.state.selectedBoundary) {
            return;
        }
        const model = this.props.model;
        const boundary = BoundaryFactory.fromObject(this.state.selectedBoundary);
        return sendCommand(ModflowModelCommand.updateBoundary(model.id, boundary),
            () => {
                this.setState({
                    isDirty: false
                });
                if (boundary) {
                    const boundaries = this.props.boundaries;
                    boundaries.update(boundary);
                    this.props.updateBoundaries(boundaries);
                }
            },
            () => this.setState({error: true})
        );
    };

    public handleChangeImport = (boundaries: BoundaryCollection) => {
        return this.props.updateBoundaries(boundaries);
    };

    public render() {
        const {model, soilmodel, types} = this.props;
        const readOnly = model.readOnly;
        const {error, isDirty, isLoading, selectedBoundary} = this.state;
        const {pid} = this.props.match.params;

        const boundaries = types ? new BoundaryCollection() : this.props.boundaries;
        if (types) {
            boundaries.items = this.props.boundaries.all.filter((b) => types.includes(b.type));
        }

        let boundary = null;
        if (selectedBoundary) {
            boundary = BoundaryFactory.fromObject(selectedBoundary);
        }

        return (
            <Segment color={'grey'} loading={isLoading}>
                <Grid>
                    <Grid.Row>
                        <Grid.Column width={4}>
                            <BoundaryList
                                boundaries={boundaries}
                                onAdd={this.onAdd}
                                onClick={this.handleBoundaryClick}
                                onClone={this.onClone}
                                onRemove={this.onRemove}
                                selected={pid}
                                types={types}
                            />
                        </Grid.Column>
                        <Grid.Column width={12}>
                            <Grid>
                                <Grid.Row>
                                    <Grid.Column width={16}>
                                        <ContentToolBar
                                            onSave={this.onUpdate}
                                            isDirty={isDirty}
                                            isError={error}
                                            saveButton={!readOnly}
                                            importButton={this.props.readOnly ||
                                            <BoundariesImport
                                                model={this.props.model}
                                                boundaries={this.props.boundaries}
                                                onChange={this.handleChangeImport}
                                            />
                                            }
                                        />
                                        {!isLoading && boundary &&
                                        <BoundaryDetails
                                            boundary={boundary}
                                            boundaries={boundaries}
                                            model={model}
                                            soilmodel={soilmodel}
                                            onClick={this.handleBoundaryClick}
                                            onChange={this.onChangeBoundary}
                                            readOnly={readOnly}
                                        />}
                                    </Grid.Column>
                                </Grid.Row>
                            </Grid>
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
            </Segment>
        );
    }
}

const mapStateToProps = (state: any, props: any) => {
    return ({
        readOnly: ModflowModel.fromObject(state.T03.model).readOnly,
        boundaries: BoundaryCollection.fromObject(state.T03.boundaries).filter((b) => props.types.includes(b.type)),
        model: ModflowModel.fromObject(state.T03.model),
        soilmodel: Soilmodel.fromObject(state.T03.soilmodel)
    });
};

const mapDispatchToProps = (dispatch: any): IDispatchProps => ({
    updateBoundaries: (boundaries: BoundaryCollection) => dispatch(updateBoundaries(boundaries)),
    updateModel: (model: ModflowModel) => dispatch(updateModel(model))
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Boundaries));
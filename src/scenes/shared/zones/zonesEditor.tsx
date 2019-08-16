import React, {ChangeEvent, MouseEvent, useState} from 'react';
import {Accordion, AccordionTitleProps, Form, Grid, Header, Icon, InputOnChangeData} from 'semantic-ui-react';
import {Array2D} from '../../../core/model/geometry/Array2D.type';
import BoundingBox from '../../../core/model/geometry/BoundingBox';
import GridSize from '../../../core/model/geometry/GridSize';
import {Zone, ZonesCollection} from '../../../core/model/gis';
import Layer from '../../../core/model/gis/Layer';
import {ILayerParameterZone} from '../../../core/model/gis/LayerParameterZone.type';
import LayerParameterZonesCollection from '../../../core/model/gis/LayerParameterZonesCollection';
import RasterParameter from '../../../core/model/gis/RasterParameter';
import {IRasterFileMetadata} from '../../../services/api/types';
import {RasterDataMap} from '../rasterData';
import RasterfileUploadModal from '../rasterData/rasterfileUploadModal';
import ZonesTable from './zonesTable';

interface IUploadData {
    data: Array2D<number>;
    metadata: IRasterFileMetadata | null;
}

interface IProps {
    boundingBox: BoundingBox;
    layer: Layer;
    gridSize: GridSize;
    onAddRelation: (relation: ILayerParameterZone) => any;
    onChange: (relations: LayerParameterZonesCollection) => any;
    onRemoveRelation: (relation: ILayerParameterZone) => any;
    parameter: RasterParameter;
    relations: LayerParameterZonesCollection;
    readOnly: boolean;
    zones: ZonesCollection;
}

interface ISmoothParameters {
    cycles: number;
    distance: number;
}

const zonesEditor = (props: IProps) => {
    const [activeIndex, setActiveIndex] = useState<number>(0);
    const [smoothParams, setSmoothParams] = useState<ISmoothParameters>({cycles: 1, distance: 1});
    const [rasterUploadModal, setRasterUploadModal] = useState<boolean>(false);

    const recalculateMap = () => {
        /*const cLayer = Layer.fromObject(layer);
        cLayer.zonesToParameters(props.gridSize.toObject(), props.parameter);
        return props.onChange(cLayer);*/
    };

    const smoothMap = () => {
        /*const cLayer = Layer.fromObject(layer);
        cLayer.smoothParameter(props.gridSize.toObject(), parameter, smoothParams.cycles, smoothParams.distance);
        return props.onChange(cLayer);*/
    };

    const handleAddRelation = (relation: ILayerParameterZone) => props.onAddRelation(relation);

    const handleChangeRelation = (relations: LayerParameterZonesCollection) => props.onChange(relations);

    const handleChangeSmoothParams = (e: ChangeEvent<HTMLInputElement>, {name, value}: InputOnChangeData) => {
        const cSmoothParams = {
            ...smoothParams,
            [name]: parseInt(value, 10)
        };

        return setSmoothParams(cSmoothParams);
    };

    const handleRemoveRelation = (relation: ILayerParameterZone) => props.onRemoveRelation(relation);

    const handleSaveModal = (zone: Zone) => {
        /*const cLayer = Layer.fromObject(layer);
        cLayer.zones = cLayer.zones.update(zone.toObject());
        cLayer.zonesToParameters(props.gridSize.toObject(), parameter);
        props.onChange(cLayer);
        return setSelectedZone(null);*/
    };

    const handleUploadRaster = (result: IUploadData) => {
        /*const cLayer = Layer.fromObject(layer);
        const base = cLayer.zones.findFirstBy('priority', 0);
        if (base) {
            const cBase = Zone.fromObject(base);
            const parametersCollection = RasterParametersCollection.fromObject(base.parameters);
            const cParameter = parametersCollection.findFirstBy('name', parameter.name);
            if (cParameter) {
                cParameter.value = cloneDeep(result.data);
                cBase.updateParameter(cParameter);
                cLayer.zones.update(cBase.toObject());
                cLayer.zonesToParameters(props.gridSize.toObject(), parameter);
                setRasterUploadModal(false);
                return props.onChange(cLayer);
            }
        }*/
    };

    const handleCancelUploadModal = () => setRasterUploadModal(false);

    const handleClickUpload = () => setRasterUploadModal(true);

    const handleClick = (e: MouseEvent, titleProps: AccordionTitleProps) => {
        const {index} = titleProps;
        if (index) {
            const newIndex = activeIndex === index ? -1 : index;
            return setActiveIndex(typeof newIndex === 'string' ? parseInt(newIndex, 10) : newIndex);
        }
    };

    const rParameter = props.layer.parameters.filter((p) => p.id === props.parameter.id);

    return (
        <div>
            <Grid>
                <Grid.Row>
                    <Grid.Column>
                        <Header as="h4">{props.parameter.title}, {props.parameter.id} [{props.parameter.unit}]</Header>
                        {rParameter.length > 0 &&
                            <RasterDataMap
                                boundingBox={props.boundingBox}
                                data={rParameter[0].value}
                                gridSize={props.gridSize}
                                unit={props.parameter.unit}
                            />
                        }
                    </Grid.Column>
                </Grid.Row>
                <Grid.Row>
                    <Grid.Column>
                        <Accordion>
                            <Accordion.Title active={activeIndex === 1} index={1} onClick={handleClick}>
                                <Icon name="dropdown"/>
                                <label>Smoothing</label>
                            </Accordion.Title>
                            <Accordion.Content active={activeIndex === 1}>
                                <Form.Group>
                                    <Form.Input
                                        label="Cycles"
                                        type="number"
                                        name="cycles"
                                        value={smoothParams.cycles}
                                        placeholder="cycles="
                                        onChange={handleChangeSmoothParams}
                                        width={5}
                                        readOnly={props.readOnly}
                                    />
                                    <Form.Input
                                        label="Distance"
                                        type="number"
                                        name="distance"
                                        value={smoothParams.distance}
                                        placeholder="distance ="
                                        onChange={handleChangeSmoothParams}
                                        width={5}
                                        readOnly={props.readOnly}
                                    />
                                    <Form.Button
                                        fluid={true}
                                        icon="tint"
                                        labelPosition="left"
                                        onClick={smoothMap}
                                        content={'Start Smoothing'}
                                        width={8}
                                        style={{marginTop: '23px'}}
                                        disabled={props.readOnly}
                                    />
                                    <Form.Button
                                        fluid={true}
                                        icon="trash"
                                        labelPosition="left"
                                        onClick={recalculateMap}
                                        content={'Remove Smoothing'}
                                        width={8}
                                        style={{marginTop: '23px'}}
                                        disabled={props.readOnly}
                                    />
                                </Form.Group>
                            </Accordion.Content>
                        </Accordion>
                    </Grid.Column>
                </Grid.Row>
                <Grid.Row>
                    <Grid.Column>
                        <ZonesTable
                            onAddRelation={handleAddRelation}
                            onClickUpload={handleClickUpload}
                            onChange={handleChangeRelation}
                            onRemoveRelation={handleRemoveRelation}
                            parameter={props.parameter}
                            readOnly={props.readOnly}
                            zones={props.zones}
                            relations={props.relations}
                        />
                    </Grid.Column>
                </Grid.Row>
            </Grid>
            {rasterUploadModal &&
            <RasterfileUploadModal
                gridSize={props.gridSize}
                parameter={props.parameter}
                onCancel={handleCancelUploadModal}
                onChange={handleUploadRaster}
            />
            }
        </div>
    );
};

export default (zonesEditor);

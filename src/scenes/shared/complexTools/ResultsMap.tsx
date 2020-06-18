import {LeafletMouseEvent} from 'leaflet';
import React, {useEffect, useRef, useState} from 'react';
import {
    FeatureGroup,
    LayersControl,
    Map,
    Rectangle,
    Viewport
} from 'react-leaflet';
import {Array2D} from '../../../core/model/geometry/Array2D.type';
import {ICell} from '../../../core/model/geometry/Cells.type';
import {BoundingBox, GridSize, ModflowModel} from '../../../core/model/modflow';
import {BoundaryCollection} from '../../../core/model/modflow/boundaries';
import {getActiveCellFromCoordinate} from '../../../services/geoTools';
import {BasicTileLayer} from '../../../services/geoTools/tileLayers';
import Rainbow from '../../../services/rainbowvis/Rainbowvis';
import {renderAreaLayer, renderBoundaryOverlays, renderBoundingBoxLayer} from '../../t03/components/maps/mapLayers';
import {ColorLegend} from '../rasterData';
import ContourLayer from '../rasterData/contourLayer';
import {
    max,
    min,
    rainbowFactory
} from '../rasterData/helpers';
import {getCellFromClick} from "../../../services/geoTools/getCellFromClick";
import {Feature, Point} from "@turf/helpers";

const style = {
    map: {
        height: '400px',
        width: '100%',
        cursor: 'pointer'
    },
    selectedRow: {
        color: '#000',
        weight: 0.5,
        opacity: 0.5,
        fillColor: '#000',
        fillOpacity: 0.5
    },
    selectedCol: {
        color: '#000',
        weight: 0.5,
        opacity: 0.5,
        fillColor: '#000',
        fillOpacity: 0.5
    },
};

interface IProps {
    activeCell: ICell;
    boundaries: BoundaryCollection;
    data: Array2D<number>;
    globalMinMax?: [number, number];
    model: ModflowModel;
    onClick: (cell: ICell) => any;
    onViewPortChange?: (viewport: Viewport) => any;
    viewport?: Viewport;
    colors?: string[];
    opacity?: number;
}

interface IState {
    viewport: Viewport | null;
}

const resultsMap = (props: IProps) => {
    const [state, setState] = useState<IState>({viewport: null});
    const mapRef = useRef<Map | null>(null);

    useEffect(() => {
        const {viewport} = props;
        if (viewport) {
            setState({viewport});
        }
    }, []);

    useEffect(() => {
        const {viewport} = props;
        if (viewport) {
            setState({viewport});
        }
    }, [props.viewport]);

    const handleClickOnMap = ({latlng}: LeafletMouseEvent) => {
        const activeCell = getCellFromClick(
            props.model.boundingBox,
            props.model.gridSize,
            latlng,
            props.model.rotation,
            props.model.geometry.centerOfMass
        );

        if (!props.model.gridSize.isWithIn(activeCell[0], activeCell[1])) {
            return;
        }

        props.onClick(activeCell);
    };

    const renderLegend = (rainbow: Rainbow) => {
        const gradients = rainbow.gradients.slice().reverse();
        const lastGradient = gradients[gradients.length - 1];
        const legend = gradients.map((gradient) => ({
            color: '#' + gradient.endColor,
            value: Number(gradient.maxNum).toExponential(2)
        }));

        legend.push({
            color: '#' + lastGradient.startColor,
            value: Number(lastGradient.minNum).toExponential(2)
        });

        return <ColorLegend legend={legend} unit={''}/>;
    };

    const renderSelectedRowAndCol = () => {
        const [selectedCol, selectedRow] = props.activeCell;

        const dX = props.model.boundingBox.dX / props.model.gridSize.nX;
        const dY = props.model.boundingBox.dY / props.model.gridSize.nY;

        const selectedRowBoundsLatLng: Array<[number, number]> = [
            [props.model.boundingBox.yMax - selectedRow * dY, props.model.boundingBox.xMin],
            [props.model.boundingBox.yMax - (selectedRow + 1) * dY, props.model.boundingBox.xMax]
        ];

        const selectedColBoundsLatLng: Array<[number, number]> = [
            [props.model.boundingBox.yMin, props.model.boundingBox.xMin + selectedCol * dX],
            [props.model.boundingBox.yMax, props.model.boundingBox.xMin + (selectedCol + 1) * dX]
        ];



        return (
            <FeatureGroup>
                <Rectangle
                    bounds={selectedColBoundsLatLng}
                    color={style.selectedCol.color}
                    weight={style.selectedCol.weight}
                    opacity={style.selectedCol.opacity}
                    fillColor={style.selectedCol.fillColor}
                    fillOpacity={style.selectedCol.fillOpacity}
                />
                <Rectangle
                    bounds={selectedRowBoundsLatLng}
                    color={style.selectedRow.color}
                    weight={style.selectedRow.weight}
                    opacity={style.selectedRow.opacity}
                    fillColor={style.selectedRow.fillColor}
                    fillOpacity={style.selectedRow.fillOpacity}
                />
            </FeatureGroup>
        );
    };

    const handleViewPortChange = () => {
        if (!mapRef.current) {
            return;
        }

        const {viewport} = mapRef.current;
        setState({viewport});

        if (!props.onViewPortChange) {
            return;
        }

        return props.onViewPortChange(viewport);
    };

    let minData = min(props.data);
    let maxData = max(props.data);

    if (props.globalMinMax) {
        [minData, maxData] = props.globalMinMax;
    }

    const rainbowVis = rainbowFactory(
        {min: minData, max: maxData},
        props.colors || ['#800080', '#ff2200', '#fcff00', '#45ff8e', '#15d6ff', '#0000FF']
    );

    return (
        <Map
            ref={mapRef}
            style={style.map}
            bounds={state.viewport ? undefined : props.model.geometry.getBoundsLatLng()}
            zoom={state.viewport && state.viewport.zoom ? state.viewport.zoom : undefined}
            center={state.viewport && state.viewport.center ? state.viewport.center : undefined}
            onclick={handleClickOnMap}
            boundsOptions={{padding: [20, 20]}}
            onmoveend={handleViewPortChange}
        >
            <BasicTileLayer/>
            <LayersControl position="topright">
                <LayersControl.Overlay name="Model area" checked={true}>
                    {renderAreaLayer(props.model.geometry)}
                </LayersControl.Overlay>
                <ContourLayer
                    boundingBox={props.model.boundingBox}
                    data={props.data}
                    geometry={props.model.geometry}
                    gridSize={props.model.gridSize}
                    rainbow={rainbowVis}
                    rotation={props.model.rotation}
                    steps={0}
                />
                {renderBoundingBoxLayer(props.model.boundingBox, props.model.rotation, props.model.geometry)}
                {renderBoundaryOverlays(props.boundaries)}
                {renderLegend(rainbowVis)}
            </LayersControl>
            {renderSelectedRowAndCol()}
        </Map>
    );
};

export default resultsMap;

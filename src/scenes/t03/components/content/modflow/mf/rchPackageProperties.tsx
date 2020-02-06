import React, {useState} from 'react';
import {Checkbox, Form, Grid, Header, Input, Label} from 'semantic-ui-react';
import {FlopyModflowMfrch} from '../../../../../../core/model/flopy/packages/mf';
import FlopyModflow from '../../../../../../core/model/flopy/packages/mf/FlopyModflow';
import FlopyModflowMfbas from '../../../../../../core/model/flopy/packages/mf/FlopyModflowMfbas';
import {IFlopyModflowMfrch} from '../../../../../../core/model/flopy/packages/mf/FlopyModflowMfrch';
import {GridSize} from '../../../../../../core/model/modflow';
import renderInfoPopup from '../../../../../shared/complexTools/InfoPopup';
import {RasterDataImage} from '../../../../../shared/rasterData';
import {documentation} from '../../../../defaults/flow';

interface IProps {
    mfPackage: FlopyModflowMfrch;
    mfPackages: FlopyModflow;
    onChange: (pck: FlopyModflowMfrch) => any;
    readonly: boolean;
}

const rchPackageProperties = (props: IProps) => {
    const [mfPackage, setMfPackage] = useState<IFlopyModflowMfrch>(props.mfPackage.toObject());
    const {readonly} = props;

    if (!mfPackage) {
        return null;
    }

    const {mfPackages} = props;
    const spData2D = Object.values(mfPackage.rech)[0];

    const basPackage = mfPackages.getPackage('bas');
    if (!basPackage || !(basPackage instanceof FlopyModflowMfbas)) {
        return null;
    }
    const {ibound} = basPackage;

    return (
        <Form>
            <Header as={'h3'} dividing={true}>RCH: Recharge Package</Header>
            <Grid divided={'vertically'}>
                <Grid.Row columns={2}>
                    <Grid.Column>
                        <Label>Stress period data (SP1)</Label>
                        <RasterDataImage
                            data={spData2D}
                            gridSize={GridSize.fromArray([0, 0])/*GridSize.fromData(ibound)*/}
                            unit={''}
                            border={'1px dotted black'}
                        />
                    </Grid.Column>
                </Grid.Row>
            </Grid>

            <Form.Group widths="equal">
                <Form.Field>
                    <label>Save cell-by-cell budget data (ipakcb)</label>
                    <Checkbox
                        toggle={true}
                        readOnly={readonly}
                        name={'ipakcb'}
                        value={mfPackage.ipakcb ? 1 : 0}
                        icon={renderInfoPopup(documentation.rch.ipakcb, 'IPAKCB')}
                    />
                </Form.Field>
            </Form.Group>

            <Form.Group widths="equal">
                <Form.Field>
                    <label>Filename extension</label>
                    <Input
                        readOnly={readonly}
                        name="extension"
                        value={mfPackage.extension || ''}
                        icon={renderInfoPopup(documentation.rch.extension, 'extension')}
                    />
                </Form.Field>
                <Form.Field>
                    <label>File unit number</label>
                    <Input
                        readOnly={readonly}
                        type={'number'}
                        name="unitnumber"
                        value={mfPackage.unitnumber || ''}
                        icon={renderInfoPopup(documentation.rch.unitnumber, 'unitnumber')}
                    />
                </Form.Field>
                <Form.Field>
                    <label>Filenames</label>
                    <Input
                        readOnly={readonly}
                        name="filenames"
                        value={mfPackage.filenames || ''}
                        icon={renderInfoPopup(documentation.rch.filenames, 'filenames')}
                    />
                </Form.Field>
            </Form.Group>
        </Form>
    );
};

export default rchPackageProperties;
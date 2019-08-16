import React from 'react';
import {pure} from 'recompose';
import {Button, Icon, Menu, Popup} from 'semantic-ui-react';
import Zone from '../../../../../core/model/gis/Zone';
import {IZone} from '../../../../../core/model/gis/Zone.type';
import ZonesCollection from '../../../../../core/model/gis/ZonesCollection';

interface IProps {
    zones: ZonesCollection;
    onClick: (zoneId: string) => any;
    onClone: (zone: Zone) => any;
    onRemove: (zoneId: string) => any;
    selected?: string;
}

const zonesList = ({zones, onClick, onClone, onRemove, selected}: IProps) => {

    const handleClick = (id: string) => {
        return () => onClick(id);
    };

    const handleClone = (zone: Zone) => {
        return () => onClone(zone);
    };

    const handleRemove = (id: string) => {
        return () => onRemove(id);
    };

    return (
        <div>
            <Menu fluid={true} vertical={true} tabular={true}>
                {zones.all.map((zone: IZone) => (
                    <Menu.Item
                        name={zone.name}
                        key={zone.id}
                        active={zone.id === selected}
                        onClick={handleClick(zone.id)}
                    >
                        <Popup
                            trigger={<Icon name="ellipsis horizontal"/>}
                            content={
                                <div>
                                    <Button.Group size="small">
                                        <Popup
                                            trigger={
                                                <Button
                                                    icon={'clone'}
                                                    onClick={handleClone(Zone.fromObject(zone))}
                                                />
                                            }
                                            content="Clone"
                                            position="top center"
                                            size="mini"
                                        />
                                        <Popup
                                            trigger={
                                                <Button
                                                    icon={'trash'}
                                                    onClick={handleRemove(zone.id)}
                                                />
                                            }
                                            content="Delete"
                                            position="top center"
                                            size="mini"
                                        />
                                    </Button.Group>
                                </div>
                            }
                            on={'click'}
                            position={'right center'}
                        />
                        {zone.name}
                    </Menu.Item>
                ))}
            </Menu>
        </div>
    );
};

export default pure(zonesList);

import ModflowModelCommand from '../../../../../scenes/t03/commands/modflowModelCommand';
import {sendCommand} from '../../../../../services/api';
import {dropData, FileData} from '../../../../../services/dataDropper';
import {IModflowModel} from '../../ModflowModel.type';
import {Soilmodel} from '../index';
import {ISoilmodel} from '../Soilmodel.type';
import {ISoilmodelLayer} from '../SoilmodelLayer.type';

const addCommand = (commands: ModflowModelCommand[], model: IModflowModel, layer: ISoilmodelLayer) => {
    commands.push(
        ModflowModelCommand.updateLayer({
            id: model.id,
            layer: {
                ...layer,
                parameters: layer.parameters.map((p) => {
                    p.data = {
                        file: p.data.file
                    };
                    p.value = Array.isArray(p.value) ? undefined : p.value;
                    return p;
                }),
                relations: layer.relations.map((r) => {
                    r.data = {
                        file: r.data.file
                    };
                    r.value = Array.isArray(r.value) ? undefined : r.value;
                    return r;
                })
            }
        })
    );
    return commands;
};

export const saveLayer = (
    layer: ISoilmodelLayer,
    model: IModflowModel,
    isFinished: boolean,
    task: number = 0,
    onEachTask: ({message, task}: { message: string, task: number }) => any,
    onFinished: (layer: ISoilmodelLayer) => any
) => {
    const parameters = layer.parameters.filter((p) => Array.isArray(p.value));
    if (parameters.length > 0) {
        task = ++task;
        if (!!onEachTask) {
            onEachTask({
                message: `Saving data for parameter ${parameters[0].id}.`,
                task
            });
        }

        dropData(parameters[0].value).then((file) => {
            layer.parameters = layer.parameters.map((p) => {
                if (p.id === parameters[0].id) {
                    p.data.file = file;
                    p.value = undefined;
                }
                return p;
            });

            return saveLayer(layer, model, false, task, onEachTask, onFinished);
        });
        return;
    }

    const relations = layer.relations.filter((r) => Array.isArray(r.value));
    if (relations.length > 0) {
        task = ++task;
        if (!!onEachTask) {
            onEachTask({
                message: `Saving data for relation ${relations[0].id}.`,
                task
            });
        }

        dropData(relations[0].value).then((file) => {
            layer.relations = layer.relations.map((r) => {
                if (r.id === relations[0].id) {
                    r.data.file = file;
                    r.value = undefined;
                }
                return r;
            });

            return saveLayer(layer, model, false, task, onEachTask, onFinished);
        });
        return;
    }

    if (!isFinished) {
        sendCommand(
            ModflowModelCommand.updateLayer({
                id: model.id,
                layer: {
                    ...layer,
                    parameters: layer.parameters.map((p) => {
                        p.data = {
                            file: p.data.file
                        };
                        p.value = Array.isArray(p.value) ? undefined : p.value;
                        return p;
                    }),
                    relations: layer.relations.map((r) => {
                        r.data = {
                            file: r.data.file
                        };
                        r.value = Array.isArray(r.value) ? undefined : r.value;
                        return r;
                    })
                }
            }), () => {
                saveLayer(layer, model, true, task, onEachTask, onFinished);
            }
        );
        return;
    }
    if (!!onFinished) {
        return onFinished(layer);
    }
    return;
};

export const saveSoilmodel = (
    model: IModflowModel,
    soilmodel: ISoilmodel,
    onEachTask: ({message, task}: { message: string, task: number }) => any,
    onSuccess: (soilmodel: ISoilmodel, needToBeFetched: boolean) => any,
    saveProperties: boolean,
    commands: ModflowModelCommand[] = [],
    task: number = 0,
): ISoilmodel => {
    const cSoilmodel = Soilmodel.fromObject(soilmodel);

    if (saveProperties) {
        onEachTask({
            message: `Saving soilmodel properties.`,
            task: task++
        });
        sendCommand(
            ModflowModelCommand.updateSoilmodelProperties({
                id: model.id,
                properties: cSoilmodel.toObject().properties
            }), () => {
                return saveSoilmodel(
                    model, cSoilmodel.toObject(), onEachTask, onSuccess, false, commands, task
                );
            }
        );
    }

    const layers = soilmodel.layers.filter((layer) =>
        layer.parameters.filter((p) => Array.isArray(p.value)) ||
        layer.relations.filter((r) => Array.isArray(r.value))
    );

    if (layers.length > 0) {
        const cLayer = layers[0];
        const parameters = cLayer.parameters.filter((p) => Array.isArray(p.value));
        if (parameters.length > 0) {
            if (!!onEachTask && task) {
                onEachTask({
                    message: `Saving data for parameter ${parameters[0].id}.`,
                    task: task++
                });
            }

            dropData(parameters[0].value).then((file) => {
                cLayer.parameters = cLayer.parameters.map((p) => {
                    if (p.id === parameters[0].id) {
                        p.data.file = file;
                        p.value = undefined;
                    }
                    return p;
                });
                cSoilmodel.updateLayer(cLayer);

                return saveSoilmodel(
                    model, cSoilmodel.toObject(), onEachTask, onSuccess, false,
                    addCommand(commands, model, cLayer), task
                );
            });
        }

        const relations = cLayer.relations.filter((r) => Array.isArray(r.value));
        if (relations.length > 0) {
            if (!!onEachTask && task) {
                onEachTask({
                    message: `Saving data for relation ${relations[0].id}.`,
                    task: task++
                });
            }

            dropData(relations[0].value).then((file) => {
                cLayer.relations = cLayer.relations.map((r) => {
                    if (r.id === relations[0].id) {
                        r.data.file = file;
                        r.value = undefined;
                    }
                    return r;
                });
                cSoilmodel.updateLayer(cLayer);

                return saveSoilmodel(
                    model, cSoilmodel.toObject(), onEachTask,  onSuccess, false,
                    addCommand(commands, model, cLayer), task
                );
            });
        }
    }

    const command = commands.shift();
    if (command) {
        sendCommand(command);
        return saveSoilmodel(model, cSoilmodel.toObject(), onEachTask, onSuccess, false, commands, task);
    }

    return onSuccess(cSoilmodel.toObject(), false);
};

export const fetchSoilmodel = (
    soilmodel: ISoilmodel,
    onEachTask: (result: { message: string, fetching: boolean }) => any,
    onFinished: (soilmodel: ISoilmodel) => any
) => {
    const layers = soilmodel.layers.filter((layer) =>
        layer.parameters.filter(
            (parameter) => parameter.data.file && !Array.isArray(parameter.data.data)).length > 0 ||
        layer.relations.filter((relation) => relation.data.file && !Array.isArray(relation.data.data)).length > 0);

    if (layers.length > 0) {
        const layer = layers[0];
        const parameters = layer.parameters.filter(
            (parameter) => parameter.data.file && !Array.isArray(parameter.data.data)
        );
        if (parameters.length > 0) {
            const parameter = parameters[0];
            onEachTask({
                message: `Fetching parameter ${parameter.id} for layer ${layer.name}`,
                fetching: true
            });

            if (parameter.data.file) {
                FileData.fromFile(parameter.data.file).then((file) => {
                    soilmodel.layers = soilmodel.layers.map((l) => {
                        if (l.id === layer.id) {
                            l.parameters = l.parameters.map((p) => {
                                if (p.id === parameter.id) {
                                    p.data = file.toObject();
                                }
                                return p;
                            });
                        }
                        return l;
                    });
                    return fetchSoilmodel(soilmodel, onEachTask, onFinished);
                });
            }
            return;
        }
        const relations = layer.relations.filter(
            (relation) => relation.data.file && !Array.isArray(relation.data.data)
        );
        if (relations.length > 0) {
            const relation = relations[0];

            onEachTask({
                message: `Fetching relation ${relation.id} for layer ${layer.name}`,
                fetching: true
            });

            if (relation.data.file) {
                FileData.fromFile(relation.data.file).then((file) => {
                    soilmodel.layers = soilmodel.layers.map((l) => {
                        if (l.id === layer.id) {
                            l.relations = l.relations.map((r) => {
                                if (r.id === relation.id) {
                                    r.data = file.toObject();
                                }
                                return r;
                            });
                        }
                        return l;
                    });
                    return fetchSoilmodel(soilmodel, onEachTask, onFinished);
                });
            }
            return;
        }
    }

    onEachTask({
        message: `Fetching finished.`,
        fetching: false
    });

    return onFinished(soilmodel);
};
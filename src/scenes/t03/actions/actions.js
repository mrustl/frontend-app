import {UPDATE_BOUNDARIES} from '../reducers/boundaries';
import {UPDATE_MODEL, UPDATE_MT3DMS, UPDATE_STRESSPERIODS} from '../reducers/model';
import {UPDATE_SOILMODEL} from '../reducers/soilmodel';

import {ModflowModel, Stressperiods} from 'core/model/modflow';
import {BoundaryCollection} from 'core/model/modflow/boundaries';
import {Soilmodel} from 'core/model/modflow/soilmodel';
import {Mt3dms} from 'core/model/modflow/mt3d';

export function updateModel(modflowModel) {
    if (!modflowModel instanceof ModflowModel) {
        throw new Error('ModflowModel is expected to be instance of ModflowModel');
    }

    return {
        type: UPDATE_MODEL,
        model: modflowModel.toObject()
    };
}

export function updateStressperiods(stressperiods) {
    if (!stressperiods instanceof Stressperiods) {
        throw new Error('Stressperiods is expected to be instance of Stressperiods');
    }

    return {
        type: UPDATE_STRESSPERIODS,
        payload: stressperiods.toObject()
    };
}

export function updateBoundaries(boundaryCollection) {
    if (!boundaryCollection instanceof BoundaryCollection) {
        throw new Error('BoundaryCollection is expected to be instance of BoundaryCollection');
    }

    return {
        type: UPDATE_BOUNDARIES,
        boundaries: boundaryCollection.toObject()
    };
}

export function updateMt3dms(mt3dms) {
    if (!mt3dms instanceof Mt3dms) {
        throw new Error('Mt3dms is expected to be instance of Mt3dms');
    }

    return {
        type: UPDATE_MT3DMS,
        payload: mt3dms.toObject()
    };
}

export function updateSoilmodel(soilmodel) {
    if (!soilmodel instanceof Soilmodel) {
        throw new Error('soilmodel is expected to be instance of Soilmodel');
    }

    return {
        type: UPDATE_SOILMODEL,
        soilmodel: soilmodel.toObject
    };
}

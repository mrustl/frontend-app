import {IOptimizationLocation} from './OptimizationLocation.type';
import {ESummaryMethod} from './OptimizationObjective.type';
import {IPropertyValueObject} from "../../types";

export enum EConstraintType {
    DISTANCE = 'distance',
    FLUX = 'flux',
    INPUT_CONC = 'inputConc',
    NONE = ''
}

export enum EOperator {
    MORE = 'more'
}

export interface IOptimizationConstraint extends IPropertyValueObject {
    id: string;
    name: string;
    type: EConstraintType;
    concFileName: string;
    summaryMethod: ESummaryMethod;
    value: number;
    operator: EOperator;
    location: IOptimizationLocation;
    location1: IOptimizationLocation;
    location2: IOptimizationLocation;
}

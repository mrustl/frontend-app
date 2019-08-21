import {cloneDeep} from 'lodash';
import {ISensor} from './Sensor.type';

export default class Sensor {

    get id(): string {
        return this._props.id;
    }

    set id(value: string) {
        this._props.id = value;
    }

    get name(): string {
        return this._props.name;
    }

    set name(value: string) {
        this._props.name = value;
    }

    get geolocation(): [number, number] | null {
        return this._props.geolocation;
    }

    set geolocation(value: [number, number] | null) {
        this._props.geolocation = value;
    }

    public static fromObject(obj: ISensor): Sensor {
        return new Sensor(obj);
    }

    private readonly _props: ISensor;

    constructor(data: ISensor) {
        this._props = cloneDeep(data);
    }

    public toObject(): ISensor {
        return this._props;
    }
}

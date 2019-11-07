import {cloneDeep} from 'lodash';

export class GenericObject<T> {

    protected _props: T;

    constructor(data: T) {
        this._props = data;
    }

    public toObject(): T {
        return cloneDeep(this._props);
    }

    public getClone() {
        this._props = cloneDeep(this._props);
        return this;
    }
}

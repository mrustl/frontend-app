class Geometry {

    _geometry;

    static fromGeoJson(geoJson) {
        if (geoJson.geometry) {
            return new Geometry(geoJson.geometry);
        }

        return new Geometry(geoJson);
    }

    static fromObject(obj) {
        return new Geometry(obj);
    }

    constructor(geometry) {
        this._geometry = geometry;
    }

    get type() {
        return this._geometry.type;
    }

    fromType(type) {
        return (type.toLowerCase() === this.type.toLowerCase());
    }

    get coordinates() {
        return this._geometry.coordinates;
    }

    get coordinatesLatLng() {
        const coordinates = this._geometry.coordinates;
        switch (this._geometry.type.toLowerCase()) {
            case 'polygon':
                return (this.getLatLngFromXY(coordinates[0]));
            case 'linestring':
                return (this.getLatLngFromXY(coordinates));
            case 'point':
                return ([coordinates[1], coordinates[0]]);
            default:
                return null;
        }
    }

    toObject = () => (this._geometry);

    toGeoJSON = () => (this._geometry);

    getLatLngFromXY = coordinates => coordinates.map(c => [c[1], c[0]]);
}

export default Geometry;

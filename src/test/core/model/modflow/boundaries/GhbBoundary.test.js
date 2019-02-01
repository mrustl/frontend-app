import Moment from  'moment';
import Uuid from 'uuid';
import {GeneralHeadBoundary} from 'core/model/modflow/boundaries';

test('GhbBoundary createWithStartDate', () => {
    const id = Uuid.v4();
    const name = 'NameOfBoundary';
    const geometry = {type: 'LineString', coordinates: [[0, 0], [0, 10], [10, 10], [10, 0]]};
    const startDateTime = new Moment.utc('2015-01-02').toISOString();

    const boundary = GeneralHeadBoundary.createWithStartDate({
        id,
        name,
        geometry,
        utcIsoStartDateTime: startDateTime
    });

    expect(boundary).toBeInstanceOf(GeneralHeadBoundary);
    expect(boundary.id).toEqual(id);
    expect(boundary.name).toEqual(name);
    expect(boundary.geometry).toEqual(geometry);
    expect(boundary.affectedLayers).toEqual([0]);
    expect(boundary.metadata).toEqual({});
    expect(boundary.getDateTimeValues()).toEqual([{date_time: startDateTime, values: [0, 0]}]);
    expect(boundary.activeCells).toBeNull();
});
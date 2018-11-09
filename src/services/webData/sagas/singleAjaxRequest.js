import { put, select, call } from 'redux-saga/effects';
import { getApiKey } from '../../../scenes/user/reducers';
import { Action } from '../actions';
import { Action as UserActions } from '../../../scenes/user/actions';
import axios from 'services/axios';

export default function* singleAjaxRequestFlow({
    url,
    provokingActionType,
    method = 'get',
    data
}) {
    const state = yield select();
    const apiKey = getApiKey(state.session);

    if (!['post', 'get', 'put'].includes(method)) {
        throw new Error('Invalid http method.');
    }

    let headers = {};
    if (apiKey) {
        headers = { 'X-AUTH-TOKEN': apiKey };
    }

    yield put(Action.setAjaxStatus(provokingActionType, {type: 'loading'}));

    try {
        const response = yield call(axios, {method, url, data, headers: headers});
        yield put(Action.setAjaxStatus(provokingActionType, {type: 'success'}));
        return response.data;
    } catch (e) {
        yield put(Action.setAjaxStatus(provokingActionType, {type: 'error', error: e}));
        if (e.response.status === 401) {
            yield put(UserActions.logout());
        }
        return null;
    }
}

import { Effect, Reducer } from 'umi';
import { addFakeList, queryFakeList, queryModelList, deleteModel, removeFakeList, updateFakeList } from './service';

import { BasicListItemDataType } from './data.d';
import { Item } from 'gg-editor';

function sleep(time) {
  return new Promise(function (resolve) {
    setTimeout(resolve, time);
  });
}

export interface StateType {
  list: BasicListItemDataType[];
}

export interface ModelType {
  namespace: string;
  state: StateType;
  effects: {
    fetch: Effect;
    appendFetch: Effect;
    submit: Effect;
    delete: Effect;
  };
  reducers: {
    queryList: Reducer<StateType>;
    appendList: Reducer<StateType>;
  };
}

const Model: ModelType = {
  namespace: 'modelMy',

  state: {
    list: [],
  },

  effects: {
    *fetch({ payload }, { call, put }) {
      const modelResult = yield call(queryModelList, payload);
      if (modelResult.errcode === 0) {
        const list = modelResult.info;
        yield put({
          type: 'queryList',
          payload: list,
        });
        let isNeedReFetch = false;
        for (let i = 0; i < list.length; i += 1) {
          const item = list[i];
          if (item.percent && item.percent < 100) {
            isNeedReFetch = true;
          }
        }
        if (isNeedReFetch) {
          yield sleep(1000);
          yield put({
            type: 'fetch',
          });
        }
      }
    },
    *appendFetch({ payload }, { call, put }) {
      const response = yield call(queryFakeList, payload);
      yield put({
        type: 'appendList',
        payload: Array.isArray(response) ? response : [],
      });
    },
    *submit({ payload }, { call, put }) {
      let callback;
      if (payload.id) {
        callback = Object.keys(payload).length === 1 ? removeFakeList : updateFakeList;
      } else {
        callback = addFakeList;
      }
      const response = yield call(callback, payload); // post
      yield put({
        type: 'queryList',
        payload: response,
      });
    },
    *delete({ payload }, { call, put }) {
      const result = yield call(deleteModel, payload.modelName);
      if (result.errcode === 0) {
        yield put({
          type: 'fetch',
        });
      }
    },
  },

  reducers: {
    queryList(state, action) {
      return {
        ...state,
        list: action.payload,
      };
    },
    appendList(state = { list: [] }, action) {
      return {
        ...state,
        list: state.list.concat(action.payload),
      };
    },
  },
};

export default Model;

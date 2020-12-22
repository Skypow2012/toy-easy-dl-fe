import { Effect, Reducer } from 'umi';

import { CardListItemDataType } from './data.d';
import { getModels } from './service';

export interface StateType {
  list: CardListItemDataType[];
}

export interface ModelType {
  namespace: string;
  state: StateType;
  effects: {
    fetch: Effect;
    refresh: Effect;
  };
  reducers: {
    queryList: Reducer<StateType>;
  };
}

const Model: ModelType = {
  namespace: 'modelPush',

  state: {
    list: [],
  },

  effects: {
    *fetch(_nothing, { call, put }) {
      const result = yield call(getModels);
      console.log(result);
      if (result.errcode !== 0) return;
      yield put({
        type: 'queryList',
        payload: result.paramModels,
      });
    },
  },

  reducers: {
    queryList(state, action) {
      return {
        ...state,
        list: action.payload,
      };
    },
  },
};

export default Model;

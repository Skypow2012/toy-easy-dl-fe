import { Effect, Reducer } from 'umi';
import { message } from 'antd';
import { fakeSubmitForm, apiGetClasses } from './service';

export interface ModelType {
  namespace: string;
  state: StateType;
  effects: {
    submitRegularForm: Effect;
    getClasses: Effect;
  };
  reducers: {
    updateClasses: Reducer<StateType>;
  }
}
export interface StateType {
  classes: [];
}
const Model: ModelType = {
  namespace: 'modelTrain',

  state: {
    classes: [],
  },

  effects: {
    *submitRegularForm({ payload }, { call }) {
      yield call(fakeSubmitForm, payload);
      message.success('提交成功');
    },
    *getClasses({ payload }, { call, put }) {
      const result = yield call(apiGetClasses);
      if (result.errcode === 0) {
        // message.success('获取成功');
        yield put({
          type: 'updateClasses',
          payload: result.info,
        });
      } else {
        message.error('获取分类失败');
      }
    },
  },

  reducers: {
    updateClasses(state, action) {
      console.log('INININI');
      return {
        ...state,
        classes: action.payload,
      };
    },
  }
};

export default Model;

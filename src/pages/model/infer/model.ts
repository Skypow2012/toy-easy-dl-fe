import { Effect, Reducer } from 'umi';
import { message } from 'antd';
import { fakeSubmitForm, apiGetClasses, apiInfer } from './service';

export interface ModelType {
  namespace: string;
  state: StateType;
  effects: {
    submitRegularForm: Effect;
    getClasses: Effect;
    infer: Effect;
  };
  reducers: {
    updateClasses: Reducer<StateType>;
    updateInferResult: Reducer<StateType>;
    updateInferLoading: Reducer<StateType>;
  }
}
export interface StateType {
  classes: [];
  inferResult: any;
  inferLoading: boolean;
}
const Model: ModelType = {
  namespace: 'modelInfer',

  state: {
    classes: [],
    inferResult: {},
    inferLoading: false,
  },

  effects: {
    *submitRegularForm({ payload }, { call }) {
      yield call(fakeSubmitForm, payload);
      message.success('提交成功');
    },
    *getClasses({ payload }, { call, put }) {
      const result = yield call(apiGetClasses);
      if (result.errcode === 0) {
        yield put({
          type: 'updateClasses',
          payload: result.info,
        });
      } else {
        message.error('获取分类失败');
      }
    },
    *infer({ payload }, { call, put }) {
      const result = yield call(apiInfer, payload);
      if (result.errcode === 0) {
        message.success('验证成功');
        yield put({
          type: 'updateInferResult',
          payload: result.info,
        });
      } else {
        yield put({
          type: 'updateInferLoading',
          payload: false,
        });
        message.error(result.errmsg);
      }
    },
  },

  reducers: {
    updateClasses(state, action) {
      return {
        ...state,
        classes: action.payload,
      };
    },
    updateInferResult(state, action) {
      return {
        ...state,
        inferResult: action.payload,
        inferLoading: false,
      };
    },
    updateInferLoading(state, action) {
      return {
        ...state,
        inferLoading: action.payload,
      };
    }
  }
};

export default Model;

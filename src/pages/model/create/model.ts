import type { Effect, Reducer } from 'umi';
import { message } from 'antd';
import { fakeSubmitForm, apiGetClasses, apiCreateTrain, apiAddParamModel } from './service';

export type ModelType = {
  namespace: string;
  state: StateType;
  effects: {
    submitRegularForm: Effect;
    getClasses: Effect;
    submit: Effect;
    addParamModel: Effect;
  };
  reducers: {
    updateClasses: Reducer<StateType>;
  }
};
export type StateType = {
  classes: [];
};
const Model: ModelType = {
  namespace: 'modelCreate',

  state: {
    classes: [],
  },

  effects: {
    *submitRegularForm({ payload }, { call }) {
      yield call(fakeSubmitForm, payload);
      message.success('提交成功');
    },
    *getClasses(_nothing, { call, put }) {
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
    *submit({ payload }, { call }) {
      const result = yield call(apiCreateTrain, {modelName:payload.modelName, classNames:payload.modelClasses});
      if (result.errcode === 0) {
        message.success('开始训练成功');
        window.location.href = '/toy-easy-dl-fe/model/my/';
      } else {
        message.error(result.errmsg);
      }
    },
    *addParamModel({ payload }, { call }) {
      const {modelName} = payload;
      // eslint-disable-next-line no-param-reassign
      const result = yield call(apiAddParamModel, {modelName, json: payload});
      if (result.errcode === 0) {
        window.location.href = '/toy-easy-dl-fe/model/push/';
      } else {
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
  }
};

export default Model;

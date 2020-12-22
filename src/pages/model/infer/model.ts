import { Effect, Reducer } from 'umi';
import { message } from 'antd';
import { fakeSubmitForm, apiGetClasses, apiCreateTrain } from './service';

export interface ModelType {
  namespace: string;
  state: StateType;
  effects: {
    submitRegularForm: Effect;
    getClasses: Effect;
    submit: Effect;
  };
  reducers: {
    updateClasses: Reducer<StateType>;
  }
}
export interface StateType {
  classes: [];
}
const Model: ModelType = {
  namespace: 'modelInfer',

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
        yield put({
          type: 'updateClasses',
          payload: result.info,
        });
      } else {
        message.error('获取分类失败');
      }
    },
    *submit({ payload }, { call }) {
      console.log(payload);
      const result = yield call(apiCreateTrain, {modelName:payload.title, classNames:payload.modelClasses});
      console.log('result', result);
      if (result.errcode === 0) {
        message.success('开始训练成功');
        window.location.href = '/toy-easy-dl-fe/model/my/';
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

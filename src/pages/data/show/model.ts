import type { Effect, Reducer } from 'umi';
import { message } from 'antd';
import { formatMessage } from 'umi';

import { apiGetClasses, apiGetImages, apiSendImages, apiDeleteImage, apiAddClass, apiDelClass } from './service';

export type StateType = {
  classes: any[];
  images: any[];
  nowClass: string;
};

export type ModelType = {
  namespace: string;
  state: StateType;
  effects: {
    fetch: Effect;
    getImages: Effect;
    sendImages: Effect;
    deleteImage: Effect;
    addClass: Effect;
    delClass: Effect;
  };
  reducers: {
    queryClasses: Reducer;
    queryImages: Reducer;
    setClass: Reducer;
  };
};

const Model: ModelType = {
  namespace: 'dataShow',

  state: {
    classes: [],
    images: [],
    nowClass: '',
  },

  effects: {
    *fetch(_nothing, { call, put }) {
      const result = yield call(apiGetClasses);
      if (result.errcode !== 0) return;
      yield put({
        type: 'queryClasses',
        payload: result.info,
      });
      yield put({
        type: 'getImages',
        payload: '全部',
      });
    },
    *getImages({ payload }, { call, put }) {
      let calssName = payload;
      if (payload === '全部') calssName = '';
      const result = yield call(apiGetImages, calssName);
      yield put({
        type: 'setClass',
        payload,
      });
      if (result.errcode !== 0) return;
      yield put({
        type: 'queryImages',
        payload: result.info,
      });
    },
    *sendImages({ payload }, { call, put, select }) {
      const result = yield call(apiSendImages, payload);
      message.success(formatMessage({id: "msg.uploadSuccess"}));
      if (result.errcode !== 0) return;
      const nowClass = yield select((state: any) => state.dataShow.nowClass);
      yield put({
        type: 'getImages',
        payload: nowClass,
      });
    },
    *deleteImage({ payload }, { call, put, select }) {
      const result = yield call(apiDeleteImage, payload);
      message.info(formatMessage({id: "msg.deleteSuccess"}));
      if (result.errcode !== 0) return;
      const nowClass = yield select((state: any) => state.dataShow.nowClass);
      yield put({
        type: 'getImages',
        payload: nowClass,
      });
    },
    *addClass({ payload }, { call, put }) {
      const result = yield call(apiAddClass, payload);
      if (result.errcode !== 0) {
        message.error(result.errmsg);
      } else {
        message.info(formatMessage({id: "msg.addSuccess"}));
      }
      if (result.errcode !== 0) return;
      yield put({
        type: 'fetch',
      });
    },
    *delClass({ payload }, { call, put }) {
      const result = yield call(apiDelClass, payload);
      if (result.errcode !== 0) {
        message.error(result.errmsg);
      } else {
        message.info(formatMessage({id: "msg.deleteSuccess"}));
      }
      if (result.errcode !== 0) return;
      yield put({
        type: 'fetch',
      });
    },
    
    
  },

  reducers: {
    queryClasses(state, action) {
      action.payload.unshift('全部');
      return {
        ...state,
        classes: action.payload,
      };
    },
    queryImages(state, action) {
      return {
        ...state,
        images: action.payload,
      };
    },
    setClass(state, action) {
      return {
        ...state,
        nowClass: action.payload,
      };
    }
  },
};

export default Model;

import type { Effect, Reducer } from 'umi';
import { message } from 'antd';
import { formatMessage } from 'umi';

import { apiGetModelInfo, apiInfer } from './service';

export type StateType = {
  modelInfo: any;
  classes: any[];
  images: any[];
  nowClass: string;
  img01Src: string;
  img02Src: string;
  classResult: string;
  matchResult: any;
  loading: boolean;
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
    classInfer: Effect;
    matchInfer: Effect;
  };
  reducers: {
    selModelInfo: Reducer;
    setImg01: Reducer;
    setImg02: Reducer;
    queryImages: Reducer;
    setClass: Reducer;
    setClassResult: Reducer;
    setMatchResult: Reducer;
    setLoading: Reducer;
  };
};

const Model: ModelType = {
  namespace: 'modelParamInfer',

  state: {
    modelInfo: {},
    classes: [],
    images: [],
    nowClass: '',
    img01Src: '',
    img02Src: '',
    classResult: '',
    matchResult: undefined,
    loading: false,
  },

  effects: {
    *fetch({ payload }, { call, put }) {
      const result = yield call(apiGetModelInfo, payload);
      if (result.errcode !== 0) {
        message.error(result.errmsg);
      } else {
        const modelInfo = result.info;
        yield put({
          type: 'selModelInfo',
          payload: modelInfo,
        });
        const demoImageList = modelInfo.demoImages ? modelInfo.demoImages.split(';') : [];
        if (demoImageList[0]) {
          yield put({
            type: 'setImg01',
            payload: demoImageList[0],
          });
        }
        if (demoImageList[1]) {
          yield put({
            type: 'setImg02',
            payload: demoImageList[1],
          });
        }
      }
    },
    *classInfer({ payload }, { call, put }) {
      console.log(payload);
      const result = yield call(apiInfer, payload);
      if (result.errcode !== 0) {
        message.error(result.errmsg);
      } else {
        yield put({type: "setLoading", payload: false});
        yield put({
          type: 'setClassResult',
          payload: result.info,
        });
      }
    },
    *matchInfer({ payload }, { call, put }) {
      const result = yield call(apiInfer, payload);
      if (result.errcode !== 0) {
        message.error(result.errmsg);
      } else {
        yield put({type: "setLoading", payload: false});
        yield put({
          type: 'setMatchResult',
          payload: result.info,
        });
      }
    }
  },

  reducers: {
    selModelInfo(state, action) {
      const modelInfo = action.payload;
      return {
        ...state,
        modelInfo,
      };
    },
    setImg01(state, action) {
      return {
        ...state,
        img01Src: action.payload,
      };
    },
    setImg02(state, action) {
      return {
        ...state,
        img02Src: action.payload,
      };
    },
    setClassResult(state, action) {
      return {
        ...state,
        classResult: action.payload,
      };
    },
    setMatchResult(state, action) {
      return {
        ...state,
        matchResult: action.payload,
      };
    },
    setLoading(state, action) {
      console.log('setLoading', action.payload)
      return {
        ...state,
        loading: action.payload,
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

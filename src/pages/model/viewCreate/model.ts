import type { Effect, Reducer } from 'umi';
import { message } from 'antd';

import { apiGetClasses, apiGetImages, apiGetImageInfo, apiSetImageInfo } from './service';

export type StateType = {
  classes: any[];
  images: any[];
  imgIdx: number,
  nowClass: string;
  imgInfo: any;
  
  x: any,
  y: any,
  w: any,
  h: any,
  tarClassName: any,
};

export type ModelType = {
  namespace: string;
  state: StateType;
  effects: {
    fetch: Effect;
    getImages: Effect;
    getImageInfo: Effect;
    putImageInfo: Effect;
  };
  reducers: {
    setClasses: Reducer;
    setImages: Reducer;
    setImgIdx: Reducer;
    setImageInfo: Reducer;
    setNowClass: Reducer;
  };
};

const Model: ModelType = {
  namespace: 'modelViewCreate',

  state: {
    classes: [],
    images: [],
    imgIdx: 0,
    nowClass: '',
    imgInfo: {},
    
    tarClassName: undefined,
  },

  effects: {
    *fetch(_nothing, { call, put }) {
      const result = yield call(apiGetClasses);
      if (result.errcode !== 0) {
        message.error(result.errmsg);
      } else {
        yield put({
          type: 'setClasses',
          payload: result.info,
        });
      }
    },
    *getImages({ payload }, { call, put }) {
      const className = payload;
      const result = yield call(apiGetImages, className);
      if (result.errcode !== 0) {
        message.error(result.errmsg);
      } else {
        yield put({
          type: 'setImages',
          payload: result.info[0].images,
        });
        yield put({
          type: 'getImageInfo',
          payload: {
            className,
            imgName: result.info[0].images[0],
          }
        });
      }
    },
    *getImageInfo({ payload }, { call, put }) {
      const result = yield call(apiGetImageInfo, payload);
      let tarInfo: any = {};
      if (result.errcode !== 0) {
        // message.error(result.errmsg);
      } else {
        tarInfo = result.info;
      }
      yield put({
        type: "setImageInfo",
        payload: result.info
      });
      yield put({type: "setImageInfo", payload: tarInfo});
    },
    *putImageInfo({ payload }, { call, put }) {
      const result = yield call(apiSetImageInfo, payload);
      if (result.errcode !== 0) {
        message.error(result.errmsg);
      } else {
        message.success("更新成功");
        if (result.needFetch) {
          yield put({
            type: "getImages",
            payload: payload.className,
          });
        } else {
          yield put({
            type: "getImageInfo",
            payload
          });
        }
      }
    }
  },

  reducers: {
    setClasses(state, action) {
      const classes = action.payload;
      return {
        ...state,
        classes,
      };
    },
    setImages(state, action) {
      return {
        ...state,
        images: action.payload,
      };
    },
    setImgIdx(state, action) {
      return {
        ...state,
        imgIdx: action.payload,
      };
    },
    setImageInfo(state, action) {
      const tarImgInfo = action.payload || {};
      if (action.payload && !tarImgInfo.className) tarImgInfo.className = state.nowClass;
      console.log('tarImgInfo', tarImgInfo)
      return {
        ...state,
        imgInfo: {
          ...tarImgInfo
        },
      };
    },
    setNowClass(state, action) {
      return {
        ...state,
        nowClass: action.payload,
      };
    },
  },
};

export default Model;

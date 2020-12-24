import { Button, Card, message, Image, Select, Input, Spin } from 'antd';
import React, { useEffect, useState } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import { connect, FormattedMessage, formatMessage } from 'umi';
import styles from './style.less';

const { Option } = Select;

function blobToDataURL(blob: any, cb: any) {
  const reader = new FileReader();
  reader.onload = (evt: any) => {
    const base64 = evt.target.result;
    cb(base64);
  };
  reader.readAsDataURL(blob);
}

function changeImg(file: any, cb: any) {
  const imgs = file.files;
  const num = imgs.length;
  const urls: any = [];
  let cnt = 0;
  for (let i = 0; i < imgs.length; i += 1) {
    const img = imgs[i];
    // eslint-disable-next-line @typescript-eslint/no-loop-func
    blobToDataURL(img, (base64Url: string) => {
      cnt += 1;
      urls[i] = base64Url;
      if (cnt === num) {
        cb(urls);
      }
    });
  }
  if (imgs.length === 0) {
    cb([]);
  }
}

function smaller(base64Urls: any[], cb: any) {
  if (!base64Urls.length) return cb(base64Urls);
  let cnt = 0;
  for (let i = 0; i < base64Urls.length; i += 1) {
    const canvas = document.createElement('canvas');
    const ctx: any = canvas.getContext('2d');
    const img = document.createElement('img');
    img.src = base64Urls[i];
    // eslint-disable-next-line @typescript-eslint/no-loop-func
    img.onload = () => {
      canvas.width = 32;
      canvas.height = 32;
      ctx.drawImage(img, 0, 0, 32, 32);
      // eslint-disable-next-line no-param-reassign
      base64Urls[i] = canvas.toDataURL();
      cnt += 1;
      if (cnt === base64Urls.length) {
        cb(base64Urls);
      }
    };
  }
  return undefined;
}


function CardList(localState: any) {
  const {
    dispatch,
    classes,
    nowClass,
    images,
    modelInfo,
    img01Src,
    img02Src,
    classResult,
    matchResult,
    loading,
  } = localState;
  useEffect(() => {
    dispatch({
      type: 'modelParamInfer/fetch',
      payload: decodeURIComponent(window.location.search.replace(/.*modelName=/,''))
    });
  }, []);
  const isClassType = modelInfo.modelType === 'paramImgClassification';
  const isMatchType = modelInfo.modelType === 'paramImgMatching';
  
  function classInfer() {
    const base64 = getBase64(1);
    dispatch({
      type: 'modelParamInfer/classInfer',
      payload: {
        modelName: modelInfo.modelName,
        base64s: [base64]
      }
    });
  }
  function matchInfer() {
    const base64_01 = getBase64(1);
    const base64_02 = getBase64(2);
    dispatch({
      type: 'modelParamInfer/matchInfer',
      payload: {
        modelName: modelInfo.modelName,
        base64s: [
          base64_01,
          base64_02
        ]
      }
    });
  }
  function getBase64(num) {
    const img = document.getElementById(`img-0${num}`);
    const cvs = document.createElement('canvas');
    const ctx = cvs.getContext('2d');
    cvs.width = 32;
    cvs.height = 32;
    ctx.drawImage(img, 0, 0, 32, 32);
    const base64 = cvs.toDataURL();
    return base64;
  }

  function selectImgInput(num: number) {
    if (num === 1) dispatch({type: "modelParamInfer/setClassResult", payload: ''});
    if (num === 2) dispatch({type: "modelParamInfer/setMatchResult", payload: undefined});
    const imgInput: any = document.getElementById(`img-input-0${num}`);
    imgInput.value = '';
    imgInput.click();
    return undefined;
  }

  function setImgSrc(src: string, num: number) {
    dispatch({
      type: `modelParamInfer/setImg0${num}`,
      payload: src
    });
  }

  function imgChangeHandle(className: string, num: number) {
    const imgInput = document.getElementById(`img-input-0${num}`);
    changeImg(imgInput, (base64Urls: any[]) => {
      console.log(base64Urls);
      if (num === 1) {
        setImgSrc(base64Urls[0], 1);
      } else if (num === 2) {
        setImgSrc(base64Urls[0], 2);
      }
      // smaller(base64Urls, (smallBase64Urls: any[])=>{
      //   sendImage(className, smallBase64Urls);
      // });
    });
  }

  return <PageContainer content={modelInfo.modelName}>
    <Card>
      <div className={styles.inferBox}>
        <h2>待识别图片</h2>
        <div className={styles.imgBox}>
          <img
            id="img-01"
            src={img01Src}
            width="100%"
            ></img>
        </div>
        <Button onClick={()=>{selectImgInput(1);}}>选择图片</Button>
        <input style={{display:'none'}} id="img-input-01" type="file" multiple onChange={()=>{imgChangeHandle(nowClass, 1);}}></input>
      </div>
      {
        isMatchType ? <div className={styles.inferBox}>
          <h2>原始图片</h2>
          <div className={styles.imgBox}>
            <img
              id="img-02"
              src={img02Src}
              width="100%"
              ></img>
          </div>
          <Button onClick={()=>{selectImgInput(2);}}>选择图片</Button>
          <input style={{display:'none'}} id="img-input-02" type="file" multiple onChange={()=>{imgChangeHandle(nowClass, 2);}}></input>
        </div> : null
      }
      {
        isClassType ? <div className={styles.classResultBox}>
          <h2>识别结果</h2>
          <svg t="1608750313821" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1720" width="64" height="64"><path d="M54.044444 36.977778v796.444444h150.755556c28.444444 99.555556 113.777778 170.666667 219.022222 170.666667s190.577778-71.111111 219.022222-170.666667h321.422223v-796.444444h-910.222223z m201.955556 739.555555c11.377778-85.333333 82.488889-150.755556 167.822222-150.755555 85.333333 0 156.444444 65.422222 167.822222 150.755555H256z m651.377778 0h-256c-5.688889-59.733333-34.133333-110.933333-76.8-147.911111l82.488889-96.711111c17.066667 5.688889 34.133333 8.533333 51.2 8.533333 79.644444 0 142.222222-62.577778 142.222222-142.222222s-62.577778-142.222222-142.222222-142.222222c-56.888889 0-105.244444 34.133333-128 79.644444l-170.666667-42.666666c-2.844444-59.733333-51.2-108.088889-113.777778-108.088889s-113.777778 51.2-113.777778 113.777778 51.2 113.777778 113.777778 113.777777c45.511111 0 82.488889-25.6 102.4-62.577777l170.666667 42.666666v5.688889c0 39.822222 17.066667 76.8 42.666667 102.4l-82.488889 93.866667c-31.288889-17.066667-65.422222-25.6-102.4-25.6-119.466667 0-216.177778 91.022222-227.555556 207.644444H113.777778v-682.666666h796.444444v682.666666z m-284.444445-375.466666c0-48.355556 36.977778-85.333333 85.333334-85.333334s85.333333 36.977778 85.333333 85.333334-36.977778 85.333333-85.333333 85.333333-85.333333-39.822222-85.333334-85.333333z m-270.222222-99.555556c0 31.288889-25.6 56.888889-56.888889 56.888889s-56.888889-25.6-56.888889-56.888889 25.6-56.888889 56.888889-56.888889 56.888889 25.6 56.888889 56.888889z" p-id="1721" fill="#cccccc"></path></svg>
          <br/>
          <p className={styles.resultLine}>识别结果：<span className={styles.resultInfo}>{classResult}</span></p>
          <p className={styles.resultLine}>识别时间：<span className={styles.resultInfo}>{classResult?(new Date()).toLocaleDateString():null}</span></p>
        </div> : null
      }
      {
        isMatchType ? <div className={styles.matchResultBox}>
          <h2>匹配结果</h2>
          <p>背景图片是否能匹配</p>
          <p>↓</p>
          <p>{matchResult !== undefined ? (matchResult ? '匹配成功' : '匹配失败') : ''}</p>
        </div> : null
      }
      <p className={styles.inferCtrl}>
        <Spin
          spinning={loading}
        >
        <Button onClick={()=>{
          dispatch({type: "modelParamInfer/setLoading", payload: true});
          if (isClassType) {
            dispatch({type: "modelParamInfer/setClassResult", payload: ''});
            classInfer();
          } else if (isMatchType) {
            dispatch({type: "modelParamInfer/setMatchResult", payload: undefined});
            matchInfer();
          } else {
            message.error('没有模型类型，识别失败');
            dispatch({type: "modelParamInfer/setLoading", payload: false});
          }
        }}>开始识别</Button></Spin>
      </p>
    </Card>
  </PageContainer>;
}

function mapStateToProps(state: any) {
  const {
    classes,
    images,
    nowClass,
    modelInfo,
    img01Src,
    img02Src,
    classResult,
    matchResult,
    loading,
  } = state.modelParamInfer;
  return {
    classes,
    images,
    nowClass,
    modelInfo,
    img01Src,
    img02Src,
    classResult,
    matchResult,
    loading,
  };
}

export default connect(mapStateToProps)(CardList);

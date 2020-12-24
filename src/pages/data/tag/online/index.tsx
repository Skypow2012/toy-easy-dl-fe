import { Button, Card, message, Image, Select, InputNumber, Spin, Space } from 'antd';
import React, { useEffect, useState } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import { connect, FormattedMessage, formatMessage } from 'umi';
import styles from './style.less';

const { Option } = Select;

function TagOnline(localState: any) {
  const {
    dispatch,
    
    classes,
    images,
    imgIdx,
    nowClass,
    imgInfo,
  } = localState;
  useEffect(() => {
    dispatch({
      type: 'dataTagOnline/fetch'
    });
  }, []);
  useEffect(() => {
    setAnchor(imgInfo);
  }, [imgInfo]);
  function selectClass(val: string) {
    dispatch({
      type: 'dataTagOnline/setNowClass',
      payload: val
    });
    dispatch({
      type: 'dataTagOnline/getImages',
      payload: val
    });
  }
  function setImgIdx(idx: number) {
    dispatch({
      type: 'dataTagOnline/getImageInfo',
      payload: {
        className: nowClass,
        imgName: images[idx]
      }
    });
    dispatch({
      type: 'dataTagOnline/setImgIdx',
      payload: idx
    });
    dispatch({type: "setImageInfo", payload: {}});
    setImgInfo('className', nowClass);
  }
  function updateModelInfo() {
    console.log(imgInfo);
    dispatch({
      type: 'dataTagOnline/putImageInfo',
      payload: {
        className: nowClass,
        imgName: images[imgIdx],
        imgInfo,
      }
    });
  }
  function setImgInfo(key: string, val: any) {
    imgInfo[key] = val;
    console.log(imgInfo);
    dispatch({type: "dataTagOnline/setImageInfo", payload: imgInfo});
  }
  const [isDown, setIsDown] = useState(false);
  const [xLoc, setXLoc] = useState(0);
  const [yLoc, setYLoc] = useState(0);
  const [x2Loc, setX2Loc] = useState(0);
  const [y2Loc, setY2Loc] = useState(0);
  // let xLoc, yLoc, x2Loc, y2Loc;
  function mDown(ev) {
    setIsDown(true);
    // console.log(ev.clientX, getOffsetX(ev.target));
    setXLoc(ev.clientX - getOffsetX(ev.target, 1));
    setYLoc(ev.clientY - getOffsetY(ev.target, 1));
    console.log(xLoc, yLoc);
  }
  function toFix(num, smallRate, fixRate) {
    return Number((num/smallRate).toFixed(fixRate));
  }
  function mUp(ev) {
    if (isDown) {
      let x2Loc = ev.clientX - getOffsetX(ev.target)
      let y2Loc = ev.clientY - getOffsetY(ev.target)
      imgInfo.x = toFix(Math.min(xLoc, x2Loc), 300, 5);
      imgInfo.y = toFix(Math.min(yLoc, y2Loc), 300, 5);
      imgInfo.w = toFix(Math.abs(xLoc - x2Loc), 300, 5);
      imgInfo.h = toFix(Math.abs(yLoc - y2Loc), 300, 5);
      console.log(imgInfo);
      dispatch({type: "dataTagOnline/setImageInfo", payload: imgInfo});
      setIsDown(false);
    }
  }
  function getOffsetX(tar, isOut) {
    if (isOut && window.offLeft) return window.offLeft;
    if (tar.offsetParent) {
      let offLeft = tar.offsetLeft + getOffsetX(tar.offsetParent);
      if (isOut) window.offLeft = offLeft;
      return offLeft;
    } else if (tar.offsetLeft) {
      return tar.offsetLeft;
    } else {
      return 0;
    }
  }
  window.onresize = ()=>{
    delete window.offLeft;
    delete window.offTop;
  }
  function getOffsetY(tar, isOut) {
    if (isOut && window.offTop) return window.offTop;
    if (tar.offsetParent) {
      let offTop = tar.offsetTop + getOffsetY(tar.offsetParent);
      if (isOut) window.offTop = offTop;
      return offTop;
    } else if (tar.offsetTop) {
      return tar.offsetTop;
    } else {
      return 0;
    }
  }
  function mMove(ev) {
    if (isDown) {
      let x2Loc = ev.clientX - getOffsetX(ev.target)
      let y2Loc = ev.clientY - getOffsetY(ev.target)
      const x = Math.min(xLoc, x2Loc);
      const y = Math.min(yLoc, y2Loc);
      const w = Math.abs(xLoc - x2Loc);
      const h = Math.abs(yLoc - y2Loc);
      setAnchor({
        x:x/300,y:y/300,w:w/300,h:h/300
      });
    }
  }
  function setAnchor(tar) {
    delAnchor();
    document.getElementById('anchor').style.left = tar.x*300 + 'px';
    document.getElementById('anchor').style.top = tar.y*300 + 'px';
    document.getElementById('anchor').style.width = tar.w*300 + 'px';
    document.getElementById('anchor').style.height = tar.h*300 + 'px';
  }
  function delAnchor() {
    document.getElementById('anchor').style.width = 0 + 'px';
    document.getElementById('anchor').style.height = 0 + 'px';
  }
  return <PageContainer>
    <Card>
      <div>
        <Select onChange={(val: string)=>{selectClass(val);}} placeholder={"请选择分类"}>
          {classes.map((className: string)=>{
            return <Option key={className} value={className}>{className}</Option>;
          })}
        </Select>
      </div>
      <div className={styles.inferBox}>
        <h2>待标注图片</h2>
        <div className={styles.imgBox}>
          <div className={styles.anchor} id="anchor"></div>
          {
            images[imgIdx]?<img
            draggable={false}
            onMouseDown={mDown}
            onMouseMove={mMove}
            onMouseUp={mUp}
            onMouseLeave={mUp}
            src={images[imgIdx]?`/toyEasyDL/images/${encodeURIComponent(encodeURIComponent(nowClass))}/${images[imgIdx]}`:''}
            width="100%"
            height="100%"
            style={{userSelect:'none'}}
            ></img>:<div className={styles.defaultImg}>没有图片</div>}
        </div>
        <Button className={styles.lastNextBtn} disabled={imgIdx <= 0} onClick={()=>{setImgIdx(imgIdx-1);}}>上一张</Button>
        <Button className={styles.lastNextBtn} disabled={imgIdx >= (images.length - 1)} onClick={()=>{setImgIdx(imgIdx+1);}}>下一张</Button>
      </div>
      <div className={styles.classResultBox}>
        <h2>标注结果</h2>
        <br/>
        {
          images[imgIdx] ? <div >
            <div className={styles.resultLine} ><span className={styles.resultLabel}>x:</span><InputNumber className={styles.resultInfo} value={imgInfo.x} onChange={(val)=>{setImgInfo('x', val);}}/></div>
            <div className={styles.resultLine} ><span className={styles.resultLabel}>y:</span><InputNumber className={styles.resultInfo} value={imgInfo.y} onChange={(val)=>{setImgInfo('y', val);}}/></div>
            <div className={styles.resultLine} ><span className={styles.resultLabel}>w:</span><InputNumber className={styles.resultInfo} value={imgInfo.w} onChange={(val)=>{setImgInfo('w', val);}}/></div>
            <div className={styles.resultLine} ><span className={styles.resultLabel}>h:</span><InputNumber className={styles.resultInfo} value={imgInfo.h} onChange={(val)=>{setImgInfo('h', val);}}/></div>
            <div className={styles.resultLine} ><span className={styles.resultLabel}>class:</span>
              <Select className={styles.resultInfo} value={imgInfo.className} onChange={(val: string)=>{console.log(val);setImgInfo('className', val);}} placeholder={"请选择目标分类"}>
                {classes.map((className: string)=>{
                  return <Option key={className} value={className}>{className}</Option>;
                })}
              </Select>
            </div>
          </div> : null
        }
        <p className={styles.inferCtrl}>
          <Button disabled={!images[imgIdx]} onClick={updateModelInfo}>更新</Button>
        </p>
      </div>
    </Card>
  </PageContainer>;
}

function mapStateToProps(state: any) {
  const {
    classes,
    images,
    imgIdx,
    nowClass,
    imgInfo,
  } = state.dataTagOnline;
  return {
    classes,
    images,
    imgIdx,
    nowClass,
    imgInfo,
  };
}

export default connect(mapStateToProps)(TagOnline);

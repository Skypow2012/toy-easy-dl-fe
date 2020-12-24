import { Button, Card, message, Image, Select, Input, InputNumber, tex, Spin, Space } from 'antd';
import React, { useEffect, useState } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import { connect, FormattedMessage, formatMessage } from 'umi';
import styles from './style.less';

const { Option } = Select;
const { TextArea } = Input;

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
  const [anchorMode, setAnchorMode] = useState('polygon');
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
  const [points, setPoints] = useState([]);
  if (imgInfo.points) {
    imgPoints2Points(imgInfo.points);
  } else {
    imgPoints2Points('');
  }
  function imgPoints2Points(imgPoints: string) {
    const ps = imgPoints ? imgPoints.split(' ') : [];
    const newPoints = [];
    for (let i = 0; i < ps.length; i += 1) {
      const p = ps[i].split(',');
      const x = Number(p[0])*300|0;
      const y = Number(p[1])*300|0;
      newPoints.push(`${x},${y}`);
    }
    console.log('newPoints', newPoints);
    if (points.join(' ') !== newPoints.join(' ')) setPoints(newPoints);
  }
  function points2ImgPoints(points) {
    const ps = [];
    for (let i = 0; i < points.length; i += 1) {
      const point = points[i];
      const p = point.split(',');
      const x = toFix(Number(p[0]), 300, 5);
      const y = toFix(Number(p[1]), 300, 5);
      console.log('points2ImgPoints', Number(p[0]), x)
      ps.push(`${x},${y}`);
    }
    return ps.join(' ');
  }
  // let xLoc, yLoc, x2Loc, y2Loc;
  function mDown(ev: any) {
    const x = ev.clientX - getOffsetX(ev.target, 1);
    const y = ev.clientY - getOffsetY(ev.target, 1);
    console.log('mDown', anchorMode);
    switch (anchorMode) {
      case 'area':
        setIsDown(true);
        setXLoc(x);
        setYLoc(y);
        console.log('area', xLoc, yLoc);
        break;
      case 'polygon':
        if (ev.button === 1) {
          delPoints(points, x, y);
        } else if (ev.button === 0) {
          points.push(`${x},${y}`);
        }
        setPoints([...points]);
        setImgInfo('points', points2ImgPoints(points));
        console.log('polygon', points);
        break;
      default:
    }
  }

  function delPoints(points, x, y) {
    let minD = Infinity;
    let minIdx;
    for (let i = 0; i < points.length; i++) {
      const p = points[i].split(',');
      const pX = Number(p[0]);
      const pY = Number(p[1]);
      const d = (pX - x)** 2 + (pY - y) ** 2;
      if (d < minD) {
        minD = d;
        minIdx = i;
      }
    }
    if (minIdx !== undefined) {
      points.splice(minIdx, 1);
    }
    return points;
  }

  function toFix(num, smallRate, fixRate) {
    return Number((num/smallRate).toFixed(fixRate));
  }
  function mUp(ev) {
    if (isDown) {
      let x2Loc = ev.clientX - getOffsetX(ev.target)
      let y2Loc = ev.clientY - getOffsetY(ev.target)
      imgInfo.x = (Math.min(xLoc, x2Loc)/ 300);
      imgInfo.y = (Math.min(yLoc, y2Loc)/ 300);
      imgInfo.w = (Math.abs(xLoc - x2Loc)/ 300);
      imgInfo.h = (Math.abs(yLoc - y2Loc)/ 300);
      if (imgInfo.x < 0) {
        imgInfo.w += imgInfo.x;
        imgInfo.x = 0;
      }
      if (imgInfo.y < 0) {
        imgInfo.h += imgInfo.y;
        imgInfo.y = 0;
      }
      if (imgInfo.w+imgInfo.x > 1) imgInfo.w = 1 - imgInfo.x;
      if (imgInfo.h+imgInfo.y > 1) imgInfo.h = 1 - imgInfo.y;
      imgInfo.x = toFix(imgInfo.x, 1, 5);
      imgInfo.y = toFix(imgInfo.y, 1, 5);
      imgInfo.w = toFix(imgInfo.w, 1, 5);
      imgInfo.h = toFix(imgInfo.h, 1, 5);
      
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
  console.log('xxx points', points)
  return <PageContainer>
    <Card>
      <div>
        <Select style={{minWidth: '5rem'}} onChange={(val: string)=>{selectClass(val);}} placeholder={"请选择分类"}>
          {classes.map((className: string)=>{
            return <Option key={className} value={className}>{className}</Option>;
          })}
        </Select>
      </div>
      <div className={styles.inferBox} draggable="false">
        <h2>待标注图片</h2>
        <div className={styles.imgBox} draggable="false">
          {
            anchorMode === 'polygon' ? <svg className={styles.polygonAnchor} height="300" width="300">
              <polygon points={`${points.join(' ')}`}/>
            </svg> : null
          }
          {
            anchorMode === 'polygon' ? <div className={styles.polygonAnchorPointArea} draggable="false">
              {
                points.map((point)=>{
                  const p = point.split(',');
                  const x = Number(p[0]);
                  const y = Number(p[1]);
                  return <div className={styles.polygonAnchorPoint} style={{left:x, top:y}} draggable="false"></div>;
                })
              }
            </div> : null
          }
          <div className={styles.anchor} id="anchor" style={{display: anchorMode === 'area' ? 'block' : 'none'}}></div>
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
        <Button className={styles.lastNextBtn} disabled={!images[imgIdx]} onClick={()=>{setAnchorMode(anchorMode==='area'?'polygon':'area');}}>{anchorMode==='area'?'矩形模型':'多边形模式'}</Button>
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
            <div className={styles.resultLine} ><span className={styles.resultLabel}>points:</span><TextArea rows={3} className={styles.resultInfo} value={imgInfo.points} disabled/></div>
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

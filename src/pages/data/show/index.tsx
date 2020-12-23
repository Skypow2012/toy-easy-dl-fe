import { Button, Card, message, Image, Select, Input } from 'antd';
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
  const { dispatch, classes, nowClass, images } = localState;
  useEffect(() => {
    dispatch({
      type: 'dataShow/fetch'
    });
  }, []);
  
  const [newClassName, setNewClassName] = useState(``);// useState(`class_${Date.now()}`);

  function selectImgInput() {
    if (!nowClass || nowClass === '全部') return message.info(formatMessage({id:'msg.needSelectClassName'}));
    const imgInput: any = document.getElementById("img-input");
    imgInput.value = '';
    imgInput.click();
    return undefined;
  }

  function addClassInput() {
    if (!newClassName) return message.info(formatMessage({id:'msg.needInputNewClassName'}));
    dispatch({
      type: 'dataShow/addClass',
      payload: newClassName
    });
    setNewClassName('');
    return undefined;
  }

  function delClassInput() {
    if (!nowClass || nowClass === '全部') return message.info(formatMessage({id:'msg.needSelectClassName'}));
    dispatch({
      type: 'dataShow/delClass',
      payload: nowClass
    });
    return undefined;
  }

  function deleteImage(className: string, imgFileName: string) {
    dispatch({
      type: 'dataShow/deleteImage',
      payload: {
        className,
        imgFileName
      }
    });
  }

  
  function renderImgs(list: any[]) {
    return list.map((item: any) => {
      return <Image.PreviewGroup
        key={item.className}
      >
        {nowClass === '全部' ? <p>{item.className}</p> : null}
        {
          item.images.map((imgFileName: string) => {
            return <Image
              onMouseDown={(event)=>{event.preventDefault();if (event.button === 1) deleteImage(item.className, imgFileName);}}
              // onClick={()=>{deleteImage(item.className, imgFileName);}}
              id={`${item.className}-${imgFileName}`}
              key={`${item.className}-${imgFileName}`}
              width={32}
              height={32}
              preview={true}
              fallback="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAB8ElEQVRYR+2Xv2sUQRTHv6+5JmghWAaL9EHUzma/w0GCadJE/wRRAykkQjCgNgHRUiEE0opgJQh6zbzlsDhI0qUM5C+wUeSaO0b2cnts1t2dubjnNrny5s37ft6PefdO0PBHGtbHJcBfGVDVaJZlIRln/U8Aut3u4mAwUBG5NksAAL8A3CJ5kuhMAFT1EMDtGYun7r+SvJcHcP9JfCRDchR8NgP/CpCk9kpoEHUDrJN8n4ir6gsAL30gdQLEJJkVVFVvNusE+ETyfg7gp68cdQKMe+rsfavqEwDv6i5B8kQ3nXNrIrIG4HqBQDpgggZZaAZOnXPbxpgPqWCn05lrtVqvADz1RVl1HgTgnHtojNkrcqSqCiAo2qL7IQBHJO+URaGqyZn1NVvZfS9AVfSpU2vtMxF5XSLyHcA+gA0AN/M2PoDK6HNPLhG6mxN4RHI3/U5VvwBYydr4AN6S3AxtMlVNftkWxvZFc+EBgI/BAM65VWPM51CAxC6O48cA5qIoelPStAcAJj1VlYHfw+HwRrvd/jENgM/WWrsjIlupXRVAh+Syz+G059baJRH55gUQkedRFO1MK+Cz7/V6V/v9/jGA+fHsLt0Hzu1sPscXOB8Nr6ISNLuSNb6UZobGhed7SDlK1/KQy7Owufxr1ngG/gAJ3d4hlk5K6AAAAABJRU5ErkJggg=="
              src={`/toyEasyDL/images/${encodeURIComponent(encodeURIComponent(item.className))}/${imgFileName}`}
            />;
          })
        }
        {nowClass === '全部' ? <br></br> : null}
      </Image.PreviewGroup>;
    });
  }

  function setClassName(className: any) {
    dispatch({
      type: 'dataShow/getImages',
      payload: className
    });
  }
  
  // 上传图片
  function sendImage(className: string, base64Urls: string[]) {
    dispatch({
      type: 'dataShow/sendImages',
      payload: {
        className,
        base64Urls,
      }
    });
  }

  function imgChangeHandle(className: string) {
    const imgInput = document.getElementById("img-input");
    changeImg(imgInput, (base64Urls: any[]) => {
      smaller(base64Urls, (smallBase64Urls: any[])=>{
        sendImage(className, smallBase64Urls);
      });
    });
  }

  return <PageContainer>
    <Card>
      <Select
        onChange={(val) => {setClassName(val);}} style={{ width: '10rem', marginRight: '1rem' }}
        value={nowClass}
        placeholder="请选择分类">
        {
          classes.map((className: string) => {
            return <Option key={className} value={className}>{className}</Option>;
          })
        }
      </Select>
      <input style={{display:'none'}} id="img-input" type="file" multiple onChange={()=>{imgChangeHandle(nowClass);}}></input>
      <Button onClick={selectImgInput} disabled={!!(!nowClass || nowClass === '全部')} style={{ marginLeft: '10px' }}><FormattedMessage id="normal.uploadImage"/></Button>
      <Button onClick={delClassInput} disabled={!!(!nowClass || nowClass === '全部')} danger style={{ marginLeft: '10px' }}><FormattedMessage id="normal.delClass"/></Button>
      <br/>
      <br/>
      <Input value={newClassName} placeholder="输入新类别名称" style={{ width: '10rem'}} onChange={(event)=>{setNewClassName(event.target.value);}}></Input>
      <Button onClick={addClassInput} disabled={!newClassName} style={{ marginLeft: '25px' }}><FormattedMessage id="normal.addClass"/></Button>
      <div className={styles.imgList}>
        <p style={{color:'#cccccc', fontSize: '0.8rem'}}>鼠标中键点击小图，可以删除图片</p>
        {renderImgs(images)}
      </div>
    </Card>
  </PageContainer>;
}

function mapStateToProps(state: any) {
  const {
    classes,
    images,
    nowClass,
  } = state.dataShow;
  return {
    classes,
    images,
    nowClass,
  };
}

export default connect(mapStateToProps)(CardList);

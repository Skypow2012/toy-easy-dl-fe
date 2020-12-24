import { useState, useEffect } from 'react';
import { InfoCircleOutlined } from '@ant-design/icons';
import { Button, Card, DatePicker, Input, Form, Radio, Checkbox, Select, Tooltip, message, Upload, Spin } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { connect, Dispatch, FormattedMessage, formatMessage } from 'umi';
import React, { FC } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import styles from './style.less';
import { Label } from 'bizcharts';
import { StateType } from './model';

const FormItem = Form.Item;
const { Option } = Select;
const { RangePicker } = DatePicker;
const { TextArea } = Input;
interface modelInferFormProps {
  submitting: boolean;
  dispatch: Dispatch<any>;
  modelInfer: StateType;
}

const modelInferForm: FC<modelInferFormProps> = (props) => {
  const {
    submitting,
    dispatch,
    modelInfer: { classes, inferResult, inferLoading}
  } = props;
  const [form] = Form.useForm();
  const [showPublicUsers, setShowPublicUsers] = React.useState(false);
  
  const formItemLayout = {
    labelCol: {
      xs: { span: 24 },
      sm: { span: 7 },
    },
    wrapperCol: {
      xs: { span: 24 },
      sm: { span: 12 },
      md: { span: 10 },
    },
  };

  const submitFormLayout = {
    wrapperCol: {
      xs: { span: 24, offset: 0 },
      sm: { span: 10, offset: 7 },
    },
  };

  const onFinish = (values: { [key: string]: any }) => {
    const { dispatch } = props;
    dispatch({
      type: 'modelInfer/submit',
      payload: values,
    });
  };

  const onFinishFailed = (errorInfo: any) => {
    // eslint-disable-next-line no-console
    console.log('Failed:', errorInfo);
  };

  const onValuesChange = (changedValues: { [key: string]: any }) => {
    const { publicType } = changedValues;
    if (publicType) setShowPublicUsers(publicType === '2');
  };
  const modelNameMatch = window.location.search.match(/modelName=(.*?)$/);
  if (!modelNameMatch) {
    if (window.errTs && Date.now() < window.errTs + 2000) {
      return null;
    }
    window.errTs = Date.now();

    message.error('请先前往【我的模型】选择模型');
    setTimeout(()=>{
      window.location.href = '/toy-easy-dl-fe/model/my/';
    }, 1000);
    return null;
  }
  const [modelName, setModelName] = useState(modelNameMatch[1]);
  const [modelBelong, setModelBelong] = useState('person');
  const [modelImgBase64, setModelImgBase64] = useState('');
  const uploadButton = (
    <div>
      {/* {loading ? <LoadingOutlined /> : <PlusOutlined />} */}
      <PlusOutlined />
      <div style={{ marginTop: 8 }}><FormattedMessage id="normal.uploadImage"/></div>
    </div>
  );
  function getBase64(img: any, callback: any) {
    const reader = new FileReader();
    reader.addEventListener('load', () => callback(reader.result));
    reader.readAsDataURL(img);
  }
  function smaller(base64Urls: any[], cb: any) {
    if (!base64Urls.length) return cb(base64Urls);
    let cnt = 0;
    for (let i = 0; i < base64Urls.length; i++) {
      const canvas = document.createElement('canvas');
      const ctx: any = canvas.getContext('2d');
      const img = document.createElement('img');
      img.src = base64Urls[i];
      // eslint-disable-next-line @typescript-eslint/no-loop-func
      img.onload = () => {
        canvas.width = 32;
        canvas.height = 32;
        ctx.drawImage(img, 0, 0, 32, 32);
        // document.body.appendChild(canvas);
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
  function handleChange(info: any) {
    dispatch({type: 'modelInfer/updateInferResult', payload: {}});
    if (info.fileList.length) {
      info.fileList[0].status = 'done';
    } else {
      return;
    }
    if (info.file.status === 'done') {
      dispatch({type: "modelInfer/updateInferLoading", payload: true});
      // Get this url from response in real world.
      getBase64(info.file.originFileObj, (imageUrl: any) => {
        // console.log(imageUrl);
        smaller([imageUrl], (smallBase64Urls: any[])=>{
          const smallImageUrl = smallBase64Urls[0];
          setModelImgBase64(smallImageUrl);
          dispatch({
            type: 'modelInfer/infer',
            payload: {
              modelName,
              base64: smallImageUrl,
            }
          });
        });
      });
    }
  };
  const onPreview = async file => {
    let src = file.url;
    if (!src) {
      src = await new Promise(resolve => {
        const reader = new FileReader();
        reader.readAsDataURL(file.originFileObj);
        reader.onload = () => resolve(reader.result);
      });
    }
    const image = new Image();
    image.src = src;
    const imgWindow = window.open(src);
    imgWindow.document.write(image.outerHTML);
  };
  const result = typeof inferResult === 'string' ? inferResult : undefined;
  return (
    <PageContainer content={`当前模型为【${decodeURIComponent(modelName)}】 ${formatMessage({id:"formandbasic-form.infer.description"})}`}>
      <Card bordered={false}>
        <Spin spinning={inferLoading} delay={500}>
          <Upload
            listType="picture-card"
            onChange={handleChange}
            onPreview={onPreview}
            action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
            customRequest={()=>{}}
            onRemove={()=>{
              setModelImgBase64('');
              dispatch({type: 'modelInfer/updateInferResult', payload: {}});
            }}
            className={styles.inferImgBox}
          >
            {!modelImgBase64?uploadButton:null}
          </Upload>
        </Spin>
        <div className={styles.resultBox}>
          {/* {result !== undefined||!Object.keys(inferResult).length?null:<img src={window.images[0]}></img>} */}
          {result !== undefined?<span>{result}</span>:null}
          {result !== undefined||!Object.keys(inferResult).length?null:<div style={{display:'inline-block',width: '100%'}}>{
            Object.keys(inferResult).map((className)=>{
              return <div key={className}>
                <span>{className}</span>
                <span style={{float:'right'}}>{
                  `${(inferResult[className] * 100).toFixed(2)}%`
                }</span>
              </div>;
            })}
          </div>}
        </div>
      </Card>
    </PageContainer>
  );
};

export default connect(
  ({
    modelInfer,
    loading
  }: {
    modelInfer: StateType,
    loading: { effects: { [key: string]: boolean } }
  }) => ({
    modelInfer,
    submitting: loading.effects['formAndbasicForm/submitRegularForm'],
  })
)(modelInferForm);

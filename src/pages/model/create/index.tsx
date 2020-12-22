import { useState, useEffect } from 'react';
import { InfoCircleOutlined } from '@ant-design/icons';
import { Button, Card, DatePicker, Input, Form, Radio, Checkbox, Select, Tooltip } from 'antd';
import { connect, Dispatch, FormattedMessage, formatMessage } from 'umi';
import React, { FC } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import styles from './style.less';
import { Label } from 'bizcharts';
import { StateType } from './model';
import { initial } from 'lodash';

const FormItem = Form.Item;
const { Option } = Select;
const { RangePicker } = DatePicker;
const { TextArea } = Input;

interface ModelCreateFormProps {
  submitting: boolean;
  dispatch: Dispatch<any>;
  modelCreate: StateType;
}

const ModelCreateForm: FC<ModelCreateFormProps> = (props) => {
  const {
    submitting,
    dispatch,
    modelCreate: { classes }
  } = props;
  const [form] = Form.useForm();
  const [showPublicUsers, setShowPublicUsers] = React.useState(false);
  
  useEffect(() => {
    dispatch({
      type: 'modelCreate/getClasses',
      payload: {},
    });
  }, [1]);
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
    if (values.modelType === 'imgClassification') {
      dispatch({
        type: 'modelCreate/submit',
        payload: values,
      });
    } else {
      dispatch({
        type: 'modelCreate/addParamModel',
        payload: values,
      });
    }
  };

  const onFinishFailed = (errorInfo: any) => {
    // eslint-disable-next-line no-console
    console.log('Failed:', errorInfo);
  };

  const onValuesChange = (changedValues: { [key: string]: any }) => {
    const { publicType } = changedValues;
    if (publicType) setShowPublicUsers(publicType === '2');
  };
  const [modelType, setModelType] = useState('imgClassification');
  const [modelBelong, setModelBelong] = useState('person');
  const initialValues = window.localStorage.editParamModel ? JSON.parse(window.localStorage.editParamModel) : {
    modelType,
    modelBelong,
    public: '1',
    matchingDataFormat: '{\n\t"base64_1": "$text1",\n\t"base64_2": "$text2"\n}',
    classificationDataFormat: '{\n\t"base64": "$text"\n}',
    requestMethod: 'POST',
    dataType: 'JSON',
  };
  if (classes.length) delete window.localStorage.editParamModel;
  if (modelType !== initialValues.modelType) {
    setModelType(initialValues.modelType);
  }
  console.log('initialValues', initialValues);
  return (  
    <PageContainer content={<FormattedMessage id="formandbasic-form.create.description" />}>
      <Card bordered={false}>
        <Form
          // hideRequiredMark
          style={{ marginTop: 8 }}
          form={form}
          name="basic"
          initialValues={initialValues}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          onValuesChange={onValuesChange}
        >
          <FormItem
            {...formItemLayout}
            label={<FormattedMessage id="formandbasic-form.model-type.label" />}
            name="modelType"
            rules={[
              {
                message: formatMessage({ id: 'formandbasic-form.model-type.required' }),
              },
            ]}
          >
            <Radio.Group disabled={initialValues.isEdit}>
              <Radio.Button value="imgClassification" onClick={()=>{setModelType('imgClassification');}}>{formatMessage({id: 'formandbasic-form.model-type.img-classification'})}</Radio.Button>
              <Radio.Button value="paramImgClassification" onClick={()=>{setModelType('paramImgClassification');}}>{formatMessage({id: 'formandbasic-form.model-type.param-img-classification'})}</Radio.Button>
              <Radio.Button value="paramImgMatching" onClick={()=>{setModelType('paramImgMatching');}}>{formatMessage({id: 'formandbasic-form.model-type.param-img-matching'})}</Radio.Button>
            </Radio.Group>
          </FormItem>
          <FormItem
            {...formItemLayout}
            label={<FormattedMessage id="formandbasic-form.model-input-name.label" />}
            name="modelName"
            rules={[
              {
                required: true,
                message: formatMessage({ id: 'formandbasic-form.model-input-name.required' }),
              },
            ]}
          >
            <Input placeholder={formatMessage({ id: 'formandbasic-form.model-input-name.placeholder' })} disabled={initialValues.isEdit}/>
          </FormItem>
          {
            modelType === 'imgClassification' ? 
            <FormItem
              {...formItemLayout}
              label={<FormattedMessage id="formandbasic-form.belong.label" />}
              name="modelBelong"
              rules={[]}
            >
              <Radio.Group>
                <Radio.Button value="company">{formatMessage({id: 'formandbasic-form.belong.company'})}</Radio.Button>
                <Radio.Button value="person">{formatMessage({id: 'formandbasic-form.belong.person'})}</Radio.Button>
              </Radio.Group>
            </FormItem> : null
          }
          {
            modelType === 'imgClassification' ? 
            <FormItem
              {...formItemLayout}
              label={<FormattedMessage id="formandbasic-form.classes.label" />}
              name="modelClasses"
              rules={[{
                required: true,
                message: formatMessage({ id: 'formandbasic-form.classes.required' }),
              }]}
            >
              <Checkbox.Group>
                {
                  classes.map((classItem) => {
                    return <Checkbox key={classItem} value={classItem}>{classItem}</Checkbox>;
                  })
                }
                {/* <Checkbox value="company">{formatMessage({id: 'formandbasic-form.classes.company'})}</Checkbox>
                <Checkbox value="person">{formatMessage({id: 'formandbasic-form.classes.person'})}</Checkbox> */}
              </Checkbox.Group>
            </FormItem> : null
          }
          {
            modelType === 'paramImgClassification' || modelType === 'paramImgMatching' ? 
            <FormItem
              {...formItemLayout}
              label={<FormattedMessage id="formandbasic-form.request-url.label" />}
              name="requestUrl"
              rules={[
                {
                  required: true,
                  message: formatMessage({ id: 'formandbasic-form.request-url.required' }),
                },
              ]}
            >
              <Input placeholder={formatMessage({ id: 'formandbasic-form.request-url.placeholder' })} />
            </FormItem> : null
          }
          {
            modelType === 'paramImgClassification' || modelType === 'paramImgMatching' ? 
            <FormItem
              {...formItemLayout}
              label={<FormattedMessage id="formandbasic-form.request-method.label" />}
              name="requestMethod"
              rules={[
                {
                  required: true,
                  message: formatMessage({ id: 'formandbasic-form.request-method.required' }),
                },
              ]}
            >
              <Radio.Group>
                <Radio.Button value="POST">POST</Radio.Button>
                <Radio.Button value="GET">GET</Radio.Button>
              </Radio.Group>
            </FormItem> : null
          }
          {
            modelType === 'paramImgClassification' || modelType === 'paramImgMatching' ? 
            <FormItem
              {...formItemLayout}
              label={<FormattedMessage id="formandbasic-form.data-type.label" />}
              name="dataType"
              rules={[
                {
                  required: true,
                  message: formatMessage({ id: 'formandbasic-form.data-type.required' }),
                },
              ]}
            >
              <Radio.Group>
                <Radio.Button value="JSON">JSON</Radio.Button>
                <Radio.Button value="FORM">FORM</Radio.Button>
              </Radio.Group>
            </FormItem> : null
          }
          {
            modelType === 'paramImgClassification' || modelType === 'paramImgMatching' ? 
            <FormItem
              {...formItemLayout}
              label={<FormattedMessage id="formandbasic-form.data-format.label" />}
              name={"dataFormat"}
              rules={[
                {
                  required: true,
                  message: formatMessage({ id: 'formandbasic-form.data-format.required' }),
                },
              ]}
            >
              <TextArea rows={4} placeholder={
                modelType === 'paramImgClassification' ? formatMessage({ id: 'formandbasic-form.data-format.matching-placeholder' }) : formatMessage({ id: 'formandbasic-form.data-format.classification-placeholder' })
              }></TextArea>
            </FormItem> : null
          }
          {
            modelType === 'paramImgClassification' || modelType === 'paramImgMatching' ? 
            <FormItem
              {...formItemLayout}
              label={<FormattedMessage id="formandbasic-form.data-map.label" />}
              name="dataMap"
              rules={[
                {
                  required: true,
                  message: formatMessage({ id: 'formandbasic-form.data-map.required' }),
                },
              ]}
            >
              <Input placeholder={formatMessage({ id: 'formandbasic-form.data-map.placeholder' })} />
            </FormItem> : null
          }
          <FormItem {...submitFormLayout} name="isEdit" style={{display: 'none'}}>
              <Input />
          </FormItem>
          <FormItem {...submitFormLayout} style={{ marginTop: 32 }}>
            <Button type="primary" htmlType="submit" loading={submitting}>
              {
                // eslint-disable-next-line no-nested-ternary
                modelType === 'imgClassification' ? <FormattedMessage id="formandbasic-form.form.train" />
                  : initialValues.isEdit ? <FormattedMessage id="formandbasic-form.form.update" /> 
                  : <FormattedMessage id="formandbasic-form.form.create" /> 
              }
            </Button>
          </FormItem>
        </Form>
      </Card>
    </PageContainer>
  );
};

export default connect(
  ({
    modelCreate,
    loading
  }: {
    modelCreate: StateType,
    loading: { effects: { [key: string]: boolean } }
  }) => ({
    modelCreate,
    submitting: loading.effects['formAndbasicForm/submitRegularForm'],
  })
)(ModelCreateForm);

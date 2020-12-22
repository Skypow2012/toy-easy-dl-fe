import { useState, useEffect } from 'react';
import { InfoCircleOutlined } from '@ant-design/icons';
import { Button, Card, DatePicker, Input, Form, Radio, Checkbox, Select, Tooltip } from 'antd';
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

interface modelTrainFormProps {
  submitting: boolean;
  dispatch: Dispatch<any>;
  modelTrain: StateType;
}

const modelTrainForm: FC<modelTrainFormProps> = (props) => {
  const {
    submitting,
    dispatch,
    modelTrain: { classes }
  } = props;
  const [form] = Form.useForm();
  const [showPublicUsers, setShowPublicUsers] = React.useState(false);
  
  useEffect(() => {
    dispatch({
      type: 'modelTrain/getClasses',
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
    dispatch({
      type: 'formAndbasicForm/submitRegularForm',
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
  const [modelType, setModelType] = useState('imgClassification');
  const [modelBelong, setModelBelong] = useState('person');
  console.log('classes2', classes);
  return (
    <PageContainer content={<FormattedMessage id="formandbasic-form.train.description" />}>
      <Card bordered={false}>
        <Form
          // hideRequiredMark
          style={{ marginTop: 8 }}
          form={form}
          name="basic"
          initialValues={{ modelType, modelBelong, public: '1' }}
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
            <Radio.Group>
              <Radio.Button value="imgClassification">{formatMessage({id: 'formandbasic-form.model-type.img-classification'})}</Radio.Button>
            </Radio.Group>
          </FormItem>
          <FormItem
            {...formItemLayout}
            label={<FormattedMessage id="formandbasic-form.title.label" />}
            name="title"
            rules={[
              {
                required: true,
                message: formatMessage({ id: 'formandbasic-form.title.required' }),
              },
            ]}
          >
            <Input placeholder={formatMessage({ id: 'formandbasic-form.title.placeholder' })} />
          </FormItem>
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
          </FormItem>
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
                  return <Checkbox value={classItem}>{classItem}</Checkbox>;
                })
              }
              {/* <Checkbox value="company">{formatMessage({id: 'formandbasic-form.classes.company'})}</Checkbox>
              <Checkbox value="person">{formatMessage({id: 'formandbasic-form.classes.person'})}</Checkbox> */}
            </Checkbox.Group>
          </FormItem>
          <FormItem {...submitFormLayout} style={{ marginTop: 32 }}>
            <Button type="primary" htmlType="submit" loading={submitting}>
              <FormattedMessage id="formandbasic-form.form.submit" />
            </Button>
          </FormItem>
        </Form>
      </Card>
    </PageContainer>
  );
};

export default connect(
  ({
    modelTrain,
    loading
  }: {
    modelTrain: StateType,
    loading: { effects: { [key: string]: boolean } }
  }) => ({
    modelTrain,
    submitting: loading.effects['formAndbasicForm/submitRegularForm'],
  })
)(modelTrainForm);

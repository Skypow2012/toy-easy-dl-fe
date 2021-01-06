import defaultSettings from '../../../../config/defaultSettings';
import { PlusOutlined, CopyOutlined } from '@ant-design/icons';
import { Button, Card, List, Typography, message } from 'antd';
import React, { Component } from 'react';

import { PageContainer } from '@ant-design/pro-layout';
import { connect, Dispatch, FormattedMessage } from 'umi';
import { StateType } from './model';
import { CardListItemDataType } from './data.d';
import styles from './style.less';
import modelSvg from '@/assets/model.svg';
import { deleteModel, deleteParamModel, updateParamModel } from '../my/service';
import copy from 'copy-to-clipboard';
import normal from '@/locales/zh-CN/normal';

const { Paragraph } = Typography;

interface CardListProps {
  modelPush: StateType;
  dispatch: Dispatch<any>;
  loading: boolean;
}
interface CardListState {
  visible: boolean;
  done: boolean;
  current?: Partial<CardListItemDataType>;
}

class CardList extends Component<CardListProps, CardListState> {
  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'modelPush/fetch',
      payload: {
        count: 8,
      },
    });
  }

  async deleteItem(item: any) {
    const { dispatch } = this.props;
    if (item.modelType === 'paramImgClassification' || item.modelType === 'paramImgMatching') {
      await deleteParamModel(item.modelName);
    } else {
      await deleteModel(item.model);
    }
    dispatch({
      type: 'modelPush/fetch',
      payload: {
        count: 5,
      },
    });
  }
  
  async updateItem(item: any, option: any) {
    const { dispatch } = this.props;
    item = {
      ...item,
      ...option
    }
    if (item.modelType === 'paramImgClassification' || item.modelType === 'paramImgMatching') {
      let result = await updateParamModel(item.modelName, item);
      if (result.errcode === 0 && option.isPublish !== undefined) {
        option.isPublish === true ? message.success('发布成功') : message.info('下线成功');
      }
    }
    dispatch({
      type: 'modelPush/fetch',
      payload: {
        count: 5,
      },
    });
  }
  editItem(item: any) {
    // eslint-disable-next-line no-param-reassign
    item.isEdit = true;
    window.localStorage.editParamModel = JSON.stringify(item);
    window.location.href = '/toy-easy-dl-fe/model/create/';
  }


  render() {
    const {
      modelPush: { list },
      loading,
    } = this.props;

    const content = (
      <div className={styles.pageHeaderContent}>
      </div>
    );
    const nullData: Partial<CardListItemDataType> = {};
    return (
      <PageContainer content={content} >
        <div className={styles.cardList}>
          <List<Partial<CardListItemDataType>>
            rowKey="id"
            loading={loading}
            grid={{
              gutter: 16,
              xs: 1,
              sm: 2,
              md: 3,
              lg: 3,
              xl: 4,
              xxl: 4,
            }}
            dataSource={[nullData, ...list]}
            renderItem={(item) => {
              if (item && item.modelName) {
                return (
                  <List.Item key={item.modelName+item.updatedAt}>
                    <Card
                      hoverable
                      className={styles.card}
                      actions={[
                        // eslint-disable-next-line @typescript-eslint/no-unused-expressions
                        <a key="option1" onClick={()=>{ item.isPublish ? null : this.editItem(item);}} style={{color: item.isPublish ? "#cccccc" : defaultSettings.primaryColor}}><FormattedMessage id="normal.edit"/></a>,
                        <a key="option2" onClick={()=>{ window.open(`/toy-easy-dl-fe/model/paramInfer/?type=param&modelName=${item.modelName}`); }} style={{color: defaultSettings.primaryColor}}><FormattedMessage id="normal.preview"/></a>,
                        <a key="option3" onClick={()=>{this.updateItem(item, {isPublish: !item.isPublish});}} style={{color: defaultSettings.primaryColor}}>{item.isPublish?<FormattedMessage id="normal.turnOff"/>:<FormattedMessage id="normal.publish"/>}</a>,
                        // eslint-disable-next-line @typescript-eslint/no-unused-expressions
                        <a key="option4" onClick={()=>{item.isPublish ? null : this.deleteItem(item);}} style={{color: item.isPublish ? "#cccccc" : "#ff0000"}}><FormattedMessage id="normal.delete"/></a>
                      ]}
                    >
                      <Card.Meta
                        avatar={<img alt="" className={styles.cardAvatar} src={item.avatar||modelSvg} />}
                        title={<b>{item.modelName}</b>}
                        description={
                          <Paragraph className={styles.item} ellipsis={{ rows: 3 }}>
                            {item.description}
                            <span>{item.modelType === 'paramImgClassification' ? '参数图像分类' : item.modelType === 'paramImgMatching' ? '参数图像匹配' : ''}</span>
                            <br/>
                            {item.isPublish?<a onClick={()=>{copy(`https://tekii.cn/toyEasyDL/paramInfer/?modelName=${item.modelName}`);message.success('复制成功');}}><CopyOutlined /><FormattedMessage id="normal.copyUrl"/></a>:null}
                            {item.isPublish?<div className={styles.republishTag}><FormattedMessage id="normal.online"/></div>:null}
                            {item.isPublish?null:<div className={styles.noRepublishTag}><FormattedMessage id="normal.offline"/></div>}
                            
                          </Paragraph>
                        }
                      />
                    </Card>
                  </List.Item>
                );
              }
              return (
                <List.Item>
                  <Button type="dashed" className={styles.newButton} onClick={()=>{window.location.href="/toy-easy-dl-fe/model/create/";}}>
                    <PlusOutlined />新增体验展示
                  </Button>
                </List.Item>
              );
            }}
          />
        </div>
      </PageContainer>
    );
  }
}

export default connect(
  ({
    modelPush,
    loading,
  }: {
    modelPush: StateType;
    loading: {
      models: { [key: string]: boolean };
    };
  }) => ({
    modelPush,
    loading: loading.models.modelPush,
  }),
)(CardList);

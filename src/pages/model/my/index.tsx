import React, { FC, useRef, useState, useEffect } from 'react';
import { DownOutlined, PlusOutlined } from '@ant-design/icons';
import {
  Avatar,
  Button,
  Card,
  Col,
  Dropdown,
  Input,
  List,
  Menu,
  Modal,
  Progress,
  Radio,
  Row,
} from 'antd';

import { findDOMNode } from 'react-dom';
import { PageContainer } from '@ant-design/pro-layout';
import { connect, Dispatch } from 'umi';
import moment from 'moment';
import OperationModal from './components/OperationModal';
import { StateType } from './model';
import { BasicListItemDataType } from './data.d';
import styles from './style.less';

const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;
const { Search } = Input;

interface BasicListProps {
  modelMy: StateType;
  dispatch: Dispatch<any>;
  loading: boolean;
}

const Info: FC<{
  title: React.ReactNode;
  value: React.ReactNode;
  bordered?: boolean;
}> = ({ title, value, bordered }) => (
  <div className={styles.headerInfo}>
    <span>{title}</span>
    <p>{value}</p>
    {bordered && <em />}
  </div>
);

const ListContent = ({
  data: { owner='炼丹师', createdAt, percent, status },
}: {
  data: BasicListItemDataType;
}) => (
  <div className={styles.listContent}>
    <div className={styles.listContentItem}>
      <span>Owner</span>
      <p>{owner}</p>
    </div>
    <div className={styles.listContentItem}>
      <span>创建时间</span>
      <p>{moment(createdAt).format('YYYY-MM-DD HH:mm')}</p>
    </div>
    <div className={styles.listContentItem}>
      <Progress percent={percent!==undefined?percent:100} status={status} strokeWidth={6} style={{ width: 180 }} />
    </div>
  </div>
);

export const BasicList: FC<BasicListProps> = (props) => {
  const addBtn = useRef(null);
  const {
    loading,
    dispatch,
    modelMy: { list },
  } = props;
  const [done, setDone] = useState<boolean>(false);
  const [visible, setVisible] = useState<boolean>(false);
  const [limitType, setLimitType] = useState<number>(0);
  const [searchText, setSearchText] = useState<string>('');
  const [current, setCurrent] = useState<Partial<BasicListItemDataType> | undefined>(undefined);
  
  useEffect(() => {
    dispatch({
      type: 'modelMy/fetch',
      payload: {
        count: 5,
      },
    });
  }, [1]);

  const paginationProps = {
    // showSizeChanger: true,
    // showQuickJumper: true,
    pageSize: 5,
    total: 5,
  };

  const showModal = () => {
    setVisible(true);
    setCurrent(undefined);
  };

  const showEditModal = (item: BasicListItemDataType) => {
    setVisible(true);
    setCurrent(item);
  };

  const deleteItem = (modelName: string) => {
    dispatch({
      type: 'modelMy/delete',
      payload: { modelName },
    });
  };

  const editAndDelete = (key: string, currentItem: BasicListItemDataType) => {
    if (key === 'edit') showEditModal(currentItem);
    else if (key === 'delete') {
      let modelName = currentItem.name;
      if (currentItem.percent !== undefined) {
        modelName += '.wait';
      }
      Modal.confirm({
        title: '删除任务',
        content: '确定删除该任务吗？',
        okText: '确认',
        cancelText: '取消',
        onOk: () => deleteItem(modelName),
      });
    }
  };

  const extraContent = (
    <div className={styles.extraContent}>
      <RadioGroup defaultValue="all">
        <RadioButton value="all" onClick={() => setLimitType(0)}>全部</RadioButton>
        <RadioButton value="progress" onClick={() => setLimitType(1)}>进行中</RadioButton>
        <RadioButton value="waiting" onClick={() => setLimitType(2)}>已完成</RadioButton>
      </RadioGroup>
      <Search className={styles.extraContentSearch} placeholder="请输入" onSearch={(text) => {setSearchText(text);}} />
    </div>
  );

  const MoreBtn: React.FC<{
    item: BasicListItemDataType;
  }> = ({ item }) => (
    <Dropdown
      overlay={
        <Menu onClick={({ key }) => editAndDelete(key, item)}>
          {/* <Menu.Item key="edit">编辑</Menu.Item> */}
          <Menu.Item key="delete">删除</Menu.Item>
        </Menu>
      }
    >
      <a>
        更多 <DownOutlined />
      </a>
    </Dropdown>
  );

  const setAddBtnblur = () => {
    if (addBtn.current) {
      // eslint-disable-next-line react/no-find-dom-node
      const addBtnDom = findDOMNode(addBtn.current) as HTMLButtonElement;
      setTimeout(() => addBtnDom.blur(), 0);
    }
  };

  const handleDone = () => {
    setAddBtnblur();

    setDone(false);
    setVisible(false);
  };

  const handleCancel = () => {
    setAddBtnblur();
    setVisible(false);
  };

  const handleSubmit = (values: BasicListItemDataType) => {
    const id = current ? current.id : '';

    setAddBtnblur();

    setDone(true);
    dispatch({
      type: 'modelMy/submit',
      payload: { id, ...values },
    });
  };
  const modelUsedTime = '2分24秒';
  let modelThisWeek = 0;
  list.forEach((item)=>{
    if (item.createdAt > getWeekStartTs()) {
      modelThisWeek += 1;
    }
  });
  function getWeekStartTs() {
    const now = new Date();
    let day = now.getDay();
    if (day === 0) {
      day = 7;
    }
    day -= 1;
    return Date.now() - (day * 24 * 3600 * 1000) - (now.getHours() * 3600 * 1000) - (now.getMinutes() * 60 * 1000) - (now.getSeconds() * 1000);
  }
  return (
    <div>
      <PageContainer>
        <div className={styles.standardList}>
          <Card bordered={false}>
            <Row>
              <Col sm={8} xs={24}>
                <Info title="我的模型" value={`${list.length}个模型`} bordered />
              </Col>
              <Col sm={8} xs={24}>
                <Info title="本周模型平均处理时间" value={modelUsedTime} bordered />
              </Col>
              <Col sm={8} xs={24}>
                <Info title="本周创建模型数" value={`${modelThisWeek}个模型`} />
              </Col>
            </Row>
          </Card>

          <Card
            className={styles.listCard}
            bordered={false}
            title="基本列表"
            style={{ marginTop: 24 }}
            bodyStyle={{ padding: '0 32px 40px 32px' }}
            extra={extraContent}
          >
            <Button
              type="dashed"
              style={{ width: '100%', marginBottom: 8 }}
              onClick={showModal}
              ref={addBtn}
            >
              <PlusOutlined />
              添加
            </Button>

            <List
              size="large"
              rowKey="id"
              loading={loading}
              pagination={{
                ...paginationProps,
                total: Math.ceil(list.length / 5) * 5,
              }}
              dataSource={list}
              renderItem={(item) => {
                if (limitType === 1 && item.percent === undefined) return null; 
                if (limitType === 2 && item.percent !== undefined) return null;
                if (searchText && item.name.indexOf(searchText) === -1) return null;
                return <List.Item
                  actions={[
                    <a
                      key="edit"
                      onClick={(e) => {
                        e.preventDefault();
                        showEditModal(item);
                      }}
                    >
                      编辑
                    </a>,
                    <a
                      key="del"
                      onClick={(e) => {
                        e.preventDefault();
                        editAndDelete('delete', item);
                      }}
                    >
                      删除
                    </a>,
                    // <MoreBtn key="more" item={item} />,
                  ]}
                >
                  <List.Item.Meta
                    // avatar={<Avatar src={item.logo} shape="square" size="large" />}
                    title={<a href={`/infer?model=${item.name}`}>{item.name}</a>}
                    description={item.subDescription}
                  />
                  <ListContent data={item} />
                </List.Item>;
              }}
            />
          </Card>
        </div>
      </PageContainer>

      <OperationModal
        done={done}
        current={current}
        visible={visible}
        onDone={handleDone}
        onCancel={handleCancel}
        onSubmit={handleSubmit}
        options={['皮卡丘', '杰尼龟', '妙蛙种子', '小火龙']}
      />
    </div>
  );
};

export default connect(
  ({
    modelMy,
    loading,
  }: {
    modelMy: StateType;
    loading: {
      models: { [key: string]: boolean };
    };
  }) => ({
    modelMy,
    loading: loading.models.listAndbasicList,
  }),
)(BasicList);

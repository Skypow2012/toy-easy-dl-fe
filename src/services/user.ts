import request from '@/utils/request';

export async function query(): Promise<any> {
  return request('/api/users');
}

export async function queryCurrent(): Promise<any> {
  // return request('/api/currentUser');
  return {
    name: '炼丹师',
    avatar: 'https://ss1.bdstatic.com/70cFuXSh_Q1YnxGkpoWK1HF6hhy/it/u=76593842,145993857&fm=26&gp=0.jpg',
    userid: '00000001',
    email: '541182180@qq.com',
    signature: '',
    title: '初级锅炉工',
    group: '炼丹联盟-锅炉工作组',
    tags: [
      {
        key: '0',
        label: '很有想法的',
      },
      {
        key: '1',
        label: '异想天开的',
      },
      {
        key: '2',
        label: '带电~',
      },
      {
        key: '3',
        label: '发呆中...',
      },
    ],
    notifyCount: 0,
    unreadCount: 0,
    country: 'China',
    geographic: {
      province: {
        label: '浙江省',
        key: '330000',
      },
      city: {
        label: '杭州市',
        key: '330100',
      },
    },
    address: '余杭区向往街1122号欧美金融城英国中心东楼',
    phone: '0571-888888888',
  };
}

export async function queryNotices(): Promise<any> {
  // return request('/api/notices');
  return [];
}

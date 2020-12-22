import request from 'umi-request';

export async function queryFakeList(params: { count: number }) {
  return request('/api/fake_list', {
    params,
  });
}

export async function getModels() {
  return request('/toyEasyDL/model');
}

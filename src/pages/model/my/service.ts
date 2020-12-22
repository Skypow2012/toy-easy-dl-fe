import request from 'umi-request';
import { BasicListItemDataType } from './data.d';

interface ParamsType extends Partial<BasicListItemDataType> {
  count?: number;
}

export async function queryFakeList(params: ParamsType) {
  return request('/api/fake_list', {
    params,
  });
}

export async function queryModelList() {
  return request('/toyEasyDL/model');
}

export async function deleteModel(modelName: string) {
  return request(`/toyEasyDL/model?modelName=${modelName}`, {
    method: 'DELETE',
  });
}

export async function deleteParamModel(modelName: string) {
  return request(`/toyEasyDL/paramModel?modelName=${modelName}`, {
    method: 'DELETE',
  });
}

export async function updateParamModel(modelName: string, data: any) {
  return request(`/toyEasyDL/paramModel?modelName=${modelName}`, {
    method: 'PUT',
    data
  });
}

export async function removeFakeList(params: ParamsType) {
  const { count = 5, ...restParams } = params;
  return request('/api/fake_list', {
    method: 'POST',
    params: {
      count,
    },
    data: {
      ...restParams,
      method: 'delete',
    },
  });
}

export async function addFakeList(params: ParamsType) {
  const { count = 5, ...restParams } = params;
  return request('/api/fake_list', {
    method: 'POST',
    params: {
      count,
    },
    data: {
      ...restParams,
      method: 'post',
    },
  });
}

export async function updateFakeList(params: ParamsType) {
  const { count = 5, ...restParams } = params;
  return request('/api/fake_list', {
    method: 'POST',
    params: {
      count,
    },
    data: {
      ...restParams,
      method: 'update',
    },
  });
}

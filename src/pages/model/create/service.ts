import request from 'umi-request';

export async function fakeSubmitForm(params: any) {
  return request('/api/forms', {
    method: 'POST',
    data: params,
  });
}

export async function addModel(params: any) {
  return request('/model', {
    method: 'POST',
    data: params,
  });
}

export async function apiGetClasses() {
  return request('/toyEasyDL/class');
}

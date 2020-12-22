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
  return request('/toyEasyDL/class/');
}

export async function apiInfer({modelName, base64}) {
  const normalInferUrl = `/toyEasyDL/infer/?modelName=${modelName}`;
  const paramInferUrl = `/toyEasyDL/paramInfer/?modelName=${modelName}`;
  const isParam = window.location.href.indexOf('type=param') > -1;
  const inferUrl = isParam ? paramInferUrl : normalInferUrl;
  return request(inferUrl, {
    method: 'POST',
    data: isParam ? {base64s: [base64]} : {base64},
  });
}
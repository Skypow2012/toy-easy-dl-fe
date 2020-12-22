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

export async function apiCreateTrain({modelName, classNames}) {
  return request(`/toyEasyDL/train/?modelName=${modelName}`, {
    method: 'POST',
    data: {classNames},
  });
}

export async function apiAddParamModel({modelName, json}) {
  const { isEdit } = json;
  // eslint-disable-next-line no-param-reassign
  delete json.isEdit;
  return request(`/toyEasyDL/paramModel/?modelName=${modelName}`, {
    method: isEdit ? 'PUT' : 'POST',
    data: json,
  });
}
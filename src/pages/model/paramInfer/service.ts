import request from 'umi-request';

export async function apiGetModelInfo(modelName: string) {
  return request('/toyEasyDL/paramModel', {
    params: {
      modelName
    }
  });
}

export async function apiInfer(payload: any) {
  const {modelName, base64s} = payload;
  return request('/toyEasyDL/paramInfer', {
    method: 'POST',
    params: {
      modelName,
    },
    data: {
      base64s
    }
  });
}



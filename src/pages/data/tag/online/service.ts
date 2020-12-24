import request from 'umi-request';

export async function apiGetClasses() {
  return request('/toyEasyDL/class');
}

export async function apiGetImages(className: string) {
  return request('/toyEasyDL/image', {
    params: {
      className
    }
  });
}

export async function apiGetImageInfo(payload: any) {
  const {className, imgName} = payload;
  return request('/toyEasyDL/imageInfo', {
    params: {
      className,
      imgName,
    }
  });
}
export async function apiSetImageInfo(payload: any) {
  const {className, imgName, imgInfo} = payload;
  return request('/toyEasyDL/imageInfo', {
    method: 'PUT',
    params: {
      className,
      imgName,
    },
    data: {
      imgInfo
    }
  });
}



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

export async function apiSendImages(payload: any) {
  const {className, base64Urls} = payload;
  return request('/toyEasyDL/image', {
    method: 'POST',
    params: {
      className
    },
    data: {
      base64: base64Urls
    }
  });
}

export async function apiDeleteImage(payload: any) {
  const {className, imgFileName} = payload;
  return request('/toyEasyDL/image', {
    method: 'DELETE',
    params: {
      className,
      imageId: imgFileName
    }
  });
}

export async function apiAddClass(className: string) {
  return request('/toyEasyDL/class', {
    method: 'POST',
    params: {
      className
    }
  });
}

export async function apiDelClass(className: string) {
  return request('/toyEasyDL/class', {
    method: 'DELETE',
    params: {
      className
    }
  });
}




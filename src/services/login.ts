import request from '@/utils/request';
import Password from 'antd/lib/input/Password';

export interface LoginParamsType {
  userName: string;
  password: string;
  mobile: string;
  captcha: string;
  type: string;
}

export async function fakeAccountLogin(params: LoginParamsType) {
  // return request('/api/login/account', {
  //   method: 'POST',
  //   data: params,
  // });
  const { userName, password } = params;
  if (userName === 'admin' && password === 'toy.2020') {
    return {
      currentAuthority: "admin",
      status: "ok",
      type: "account",
    };
  }
  if (userName === 'user' && password === 'toy.2020') {
    return {
      currentAuthority: "admin",
      status: "ok",
      type: "user",
    };
  }
  return {
    status: "error",
    type: "account",
    currentAuthority: "guest",
  };
}

export async function getFakeCaptcha(mobile: string) {
  return request(`/api/login/captcha?mobile=${mobile}`);
}

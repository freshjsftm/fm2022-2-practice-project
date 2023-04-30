import axios from 'axios';
import CONTANTS from '../constants';
import history from '../browserHistory';

const http = axios.create({
  baseURL: CONTANTS.BASE_URL,
});

let accessToken = null;

http.interceptors.request.use(
  config => {
    if (accessToken) {
      //console.log('accessToken ===========>>>>>', accessToken)
      config.headers = { ...config.headers, 'Authorization': `Bearer ${accessToken}` };
    }
    return config;
  },
  err => Promise.reject(err)
);

http.interceptors.response.use(
  response => {
    if (response && response.data && response.data.data && response.data.data.tokenPair) {
      const {data:{data:{tokenPair:{access, refresh}}}} = response;
      window.localStorage.setItem(CONTANTS.REFRESH_TOKEN, refresh);
      accessToken = access;
    }
    return response;
  },
  err => {
    const refreshToken = window.localStorage.getItem(CONTANTS.REFRESH_TOKEN);
    if(err.response.status === 408 && refreshToken){
      const {data:{data:{tokenPair:{access, refresh}}}} = http.post('/auth/refresh', {refreshToken});
      window.localStorage.setItem(CONTANTS.REFRESH_TOKEN, refresh);
      accessToken = access;
      err.config.headers.Authorization = `Bearer ${access}`;
      return axios.request(err.config);
    }
    return Promise.reject(err);
  }
);

export default http;

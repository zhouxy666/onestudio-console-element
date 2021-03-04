/* eslint-disable no-undef */
import axios from "axios";
import { Message } from "element-ui";
import store from "@/store";
import { getToken, removeToken } from "@/utils/auth";
import { Base64 } from "js-base64";
import { vueIns } from "../main";
// create an axios instance
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API, // url = base url + request url
  // withCredentials: true, // send cookies when cross-domain requests
  timeout: 5000 // request timeout
});

// request interceptor
service.interceptors.request.use(
  config => {
    // do something before request is sent
    if (store.getters.token) {
      // console.log('store.getters.token',store.getters.token)
      // let each request carry token
      // ['X-Token'] is a custom headers key
      // please modify it according to the actual situation
      let token64 = Base64.encode(`${getToken()}:`);
      config.headers["Authorization"] = `Basic ${token64}`;
    }
    return config;
  },
  error => {
    // do something with request error
    console.log(error); // for debug
    return Promise.reject(error);
  }
);

// response interceptor
service.interceptors.response.use(
  /**
   * If you want to get http information such as headers or status
   * Please return  response => response
   */

  /**
   * Determine the request status by custom code
   * Here is just an example
   * You can also judge the status by HTTP Status Code
   */
  response => {
    const res = response.data;
    // if the custom code is not 20000, it is judged as an error.
    if (res.error_code) {
      Message({
        message: res.msg || "Error",
        type: "error",
        duration: 5 * 1000
      });
      return Promise.reject(new Error(res.message || "Error"));
    } else {
      return res;
    }
  },
  error => {
    const response = error.response;
    const responseData = response.data;
    if (responseData.error_code === 40001) {
      // store中的有需要清楚
      vueIns.$store.commit("user/SET_TOKEN", "");
      // 把cookie和store中的token去掉
      removeToken();
      // 提示信息，5s后跳到首页
      Message({
        message: `${response.data.msg}，5s秒后跳回登录页面`,
        type: "error",
        duration: 5 * 1000
      });
      setTimeout(() => {
        vueIns.$router.push("/login");
      }, 5000);
    } else {
      Message({
        message: response.data.msg,
        type: "error",
        duration: 5 * 1000
      });
      return Promise.reject(error);
    }
  }
);

export default service;

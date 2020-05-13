import jsonp from "js/jsonp";
import {commonParams, options} from "api/config";
import axios from "axios";

export function getRecommend() {
  const url = "https://c.y.qq.com/musichall/fcgi-bin/fcg_yqqhomepagerecommend.fcg";
  const data = Object.assign({}, commonParams, {
    platform: "h5",
    uin: 0,
    needNewCode: 1
  });
  return jsonp(url, data, options);
}

export function getDiscList() {
  const url = "/api/getDiscList";
  const data = Object.assign({}, commonParams, {
    platform: "yqq.json",
    hostUin: 0,
    loginUin: 0,
    sin: 0,
    ein: 19,
    sortId: 5,
    picmid: 1,
    needNewCode: 0,
    categoryId: 10000000,
    rnd: Math.random()
  });
  return axios.get(url, {
    params: data
  }).then(res => {
    return Promise.resolve(res.data);
  }).catch(res => {
    console.log("错误：" + res);
  });
}

export function getSongList(disstid) {
  const url = '/api/discDetail';
  const data = Object.assign({}, commonParams, {
    disstid,
    type: 1,
    json: 1,
    utf8: 1,
    onlysong: 0,
    platform: 'yqq',
    hostUin: 0,
    needNewCode: 0
  });
  return axios.get(url, {
    params: data
  }).then((res) => {
    return Promise.resolve(res.data);
  });
}

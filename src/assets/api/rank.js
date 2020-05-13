import jsonp from 'js/jsonp';
import {commonParams, options} from 'api/config';
import axios from "axios";

export function getTopList() {
  const url = '/api/toplist';
  const data = Object.assign({}, commonParams, {
    platform: 'h5',
    needNewCode: 1
  });
  return axios.get(url, {
    params: data
  }).then(res => {
    return Promise.resolve(res.data);
  }).catch(res => {
    console.log("错误：" + res);
  });
}

export function getMusicList(topid) {
  const url = 'https://c.y.qq.com/v8/fcg-bin/fcg_v8_toplist_cp.fcg';
  const data = Object.assign({}, commonParams, {
    topid,
    needNewCode: 1,
    uin: 0,
    tpl: 3,
    page: 'detail',
    type: 'top',
    platform: 'h5'
  });
  return jsonp(url, data, options);
}

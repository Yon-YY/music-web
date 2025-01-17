import {commonParams} from 'api/config';
import axios from 'axios';

export function getLyric(mid) {
  const url = '/api/lyric';

  const data = Object.assign({}, commonParams, {
    songmid: mid,
    pcachetime: +new Date(),
    platform: 'yqq.json',
    inCharset: 'utf8',
    hostUin: 0,
    needNewCode: 0,
    g_tk: 37691960
  });
  return axios.get(url, {
    params: data
  }).then((res) => {
    return Promise.resolve(res.data);
  });
}

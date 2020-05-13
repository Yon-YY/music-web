import jsonp from 'js/jsonp';
import {commonParams, options} from 'api/config';
import {getLyric} from 'api/song';
import {ERR_OK} from 'api/config';
import {Base64} from 'js-base64';
import axios from 'axios';

export default class Song {
  constructor({id, mid, singer, name, album, duration, image, url}) {
    this.id = id;
    this.mid = mid;
    this.singer = singer;
    this.name = name;
    this.album = album;
    this.duration = duration;
    this.image = image;
    this.url = url;
  }

  getLyric() {
    if (this.lyric) {
      return Promise.resolve(this.lyric);
    }
    return new Promise((resolve, reject) => {
      getLyric(this.mid).then((res) => {
        if (res.retcode === ERR_OK) {
          // base64转换
          this.lyric = Base64.decode(res.lyric);
          resolve(this.lyric);
        } else {
          reject('no lyric');
        }
      });
    });
  }
}

export function CreateSong(musicData, vkey) {
  return new Song({
    id: musicData.songid,
    mid: musicData.songmid,
    singer: filterSinger(musicData.singer),
    name: musicData.songname,
    album: musicData.albumname,
    duration: musicData.interval,
    image: `https://y.gtimg.cn/music/photo_new/T002R300x300M000${musicData.albummid}.jpg?max_age=2592000`,
    url: `http://aqqmusic.tc.qq.com/amobile.music.tc.qq.com/C400${musicData.songmid}.m4a?guid=6588271464&vkey=${vkey}&uin=2263&fromtag=38`
  })
}

// 获取歌曲接口动态参数 vkey
export function getSongVkey(songmid) {
  // const url = 'https://c.y.qq.com/base/fcgi-bin/fcg_music_express_mobile3.fcg';
  const url = '/api/getVkey';
  const data = Object.assign({}, commonParams, {
    loginUin: 0, //可以传空值
    format: 'jsonp',
    hostUin: 0,
    platform: 'yqq',
    needNewCode: 0,
    cid: 205361747,
    uin: 0, //可以传空值
    guid: 6588271464,
    songmid: songmid,
    filename: `C400${songmid}.m4a`
  });
  return axios.get(url, {
    params: data
  }).then(res => {
    return Promise.resolve(res.data);
  }).catch(res => {
    console.log("错误：" + res);
  });
}

function storages(key, val) {
  let storage = window.localStorage;
  if (!val) {
    return storage.getItem(key);
  } else {
    return storage.setItem(key, val);
  }
}

function filterSinger(singer) {
  let ret = [];
  if (!singer) {
    return '';
  }
  singer.forEach((s) => {
    ret.push(s.name);
  });
  return ret.join('/');
}


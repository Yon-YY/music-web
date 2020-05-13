// 引入 npm install 进来的 jsonp
import originJSONP from "jsonp";

// 重新封装jsonp
export default function jsonp(url, data, option) {
  url += (url.indexOf("?") < 0 ? "?" : "&") + param(data);

  return new Promise((resolve, reject) => {
    originJSONP(url, option, (err, data) => {
      if (!err) {
        resolve(data);
      } else {
        reject(err);
      }
    });
  });
}

function param(data) {
  let url = "";
  for (var k in data) {
    let value = data[k] !== undefined ? data[k] : "";
    // 拼接 url 上带的参数
    url += `&${k}=${encodeURIComponent(value)}`;
  }
  //如果url有参数，去掉第一个&符号
  return url ? url.substring(1) : "";
}

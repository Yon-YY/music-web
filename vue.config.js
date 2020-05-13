// vue.config.js 配置说明
// const path = require("path");
// const resolve = dir => path.join(__dirname, dir);
// const IS_PROD = ["production", "prod"].includes(process.env.NODE_ENV);
// 这里只列一部分，具体配置参考文档啊
module.exports = {
  // baseUrl  type:{string} default:‘/‘
  // 将部署应用程序的基本URL
  // 将部署应用程序的基本URL。
  // 默认情况下，Vue CLI假设您的应用程序将部署在域的根目录下。
  // https://www.my-app.com/。如果应用程序部署在子路径上，则需要使用此选项指定子路径。例如，如果您的应用程序部署在https://www.foobar.com/my-app/，集baseUrl到‘/my-app/‘.

  // baseUrl: "/",
  publicPath: process.env.NODE_ENV === "production" ? "./" : "/",

  configureWebpack: {
    resolve: {
      alias: {
        assets: "@/assets",
        stylus: "@/assets/stylus",
        js: "@/assets/js",
        api: "@/assets/api",
        img: "@/assets/img",
        components: "@/components",
        "~": "@/views"
      }
    }
  },

  // outputDir: 在npm run build时 生成文件的目录 type:string, default:‘dist‘

  outputDir: "music",

  //   lintOnSave：{ type:Boolean default:true } 问你是否使用eslint
  lintOnSave: true, // productionSourceMap：{ type:Bollean,default:true } 生产源映射
  // 如果您不需要生产时的源映射，那么将此设置为false可以加速生产构建
  productionSourceMap: false, // devServer:{type:Object} 3个属性host,port,https
  // 它支持webPack-dev-server的所有选项

  devServer: {
    // overlay: {
    //   warnings: true,
    //   errors: true
    // },
    port: 8082, // 端口号
    host: "0.0.0.0",
    https: false, // https:{type:Boolean}
    open: false, //配置自动启动浏览器
    // 配置跨域处理
    proxy: {
      "/api/getDiscList": {
        target: "https://c.y.qq.com/splcloud/fcgi-bin/fcg_get_diss_by_tag.fcg",
        bypass: function (req) {
          // 结尾斜杠很重要！很重要！很重要！
          req.headers.referer = "https://c.y.qq.com/";
          req.headers.vary = "Accept-Encoding";
        },
        changeOrigin: true,
        pathRewrite: {
          "^/api/getDiscList": "" // rewrite path
        }
      },
      // 歌曲Vkey
      "/api/getVkey": {
        target: "https://c.y.qq.com/base/fcgi-bin/fcg_music_express_mobile3.fcg",
        bypass: function (req) {
          // 结尾斜杠很重要！很重要！很重要！
          req.headers.referer = "https://c.y.qq.com/";
          req.headers.vary = "Accept-Encoding";
        },
        changeOrigin: true,
        pathRewrite: {
          "^/api/getVkey": "" // rewrite path
        }
      },
      // 歌词
      "/api/lyric": {
        target: "https://c.y.qq.com/lyric/fcgi-bin/fcg_query_lyric_new.fcg",
        bypass: function (req) {
          // 结尾斜杠很重要！很重要！很重要！
          req.headers.referer = "https://c.y.qq.com/";
          req.headers.vary = "Accept-Encoding";
        },
        changeOrigin: true,
        pathRewrite: {
          "^/api/lyric": "" // rewrite path
        }
      },
      // 推荐歌单详情
      "/api/discDetail": {
        target: "https://c.y.qq.com/qzone/fcg-bin/fcg_ucc_getcdinfo_byids_cp.fcg",
        bypass: function (req) {
          // 结尾斜杠很重要！很重要！很重要！
          req.headers.referer = "https://y.qq.com/";
          req.headers.host = "c.y.qq.com/";
        },
        changeOrigin: true,
        pathRewrite: {
          "^/api/discDetail": "" // rewrite path
        }
      },
      // 排行榜
      "/api/toplist": {
        target: "https://c.y.qq.com/v8/fcg-bin/fcg_myqq_toplist.fcg",
        bypass: function (req) {
          // 结尾斜杠很重要！很重要！很重要！
          req.headers.referer = "https://y.qq.com/";
          req.headers.host = "c.y.qq.com/";
        },
        changeOrigin: true,
        pathRewrite: {
          "^/api/toplist": "" // rewrite path
        }
      },
      // 搜索歌曲、歌手
      "/api/clientSearch": {
        target: "https://c.y.qq.com/soso/fcgi-bin/search_for_qq_cp",
        bypass: function (req) {
          // 结尾斜杠很重要！很重要！很重要！
          req.headers.referer = "https://y.qq.com/";
          req.headers.vary = "Accept-Encoding";
        },
        changeOrigin: true,
        pathRewrite: {
          "^/api/clientSearch": "" // rewrite path
        }
      }
    }
  }
};

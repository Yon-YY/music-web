// 转换新的 JavaScript 语法
import "babel-polyfill";
import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import VueLazyLoad from "vue-lazyload";
// 处理移动端 click 事件 300 毫秒延迟
import fastclick from "fastclick";

import "stylus/index.styl";

fastclick.attach(document.body);

Vue.use(VueLazyLoad, {
  loading: require('img/default.png')
});

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");

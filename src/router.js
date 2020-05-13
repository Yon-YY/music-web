import Vue from "vue";
import Router from "vue-router";
// import Recommend from "~/recommend/recommend";
// import Singer from "~/singer/singer";
// import Rank from "~/rank/rank";
// import Search from "~/search/search";
// import SingerDetail from "~/singer-detail/singer-detail";
// import Disc from 'components/disc/disc';
// import TopList from '~/top-list/top-list';
// import UserCenter from 'components/user-center/user-center';

Vue.use(Router);

export default new Router({
  mode: "history",
  base: process.env.BASE_URL,
  routes: [
    {
      path: "/",
      redirect: () => import("~/recommend/recommend")
    },
    {
      path: "/recommend",
      name: "recommend",
      component: () => import("~/recommend/recommend"),
      children: [{
        path: ':id',
        component: () => import("components/disc/disc")
      }]
    },
    {
      path: "/singer",
      name: "singer",
      component: () => import("~/singer/singer"), // :id根据id跳转
      children: [{
        path: ':id',
        component: () => import("~/singer-detail/singer-detail")
      }]
    },
    {
      path: "/rank",
      name: "rank",
      component: () => import("~/rank/rank"),
      children: [{
        path: ':id',
        component: () => import("~/top-list/top-list")
      }]
    },
    {
      path: "/search",
      name: "search",
      component: () => import("~/search/search"),
      children: [{
        path: ':id',
        component: () => import("~/singer-detail/singer-detail")
      }]
    },
    {
      path: "/user",
      component: () => import("components/user-center/user-center")
    }
  ]
});

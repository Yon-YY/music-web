import Vue from "vue";
import Router from "vue-router";
import Recommend from "~/recommend/recommend";
import Singer from "~/singer/singer";
import Rank from "~/rank/rank";
import Search from "~/search/search";
import SingerDetail from "~/singer-detail/singer-detail";
import Disc from 'components/disc/disc';
import TopList from '~/top-list/top-list';
import UserCenter from 'components/user-center/user-center';

Vue.use(Router);

export default new Router({
  mode: "history",
  base: process.env.BASE_URL,
  routes: [
    {
      path: "/",
      redirect: "/recommend"
    },
    {
      path: "/recommend",
      name: "recommend",
      component: Recommend,
      children: [{
        path: ':id',
        component: Disc
      }]
    },
    {
      path: "/singer",
      name: "singer",
      component: Singer, // :id根据id跳转
      children: [{
        path: ':id',
        component: SingerDetail
      }]
    },
    {
      path: "/rank",
      name: "rank",
      component: Rank,
      children: [{
        path: ':id',
        component: TopList
      }]
    },
    {
      path: "/search",
      name: "search",
      component: Search,
      children: [{
        path: ':id',
        component: SingerDetail
      }]
    },
    {
      path: "/user",
      component: UserCenter
    }
  ]
});

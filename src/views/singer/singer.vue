<template>
  <div class="singer" ref="singer">
    <list-view @select="selectSinger" :data="singers" ref="list"></list-view>
    <router-view></router-view>
  </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import {getSingerList} from 'api/singer';
  import {ERR_OK} from 'api/config';
  // 歌手公用数据
  import Singer from 'js/singer';
  // 歌手列表(通讯录组件)
  import ListView from 'components/listview/listview';
  import {mapMutations} from 'vuex';
  import {playlistMixin} from 'js/mixin';

  const HOT_NAME = '热门';
  const HOT_SINGER_LEN = 10;

  export default {
    mixins: [playlistMixin],
    data() {
      return {
        singers: []
      };
    },
    created() {
      this._getSingerList();
    },
    computed: {
      test() {
        return this.$store.state.name;
      }
    },
    mounted() {
      // console.log(this);
    },
    methods: {
      handlePlaylist(playlist) {
        const bottom = playlist.length > 0 ? '60px' : '';
        this.$refs.singer.style.bottom = bottom;
        this.$refs.list.refresh();
      },
      ...mapMutations({
        setSinger: 'SET_SINGER'
      }),
      selectSinger(singer) {
        this.$router.push({
          path: `/singer/${singer.id}`
        });
        this.setSinger(singer);
      },
      _getSingerList() {
        getSingerList().then((res) => {
          if (res.code === ERR_OK) {
            this.singers = this._normalizeSinger(res.data.list);
          }
        }).catch((err) => {
          console.log(err);
        });
      }, // 返回的数据处理符合前端需要的数据结构
      _normalizeSinger(list) {
        let map = {
          // 热门
          hot: {
            title: HOT_NAME,
            items: []
          }
        };
        list.forEach((item, index) => {
          // 前10条为热门数据
          if (index < HOT_SINGER_LEN) {
            // 歌手公用数据封装到singer.js，调用new Singer
            map.hot.items.push(new Singer({
              id: item.Fsinger_mid,
              name: item.Fsinger_name
            }));
          }
          // 聚合归类
          const key = item.Findex;
          // 如果key不存在map里,则创建一个key对象
          if (!map[key]) {
            map[key] = {
              title: key,
              items: []
            }
          }
          // 把相应的数据push到创建的key中
          map[key].items.push(new Singer({
            id: item.Fsinger_mid,
            name: item.Fsinger_name
          }));
        });
        // 处理map后的数据，使数据变为有序列表
        let hot = [];
        let ret = [];
        for (let key in map) {
          let val = map[key];
          // 正则筛选title中包含有字母则push入ret数组
          if (val.title.match(/[a-zA-Z]/)) {
            ret.push(val);
          } else if (val.title === HOT_NAME) {
            hot.push(val);
          }
        }
        // 字母排序
        ret.sort((a, b) => {
          return a.title.charCodeAt(0) - b.title.charCodeAt(0);
        });
        // 合并数组
        return hot.concat(ret);
      }
    },
    components: {
      ListView
    }
  };
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" type="text/stylus" rel="stylesheet/stylus" scoped>
  .singer
    position: fixed
    top: 88px
    bottom: 0
    width: 100%
</style>

<template>
  <scroll class="suggest" :data="result" :pullup="pullup"
          :beforeScroll="beforeScroll"
          @scrollToEnd="searchMore" @beforeScroll="listScroll" ref="suggest">
    <ul class="suggest-list">
      <li @click="selectItem(item)" class="suggest-item"
          v-for="(item, index) in result" :key="index">
        <div class="icon">
          <i :class="getIconCls(item)"></i>
        </div>
        <div class="name">
          <p class="text" v-html="getDisplayName(item)"></p>
        </div>
      </li>
      <loading v-show="hasMore" title=""></loading>
    </ul>
    <div v-show="!hasMore && !result.length" class="no-result-wrapper">
      <no-result title="抱歉，暂无搜索结果"></no-result>
    </div>
  </scroll>
</template>

<script type="text/ecmascript-6">
  import {search} from 'api/search';
  import {ERR_OK} from 'api/config';
  import {CreateSong, getSongVkey} from 'js/song';
  import Scroll from 'components/scroll/scroll';
  import Loading from 'components/loading/loading';
  import Singer from 'js/singer';
  import {mapMutations, mapActions} from 'vuex';
  import NoResult from 'components/no-result/no-result';

  const TYPE_SINGER = 'singer';
  const perpage = 20;

  export default {
    props: {
      query: {
        type: String,
        default: ''
      },
      showSinger: {
        type: Boolean,
        default: true
      }
    },
    data() {
      return {
        page: 1,
        result: [],
        pullup: true,
        beforeScroll: true,
        hasMore: true
      };
    },
    methods: {
      search() {
        this.hasMore = true;
        this.page = 1;
        this.$refs.suggest.scrollTo(0, 0);
        search(this.query, this.page, this.showSinger, perpage).then((res) => {
          if (res.code === ERR_OK) {
            this._genResult(res.data, (res) => {
              this.result = res;
            });
            this._checkMore(res.data);
          }
        });
      },
      // 刷新加载更多
      searchMore() {
        if (!this.hasMore) {
          return;
        }
        this.page++;
        search(this.query, this.page, this.showSinger, perpage).then((res) => {
          if (res.code === ERR_OK) {
            this._genResult(res.data, (rest) => {
              this.result = this.result.concat(rest) //把新搜索到的数据拼接到之前搜索到的数据中
            })
            this._checkMore(res.data);
          }
        });
      },
      getDisplayName(item) {
        if (item.type === TYPE_SINGER) {
          return item.singername;
        } else {
          return `${item.name}-${item.singer}`;
        }
      },
      getIconCls(item) {
        if (item.type === TYPE_SINGER) {
          return 'icon-mine';
        } else {
          return 'icon-music';
        }
      },
      selectItem(item) {
        if (item.type === TYPE_SINGER) {
          const singer = new Singer({
            id: item.singermid,
            name: item.singername
          });
          this.$router.push({
            path: `/search/${singer.id}`
          });
          this.setSinger(singer);
        } else {
          this.insertSong(item);
        }
        this.$emit('select');
      },
      refresh() {
        this.$refs.suggest.refresh();
      },
      listScroll() {
        this.$emit('listScroll');
      },
      // 处理上拉刷新
      _checkMore(data) {
        const song = data.song;
        if (!song.list.length || (song.curnum + song.curpage * perpage) > song.totalnum) {
          this.hasMore = false;
        }
      },
      // 处理返回的数据
      _genResult(data, callback) {
        let ret = [];
        if (data.zhida && data.zhida.singername) {
          ret.push({...data.zhida, ...{type: TYPE_SINGER}});
        }
        if (data.song) {
          this._normalizeSongs(data.song.list, (restdata) => {
            ret = ret.concat(restdata)
            callback && callback(ret);
          });
        }
      },
      _normalizeSongs(list, callback) {
        if (!list) {
          return;
        }
        let ret = [];
        let index = 1;
        list.forEach((musicData) => {
          if (musicData.songid && musicData.albummid) {
            getSongVkey(musicData.songmid).then((res) => {
              if (res.code === ERR_OK) {
                const vkey = res.data.items[0].vkey;
                ret.push(CreateSong(musicData, vkey));
                if (index === list.length) {
                  callback && callback(ret)
                }
                index++;
              }
            });
          }
        });
      },
      ...mapMutations({
        setSinger: 'SET_SINGER'
      }),
      ...mapActions([
        'insertSong'
      ])
    },
    watch: {
      query() {
        this.search();
      }
    },
    components: {
      Scroll,
      Loading,
      NoResult
    }
  };
</script>

<style lang="stylus" rel="stylesheet/stylus" type="text/stylus" scoped>
  @import "~@/assets/stylus/variable";
  @import "~@/assets/stylus/mixin";
  .suggest
    height: 100%
    overflow: hidden
    .suggest-list
      padding: 0 30px
      .suggest-item
        display: flex
        align-items: center
        padding-bottom: 20px
      .icon
        flex: 0 0 30px
        width: 30px
        [class^="icon-"]
          font-size: 14px
          color: $color-text-d
      .name
        flex: 1
        font-size: $font-size-medium
        color: $color-text-d
        overflow: hidden
        .text
          no-wrap()
    .no-result-wrapper
      position: absolute
      width: 100%
      top: 50%
      transform: translateY(-50%)
</style>

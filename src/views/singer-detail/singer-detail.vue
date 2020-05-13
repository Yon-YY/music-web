<template>
  <transition name="slide">
    <music-list :songs="songs" :title="title" :bg-image="bgImage"></music-list>
  </transition>
</template>

<script type="text/ecmascript-6">
  import {mapGetters} from 'vuex';
  import {getSingerDetail} from 'api/singer';
  import {ERR_OK} from 'api/config';
  import {CreateSong, getSongVkey} from 'js/song';
  import musicList from 'components/music-list/music-list';

  export default {
    data() {
      return {
        songs: []
      };
    },
    computed: {
      title() {
        return this.singer.name
      },
      bgImage() {
        return this.singer.avatar
      },
      ...mapGetters(['singer'])
    },
    created() {
      this._getDetail();
    },
    methods: {
      _getDetail() {
        if (!this.singer.id) {
          this.$router.push('/singer');
          return;
        }
        getSingerDetail(this.singer.id).then((res) => {
          if (res.code === ERR_OK) {
            console.log(res);
            this.songs = this._normalizeSinger(res.data.list);
          }
        })
      },
      _normalizeSinger(list) {
        let ret = [];
        list.forEach((item) => {
          let {musicData} = item;
          getSongVkey(musicData.songmid).then((res) => {
            const vkey = res.data.items[0].vkey;
            if (musicData.songid && musicData.albummid) {
              ret.push(CreateSong(musicData, vkey))
            }
          });
        });
        return ret;
      }
    },
    components: {
      musicList
    }
  };
</script>

<style lang="stylus" rel="stylesheet/stylus" type="text/stylus" scoped>
  @import "~@/assets/stylus/variable";
  .slide-enter-active, .slide-leave-active
    transition: all 0.3s
  .slide-enter, .slide-leave-to
    transform: translate3d(100%, 0, 0)
</style>

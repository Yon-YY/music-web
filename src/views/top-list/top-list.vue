<template>
  <transition name="slide">
    <music-list :rank="rank" :title="title" :bgImage="bgImage"
                :songs="songs"></music-list>
  </transition>
</template>

<script type="text/ecmascript-6">
  import MusicList from 'components/music-list/music-list';
  import {mapGetters} from 'vuex';
  import {getMusicList} from 'api/rank';
  import {ERR_OK} from 'api/config';
  import {CreateSong, getSongVkey} from 'js/song';

  export default {
    data() {
      return {
        songs: [],
        rank: true
      };
    },
    created() {
      this._getMusicList();
    },
    methods: {
      _getMusicList() {
        if (!this.topList.id) {
          this.$router.push('/rank');
          return;
        }
        getMusicList(this.topList.id).then((res) => {
          if (res.code === ERR_OK) {
            this.songs = this._normalizeSongs(res.songlist);
          }
        }).catch((err) => {
          console.log(err);
        });
      },
      _normalizeSongs(list) {
        let ret = [];
        list.forEach((item) => {
          const musicData = item.data;
          getSongVkey(musicData.songmid).then((res) => {
            const vkey = res.data.items[0].vkey;
            if (musicData.songid && musicData.albummid) {
              ret.push(CreateSong(musicData, vkey));
            }
          });
        });
        return ret;
      }
    },
    computed: {
      title() {
        return this.topList.topTitle;
      },
      bgImage() {
        if (this.songs.length) {
          return this.songs[0].image;
        }
        return '';
        // return this.topList.picUrl;
      },
      ...mapGetters(['topList'])
    },
    components: {
      MusicList
    }
  };
</script>

<style lang="stylus" rel="stylesheet/stylus" type="text/stylus" scoped>
  .slide-enter-active, .slide-leave-active
    transition: all 0.3s ease
  .slide-enter, .slide-leave-to
    transform: translate3d(100%, 0, 0)
</style>

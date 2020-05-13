<template>
  <div id="app">
    <m-header></m-header>
    <tab></tab>
    <keep-alive>
      <router-view></router-view>
    </keep-alive>
    <player></player>
  </div>
</template>
<script type="text/ecmascript-6">
  import MHeader from '~/header/header';
  import Tab from '~/tab/tab';
  import Player from 'components/player/player';

  export default {
    components: {
      MHeader,
      Tab,
      Player
    }
  };
</script>
<style lang="stylus" type="text/stylus" rel="stylesheet/stylus">
  @import './assets/stylus/variable.styl';
  #app
    color: $color-theme
</style>

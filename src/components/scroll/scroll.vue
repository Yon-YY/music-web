<template>
  <div class="wrapper" ref="wrapper">
    <slot></slot>
  </div>
</template>

<script type="text/ecmascript-6">
  import BScroll from 'better-scroll';

  export default {
    props: {
      probeType: {
        type: Number,
        default: 1
      },
      click: {
        type: Boolean,
        default: true
      },
      data: {
        type: Array,
        default: null
      },
      listenScroll: {// 是否启用scroll监听滚动位置
        type: Boolean,
        default: false
      },
      pullup: { // 是否开启上拉刷新
        type: Boolean,
        default: false
      },
      beforeScroll: {
        type: Boolean,
        default: false
      },
      refreshDelay: {
        type: Number,
        default: 20
      }
    },
    mounted() {
      setTimeout(() => {
        this._initScroll();
      }, 20);
    },
    methods: {
      _initScroll() {
        if (!this.$refs.wrapper) {
          return
        }
        this.scroll = new BScroll(this.$refs.wrapper, {
          probeType: this.probeType,
          click: this.click
        });
        // 监听scroll滚动事件
        if (this.listenScroll) {
          let _self = this;
          this.scroll.on('scroll', (pos) => {
            _self.$emit('scroll', pos);
          });
        }
        // 监听scroll上拉刷新
        if (this.pullup) {
          this.scroll.on('scrollEnd', () => {
            if (this.scroll.y <= (this.scroll.maxScrollY + 50)) {
              this.$emit('scrollToEnd');
            }
          });
        }
        if (this.beforeScroll) {
          this.scroll.on('beforeScrollStart', () => {
            this.$emit('beforeScroll');
          });
        }
      },
      enable() {  // BScroll 的代理方法
        this.scroll && this.scroll.enable();
      },
      disable() { // BScroll 的代理方法
        this.scroll && this.scroll.disable();
      },
      refresh() { // BScroll 的代理方法
        this.scroll && this.scroll.refresh();
      },
      scrollTo() { // BScroll 的代理方法
        this.scroll && this.scroll.scrollTo.apply(this.scroll, arguments);
      },
      scrollToElement() { // BScroll 的代理方法
        this.scroll && this.scroll.scrollToElement.apply(this.scroll, arguments);
      }
    },
    watch: {
      data() {
        setTimeout(() => {
          this.refresh();
        }, this.refreshDelay);
      }
    }
  };
</script>

<style lang="stylus" rel="stylesheet/stylus" type="text/stylus" scoped></style>

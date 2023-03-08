<template>
  <div id="app">
    <router-view v-if="isRouterAlive"></router-view>
  </div>
</template>
<script>

export default {
  name: 'App',
  provide () {
    return {
      reload: this.reload,
    }
  },
  data () {
    return {
      isRouterAlive: true,
      userInfo: new Object
    }
  },
  beforeCreate () {

  },
  created () {
    this.changeTheme();
  },
  mounted () {

  },
  methods: {
    reload () {
      this.isRouterAlive = false;
      this.$nextTick(
        function () {
          this.isRouterAlive = true;
          this.changeTheme();
        }
      )
    },
    changeTheme () {
      let userInfoStr = localStorage.getItem('userInfo');
      if (userInfoStr == null) {
        import('./assets/css/color-white.css');
        import('./assets/css/main-white.css');
      } else {
        let userInfo = JSON.parse(userInfoStr);
        if (JSON.stringify(userInfo) != 'null') {
          switch (userInfo.Theme) {
            case 'DARK':
              import('./assets/css/color-dark.css');
              import('./assets/css/main-dark.css');
              break;
            case 'WHITE':
              import('./assets/css/color-white.css');
              import('./assets/css/main-white.css');
              break;
            default:
              import('./assets/css/color-white.css');
              import('./assets/css/main-white.css');
              break;
          }
        }
      }
    },

  },

}
</script>
<style>
@import './assets/css/main.css';
/* @import "./assets/css/color-dark.css";     深色主题 */
/*@import './assets/css/theme-green/color-green.css'; /* 浅绿色主题 */
/*@import './assets/css/color-white.css'; /* 深色主题 */
</style>
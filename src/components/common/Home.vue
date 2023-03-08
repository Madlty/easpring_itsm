<template>
    <div class="wrapper">
        <v-head></v-head>
        <v-sidebar></v-sidebar>
        <div class="content-box" :class="{ 'content-collapse': collapse }">
            <v-tags></v-tags>
            <div class="content"    v-bind:class="[isDark ? contentDark : contentWhite]">
                <transition name="move" mode="out-in">
                    <keep-alive :include="tagsList">
                        <router-view></router-view>
                    </keep-alive>
                </transition>
                <el-backtop target=".content"></el-backtop>
            </div>
        </div>
    </div>
</template>

<script>
import vHead from './Header.vue';
import vSidebar from './Sidebar.vue';
import vTags from './Tags.vue';
import bus from './bus';
export default {
  data () {
    return {
      tagsList: [],
      collapse: false,
        isDark: Boolean,
      contentDark: 'contentColorDark',
      contentWhite: 'contentColorWhite'
    };
  },
  components: {
    vHead,
    vSidebar,
    vTags
  },
  created () {
    bus.$on('collapse-content', msg => {
      this.collapse = msg;
    });

    // 只有在标签页列表里的页面才使用keep-alive，即关闭标签之后就不保存到内存中了。
    bus.$on('tags', msg => {
      let arr = [];
      for (let i = 0, len = msg.length; i < len; i++) {
        msg[i].name && arr.push(msg[i].name);
      }
      this.tagsList = arr;
    });
  },
  mounted(){
    let userInfo = JSON.parse(localStorage.getItem('userInfo'));
    if (userInfo != null) {
      switch (userInfo.Theme) {
        case 'DARK':
          this.isDark = true;
          break;
        case 'WHITE':
          this.isDark = false;
          break;
        default:
          this.isDark = true;
          break;
      }
    }
  }
};
</script>

<style scoped>
.content {
    margin-top: -10px;
}
.contentColorDark {
    background-color: #000;
}
.contentColorWhite {
    background-color: #fff;
}
.content-box {
    margin-top: -20px;
}
</style>

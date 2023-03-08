<template>
  <div class="sidebar">
    <el-menu class="sidebar-el-menu" :default-active="onRoutes" :collapse="collapse" :background-color='bgMenuColor' :text-color="txtMenuColor" :active-text-color="atxtMenuColor" :unique-opened="false" router>
      <!-- <template v-for="item in items">
                <template v-if="item.subs">
                    <el-submenu :index="item.index" :key="item.index">
                        <template slot="title">
                            <i :class="item.icon"></i>
                            <span slot="title">{{ item.title }}</span>
                        </template>
                        <template v-for="subItem in item.subs">
                            <el-submenu
                                v-if="subItem.subs"
                                :index="subItem.index"
                                :key="subItem.index"
                            >
                                <template slot="title">{{ subItem.title }}</template>
                                <el-menu-item
                                    v-for="(threeItem,i) in subItem.subs"
                                    :key="i"
                                    :index="threeItem.index"
                                >{{ threeItem.title }}</el-menu-item>
                            </el-submenu>
                            <el-menu-item
                                v-else
                                :index="subItem.index"
                                :key="subItem.index"
                            >{{ subItem.title }}</el-menu-item>
                        </template>
                    </el-submenu>
                </template>
                <template v-else>
                    <el-menu-item :index="item.index" :key="item.index">
                        <i :class="item.icon"></i>
                        <span slot="title">{{ item.title }}</span>
                    </el-menu-item>
                </template>
            </template>  -->
      <template v-for="item in menuItems">
        <template v-if="item.childMenu && item.childMenu.length">
          <el-submenu :index="item.menuId" :key="item.menuId">
            <template slot="title">
              <i :class="item.icon"></i>
              <span slot="title">{{ item.menuName }}</span>
            </template>
            <template v-for="subItem in item.childMenu">
              <el-submenu v-if="subItem.childMenu && subItem.childMenu.length" :index="subItem.menuId" :key="subItem.menuId">
                <template slot="title">
                  <i :class="subItem.icon"></i>
                  <span slot="title">{{ subItem.menuName }}</span>
                </template>
                <el-menu-item v-for="threeItem in subItem.childMenu" :key="threeItem.url" :index="threeItem.url">
                  <i :class="threeItem.icon"></i>
                  <span slot="title">{{ threeItem.menuName }}</span>
                </el-menu-item>
              </el-submenu>
              <el-menu-item v-else :index="subItem.url" :key="subItem.url">
                <i :class="subItem.icon"></i>
                <span slot="title">{{ subItem.menuName }}</span>
              </el-menu-item>
            </template>
          </el-submenu>
        </template>
        <template v-else>
          <el-menu-item :index="item.url" :key="item.url">
            <i :class="item.icon"></i>
            <span slot="title">{{ item.menuName }}</span>
          </el-menu-item>
        </template>
      </template>
    </el-menu>
  </div>
</template>

<script>
import bus from '../common/bus';
export default {
  data () {
    return {
      collapse: false,
      items: [],
      menuItems: [],
      bgMenuColor:'',
      txtMenuColor :'',
      atxtMenuColor:''

    };
  },
  computed: {
    onRoutes () {
      return this.$route.path.replace('/', '');
    }
  },
  created () {
    // 通过 Event Bus 进行组件间通信，来折叠侧边栏
    bus.$on('collapse', msg => {
      this.collapse = msg;
      bus.$emit('collapse-content', msg);
    });
    let userInfo = JSON.parse(localStorage.getItem("userInfo"));
  let menuItems = userInfo.menus;

    this.menuItems = menuItems;
    console.log(menuItems);

    switch( userInfo.Theme){
        case 'DARK':
              this.bgMenuColor = '#13142b';
              this.txtMenuColor ='#bfcbd9'; 
              this.atxtMenuColor='#20a0ff';
          break;
        case 'WHITE':
              this.bgMenuColor =  '#d8d8e0';
              this.txtMenuColor = '#4d5457'; 
              this.atxtMenuColor='#1b92d0';
          break;
        default:
          break;
      }

  }
};
</script>

<style scoped>
.sidebar {
    display: block;
    position: absolute;
    left: 0;
    top: 70px;
    bottom: 0;
    overflow-y: scroll;
}
.sidebar::-webkit-scrollbar {
    width: 0;
}
.sidebar-el-menu:not(.el-menu--collapse) {
    width: 250px;
}
.sidebar > ul {
    height: 100%;
}
</style>

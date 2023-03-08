import Vue from 'vue';
import App from './App.vue';
import router from './router';
import ElementUI from 'element-ui';
import VueI18n from 'vue-i18n';
import 'element-ui/lib/theme-chalk/index.css'; // 默认主题
//import './assets/scss/ element-variables.scss'
//import './assets/css/theme-green/index.css'; // 浅绿色主题
import './assets/css/icon.css';
import './common.css'
import './components/common/directives';
import 'babel-polyfill';
import './icons';
import VCharts from 'v-charts'
import axios from 'axios';
import iconPicker from 'e-icon-picker';
import 'e-icon-picker/dist/index.css'; //基础样式
import 'e-icon-picker/dist/main.css'; //fontAwesome 图标库样式
import echarts from 'echarts'
import {
  Notification
} from 'element-ui';
import para from './utils/global_variable';
import './assets/icon/iconfont.css';




axios.defaults.withCredentials = true;
// Vue.prototype.baseDownUrl = 'http://localhost:9003/down'
Vue.prototype.baseDownUrl = process.env.VUE_APP_BASE_API + 'down'
Vue.config.productionTip = false;
Vue.use(VueI18n);
Vue.use(VCharts);
Vue.use(ElementUI, {
  size: 'small'
});
Vue.use(iconPicker);
const i18n = new VueI18n({
  locale: 'ZH', // 语言标识
  //this.$i18n.locale // 通过切换locale的值来实现语言切换
  messages: {
    'ZH': require('./components/common/lang/zh'), // 中文语言包
    'EN': require('./components/common/lang/en') // 英文语言包
  }
});
//重置表单，formRef为表单的ref值，excludeFields为要排除重新初始化值得属性
Vue.prototype.$reset = function (formRef, ...excludeFields) {
  this.$refs[formRef].resetFields();
  let obj1 = this.$data;
  //let obj2 = this.$options.data.call(this);
  if (!excludeFields || excludeFields.length === 0) {
    excludeFields = ["ruleValidate"];
  }
  for (let attrName in obj1) {
    if (excludeFields && excludeFields.includes(attrName)) {
      continue;
    }
    //obj1[attrName] = obj2[attrName];
  }
};

Vue.prototype.$echarts = echarts;
Vue.prototype.$notify = Notification;
Vue.prototype.$para = para;

//使用钩子函数对路由进行权限跳转
router.beforeEach((to, from, next) => {
  document.title = `${to.meta.title} | 当升科技ITSM`;
  var user = {};
  if (localStorage.getItem('userInfo') != 'undefined') {
    user = JSON.parse(localStorage.getItem('userInfo'));
  }
  if (!user && to.path !== '/login' && to.path !== '/CHANGEPWD') {
    next('/login');
  } else if (to.meta.permission) {
    // 如果是管理员权限则可进入，这里只是简单的模拟管理员权限而已
    user.name === 'admin' ? next() : next('/403');
  } else {
    // 简单的判断IE10及以下不进入富文本编辑器，该组件不兼容
    if (navigator.userAgent.indexOf('MSIE') > -1 && to.path === '/editor') {
      Vue.prototype.$alert('vue-quill-editor组件不兼容IE10及以下浏览器，请使用更高版本的浏览器查看', '浏览器不兼容通知', {
        confirmButtonText: '确定'
      });
    } else {
      next();
    }
  }
});

new Vue({
  router,
  i18n,
  render: h => h(App)
}).$mount('#app');
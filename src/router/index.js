import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

export default new Router({
    routes: [
        {
            path: '/',
            redirect: '/DASHBOARD'
        },
        {
            path: '/',
            component: () => import('../components/common/Home.vue'),
            meta: {
                title: '自述文件'
            },
            children: [
                {
                    path: '/DASHBOARD',
                    component: () => import('../components/view/Dashboard.vue'),
                    meta: {
                        title: '系统首页'
                    }
                },
                {
                    path: '/USER',
                    component: () => import('../components/view/User.vue'),
                    meta: {
                        title: '用户管理'
                    }
                },
                {
                    path: '/ROLE',
                    component: () => import('../components/view/Role.vue'),
                    meta: {
                        title: '角色管理'
                    }
                },
                {
                    path: '/AUTHORIZATION',
                    component: () => import('../components/view/Authorization.vue'),
                    meta: {
                        title: '权限管理'
                    }
                },
                {
                    path: '/MENU',
                    component: () => import('../components/view/Menu.vue'),
                    meta: {
                        title: '菜单管理'
                    }
                },
                {
                    path: '/AUTHFIELD',
                    component: () => import('../components/view/AuthField.vue'),
                    meta: {
                        title: '权限字段'
                    }
                },
                {
                    path: '/404',
                    component: () => import('../components/view/404.vue'),
                    meta: {
                        title: '404'
                    }
                },
                {
                    path: '/403',
                    component: () => import('../components/view/403.vue'),
                    meta: {
                        title: '403'
                    }
                },
                {
                    path: '/pictureType',
                    component: () => import('../components/view/PictureType.vue'),
                    meta: {
                        title: '图片分类列表'
                    }
                },
                {
                    path: '/pictureData',
                    component: () => import('../components/view/PictureData.vue'),
                    meta: {
                        title: '图片数据列表'
                    }
                },
                {
                    path: '/MMDATA',
                    component: () => import('../components/view/MMData.vue'),
                    meta: {
                        title: '物料主数据'
                    }
                }
            ]
        },
        {
            path: '/login',
            component: () => import('../components/view/Login.vue'),
            meta: {
                title: '登录'
            }
        },
        {
          path: '/CHANGEPWD',
          component: () => import('../components/view/ChangePwd.vue'),
          meta: {
              title: '修改密码'
          }
        },
        {
            path: '*',
            redirect: '/404'
        }
    ]
});

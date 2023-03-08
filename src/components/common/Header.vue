<template>
    <div class="header" v-bind:class="[isDark ? headerDark : headerWhite]">
        <!-- 折叠按钮 -->
        <div class="collapse-btn" @click="collapseChage">
            <i v-if="!collapse" class="el-icon-s-fold"></i>
            <i v-else class="el-icon-s-unfold"></i>
        </div>
        <div class="logo">
            <img src="@/img/easpring_log.png" />
            <span>ITSM</span>
        </div>
        <div class="header-right">
            <div class="header-user-con">
                <!-- 全屏显示 -->
                <div class="btn-fullscreen" @click="handleFullScreen">
                    <el-tooltip effect="dark" :content="fullscreen ? `取消全屏` : `全屏`" placement="bottom">
                        <i class="el-icon-rank"></i>
                    </el-tooltip>
                </div>
                <!-- 消息中心 -->
                <!-- <div class="btn-bell">
                    <el-tooltip
                        effect="dark"
                        :content="message?`有${message}条未读消息`:`消息中心`"
                        placement="bottom"
                    >
                        <router-link to="/tabs">
                            <i class="el-icon-bell"></i>
                        </router-link>
                    </el-tooltip>
                    <span class="btn-bell-badge" v-if="message"></span>
                </div> -->
                <!-- 用户头像 -->
                <div class="user-avator">
                    <!--<img v-bind:src="imgUrl" />-->
                </div>
                <!-- 用户名下拉菜单 -->
                <el-dropdown class="user-name" trigger="click" @command="handleCommand">
                    <span class="el-dropdown-link" v-bind:class="[isDark ? headerDark : headerWhite]">
                        {{ username }}
                        <i class="el-icon-caret-bottom"></i>
                    </span>
                    <el-dropdown-menu slot="dropdown">
                        <!-- <el-dropdown-item divided command="theme">{{ $t('m.changeTheme') }}</el-dropdown-item> -->
                        <el-dropdown-item divided command="logout">{{ $t('m.exitSys') }}</el-dropdown-item>
                    </el-dropdown-menu>
                </el-dropdown>
            </div>
        </div>
    </div>
</template>
<script>
import bus from '../common/bus';
import axios from 'axios';
import request from '../../utils/request';
axios.defaults.withCredentials = true;
export default {
    inject: ['reload'],
    data() {
        return {
            userInfo: JSON.parse(localStorage.getItem('userInfo')),
            collapse: false,
            fullscreen: false,
            name: '管理员',
            message: 2,
            userInfo: {},
            imgUrl: '',
            isDark: Boolean,
            headerDark: 'headerColorDark',
            headerWhite: 'headerColorWhite'
        };
    },
    created() {
        this.getImage();
    },

    computed: {
        username() {
            this.userInfo = JSON.parse(localStorage.getItem('userInfo'));
            let username = this.userInfo.NameLast + this.userInfo.NameFirst;
            return username ? username : this.userInfo.loginName;
        }
    },
    methods: {
        async getImage() {
            let userInfo = JSON.parse(localStorage.getItem('userInfo'));
            const token = Buffer.from(`${process.env.VUE_APP_BASE_USER}:${process.env.VUE_APP_BASE_PWD}`, 'utf8').toString('base64');
            await axios
                .get(
                    process.env.VUE_APP_BASE_API +
                        `fileSet('` +
                        userInfo.loginName +
                        `')/$value?cust_token=` +
                        userInfo.CustToken +
                        `&bname=` +
                        userInfo.loginName,
                    {
                        responseType: 'blob',
                        headers: {
                            Authorization: `Basic ${token}`
                        }
                    }
                )
                .then(res => {
                    this.imgUrl = URL.createObjectURL(res.data);
                })
                .catch(error => {
                    this.$router.push('/login');
                    console.log(error);
                });
        },
        // 用户名下拉菜单选择事件
        handleCommand(command) {
            const token = Buffer.from(`${process.env.VUE_APP_BASE_USER}:${process.env.VUE_APP_BASE_PWD}`, 'utf8').toString('base64');
            switch (command) {
                case 'logout': {
                    localStorage.removeItem('userInfo');
                    axios
                        .get(
                            process.env.VUE_APP_BASE_API +
                                'logoutSet(' +
                                "loginName='" +
                                this.userInfo.loginName +
                                "',CustToken='" +
                                this.userInfo.CustToken +
                                "')?sap-client=300",
                            {
                                headers: {
                                    Authorization: `Basic ${token}`,
                                    cust_method: 'logoutSet',
                                    srv_name: 'ZGW_ERP_B_SRV'
                                }
                            }
                        )
                        .then(res => {
                            this.$router.go('/login');
                        })
                        .catch(error => {
                            this.$router.go('/login');
                            console.log(error);
                        });

                    break;
                }
                case 'theme': {
                    let userInfo = JSON.parse(localStorage.getItem('userInfo'));
                    if (userInfo.Theme == 'WHITE') {
                        userInfo.Theme = 'DARK';
                    } else {
                        userInfo.Theme = 'WHITE';
                    }
                    let theme = { Bname: userInfo.loginName, Theme: userInfo.Theme };

                    request({
                        url: process.env.VUE_APP_BASE_API + "userSet(Bname='" + userInfo.Bname + "')",
                        method: 'put',
                        data: theme,
                        headers: {
                            'Content-Type': 'application/json;charset=UTF-8',
                            'X-CSRF-Token': this.userInfo.token
                        }
                    }).then(res => {
                        if (res.status == 204) {
                            localStorage.setItem('userInfo', JSON.stringify(userInfo));
                            window.location.reload();
                        } else {
                            this.$message.error(res.msg);
                        }
                    });
                    break;
                }

                default:
                    break;
            }
        },
        // 侧边栏折叠
        collapseChage() {
            this.collapse = !this.collapse;
            bus.$emit('collapse', this.collapse);
        },
        // 全屏事件
        handleFullScreen() {
            let element = document.documentElement;
            if (this.fullscreen) {
                if (document.exitFullscreen) {
                    document.exitFullscreen();
                } else if (document.webkitCancelFullScreen) {
                    document.webkitCancelFullScreen();
                } else if (document.mozCancelFullScreen) {
                    document.mozCancelFullScreen();
                } else if (document.msExitFullscreen) {
                    document.msExitFullscreen();
                }
            } else {
                if (element.requestFullscreen) {
                    element.requestFullscreen();
                } else if (element.webkitRequestFullScreen) {
                    element.webkitRequestFullScreen();
                } else if (element.mozRequestFullScreen) {
                    element.mozRequestFullScreen();
                } else if (element.msRequestFullscreen) {
                    // IE11
                    element.msRequestFullscreen();
                }
            }
            this.fullscreen = !this.fullscreen;
        }
    },
    mounted() {
        if (document.body.clientWidth < 1500) {
            this.collapseChage();
        }
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
.header {
    position: relative;
    box-sizing: border-box;
    width: 100%;
    height: 100%;
    font-size: 22px;
}
.headerColorDark {
    color: #fff;
    background-color: #000;
}
.headerColorWhite {
    color: #000;
    background-color: #fff;
}
.collapse-btn {
    float: left;
    padding: 0 21px;
    cursor: pointer;
    line-height: 60px;
}
.header .logo {
    float: left;
    width: 600px;
    line-height: 60px;
    height: 60px;
    display: flex;
    align-items: center;
}
.header .logo img {
    height: 30px;
    margin-right: 16px;
}
.header-right {
    float: right;
    padding-right: 50px;
}
.header-user-con {
    display: flex;
    height: 60px;
    align-items: center;
}
.btn-fullscreen {
    transform: rotate(45deg);
    margin-right: 5px;
    font-size: 24px;
    display: none;
}
.btn-bell,
.btn-fullscreen {
    position: relative;
    width: 30px;
    height: 30px;
    text-align: center;
    border-radius: 15px;
    cursor: pointer;
}
.btn-bell-badge {
    position: absolute;
    right: 0;
    top: -2px;
    width: 8px;
    height: 8px;
    border-radius: 4px;
    background: #f56c6c;
    color: #000;
}
.btn-bell .el-icon-bell {
    color: #000;
}
.user-name {
    margin-left: 10px;
}
.user-avator {
    margin-left: 20px;
}
.user-avator img {
    display: block;
    width: 40px;
    height: 40px;
    border-radius: 50%;
}
.el-dropdown-link {
    cursor: pointer;
}
.el-dropdown-menu__item {
    text-align: center;
}
</style>

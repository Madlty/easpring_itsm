<template>
    <div class="login-wrap">
        <div class="login-langu ">
            <el-dropdown @command="locale">
                <span class="el-dropdown-link">
                    <i class="iconfont icon-language mr10"></i>{{ $t('m.language') }}<i class="el-icon-arrow-down el-icon--right"></i>
                </span>
                <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item command="ZH">中文</el-dropdown-item>
                    <el-dropdown-item command="EN">Engligh</el-dropdown-item>
                </el-dropdown-menu>
            </el-dropdown>
        </div>
        <div class="login-changepwd mrl10">
            <el-button type="text" @click="handleChangePwd">
                <span class="el-dropdown-link"> <i class="iconfont icon-xiugaimima1 mr10"></i>{{ $t('m.changepwd') }} </span>
            </el-button>
        </div>

        <div class="title-container">
            <!-- <div class="letf_arrow"><img src="../../img/left_arrow_icon.png" /></div> -->
            <h3 class="title">
                {{ $t('m.easpITSM') }}
            </h3>
            <!-- <div class="right_arrow"><img src="../../img/right_arrow_icon.png" /></div> -->
        </div>
        <div class="ms-login">
            <!-- <el-tabs type="card" ref="loginTabs">
                <el-tab-pane label="密码登录"> -->
            <el-form :model="param" :rules="rules" ref="login" label-width="0px" class="ms-content">
                <el-form-item prop="loginName">
                    <el-input v-model="loginName" :placeholder="$t('m.username')" prefix-icon="el-icon-lx-people"> </el-input>
                </el-form-item>
                <el-form-item prop="password">
                    <el-input
                        type="password"
                        :placeholder="$t('m.password')"
                        v-model="param.password"
                        prefix-icon="el-icon-lx-lock"
                        @keyup.enter.native="submitForm()"
                    >
                    </el-input>
                </el-form-item>
            </el-form>
            <!-- </el-tab-pane>
                <el-tab-pane label="短信登录">
                    <el-form :model="paramPhone" :rules="rules" ref="phoneLogin" label-width="0px" class="ms-content">
                        <el-form-item prop="phone">
                            <el-input v-model="paramPhone.phone" placeholder="电话" prefix-icon="el-icon-mobile-phone"> </el-input>
                        </el-form-item>
                    </el-form>
                    <el-form :model="paramVerCode" :rules="rules" ref="verLogin" label-width="0px" class="ms-content-ver">
                        <el-form-item prop="verCode">
                            <el-input
                                type="verCode"
                                placeholder="验证码"
                                v-model="paramVerCode.verCode"
                                @keyup.enter.native="submitForm()"
                                class="verCode"
                                prefix-icon="el-icon-success"
                            >
                            </el-input>
                            <el-button class="verButton" @click="getVerCode()" type="primary" :disabled="(disabled = !show)">
                                <span v-show="show">获取验证码</span> <span v-show="!show" class="count">{{ count }} s</span>
        </el-button>
        </el-form-item>
        </el-form>
        </el-tab-pane>
        </el-tabs> -->
            <div class="login-btn">
                <el-button style="width: 100%; margin-bottom: 30px;" class="loginBtn" @click="submitForm()" :loading="isloading"
                    >{{ $t('m.login') }}
                </el-button>
            </div>

            <img src="../../img/bottom_border.png" style="width: 450px;" />
        </div>
    </div>
</template>

<script>
import axios from 'axios';
import rules from '../../utils/rules';
import loginJson from '../mockdata/login';
axios.defaults.withCredentials = true;
const TIME_COUNT = 60; //更改倒计时时间
export default {
    name: 'login',
    data: function() {
        return {
            param: {
                loginName: '',
                password: ''
            },
            paramPhone: {
                phone: ''
            },
            paramVerCode: {
                verCode: ''
            },

            show: true, // 初始启用按钮
            count: '', // 初始化次数
            timer: null,
            lj: loginJson,
            langu: '',
            isloading: false
        };
    },
    watch: {},

    computed: {
        rules() {
            return {
                loginName: [{ required: true, message: this.$t('m.plsInputUsername'), trigger: 'blur' }],
                password: [{ required: true, message: this.$t('m.plsInputPassword'), trigger: 'blur' }],
                phone: [{ required: true, validator: rules.phone, trigger: 'blur' }],
                verCode: [{ required: true, message: '请输入验证码', trigger: 'blur' }]
            };
        },
        loginName: {
            get: function() {
                return this.param.loginName;
            },
            set: function(val) {
                this.param.loginName = val.toUpperCase();
            }
        }
    },
    methods: {
        locale(command) {
            this.lang = this.$i18n.locale = command;
        },
        showPwd() {
            if (this.passwordType === 'password') {
                this.passwordType = '';
            } else {
                this.passwordType = 'password';
            }
            this.$nextTick(() => {
                this.$refs.password.focus();
            });
        },
        getVerCode() {
            this.$refs.phoneLogin.validate(valid => {
                if (valid) {
                    if (!this.timer) {
                        this.count = TIME_COUNT;
                        this.show = false;
                        this.timer = setInterval(() => {
                            if (this.count > 0 && this.count <= TIME_COUNT) {
                                this.count--;
                            } else {
                                this.show = true;
                                clearInterval(this.timer); // 清除定时器
                                this.timer = null;
                            }
                        }, 1000);
                    }
                }
                axios.post(process.env.VUE_APP_BASE_API + 'sms/sendSmsCode?mobile=' + this.paramPhone.phone + '&source=web').then(res => {
                    if (res.data.code == 0) {
                        this.$message.success('验证码发送成功');
                    } else {
                        this.$message.error(res.data.msg);
                        return false;
                    }
                });
            });
        },
        submitForm() {
            //if (this.$refs.loginTabs.panes[0].active == true) {
            this.isloading = true;

            const token = Buffer.from(`${process.env.VUE_APP_BASE_USER}:${process.env.VUE_APP_BASE_PWD}`, 'utf8').toString('base64');

            this.$refs.login.validate(valid => {
                if (valid) {
                    axios
                        .get(
                            process.env.VUE_APP_BASE_API +
                                'loginSet(Bname=' +
                                "'" +
                                this.param.loginName +
                                "'" +
                                ',Zpassword=' +
                                "'" +
                                this.param.password +
                                "'" +
                                ')?sap-client=300&sap-language=ZH',
                            {
                                headers: {
                                    Authorization: `Basic ${token}`,
                                    'Content-Type': 'application/json;charset=UTF-8',
                                    'X-CSRF-Token': 'Fetch',
                                    cust_method: 'loginSet',
                                    srv_name: 'ZGW_ERP_B_SRV'
                                }
                            }
                        )
                        .then(res => {
                            let data = {};
                            if (res.data.d.Zrc == 0) {
                                this.$message.success('登录成功');
                                res.data.d.menus = JSON.parse(res.data.d.Menus);
                                res.data.d.token = res.headers['x-csrf-token'];
                                localStorage.setItem('userInfo', JSON.stringify(res.data.d));

                                //this.$i18n.locale = res.data.d.langu
                                this.loadTheme(res.data.d.Theme);
                                this.$router.push('/');
                                this.isloading = false;
                            } else {
                                this.$message.error(this.$t('m.uNamenotMatchPwd'));
                                this.isloading = false;
                                return false;
                            }
                        })
                        .catch(error => {
                            this.$message.error(this.$t('m.backendNetworkError'));
                            this.isloading = false;
                        });
                } else {
                    this.$message.error(this.$t('m.plsInputUnamePwd'));
                    this.isloading = false;
                    return false;
                }
            });
            // }
            // else {
            //   this.$refs.phoneLogin.validate(valid => {
            //     if (valid) {
            //       this.$refs.verLogin.validate(valid => {
            //         if (valid) {
            //           axios.post(process.env.VUE_APP_BASE_API + 'user/codeLogin?mobile=' + this.paramPhone.phone + '&smsCode=' + this.paramVerCode.verCode)
            //             .then(res => {
            //               let data = {};
            //               if (res.data.code == 0) {
            //                 this.$message.success('登录成功');
            //                 this._converLocalUserInfo(res.data.data, data);
            //               } else {
            //                 this.$message.error('您输入的用户名和密码不匹配');
            //                 return false;
            //               }
            //             })
            //         } else {
            //           this.$message.error('请输入验证码');
            //           return false;
            //         }            });

            //     } else {
            //       this.$message.error('请输入手机号');
            //       return false;
            //     }
            // });å
            // }
        },
        loadTheme(theme) {
            switch (theme) {
                case 'DARK':
                    import(`../../assets/css/color-dark.css`);
                    import(`../../assets/css/main-dark.css`);
                    break;
                case 'WHITE':
                    import(`../../assets/css/color-white.css`);
                    import(`../../assets/css/main-white.css`);
                    break;
                default:
                    import(`../../assets/css/color-white.css`);
                    import(`../../assets/css/main-white.css`);
                    break;
            }
        },
        handleChangePwd() {
            this.$router.push({ path: `/CHANGEPWD` });
        }
    }
};
</script>

<style lang="scss">
/* 修复input 背景不协调 和光标变色 */
/* Detail see https://github.com/PanJiaChen/vue-element-admin/pull/927 */

$bg: #283443;
$light_gray: rgb(107, 101, 101);
$cursor: #fff;

@supports (-webkit-mask: none) and (not (cater-color: $cursor)) {
    .login-container .el-input input {
        color: $cursor;
    }
}

.login-wrap {
    position: relative;
    width: 100%;
    height: 100%;
    background-size: 100%;
    background: url(../../img/background8.png) 0 0 no-repeat;
}

.ms-title {
    left: 46%;
    top: 50%;
    width: 100%;
    line-height: 50px;
    text-align: center;
    font-size: 20px;
    color: #000;
    border-bottom: 1px solid rgb(15, 14, 14);
}
.ms-login {
    position: absolute;
    left: 65%;
    top: 35%;
    width: 450px;
    border-radius: 5px;
    background: rgba(0, 0, 0, 0.3);
    overflow: hidden;
}

.ms-content {
    padding-top: 30px;
    padding-left: 30px;
    padding-right: 30px;
}
.ms-content-ver {
    padding-left: 30px;
    padding-right: 30px;
}

.login-btn {
    padding: 30px 30px;
}
.bottom_border {
    display: block;
    height: 20px;
    text-align: center;
    align-content: center;
}

/* reset element-ui css */
.login-container {
    .el-input {
        display: inline-block;
        height: 47px;
        width: 85%;
        input {
            background: transparent;
            border: 0px;
            -webkit-appearance: none;
            appearance: none;
            border-radius: 0px;
            padding: 12px 5px 12px 15px;
            color: $light_gray;
            height: 47px;
            caret-color: $cursor;

            &:-webkit-autofill {
                box-shadow: 0 0 0px 1000px $bg inset !important;
                -webkit-text-fill-color: $cursor !important;
            }
        }
    }

    .el-form-item {
        border: 1px solid rgba(0, 0, 0, 0.1);
        background: rgba(255, 255, 255, 0.1);
        border-radius: 5px;
        color: #454545;
    }
}
.title-container {
    position: absolute;
    left: 10%;
    top: 45%;
    width: 600px;
    border-radius: 5px;
    background: rgba(255, 255, 255, 0);
    overflow: hidden;
    text-align: center;
    .letf_arrow {
        float: left;
    }
    .right_arrow {
        float: right;
    }
    .title {
        font-size: 80px;
        color: $light_gray;
        margin: 0 auto;
        font-weight: bold;
    }
}
.verCode {
    width: 70%;
}
.verButton {
    margin-left: 20px;
    height: 30px;
    width: 24%;
}
.el-tabs--card > .el-tabs__header {
    border-bottom: none;
}
.el-tabs--card > .el-tabs__header .el-tabs__nav {
    border: none;
    margin-left: 129px;
}

.el-tabs--card > .el-tabs__header .el-tabs__item.is-active {
    border-bottom: 1px solid;
    border-image: url(../../img/active_tab_bottom.png) 27;
}
.el-tabs__item.is-active {
    color: #000;
}
.el-tabs__item {
    color: #606266;
}
.el-tabs__item:hover {
    color: #b4b4be;
}
.el-tabs--card > .el-tabs__header .el-tabs__item {
    border-bottom: none;
    border-left: none;
}
.loginBtn {
    background-color: #e3e6ec;
}
.login-langu {
    position: absolute;
    left: 80%;
    top: 5%;
    display: none;
}
.login-changepwd {
    position: absolute;
    left: 84%;
    top: 4.2%;
}
.el-dropdown-link {
    cursor: pointer;
    color: #e3e6ec;
}
.el-icon-arrow-down {
    font-size: 12px;
}
.mr10 {
    margin-right: 5px;
    margin-left: 5px;
}
.mrl10 {
    margin-left: 5px;
}
</style>

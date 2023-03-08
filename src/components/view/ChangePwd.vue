<template>
    <div class="change-layout">
        <div class="change-content">
            <header id="header" class="mui-bar mui-bar-nav">
                <h1 class="mui-title">{{ $t('m.changepwd') }}</h1>
            </header>
        </div>
        <div class="change-account">
            <p>{{ $t('m.passwordRule') }}</p>
        </div>
        <!--引入element插件HTML样式-->
        <template>
            <el-form class="user-account-key" ref="form" :model="form" :rules="rules" label-width="150px">
                <el-form-item :label="$t('m.username')" prop="loginName">
                    <el-input :placeholder="$t('m.plsInputUsername')" v-model="loginName"></el-input>
                </el-form-item>
                <el-form-item :label="$t('m.oPassword')" prop="lastpassword">
                    <el-input type="password" :placeholder="$t('m.plsInputOPassword')" v-model="form.lastpassword"></el-input>
                </el-form-item>
                <el-form-item :label="$t('m.newPassword')" prop="password">
                    <el-input type="password" :placeholder="$t('m.plsInputNPassword')" v-model="form.password"></el-input>
                </el-form-item>
                <el-form-item :label="$t('m.passConfirm')" prop="cfpassword">
                    <el-input type="password" :placeholder="$t('m.plsInputCPassword')" v-model="form.cfpassword"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="onSubmit(form)" :loading="isloading">{{ $t('m.modify') }}</el-button>
                    <el-button @click="$refs['form'].resetFields()">{{ $t('m.reset') }}</el-button>
                    <el-button @click="goBack">{{ $t('m.back') }}</el-button>
                </el-form-item>
            </el-form>
        </template>
    </div>
</template>

<script>
import axios from 'axios';
import request from '../../utils/request';
export default {
    name: 'CHANGEPWD',
    data() {
        return {
            form: {
                loginName: '',
                lastpassword: '',
                password: '',
                cfpassword: ''
            },
            isloading: false,
            rules: {
                //验证规则
                loginName: [
                    {
                        required: true,
                        message: this.$t('m.plsInputUsername'),
                        trigger: 'blur'
                    }
                ],
                lastpassword: [
                    {
                        required: true,
                        message: this.$t('m.plsInputOPassword'),
                        trigger: 'blur'
                    }
                ],
                password: [
                    {
                        required: true,
                        message: this.$t('m.plsInputNPassword'),
                        trigger: 'blur'
                    }
                ],
                cfpassword: [
                    {
                        required: true,
                        message: this.$t('m.plsInputCPassword'),
                        trigger: 'blur'
                    }
                ]
            }
        };
    },
    computed: {
        loginName: {
            get: function() {
                return this.form.loginName;
            },
            set: function(val) {
                this.form.loginName = val.toUpperCase();
            }
        }
    },
    created() {},
    methods: {
        goBack() {
            this.$router.go(-1);
        },
        //提交事件
        onSubmit(vForm) {
            this.$refs['form'].validate(valid => {
                //valid 全为 true即执行以下操作
                if (valid) {
                    if (vForm.lastpassword === vForm.password) {
                        this.$message.error(this.$t('m.sameONPassword'));
                        return;
                    }
                    if (vForm.password != vForm.cfpassword) {
                        this.$message.error(this.$t('m.notMatchNCPassword'));
                        return;
                    }

                    this.isloading = true;
                    let pwd = {
                        Bname: vForm.loginName,
                        Password: vForm.cfpassword
                    };
                    let userInfo = new Object();
                    const token = Buffer.from(`${process.env.VUE_APP_BASE_USER}:${process.env.VUE_APP_BASE_PWD}`, 'utf8').toString(
                        'base64'
                    );
                    axios
                        .get(
                            process.env.VUE_APP_BASE_API +
                                'loginSet(Bname=' +
                                "'" +
                                vForm.loginName +
                                "'" +
                                ',Zpassword=' +
                                "'" +
                                vForm.lastpassword +
                                "'" +
                                ')?sap-client=300',
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
                            if (res.data.d.Zrc == 0) {
                                localStorage.setItem('userInfo', JSON.stringify(res.data.d));
                                userInfo = res.data.d;
                                request({
                                    url: process.env.VUE_APP_BASE_API + "userSet(Bname='" + vForm.loginName + "')",
                                    headers: {
                                        'Content-Type': 'application/json;charset=UTF-8',
                                        'X-CSRF-Token': res.headers['x-csrf-token']
                                    },
                                    data: pwd,
                                    method: 'put'
                                }).then(res => {
                                    request({
                                        url:
                                            process.env.VUE_APP_BASE_API +
                                            'logoutSet(' +
                                            "Bname='" +
                                            userInfo.loginName +
                                            "',CustToken='" +
                                            userInfo.CustToken +
                                            "')?sap-client=300",
                                        method: 'get'
                                    });
                                    this.isloading = false;
                                    if (res.status == 204) {
                                        this.$message.success('修改成功');
                                    } else {
                                        this.$message.error(res.msg);
                                    }
                                });
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
                    this.$message.error(this.$t('m.plsInputCorrect'));
                    return false;
                }
            });
        }
    }
};
</script>

<style scoped>
.error-page {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    width: 100%;
    height: 100%;
    background: #f3f3f3;
    box-sizing: border-box;
}
.error-code {
    line-height: 1;
    font-size: 250px;
    font-weight: bolder;
    color: #2d8cf0;
}
.error-code span {
    color: #00a854;
}
.error-desc {
    font-size: 30px;
    color: #777;
}
.error-handle {
    margin-top: 30px;
    padding-bottom: 200px;
}
.error-btn {
    margin-left: 100px;
}
.change-back {
    position: absolute;
    top: 24%;
    left: 0%;
}

.change-content {
    text-align: center;
}
.user-account-key {
    width: 88%;
}
.change-layout {
    width: 700px;
    position: absolute;
    left: 30%;
    top: 20%;
}
</style>

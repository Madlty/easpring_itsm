import axios from 'axios';
import router from '../router';
axios.defaults.withCredentials = true;
// const token = Buffer.from(`${process.env.VUE_APP_BASE_USER}:${process.env.VUE_APP_BASE_PWD}`, 'utf8').toString('base64')
const service = axios.create({
    //baseURL: 'http://10.91.31.33:8888/',
    timeout: 5000,
    auth: {
        username: 'liutianyu',
        password: 'Init_123'
    }
});

service.interceptors.request.use(
    config => {
        config.headers['cust_token'] = JSON.parse(localStorage.getItem('userInfo')).CustToken;
        config.headers['bname'] = JSON.parse(localStorage.getItem('userInfo')).loginName;
        config.headers['srv_name'] = 'ZGW_ERP_B_SRV';
        if (config.url.indexOf('?') > 0) {
            config.url = config.url + `&search=` + JSON.parse(localStorage.getItem('userInfo')).loginName;
        } else {
            config.url = config.url + `?search=` + JSON.parse(localStorage.getItem('userInfo')).loginName;
        }
        // config.headers['Authorization'] = `Basic ${token}`;
        let creatIndex = config.url.indexOf('insert');
        let modifyIndex = config.url.indexOf('update');
        let loginName = JSON.parse(localStorage.getItem('userInfo')).loginName;
        if (creatIndex > -1 || modifyIndex > -1) {
            config.transformRequest = [
                data => {
                    if (creatIndex > -1) {
                        //新建的加入 ：createUser
                        data = Object.assign(data, {
                            createUser: loginName
                        });
                        return JSON.stringify(data);
                    }
                    if (modifyIndex > -1) {
                        //修改的加入 ：  modifyUser
                        data = Object.assign(data, {
                            modifyUser: loginName
                        });
                        return JSON.stringify(data);
                    }
                }
            ];
        }

        return config;
    },
    error => {
        console.log(error);
        return Promise.reject();
    }
);

service.interceptors.response.use(
    response => {
        switch (response.status) {
            case 200:
                return response.data;
            case 201:
                return response;
            case 202:
                return response;
            case 204:
                return response;
            default:
                return Promise.reject();
        }
    },
    error => {
        console.log(error);

        if (error.response && error.response.status) {
            switch (error.response.status) {
                case 403:
                    router.replace({
                        path: '/login',
                        query: {
                            redirect: router.currentRoute.fullPath
                        }
                    });
                    break;
                case 401:
                    router.replace({
                        path: '/login',
                        query: {
                            redirect: router.currentRoute.fullPath
                        }
                    });
                    break;
            }
        } else {
            router.replace({
                path: '/login',
                query: {
                    redirect: router.currentRoute.fullPath
                }
            });
        }
        return Promise.reject();
    }
);

export default service;

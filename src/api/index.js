import request from '../utils/request';

export const fetchData = query => {
    return request({
        url:  process.env.VUE_APP_BASE_API+'table.json',
        method: 'get',
        params: query
    });
};


//营销码管理查询
export function getSalesManCode(params = {}) {
    return request({
        url: process.env.VUE_APP_BASE_API+'salesMan/getList',
        method: 'post',
        data: params
    })
}

//营销码管理查询
export function editSalesManCode(params = {}) {
    return request({
        url: process.env.VUE_APP_BASE_API+'salesMan/updateSalesMan',
        method: 'post',
        data: params
    })
}




module.exports = {
  publicPath: './',
  assetsDir: 'static',
  productionSourceMap: false,
  devServer: {
    open: process.platform === 'darwin', //平台类型
    host: '0.0.0.0',
    port: 8080,
    disableHostCheck: true,
    proxy: {
      "/api": {
        target: 'http://s4devapp01.easpring.com.cn:8002/sap/opu/odata/sap/ZGW_ERP_B_SRV',
        //target: 'https://erpdevapp.bjev.com.cn:44300/sap/opu/odata/sap/ZGW_ERP_B_SRV',
        //target: 'http://10.86.105.9:8000/sap/opu/odata/sap/ZGW_ERP_F_SRV',
        changeOrigin: true,
        pathRewrite: {
          '^/api': '/'
        }
      },
      "/saptoken": {
        target: 'https://erpdevapp.bjev.com.cn:44300/sap/bc',
        changeOrigin: true,
        pathRewrite: {
          '^/saptoken': '/'
        }
      }
    }

  },

}
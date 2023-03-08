<template>
  <div class="dashboardWrap">
    <div
      class="salesWrap"
      v-bind:class="[isDark ? headerDark : headerWhite]"
    >
      <h1 class="title">
        每日消息
      </h1>
      <ul class="saleResultList">
        <li>
          <h2><img src="@/img/zongchengjiao-icon.png" />通知栏</h2>
          <p>{{ allCount.successCodes }}</p>
        </li>
        <li>
          <h2><img src="@/img/zongchengjiao-icon.png" />工作任务栏</h2>
          <p>{{ dayCount.successCodes }}</p>
        </li>
        <li>
          <h2><img src="@/img/zongchengjiao-icon.png" />数据分析栏</h2>
          <p>{{ allCount.errorCodes }}</p>
        </li>
      </ul>
    </div>
    <div class="rowWrap">
      <section
        class="chartWrap"
        v-bind:class="[isDark ? headerDark : headerWhite]"
      >
        <h1 class="title">
          供应商数据日提交统计
        </h1>
        <el-date-picker
          v-model="supDate"
          format="yyyy-MM"
          type="month"
          value-format="yyyy-MM"
          placeholder="选择月份"
          size="mini"
          class="handle-date"
          @change="supDateChange"
        >
        </el-date-picker>
        <div
          id="mutipleLineChart"
          class="mutipleLineChart"
        ></div>
      </section>
      <section
        class="chartWrap"
        v-bind:class="[isDark ? headerDark : headerWhite]"
      >
        <h1 class="title">
          供应商数据状态统计
        </h1>
        <el-date-picker
          v-model="supStatus"
          format="yyyy-MM"
          type="month"
          value-format="yyyy-MM"
          placeholder="选择月份"
          size="mini"
          class="handle-date"
          @change="supStatusChange($event)"
        >
        </el-date-picker>

        <div
          id="mutipleAreaChart"
          class="mutipleAreaChart"
        ></div>
      </section>
    </div>
  </div>
</template>

<script>
import request from '../../utils/request';
export default {
  name: 'dashboard',
  data () {
    return {
      admin: JSON.parse(localStorage.getItem('userInfo')),
      dayCount: {},
      allCount: {},
      supDate: '',
      supStatus: '',
      supClass: '',
      supOnce: '',
      headerDark: 'headerColorDark',
      headerWhite: 'headerColorWhite',
      isDark: Boolean
    };
  },
  mounted () {
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
  },
  created () {
    // this.changeDate();
    // this.getMutipleLineChart();
    // this.getMutipleAreaChart();
    // this.getDayChart();
    // this.getTypeChart();
    // this.notification();
    // this.getNotification();

  },
  computed: {
    role () {
      return this.admin.name === 'admin' ? '超级管理员' : '普通用户';
    }

  },
  methods: {
    changeDate () {
      const now = new Date().getTime();
      const date = new Date(now + 86400000);
      // this.data.forEach((item, index) => {
      //   const date = new Date(now - (6 - index) * 86400000);
      //   item.name = `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}`;
      // });
      this.supDate = date.getFullYear() + '-0' + date.getMonth();
      this.supStatus = date.getFullYear() + '-0' + date.getMonth();
      this.supClass = date.getFullYear() + '-0' + date.getMonth();
      this.supOnce = date.getFullYear() + '-0' + date.getMonth();
    },
    getMutipleLineChart () {
      let month = this.supDate;
      request({ url: process.env.VUE_APP_BASE_API + '' + month, method: 'get', data: {} }).then(res => {
        let dataMutipleLine = res.data;
        // 基于准备好的dom，初始化echarts实例
        let mutipleLineChart = this.$echarts.init(document.getElementById('mutipleLineChart'))
        // 绘制图表
        mutipleLineChart.setOption({
          title: {},
          tooltip: { trigger: 'axis' },
          legend: {
            data: dataMutipleLine.legend,
            textStyle: {
              color: '#ffffff',
            }

          },
          grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
          },
          xAxis: {
            type: 'category',
            data: dataMutipleLine.xAxis,
            boundaryGap: false,
            axisLabel: {
              show: true,
              textStyle: {
                color: '#FFFFFF',
              },
              fontSize: 10,//字体大小
            },
            axisLine: {
              lineStyle: {
                color: '#FFFFFF',
                width: 1,//这里是为了突出显示加上的
              }
            }
          },
          yAxis: {
            type: 'value',
            axisLabel: {
              show: true,
              textStyle: {
                color: '#FFFFFF',
              },
              fontSize: 20,//字体大小
            },
            axisLine: {
              lineStyle: {
                color: '#FFFFFF',
                width: 1,//这里是为了突出显示加上的
              }
            },
            splitLine: {
              lineStyle: {
                // 使用深浅的间隔色
                color: ['#FFFFFF']
              }
            },
          },
          series: dataMutipleLine.data

        });
      });
    },
    getMutipleAreaChart () {
      let month = this.supStatus;
      request({ url: process.env.VUE_APP_BASE_API + '' + month, method: 'get', data: {} }).then(res => {
        let dataMutipleArea = res.data;
        for (let i = 0; i < dataMutipleArea.series.length; i++) {
          dataMutipleArea.series[i].label = {
            show: true,
            position: 'insideRight'
          };
        }
        // 基于准备好的dom，初始化echarts实例
        let mutipleAreaChart = this.$echarts.init(document.getElementById('mutipleAreaChart'))
        // 绘制图表
        mutipleAreaChart.setOption({
          title: {},
          tooltip: {
            trigger: 'axis',
            axisPointer: {            // 坐标轴指示器，坐标轴触发有效
              type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
            }
          },
          legend: {
            data: dataMutipleArea.legend,

          },
          grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
          },
          xAxis: { type: 'category', data: dataMutipleArea.xAxis },
          yAxis: {
            type: 'value',
          },
          series: dataMutipleArea.series

        });
      });
    },
    getDayChart () {
      request({ url: process.env.VUE_APP_BASE_API + '', method: 'get', data: {} }).then(res => {
        let dataBar = res.data;
        // 基于准备好的dom，初始化echarts实例
        let dayChart = this.$echarts.init(document.getElementById('dayChart'))
        // 绘制图表
        dayChart.setOption({
          title: {},
          tooltip: {
            formatter: function (data) {
              return '日期:' + data.name + '<br/>' + '数量:' + data.value;
            }
          },
          xAxis: {
            type: 'category',
            data: dataBar.type,
            axisLabel: {
              show: true,
              textStyle: {
                color: '#FFFFFF',
              },
              fontSize: 10,//字体大小
            },
            axisLine: {
              lineStyle: {
                color: '#FFFFFF',
                width: 1,//这里是为了突出显示加上的
              }
            }
          },
          yAxis: {
            type: 'value',
            axisLabel: {
              show: true,
              textStyle: {
                color: '#FFFFFF',
              },
              fontSize: 20,//字体大小
            },
            axisLine: {
              lineStyle: {
                color: '#FFFFFF',
                width: 1,//这里是为了突出显示加上的
              }
            },
            splitLine: {
              lineStyle: {
                // 使用深浅的间隔色
                color: ['#FFFFFF']
              }
            },
          },
          series: [{
            data: dataBar.data,
            barWidth: 20,
            type: 'line',
            itemStyle: {
              //通常情况下：
              normal: {
                //每个柱子的颜色即为colorList数组里的每一项，如果柱子数目多于colorList的长度，则柱子颜色循环使用该数组
                color: function (d) { return "#" + Math.floor(Math.random() * (256 * 256 * 256 - 1)).toString(16); }
                // color: function (params) {
                //   var colorList = ['rgb(164,205,238)', 'rgb(42,170,227)', 'rgb(25,46,94)', 'rgb(195,229,235)', 'rgb(203,100,234)', 'rgb(103,100,234)'];
                //   return colorList[params.dataIndex];
                // }
              },
              //鼠标悬停时：
              emphasis: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            },
          }]
        });
      });
    },
    getTypeChart () {
      let linRows = [];
      request({ url: process.env.VUE_APP_BASE_API + '', method: 'get', data: {} }).then(res => {
        let dataBar = res.data;
        // 基于准备好的dom，初始化echarts实例
        let typeChart = this.$echarts.init(document.getElementById('typeChart'))
        // 绘制图表
        typeChart.setOption({
          title: {},
          tooltip: {

            formatter: function (data) {
              return '类型:' + data.name + '<br/>' + '数量:' + data.value;
            }
          },
          xAxis: {
            type: 'category',
            data: dataBar.type,
            axisLabel: {
              show: true,
              textStyle: {
                color: '#FFFFFF',
              },
              fontSize: 10,//字体大小
            },
            axisLine: {
              lineStyle: {
                color: '#FFFFFF',
                width: 1,//这里是为了突出显示加上的
              }
            }
          },
          yAxis: {
            type: 'value',
            axisLabel: {
              show: true,
              textStyle: {
                color: '#FFFFFF',
              },
              fontSize: 20,//字体大小
            },
            axisLine: {
              lineStyle: {
                color: '#FFFFFF',
                width: 1,//这里是为了突出显示加上的
              }
            },
            splitLine: {
              lineStyle: {
                // 使用深浅的间隔色
                color: ['#FFFFFF']
              }
            },
          },
          series: [{
            data: dataBar.data,
            barWidth: 20,
            type: 'bar',
            itemStyle: {
              //通常情况下：
              normal: {
                //每个柱子的颜色即为colorList数组里的每一项，如果柱子数目多于colorList的长度，则柱子颜色循环使用该数组
                color: function (d) { return "#" + Math.floor(Math.random() * (256 * 256 * 256 - 1)).toString(16); }
                // color: function (params) {
                //   var colorList = ['rgb(164,205,238)', 'rgb(42,170,227)', 'rgb(25,46,94)', 'rgb(195,229,235)', 'rgb(203,100,234)', 'rgb(103,100,234)'];
                //   return colorList[params.dataIndex];
                // }
              },
              //鼠标悬停时：
              emphasis: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            },
          }]
        });
      });
    },
    getAccRateChart () {
      let linRows = [];
      request({ url: process.env.VUE_APP_BASE_API + '', method: 'get', data: {} }).then(res => {
        let dataBar = res.data;
        // 基于准备好的dom，初始化echarts实例
        let accRateChart = this.$echarts.init(document.getElementById('accRateChart'))
        // 绘制图表
        accRateChart.setOption({
          title: {},
          tooltip: {},
          xAxis: {
            type: 'category',
            data: dataBar.type,
            axisLabel: {
              show: true,
              textStyle: {
                color: '#FFFFFF',
              },
              fontSize: 10,//字体大小
            },
            axisLine: {
              lineStyle: {
                color: '#FFFFFF',
                width: 1,//这里是为了突出显示加上的
              }
            }
          },
          yAxis: {
            type: 'value',
            axisLabel: {
              show: true,
              textStyle: {
                color: '#FFFFFF',
              },
              fontSize: 20,//字体大小
            },
            axisLine: {
              lineStyle: {
                color: '#FFFFFF',
                width: 1,//这里是为了突出显示加上的
              }
            },
            splitLine: {
              lineStyle: {
                // 使用深浅的间隔色
                color: ['#FFFFFF']
              }
            },
          },
          series: [{
            data: dataBar.data,
            barWidth: 20,
            type: 'bar',
            itemStyle: {
              //通常情况下：
              normal: {
                //每个柱子的颜色即为colorList数组里的每一项，如果柱子数目多于colorList的长度，则柱子颜色循环使用该数组
                color: function (d) { return "#" + Math.floor(Math.random() * (256 * 256 * 256 - 1)).toString(16); }
                // color: function (params) {
                //   var colorList = ['rgb(164,205,238)', 'rgb(42,170,227)', 'rgb(25,46,94)', 'rgb(195,229,235)', 'rgb(203,100,234)', 'rgb(103,100,234)'];
                //   return colorList[params.dataIndex];
                // }
              },
              //鼠标悬停时：
              emphasis: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            },
          }]
        });
      });
    },
    getSuppRateChart () {
      let linRows = [];
      request({ url: process.env.VUE_APP_BASE_API + '', method: 'get', data: {} }).then(res => {
        let dataBar = res.data;
        // 基于准备好的dom，初始化echarts实例
        let suppRateChart = this.$echarts.init(document.getElementById('suppRateChart'))
        // 绘制图表
        suppRateChart.setOption({
          title: {},
          tooltip: {},
          xAxis: {
            type: 'category',
            data: dataBar.type,
            axisLabel: {
              show: true,
              textStyle: {
                color: '#FFFFFF',
              },
              fontSize: 10,//字体大小
            },
            axisLine: {
              lineStyle: {
                color: '#FFFFFF',
                width: 1,//这里是为了突出显示加上的
              }
            }
          },
          yAxis: {
            type: 'value',
            axisLabel: {
              show: true,
              textStyle: {
                color: '#FFFFFF',
              },
              fontSize: 20,//字体大小
            },
            axisLine: {
              lineStyle: {
                color: '#FFFFFF',
                width: 1,//这里是为了突出显示加上的
              }
            },
            splitLine: {
              lineStyle: {
                // 使用深浅的间隔色
                color: ['#FFFFFF']
              }
            },
          },
          series: [{
            data: dataBar.data,
            barWidth: 20,
            type: 'bar',
            itemStyle: {
              //通常情况下：
              normal: {
                //每个柱子的颜色即为colorList数组里的每一项，如果柱子数目多于colorList的长度，则柱子颜色循环使用该数组
                color: function (d) { return "#" + Math.floor(Math.random() * (256 * 256 * 256 - 1)).toString(16); }
                // color: function (params) {
                //   var colorList = ['rgb(164,205,238)', 'rgb(42,170,227)', 'rgb(25,46,94)', 'rgb(195,229,235)', 'rgb(203,100,234)', 'rgb(103,100,234)'];
                //   return colorList[params.dataIndex];
                // }
              },
              //鼠标悬停时：
              emphasis: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            },
          }]
        });
      });
    },
    notification () {
      if (this.admin.roleId == '1') {
        request({ url: process.env.VUE_APP_BASE_API + '', method: 'get', data: {} }).then(res => {
          this.$notify({
            title: '',
            dangerouslyUseHTMLString: true,
            message: '<strong><i>' + res.data + '</i></strong>',
            position: 'bottom-right'

          });
        });
      }
    },
    getNotification () {

    },
    supDateChange (value) {
      this.supDate = value;
      this.getMutipleLineChart();
    },
    supStatusChange (event) {

    },
    supClassChange (event) {

    },
    supOnceChange (event) {

    }
  }
};
</script>


<style scoped>
.el-row {
    margin-bottom: 20px;
}

.grid-content {
    display: flex;
    align-items: center;
    height: 100px;
}

.grid-cont-right {
    flex: 1;
    text-align: center;
    font-size: 14px;
    color: #999;
}

.grid-num {
    font-size: 30px;
    font-weight: bold;
}

.grid-con-icon {
    font-size: 50px;
    width: 100px;
    height: 100px;
    text-align: center;
    line-height: 100px;
    color: #fff;
}

.grid-con-1 .grid-con-icon {
    background: rgb(45, 140, 240);
}

.grid-con-1 .grid-num {
    color: rgb(45, 140, 240);
}

.grid-con-2 .grid-con-icon {
    background: rgb(100, 213, 114);
}

.grid-con-2 .grid-num {
    color: rgb(45, 140, 240);
}

.grid-con-3 .grid-con-icon {
    background: rgb(242, 94, 67);
}

.grid-con-3 .grid-num {
    color: rgb(242, 94, 67);
}

.user-info {
    display: flex;
    align-items: center;
    padding-bottom: 20px;
    border-bottom: 2px solid #ccc;
    margin-bottom: 20px;
}

.user-avator {
    width: 120px;
    height: 120px;
    border-radius: 50%;
}

.user-info-cont {
    padding-left: 50px;
    flex: 1;
    font-size: 14px;
    color: #999;
}

.user-info-cont div:first-child {
    font-size: 30px;
    color: #222;
}

.user-info-list {
    font-size: 14px;
    color: #999;
    line-height: 25px;
}

.user-info-list span {
    margin-left: 70px;
}

.mgb20 {
    margin-bottom: 20px;
}

.todo-item {
    font-size: 14px;
}

.todo-item-del {
    text-decoration: line-through;
    color: #999;
}

.schart {
    width: 100%;
    height: 300px;
}
.salesWrap {
    border-radius: 4px;
    padding: 20px;
    box-sizing: border-box;
}
.headerColorDark {
    background: #13142b;
}
.headerColorWhite {
    background: #d8d8e0;
}
.title {
    font-size: 26px;
    line-height: 26px;
    border-left: 10px solid #e82c1f;
    text-indent: 24px;
    font-weight: normal;
    margin-bottom: 20px;
    position: relative;
    display: inline-block;
}
.dashboardWrap .title span {
    font-size: 14px;
    color: #999;
}
.dashboardWrap .title .more {
    font-size: 14px;
    color: #10b267;
    position: absolute;
    right: 10px;
    top: 0px;
    line-height: 26px;
}
.saleResultList {
    display: flex;
    justify-content: space-around;
    align-items: center;
}
.saleResultList li {
    width: 22%;
    list-style: none;
}
.saleResultList li:nth-child(1) {
    background: url('../../img/zongchengjiao.png') no-repeat center center / 100% 100%;
}
.saleResultList li:nth-child(2) {
    background: url('../../img/dangrichengjiao.png') no-repeat center center / 100% 100%;
}
.saleResultList li:nth-child(3) {
    background: url('../../img/weichengjiao.png') no-repeat center center / 100% 100%;
}
.saleResultList li:nth-child(4) {
    background: url('../../img/qita.png') no-repeat center center / 100% 100%;
}
.saleResultList h2 {
    font-size: 20px;
    font-weight: normal;
    color: #fff;
    line-height: 70px;
    border-bottom: 1px solid rgba(255, 255, 255, 0.8);
    display: flex;
    justify-content: flex-start;
    align-items: center;
    white-space: nowrap;
}
.saleResultList h2 img {
    display: flex;
    width: 30px;
    height: 30px;
    margin-right: 10px;
    margin-left: 20px;
}
.saleResultList p {
    height: 118px;
    line-height: 90px;
    text-align: center;
    font-size: 45px;
    color: #fff;
}
.rowWrap {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 10px;
}
.rowWrap .chartWrap {
    border-radius: 4px;
    padding: 20px;
    box-sizing: border-box;
    width: 49.5%;
}
.mutipleLineChart {
    width: 100%;
    height: 400px;
}
.mutipleAreaChart {
    width: 100%;
    height: 400px;
}

.dayChart {
    width: 100%;
    height: 400px;
}
.typeChart {
    width: 100%;
    height: 400px;
}
.accRateChart {
    width: 100%;
    height: 400px;
}
.suppRateChart {
    width: 100%;
    height: 400px;
}
.handle-date {
    width: 150px;
    display: inline-block;
}
</style>

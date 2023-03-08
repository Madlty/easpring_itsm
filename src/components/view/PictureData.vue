<template>
  <div class="all">
    <div class="crumbs">
      <!-- <el-breadcrumb separator="/">
                <el-breadcrumb-item> <i class="el-icon-lx-friendadd"></i> 图片数据 </el-breadcrumb-item>
            </el-breadcrumb> -->
      <el-form ref="formSQE" :model="SQEClassData" class="SQE-form" v-if="this.admin.roleId == '0'">
        <el-form-item label="SQE:" size="mini">
          <el-radio-group v-model="SQEClassData.sqe" @change="generateSupplier" size="mini">
            <el-radio-button v-for="sqe in SQEClassData.data" :key="sqe.id" :label="sqe.nickName" class="SQE-button"></el-radio-button>
          </el-radio-group>
          <el-tooltip content="清空" placement="top-end">
            <el-button type="text" icon="el-icon-delete" circle size="mini" class="SQE-button-clear" @click="clearSQEClass"></el-button>
          </el-tooltip>
        </el-form-item>
      </el-form>
      <el-form ref="formSupplier" :model="supplierClassData" class="supplier-form" v-if="this.admin.roleId == '0' || this.admin.roleId == '1'">
        <el-form-item label="供应商:" size="mini">
          <el-checkbox-group ref="supplierCheckGroup" v-model="supplierClassData.supplier" @change="filterSupplier" size="mini">
            <!-- <el-checkbox-button
                            v-for="supplier in supplierClassData.data"
                            :key="supplier.ccode"
                            :label="supplier.sname"
                            class="supplier-button"
                        ></el-checkbox-button> -->
            <el-checkbox v-for="supplier in supplierClassData.data" :key="supplier.ccode" :label="supplier.sname" class="supplier-button"></el-checkbox>
          </el-checkbox-group>
        </el-form-item>
      </el-form>
    </div>
    <div class="container">
      <div class="handle-box">
        <el-select v-model="query.ptype" filterable clearable placeholder="图片类型" class="handle-select mr10" @change="handleImageTypeChange" size="mini">
          <el-option v-for="item in pCode" :key="item.cdoe" :label="item.name" :value="item.code">
            <span style="float: left">{{ item.name }}</span>
            <span style="float: right; color: #8492a6; font-size: 13px">{{ item.code }}</span>
          </el-option>
        </el-select>
        <el-select v-model="query.type" filterable clearable placeholder="图片分类" class="handle-select mr10" @change="handleImageClassChange" size="mini">
          <el-option v-for="item in childCodes" :key="item.code" :label="item.name" :value="item.code"></el-option>
        </el-select>
        <el-input v-model="query.creater" placeholder="创建人" @keyup.enter.native="handleSearch" class="handle-input mr10" size="mini"></el-input>
        <el-date-picker v-model="query.startDate" placeholder="开始时间" class="mr10" size="mini" style="width: 130px"></el-date-picker>
        <el-date-picker v-model="query.endDate" placeholder="结束时间" class="mr10" size="mini" style="width: 130px"></el-date-picker>
        <el-select v-model="query.status" placeholder="审批状态" clearable size="mini" class="handle-select mr10">
          <el-option key="1" label="待审批" value="1"></el-option>
          <el-option key="2" label="通过" value="2"></el-option>
          <el-option key="3" label="不通过" value="3"></el-option>
        </el-select>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleSearch">搜索</el-button>
      </div>
      <el-table :data="tableData" border class="table" ref="multipleTable" header-cell-class-name="table-header" @selection-change="handleSelectionChange" :height="this.tableHeight">
        <el-table-column prop="ptype" label="图片类型" width="100" align="center" :formatter="fomartPtype"></el-table-column>
        <el-table-column prop="type" label="图片分类" width="140" align="center" :formatter="fomartType"></el-table-column>
        <el-table-column prop="status" label="状态" width="80" align="center" :formatter="fomartStatus"></el-table-column>
        <el-table-column prop="imagePath" label="图片" width="50" align="center">
          <template slot-scope="scope">
            <el-image :src="scope.row.imagePath || defaultImg" style="width: 24px; height: 24px" :preview-src-list="scope.row.srcDetail || [defaultImg]"></el-image>
          </template>
        </el-table-column>
        <el-table-column prop="supplierName" label="供应商名称" width="120" align="center"></el-table-column>
        <el-table-column prop="creater" label="创建人" width="80" align="center"></el-table-column>
        <el-table-column prop="position" label="地址" :show-overflow-tooltip="true" width="100" align="center"></el-table-column>
        <el-table-column prop="createTime" label="创建时间" width="120" align="center"></el-table-column>
        <el-table-column prop="modifyer" label="审批人" width="80" align="center"></el-table-column>
        <el-table-column prop="modifyTime" label="审批时间" width="120" align="center"></el-table-column>
        <el-table-column prop="memo" label="审批意见" :show-overflow-tooltip="true" width="150"></el-table-column>
        <el-table-column v-if="this.admin.roleId != '2'" label="审批" align="center" width="280px">
          <template slot-scope="scope">
            <el-button type="success" :disabled="scope.row.status == '2' || scope.row.status == '3'" @click="handleApproval(scope.$index, scope.row)">通过</el-button>
            <el-button type="warning" :disabled="scope.row.status == '2' || scope.row.status == '3'" @click="handleReject(scope.$index, scope.row)">驳回</el-button>
            <el-button type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
            <el-button type="info" @click="handleDownload(scope.$index, scope.row)">下载</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination">
        <el-pagination background layout="total, prev, pager, next" :current-page="query.pageNum" :page-size="query.pageSize" :total="pageTotal" @current-change="handlePageChange"></el-pagination>
      </div>
    </div>
    <!-- 驳回弹出框 -->
    <el-dialog title="驳回" :visible.sync="rejectVisible" width="50%" @close="$reset('form')" :close-on-click-modal="false">
      <el-form ref="form" :model="form" label-width="100px">
        <el-row>
          <el-col :span="24">
            <el-form-item label="驳回意见" prop="memo" :rules="[{ required: true, message: '驳回意见为必填项', trigger: 'blur' }]">
              <el-input type="textarea" :rows="2" v-model="form.memo"> </el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="24">
            <el-form-item label="标注图片">
              <el-upload :class="{ hide: hideUpload }" :action="actionUrl" ref="upload" list-type="picture-card" :limit="limitCount" accept="image/png,image/jpg,image/jpeg" :on-success="uploadSuccess" :on-error="uploadError" :auto-upload="false" :before-upload="beforeUpload" :data="imageData" :on-preview="handlePictureCardPreview" :on-remove="handleRemove" :on-change="handleChange">
                <i class="el-icon-upload"></i>
              </el-upload>
              <el-dialog append-to-body :visible.sync="imageDialogVisible">
                <el-image width="100%" :src="dialogImageUrl" alt="" />
              </el-dialog>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="rejectVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitUpload('form')">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
//
import request from '../../utils/request';
import defaultImg from '../../img/weichengjiao.png'
export default {
  name: 'basetable',
  data () {
    return {
      actionUrl: process.env.VUE_APP_BASE_API + "data/noPass",
      admin: JSON.parse(localStorage.getItem('user')),
      query: {
        pageNum: 1,
        pageSize: 10,
        ptype: '',
        type: '',
        creater: '',
        startDate: '',
        endDate: '',
        dialogImageUrl: '',
        status: '',
        sqe: '',
        supIds: []
      },
      tableData: [],
      multipleSelection: [],
      delList: [],
      dialogVisible: false,
      disabled: false,
      viewVisible: false,
      rejectVisible: false,
      importVisible: false,
      addVisible: false,
      pageTotal: 0,
      form: {},
      idx: -1,
      id: -1,
      pCode: [],
      childCodes: [],
      defaultImg: defaultImg,
      imageDialogVisible: false,
      imageData: {},
      dialogImageUrl: '',
      hideUpload: false,
      limitCount: 1,
      downloadImageUrl: '',
      screenHeight: document.body.clientHeight,
      SQEClassData: { sqe: '', data: [] },
      supplierClassData: { supplier: [], data: [] },
      tableHeight: 300
    };
  },
  created () {
    this.generateSQE();
    this.generateSupplier();
    this.getData();
  },
  methods: {
    // 获取数据
    getData () {
      if (this.query.status == '' || this.query.status == undefined) {
        this.query.status = 'no';
      }
      this.query.sqe = '';
      if (this.SQEClassData.sqe != '' && this.SQEClassData.sqe != undefined) {
        this.query.sqe = this._returnSQE(this.SQEClassData.sqe, this.SQEClassData.data)[0].id;
      }
      this.query.supIds = [];
      if (this.supplierClassData.supplier.length != 0) {

        for (let i = 0; i < this.supplierClassData.supplier.length; i++) {

          this.query.supIds.push(this._returnCompany(this.supplierClassData.supplier[i], this.supplierClassData.data)[0].ccode);
        }
      }
      request({        url: process.env.VUE_APP_BASE_API + 'data/getList',
        method: 'post', data: this.query      }).then(res => {
        if (this.query.status == 'no') {
          this.query.status = '';
        }
        this.tableData = res.data.list;
        this.pageTotal = res.data.total;

        for (let i = 0; i < res.data.list.length; i++) {
          this.tableData[i].srcDetail = [];
          for (let j = 0; j < res.data.list[i].paths.length; j++) {
            this.tableData[i].srcDetail.push(res.data.list[i].paths[j].imagePath);
          }
        }
        this.$set(this.tableData);
        this.tableHeight = this._setTableHeight();
      });

      this.pCode = []
      request({        url: process.env.VUE_APP_BASE_API + 'type/getPcodes',
        method: 'post'      }).then(res => {
        this.pCode = res.data;
      });

      this.childCodes = [];
      request({        url: process.env.VUE_APP_BASE_API + 'type/getChildCodes',
        method: 'post'      }).then(res => {
        this.childCodes = res.data;
      });

    },
    // 触发搜索按钮
    handleSearch () {
      this.$set(this.query, 'pageNum', 1);
      this.getData();
    },
    // 多选操作
    handleSelectionChange (val) {
      this.multipleSelection = val;
    },
    handleDownload (index, row) {
      //后端如果返回二进制乱码可以用注释的代码解决
      // request({ url: process.env.VUE_APP_BASE_API + 'data/downImage?id=' + row.id, method: 'get', responseType: 'arraybuffer' }).then(res => {
      //   let src = 'data:image/jpeg;base64,' + btoa(
      //     new Uint8Array(res).reduce((data, byte) => data + String.fromCharCode(byte), ''));
      //   let link = document.createElement('a');
      //   link.href = src;
      //   link.download = row.id + ".jpg";
      //   link.click();
      // });

      //后端返回图片用window.location.href下载
      window.location.href = process.env.VUE_APP_BASE_API + 'down/downImage?id=' + encodeURIComponent(row.id);
    },
    beforeUpload (file) {
      //this.imageData.file = file;
      this.imageData.id = this.form.id;
      this.imageData.status = this.form.status;
      this.imageData.memo = this.form.memo;
      this.imageData.ptype = this.form.ptype;
      this.imageData.type = this.form.type;
    },
    handleChange (file, fileList) {
      this.hideUpload = fileList.length >= this.limitCount;
    },
    handleRemove (file, fileList) {
      console.log(file, fileList);
      this.hideUpload = fileList.length >= this.limitCount;
    },
    handlePictureCardPreview (file) {
      this.dialogImageUrl = file.url;
      this.imageDialogVisible = true;
    },
    submitUpload (formName) {
      var that = this;
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.rejectVisible = false;
          if (this.$refs.upload.uploadFiles.length == 0) {
            request({              url: this.actionUrl + '?id=' + this.form.id
                + '&status=' + this.form.status
                + '&memo=' + this.form.memo
                + '&ptype=' + this.form.ptype
                + '&type=' + this.form.type,
              method: 'post'            }).then(res => {
              if (this.query.status == 'no') {
                this.query.status = '';
              }
              if (res.code == 0) {
                this.$message.success(res.msg);
                this.importVisible = false;
                this.getData();
              } else {
                this.$message.error(res.msg);
              }
            });
          } else {
            this.$refs.upload.submit();
          }
        } else {
          this.$message.error('请您正确填写信息！');
          return false;
        }
      });

    },
    uploadSuccess (res, file, fileList) {
      if (res.code == 0) {
        this.$message.success(res.msg);
        this.importVisible = false;
        this.getData();
      } else {
        this.$message.error(res.msg);
      }
    },
    uploadError (err, file, fileList) {
      this.$message.error(err.msg);
    },
    //审批通过
    handleApproval (index, row) {
      this.$confirm('确定审批通过. 继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'info'
      }).then(() => {
        request({ url: process.env.VUE_APP_BASE_API + 'data/pass?id=' + row.id + '&status=' + row.status, method: 'post' }).then(res => {
          if (res.code == 0) {
            this.$message.success('审批通过');
            this.getData();
          } else {
            this.$message.error(res.msg);
          }
        });
      }).catch(() => {
        this.$message.info('取消');
      });
    },
    // 驳回操作
    handleReject (index, row) {
      this.idx = index;
      this.form = Object.assign({}, row);
      this.rejectVisible = true;
      if (this.$refs.upload != undefined) {
        this.$refs.upload.clearFiles();
        this.hideUpload = false;
      }
      if (this.$refs.form != undefined) {
        this.$reset('form');
      }

    },
    //删除单行
    handleDelete (index, row) {
      this.$confirm('确定删除. 继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'info'
      }).then(() => {
        let deleteIds = [];
        deleteIds.push(row.id);

        request({ url: process.env.VUE_APP_BASE_API + "data/removeImages?deleteFlag=0", data: deleteIds, method: 'post' }).then(res => {
          if (res.code == 0) {
            this.$message.success('删除成功');
            this.getData();
          } else {
            this.$message.error(res.msg);
          }
        });
      }).catch(() => {
        this.$message.info('取消');
      });
    },
    // 分页导航
    handlePageChange (val) {
      this.$set(this.query, 'pageNum', val);
      this.getData();
    },
    handleImageTypeChange () {
      this.childCodes = [];
      request({        url: process.env.VUE_APP_BASE_API + 'type/getChildCodes?pcode=' + this.query.ptype,
        method: 'post'      }).then(res => {
        this.childCodes = res.data;
      });
      if (this.query.type != undefined) {
        this.query.type = '';
      }
    },
    handleImageClassChange () {

    },
    fomartStatus (row, column, cellValue, index) {
      if (cellValue == "1") {
        return "待审批";
      } else if (cellValue == "2") {
        return "通过";
      } else if (cellValue == '3') {
        return "不通过";
      }
    },
    fomartPtype (row, column, cellValue, index) {
      return row.ptypeName;
    },
    fomartType (row, column, cellValue, index) {
      return row.typeName;
    },
    generateSQE () {
      if (this.admin.roleId != '0') {
        return;
      }
      request({ url: process.env.VUE_APP_BASE_API + "user/getSqeOrSup", method: "post" }).then(res => {
        if (res.code == 0) {
          this.SQEClassData.data = res.data;
          this.getData();
        } else {
          this.$message.error(res.msg);
        }
      });
    },
    generateSupplier (val) {
      if (this.admin.roleId == '2') {
        return;
      }
      let sqeId = '';
      if (this.admin.roleId == '1') {
        sqeId = this.admin.id;
      } else {
        if (this.SQEClassData.data != undefined && this.SQEClassData.data.length != 0) {
          sqeId = this._returnSQE(val, this.SQEClassData.data)[0].id;
        }
      }
      if (sqeId == '') {
        return;
      }

      request({ url: process.env.VUE_APP_BASE_API + "user/getSqeOrSup?pid=" + sqeId, method: "post" }).then(res => {
        if (res.code == 0) {
          this.supplierClassData = { supplier: [], data: [] };
          this.supplierClassData.data = res.data;
          this.$set(this.supplierClassData.data);
          this.getData();
        } else {
          this.$message.error(res.msg);
        }
      });
    },
    filterSupplier () {
      this.getData();
    },
    _setTableHeight () {
      // return this.admin.roleId == '2' ? (document.body.clientHeight - 235) :
      //   this.admin.roleId == '1' ? (document.body.clientHeight - 285) :
      //     this.admin.roleId == '0' ? (document.body.clientHeight - 320) : 500
      return 500;
    },
    _returnSQE (nickName, dataSet) {
      return dataSet.filter(function (data) {
        if (data.nickName == nickName) {
          return data;
        }
      });
    },
    _returnCompany (sname, dataSet) {
      return dataSet.filter(function (data) {
        if (data.sname == sname) {
          return data;
        }
      });
    },
    clearSQEClass () {
      this.SQEClassData.sqe = '';
      this.supplierClassData = { supplier: [], data: [] };
      this.getData();
    }
  }
};

</script>

<style>
.sqe-list {
    color: #fff;
    font-size: 14px;
    line-height: 14px;
    text-indent: 24px;
    font-weight: normal;
    position: relative;
}
.supplier-list {
    color: #fff;
    font-size: 14px;
    line-height: 14px;
    text-indent: 24px;
    font-weight: normal;
    position: relative;
}
.handle-box {
    margin-top: -20px;
    margin-bottom: 5px;
}

.handle-select {
    width: 120px;
}

.handle-input {
    width: 150px;
    display: inline-block;
}
.handle-img {
    width: 150px;
    height: 150px;
    display: inline-block;
}
.handle-upload {
    width: 150px;
    height: 150px;
    display: inline-block;
}
.pagination {
    margin-bottom: -15px;
    margin-top: 8px;
}
.hide .el-upload--picture-card {
    display: none;
}
.table {
    width: 100%;
    font-size: 14px;
}
.red {
    color: #ff0000;
}
.mr10 {
    margin-right: 10px;
}
.SQE-button-clear {
    color: #ffffff;
}
.SQE-button {
    display: inline-block;
    color: #ffffff;
}
.SQE-form {
    height: 50px;
    width: 100%;
    display: inline-block;
    overflow-y: auto;
    background-color: rgb(19, 20, 43);
    margin-top: -15px;
    margin-bottom: -4px;
}
.supplier-button {
    display: inline-block;
    color: #ffffff;
}
.supplier-form {
    height: 51px;
    width: 100%;
    display: inline-block;
    overflow-y: auto;
    background-color: rgb(19, 20, 43);
    margin-bottom: -14px;
}
.el-radio-button:first-child .el-radio-button__inner {
    border-left: 0;
    border-radius: 0 0px 0px 0;
}
.el-radio-button__inner {
    border: 0;
    background-color: rgb(19, 20, 43);
    color: #ffffff;
}
.el-radio-button:last-child .el-radio-button__inner {
    border-radius: 0 0px 0px 0;
}
.el-radio-button__orig-radio:checked + .el-radio-button__inner {
    background-color: rgb(19, 20, 43);
    color: #409eff;
    box-shadow: none;
    border-bottom: 1px solid #409eff;
}
</style>

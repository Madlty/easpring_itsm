<template>
  <div>
    <div class="container">
      <div class="handle-box">
        <el-input v-model="qMatnr" width="100" :placeholder="$t('m.matnr')" class="handle-input mr10" maxlength="18" show-word-limit @keyup.enter.native="handleSearch"></el-input>
        <el-input v-model="query.Maktx" width="100" :placeholder="$t('m.maktx')" class="handle-input mr10" maxlength="40" show-word-limit @keyup.enter.native="handleSearch"></el-input>
        <el-button type="primary" icon="el-icon-search" class="mr10" @click="handleSearch">{{ $t('m.search') }}</el-button>
      </div>
      <el-table :data="tableData" border class="table" ref="multipleTable" header-cell-class-nickna me="table-header" height="600">
        <el-table-column prop="Matnr" :label="$t('m.matnr')" align="center"></el-table-column>
        <el-table-column prop="Maktx" :label="$t('m.maktx')" align="center" :show-overflow-tooltip="true"></el-table-column>
        <el-table-column prop="Mtart" :label="$t('m.mtart')" align="center"></el-table-column>
        <el-table-column prop="Matkl" :label="$t('m.matkl')" align="center"></el-table-column>
        <el-table-column prop="Ersda" :label="$t('m.ersda')" align="center" :formatter="$para.translateDate"></el-table-column>
        <el-table-column prop="Laeda" :label="$t('m.laeda')" align="center" :formatter="$para.translateDate"></el-table-column>
        <el-table-column :label="$t('m.operation')" width="170" align="center">
          <template slot-scope="scope">
            <el-button type="success" icon="el-icon-edit" @click="handleEdit(scope.$index, scope.row)">{{
                            $t('m.modify')
                        }}</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination">
        <el-pagination background layout="total, prev, pager, next" :current-page="query.pageNum" :page-size="query.pageSize" :total="pageTotal" @current-change="handlePageChange"></el-pagination>
      </div>
    </div>
    <!-- 新建弹出框 -->
    <el-dialog title="新增" :visible.sync="addVisible" width="60%" @close="$reset('addform')" :close-on-click-modal="false">
      <el-form ref="addform" :model="addform" label-width="80px" class="demo-ruleForm" :rules="ruleValidate">
        <el-row>
          <el-col :span="12">
            <el-form-item label="公司名称" prop="name">
              <el-input v-model="addform.name" class="handle-input" maxlength="50" show-word-limit></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="公司简称" prop="sname">
              <el-input v-model="addform.sname" class="handle-input" maxlength="20" show-word-limit> </el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="公司代码" prop="ccode">
              <el-input v-model="addform.ccode" class="handle-input" maxlength="10" show-word-limit> </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="状态" prop="status">
              <el-select v-model="addform.status" placeholder="请选择" class="handle-select mr10">
                <el-option key="0" label="未激活" value="0"></el-option>
                <el-option key="1" label="激活" value="1"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveOne('addform')">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 编辑弹出框 -->
    <el-dialog title="编辑" :visible.sync="editVisible" width="60%" :close-on-click-modal="false">
      <el-form ref="editform" :model="editform" label-width="80px" class="demo-ruleForm" :rules="ruleValidate">
        <el-row>
          <el-col :span="12">
            <el-form-item label="公司名称" prop="name">
              <el-input v-model="editform.name" class="handle-input" maxlength="50" show-word-limit></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="公司简称" prop="sname">
              <el-input v-model="editform.sname" class="handle-input" maxlength="20" show-word-limit></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="公司代码" prop="ccode">
              <el-input v-model="editform.ccode" class="handle-input" :readonly="true"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="状态" prop="status">
              <el-select v-model="editform.status" placeholder="请选择" class="handle-select mr10">
                <el-option key="0" label="未激活" value="0"></el-option>
                <el-option key="1" label="激活" value="1"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="创建日期">
              <el-date-picker v-model="editform.createTime" class="handle-input" :readonly="true"></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="修改日期">
              <el-date-picker v-model="editform.modifyTime" class="handle-input" :readonly="true"></el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="创建人">
              <el-input v-model="editform.creater" class="handle-input" :readonly="true"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="修改人">
              <el-input v-model="editform.modifyer" class="handle-input" :readonly="true"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveEdit('editform')">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import request from '../../utils/request';
import rules from '../../utils/rules';
import axios from 'axios';

export default {
  name: 'basetable',
  data () {
    return {
      userInfo: '',
      query: {
        Matnr: '',
        Maktx: '',
        pageNum: 1,
        pageSize: 10,
      },
      tableData: [],
      addVisible: false,
      editVisible: false,
      pageTotal: 0,
      editform: {},
      addform: {},
      idx: -1,
      id: -1,
      ruleValidate: {
        name: { required: true, message: "公司名称为必填项", trigger: "blur" },
        sname: { required: true, message: "公司简称不能为空", trigger: "blur" },
        ccode: { required: true, message: "公司代码不能为空", trigger: "blur" },
        status: { required: true, message: "状态不能为空", trigger: "blur" },
      }
    }
  },
  created () {
    this.userInfo = JSON.parse(localStorage.getItem('userInfo'));
    this.getData();
  },
  computed: {
    qMatnr: {
      get: function () {
        return this.query.Matnr;
      },
      set: function (val) {
        this.query.Matnr = val.toUpperCase();
      }
    }
  }
  ,
  methods: {
    getData () {

      let uri = `mmDataReqSet?$filter=Matnr eq '` + this.query.Matnr + `' and Maktx eq '` + this.query.Maktx + `' and Langu eq '` + this.userInfo.langu + `' &$expand=mmDataSet&$skip=` + this.query.pageSize
        + '&$top=' + this.query.pageNum;
      request({
        url: process.env.VUE_APP_BASE_API + uri, method: 'get'
      }).then(res => {
        this.tableData = res.d.results[0].mmDataSet.results;
        this.pageTotal = res.d.results[0].Total;
      });
    },

    // 触发搜索按钮
    handleSearch () {
      this.$set(this.query, 'pageNum', 1);
      this.getData();
    },
    // 编辑操作
    handleEdit (index, row) {
      this.addform = {};
      this.idx = index;
      this.editform = Object.assign({}, row);
      this.editVisible = true;
    },
    saveEdit (vform) {
      this.$refs[vform].validate((valid) => {
        if (valid) {
          let edit = {
            name: this.editform.name,
            sname: this.editform.sname,
            status: this.editform.status,
            ccode: this.editform.ccode
          };
          this.editVisible = false;
          request({
            url: process.env.VUE_APP_BASE_API + 'company/updateCompany', method: 'post', data: edit
          }).then(res => {
            if (res.code == 0) {
              this.$message.success('修改成功');
              this.getData();
            } else {
              this.$message.error('修改失败');
            }
          });
          this.$set(this.tableData, this.idx, this.editform);
        }
      });
      //
    },
    translateStatus (row, column, cellValue, index) {
      return cellValue == "0" ? "未激活" : "激活";
    },
    // 分页导航
    handlePageChange (val) {
      this.$set(this.query, 'pageNum', val);
      this.getData();
    }
  }
};
</script>

<style scoped>
.handle-box {
    margin-bottom: 20px;
}

.handle-select {
    width: 120px;
}

.handle-select-multiple {
    width: 100%;
}
.handle-input {
    width: 300px;
    display: inline-block;
}
.table {
    width: 100%;
    font-size: 14px;
}
.red {
    color: #ff0000;
}
.mr10 {
    margin-right: 5px;
    margin-left: 5px;
}
.table-td-thumb {
    display: block;
    margin: auto;
    width: 40px;
    height: 40px;
}
</style>

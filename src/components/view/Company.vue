<template>
  <div>
    <!-- <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item> <i class="el-icon-lx-friendadd"></i> 用户管理</el-breadcrumb-item>
            </el-breadcrumb>
        </div> -->
    <div class="container">
      <div class="handle-box">
        <el-input v-model="query.name" width="100" placeholder="公司名称" class="handle-input mr10" maxlength="50" show-word-limit @keyup.enter.native="handleSearch"></el-input>
        <el-button type="primary" icon="el-icon-plus" class="mr10" @click="handleNew">新增</el-button>
        <el-button type="primary" icon="el-icon-search" class="mr10" @click="handleSearch">搜索</el-button>
      </div>
      <el-table :data="tableData" border class="table" ref="multipleTable" header-cell-class-nickna me="table-header" @selection-change="handleSelectionChange" height="600">
        <el-table-column prop="name" label="公司名称" align="center"></el-table-column>
        <el-table-column prop="sname" label="公司简称" align="center"></el-table-column>
        <el-table-column prop="ccode" label="公司代码" align="center"></el-table-column>
        <el-table-column prop="createTime" label="创建时间" align="center"></el-table-column>
        <el-table-column prop="creater" label="创建人" align="center"></el-table-column>
        <el-table-column prop="modifyTime" label="修改时间" align="center"></el-table-column>
        <el-table-column prop="modifyer" label="修改人" align="center"></el-table-column>
        <el-table-column prop="status" label="状态" :formatter="translateStatus" align="center"></el-table-column>
        <el-table-column label="操作" width="170" align="left">
          <template slot-scope="scope">
            <el-button type="success" icon="el-icon-edit" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
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

export default {
  name: 'basetable',
  data () {
    return {
      query: {
        name: '',
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
    this.getData();
  },
  methods: {
    getData () {
      request({        url: process.env.VUE_APP_BASE_API + 'company/selectCompanyList', method: 'post', data: this.query
      }).then(res => {
        if (res.code == 0) {
          this.tableData = res.data.list;
          this.pageTotal = res.data.total || 50;
        } else {
          this.$message.error(res.msg)
        }
      });
    },

    // 触发搜索按钮
    handleSearch () {
      this.$set(this.query, 'page', 1);
      this.getData();
    },
    // // 批量删除操作
    // delAllSelection () {
    //   const length = this.multipleSelection.length;
    //   let ids = [];
    //   this.delList = this.delList.concat(this.multipleSelection);
    //   for (let i = 0; i < length; i++) {
    //     ids.push(this.multipleSelection[i].id);
    //   }
    //   if (ids.length == 0) {
    //     this.$message.error('请选择数据!');
    //     return;
    //   }
    //   this.$confirm('确定要删除吗？', '提示', {
    //     type: 'warning'
    //   }).then((res) => {
    //     request({          url: process.env.VUE_APP_BASE_API + 'admin/deleteAdmin', method: 'post', data: ids
    //     }).then(res => {
    //       if (res.code == 0) {
    //         this.$message.success('删除成功！');
    //         this.getData();
    //       } else {
    //         this.$message.error('删除失败！');
    //       }
    //     });
    //   }).catch(() => {
    //     this.$message.success('已取消操作!');
    //   });
    //   this.multipleSelection = [];
    // },
    // 多选操作
    handleSelectionChange (val) {
      this.multipleSelection = val;
    },
    // 新增
    handleNew () {
      this.addform = {};
      this.editform = {};
      this.addVisible = true;
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
          request({            url: process.env.VUE_APP_BASE_API + 'company/updateCompany', method: 'post', data: edit
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
    saveOne (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let add = {
            name: this.addform.name,
            sname: this.addform.sname,
            status: this.addform.status,
            ccode: this.addform.ccode
          }
          this.addVisible = false;
          request({ url: process.env.VUE_APP_BASE_API + 'company/createCompany', method: 'post', data: add }).then(res => {
            if (res.code == 0) {
              this.$message.success(res.msg);
              this.getData();
            } else {
              this.$message.error(res.msg);
            }
          });
        } else {
          this.$message.error('请您正确填写信息！');
          return false;
        }
      });
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

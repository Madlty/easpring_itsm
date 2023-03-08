<template>
  <div>
    <div class="crumbs">
      <!-- <el-breadcrumb separator="/">
                <el-breadcrumb-item> <i class="el-icon-lx-friendadd"></i> 图片分类</el-breadcrumb-item>
            </el-breadcrumb> -->
    </div>
    <div class="container">
      <div class="handle-box">
        <el-button type="success" icon="el-icon-plus" class="mr10" @click="addImageType">添加</el-button>
      </div>
      <el-table :data="tableData" :height="this.tableHeight" border class="table" ref="multipleTable" header-cell-class-name="table-header" @selection-change="handleSelectionChange" row-key="code" default-expand-all :tree-props="{ children: 'child' }">
        <el-table-column prop="name" label="名称" width="270" :show-overflow-tooltip="true"></el-table-column>
        <el-table-column prop="status" label="状态" width="100" :formatter="fomartStatus"></el-table-column>
        <el-table-column prop="orderNo" label="排序号" width="70"></el-table-column>
        <el-table-column prop="memo" label="备注" width="200" :show-overflow-tooltip="true"></el-table-column>
        <!-- <el-table-column prop="createTime" label="创建日期" width="120"></el-table-column>
                <el-table-column prop="modifyTime" label="修改日期" width="120"></el-table-column>
                <el-table-column prop="creater" label="创建人" width="100"></el-table-column>
                <el-table-column prop="modifyer" label="修改人" width="100"></el-table-column> -->
        <el-table-column prop="code" label="编码" width="200"></el-table-column>
        <el-table-column label="操作" width="100" align="center">
          <template slot-scope="scope">
            <el-button type="info" icon="el-icon-edit" @click="handleEdit(scope.$index, scope.row)">修改</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- 添加弹出框 -->
    <el-dialog title="添加图片类型" :visible.sync="addVisible" width="50%" :close-on-click-modal="false" @close="$reset('form')">
      <el-form ref="form" :model="form" label-width="100px" :rules="ruleValidate">
        <el-form-item label="名称" prop="name">
          <el-input v-model="form.name"></el-input>
        </el-form-item>
        <el-form-item label="代码" prop="code">
          <el-input v-model="form.code"></el-input>
        </el-form-item>
        <el-form-item label="排序号" prop="orderNo">
          <el-input v-model="form.orderNo" maxlength="3"></el-input>
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-select v-model="form.status" placeholder="状态">
            <el-option key="0" label="无效" value="0"></el-option>
            <el-option key="1" label="有效" value="1"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="备注">
          <el-input v-model="form.memo"></el-input>
        </el-form-item>
        <el-form-item label="父项代码">
          <el-select v-model="form.pcode" clearable>
            <el-option v-for="item in pCode" :key="item.code" :label="item.name" :value="item.code"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addVisible = false">取消</el-button>
        <el-button @click="addData('form')" type="primary">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 编辑弹出框 -->
    <el-dialog title="编辑" :visible.sync="editVisible" width="50%" :close-on-click-modal="false">
      <el-form ref="form" :model="form" label-width="100px" :rules="ruleValidate">
        <el-form-item label="名称" prop="name">
          <el-input v-model="form.name"></el-input>
        </el-form-item>
        <el-form-item label="代码" prop="code">
          <el-input v-model="form.code" :readonly="true"></el-input>
        </el-form-item>
        <el-form-item label="排序号" prop="orderNo">
          <el-input v-model="form.orderNo" maxlength="3" style="width:60px"></el-input>
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-select v-model="form.status" placeholder="状态">
            <el-option key="0" label="无效" value="0"></el-option>
            <el-option key="1" label="有效" value="1"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="备注">
          <el-input v-model="form.memo"></el-input>
        </el-form-item>
        <el-form-item label="父项代码">
          <el-select v-model="form.pcode" filterable clearable>
            <el-option v-for="item in pCode" :key="item.code" :label="item.name" :value="item.code">
              <span style="float: left">{{ item.name }}</span>
              <span style="float: right; color: #8492a6; font-size: 13px">{{ item.code }}</span>
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="创建日期">
          <el-date-picker v-model="form.createTime" :readonly="true"></el-date-picker>
        </el-form-item>
        <el-form-item label="修改日期">
          <el-date-picker v-model="form.modifyTime" :readonly="true"></el-date-picker>
        </el-form-item>
        <el-form-item label="创建人">
          <el-input v-model="form.creater" class="handle-input" :readonly="true"></el-input>
        </el-form-item>
        <el-form-item label="修改人">
          <el-input v-model="form.modifyer" class="handle-input" :readonly="true"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <span slot="footer" class="dialog-footer">
          <el-button @click="editVisible = false">取消</el-button>
          <el-button @click="editData('form')" type="primary">确 定</el-button>
        </span>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import request from '../../utils/request';
export default {
  name: 'basetable',
  data () {
    return {
      query: {
        phone: '',
        name: '',
        parentId: '',
        page: 1,
        rows: 10,
        deptId: JSON.parse(localStorage.getItem("admin_user")).deptId,
        sectionId: JSON.parse(localStorage.getItem("admin_user")).sectionId,
        roleId: JSON.parse(localStorage.getItem("admin_user")).roleId
      },
      tableData: [],
      multipleSelection: [],
      delList: [],
      editVisible: false,
      editCutomer: false,
      addVisible: false,
      pageTotal: 0,
      form: {},
      idx: -1,
      id: -1,
      pCode: [],
      ruleValidate: {
        name: { required: true, message: "名称不能为空", trigger: "blur" },
        code: { required: true, message: "代码不能为空", trigger: "blur" },
        status: { required: true, message: "状态不能为空", trigger: "blur" },

      },
      tableHeight: (document.body.clientHeight - 250)
    };
  },
  created () {
    this.getData();
  },
  watch: {
    '$route': 'getData'
  },
  methods: {
    // 获取 easy-mock 的模拟数据
    getData () {

      request({        url: process.env.VUE_APP_BASE_API + 'type/treeTypes?status',
        method: 'post', data: []      }).then(res => {
        this.tableData = res.data;
      });

      request({        url: process.env.VUE_APP_BASE_API + 'type/getPcodes',
        method: 'post', data: []      }).then(res => {
        this.pCode = res.data;
      });
    },
    handleEdit (index, row) {
      this.idx = index;
      this.form = Object.assign({}, row);
      this.editVisible = true
    },
    addImageType () {
      this.addVisible = true;
      this.form = {};
    },
    // 多选操作
    handleSelectionChange (val) {
      this.multipleSelection = val;
    },
    addData (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let add = {
            name: this.form.name,
            status: this.form.status,
            memo: this.form.memo,
            creater: JSON.parse(localStorage.getItem('admin_user')).loginName,
            code: this.form.code,
            pcode: this.form.pcode,
            orderNo: this.form.orderNo
          }

          this.addVisible = false;
          request({ url: process.env.VUE_APP_BASE_API + 'type/addImageType', method: 'post', data: add }).then(res => {
            if (res.code == 0) {
              this.$message.success('创建成功');
              this.addVisible = false;
              this.getData();
            } else {
              this.$message.error('创建失败');
            }
          });

        } else {
          this.$message.error('请您正确填写信息！');
          return false;
        }
      });
    },
    fomartStatus (row, column, cellValue, index) {
      if (cellValue == "0") {
        return "无效";
      } else if (cellValue == "1") {
        return "有效";
      } else if (cellValue == '2') {
        return "已删除";
      }
    },
    editData (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let edit = {
            name: this.form.name,
            status: this.form.status,
            memo: this.form.memo,
            modifyer: JSON.parse(localStorage.getItem('admin_user')).loginName,
            code: this.form.code,
            pcode: this.form.pcode,
            orderNo: this.form.orderNo
          }

          this.editVisible = false;
          request({ url: process.env.VUE_APP_BASE_API + 'type/modifyImageType', method: 'post', data: edit }).then(res => {
            if (res.code == 0) {
              this.$message.success('修改成功');
              this.addVisible = false;
              this.getData();
            } else {
              this.$message.error('修改失败');
            }
          });

        } else {
          this.$message.error('请您正确填写信息！');
          return false;
        }
      });
    },
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
    margin-right: 10px;
}
.table-td-thumb {
    display: block;
    margin: auto;
    width: 40px;
    height: 40px;
}
</style>

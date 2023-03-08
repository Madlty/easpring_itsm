<template>
  <div>
    <div class="crumbs">
      <!-- <el-breadcrumb separator="/">
                <el-breadcrumb-item> <i class="el-icon-lx-friendadd"></i> 用户管理</el-breadcrumb-item>
            </el-breadcrumb> -->
    </div>
    <div class="container">
      <div class="handle-box">
        <el-input
          v-model="queryAgrName"
          width="100"
          :placeholder="$t('m.agrname')"
          maxlength="30"
          show-word-limit
          class="handle-input mr10"
          @keyup.enter.native="handleSearch"
        ></el-input>
        <el-input
          v-model="queryText"
          :placeholder="$t('m.text')"
          class="handle-input mr10"
          maxlength="80"
          show-word-limit
          @keyup.enter.native="handleSearch"
        ></el-input>
        <el-button
          type="primary"
          icon="el-icon-plus"
          class="mr10"
          @click="handleNew"
        >{{ $t('m.new') }}</el-button>
        <el-button
          type="danger"
          icon="el-icon-delete"
          @click="delAllSelection"
        >{{ $t('m.delete') }}</el-button>
        <el-button
          type="primary"
          icon="el-icon-search"
          class="mr10"
          @click="handleSearch"
        >{{ $t('m.search') }}</el-button>
      </div>
      <el-table
        :data="tableData"
        border
        class="table"
        ref="multipleTable"
        header-cell-class-nickna
        me="table-header"
        @selection-change="handleSelectionChange"
        height="600"
      >
        <el-table-column
          type="selection"
          width="55"
          align="center"
        ></el-table-column>
        <el-table-column
          prop="AgrName"
          :label="$t('m.agrname')"
          align="center"
        ></el-table-column>
        <el-table-column
          prop="Text"
          :label="$t('m.text')"
          align="center"
        ></el-table-column>
        <el-table-column
          prop="Auths"
          :label="$t('m.auths')"
          align="center"
          :show-overflow-tooltip="true"
        ></el-table-column>
        <el-table-column
          prop="Crtdt"
          :label="$t('m.crtdt')"
          align="center"
          :formatter="$para.translateDate"
        ></el-table-column>
        <!-- <el-table-column prop="Crttm" :label="$t('m.crttm')" align="center" :formatter="$para.translateTime"></el-table-column> -->
        <el-table-column
          prop="Crtusr"
          :label="$t('m.crtusr')"
          align="center"
        ></el-table-column>
        <el-table-column
          prop="Chgdt"
          :label="$t('m.chgdt')"
          align="center"
          :formatter="$para.translateDate"
        ></el-table-column>
        <!-- <el-table-column prop="Chgtm" :label="$t('m.chgtm')" align="center" :formatter="$para.translateTime"></el-table-column> -->
        <el-table-column
          prop="Chgusr"
          :label="$t('m.chgusr')"
          align="center"
        ></el-table-column>
        <el-table-column
          :label="$t('m.operation')"
          width="200"
          align="center"
        >
          <template slot-scope="scope">
            <el-button
              type="success"
              icon="el-icon-edit"
              @click="handleEdit(scope.$index, scope.row)"
            >
              {{ $t('m.modify') }}
            </el-button>
            <el-button
              type="danger"
              icon="el-icon-delete"
              @click="handleDelete(scope.$index, scope.row)"
            >
              {{ $t('m.delete') }}
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination">
        <el-pagination
          background
          layout="total, prev, pager, next"
          :current-page="query.pageNum"
          :page-size="query.pageSize"
          :total="pageTotal"
          @current-change="handlePageChange"
        ></el-pagination>
      </div>
    </div>
    <!-- 新建弹出框 -->
    <el-dialog
      :title="$t('m.new')"
      :visible.sync="addVisible"
      width="60%"
      @close="$reset('addform')"
      :close-on-click-modal="false"
    >
      <el-form
        ref="addform"
        :model="addform"
        label-width="80px"
        class="demo-ruleForm"
        :rules="ruleValidate"
      >
        <el-row>
          <el-col :span="12">
            <el-form-item
              :label="$t('m.agrname')"
              prop="AgrName"
            >
              <el-input
                v-model="addAgrName"
                class="handle-input"
                maxlength="30"
                show-word-limit
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item
              :label="$t('m.text')"
              prop="Text"
            >
              <el-input
                v-model="addform.Text"
                class="handle-input"
                maxlength="80"
                show-word-limit
              > </el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item
              :label="$t('m.choseAuth')"
              prop="AuthsStd"
            >
              <el-transfer
                class="transfer"
                v-model="addform.AuthsStd"
                filterable
                :titles="[$t('m.source'), $t('m.target')]"
                @change="handleChange"
                :data="authList"
                :render-content="renderFunc"
                :props="{
                                    key: 'Object',
                                    label: 'Ttext'
                                }"
              >
              </el-transfer>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <span
        slot="footer"
        class="dialog-footer"
      >
        <el-button @click="addVisible = false">{{ $t('m.cancel') }}</el-button>
        <el-button
          type="primary"
          @click="saveOne(addform)"
        >{{ $t('m.confirm') }}</el-button>
      </span>
    </el-dialog>

    <!-- 编辑弹出框 -->
    <el-dialog
      :title="$t('m.modify')"
      :visible.sync="editVisible"
      width="60%"
      :close-on-click-modal="false"
    >
      <el-form
        ref="editform"
        :model="editform"
        label-width="80px"
        class="demo-ruleForm"
        :rules="ruleValidate"
      >
        <el-row>
          <el-col :span="12">
            <el-form-item
              :label="$t('m.agrname')"
              prop="AgrName"
            >
              <el-input
                v-model="editform.AgrName"
                class="handle-input"
                maxlength="30"
                show-word-limit
                :readonly="true"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item
              :label="$t('m.text')"
              prop="Text"
            >
              <el-input
                v-model="editform.Text"
                class="handle-input"
                maxlength="80"
                show-word-limit
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item
              :label="$t('m.choseAuth')"
              prop="AuthsStd"
            >
              <el-transfer
                class="transfer"
                v-model="editform.AuthsStd"
                filterable
                :titles="[$t('m.source'), $t('m.target')]"
                @change="handleChange"
                :data="authList"
                :render-content="renderFunc"
                :props="{
                                    key: 'Object',
                                    label: 'Ttext'
                                }"
              >
              </el-transfer>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item :label="$t('m.crtdt')">
              <el-input
                v-model="editform.Crtdt"
                class="short-input"
                :readonly="true"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item :label="$t('m.crttm')">
              <el-input
                v-model="editform.Crttm"
                class="short-input"
                :readonly="true"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item :label="$t('m.crtusr')">
              <el-input
                v-model="editform.Crtusr"
                class="short-input"
                :readonly="true"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item :label="$t('m.chgdt')">
              <el-input
                v-model="editform.Chgdt"
                class="short-input"
                :readonly="true"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item :label="$t('m.chgtm')">
              <el-input
                v-model="editform.Chgtm"
                class="short-input"
                :readonly="true"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item :label="$t('m.chgusr')">
              <el-input
                v-model="editform.Chgusr"
                class="short-input"
                :readonly="true"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <span
        slot="footer"
        class="dialog-footer"
      >
        <el-button @click="editVisible = false">取 消</el-button>
        <el-button
          type="primary"
          @click="saveEdit(editform)"
        >确 定</el-button>
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
      userInfo: JSON.parse(localStorage.getItem('userInfo')),
      query: {
        AgrName: '',
        Text: '',
        pageNum: 1,
        pageSize: 10,
      },
      loading: false,
      tableData: [],
      multipleSelection: [],
      delList: [],
      addVisible: false,
      editVisible: false,
      pageTotal: 0,
      editform: { AuthsStd: [] },
      addform: { addAgrName: '', AuthsStd: [] },
      ruleValidate: {
        AgrName: { required: true, validator: this.checkAgrName, trigger: "blur" },
        Text: { required: true, message: this.$t('m.textEmpty'), trigger: "blur" },
      },
      authList: [],
    }
  },
  mounted () {
    this.getData();
  },
  computed: {
    addAgrName: {
      get: function () {
        return this.addform.AgrName;
      },
      set: function (val) {
        this.addform.AgrName = val.toUpperCase();
      }
    },
    queryAgrName: {
      get: function () {
        return this.query.AgrName;
      },
      set: function (val) {
        this.query.AgrName = val.toUpperCase();
      }
    },
    queryText: {
      get: function () {
        return this.query.Text;
      },
      set: function (val) {
        this.query.Text = val.toUpperCase();
      }
    }
  },
  created () {

  },
  methods: {
    getData () {
      let uri = `rolesReqSet?$filter=AgrName eq '` + this.query.AgrName + `' and ` + `Text  eq '` + this.query.Text + `'&$expand=rolesRespNav/RoleAuthRespNav&$skip=` + this.query.pageSize
        + '&$top=' + this.query.pageNum;
      request({
        url: process.env.VUE_APP_BASE_API + uri, method: 'get', data: {}
      }).then(res => {
        this.tableData = [];
        res.d.results[0].rolesRespNav.results.forEach(element => {
          element.AuthsStd = element.RoleAuthRespNav.results;
          this.tableData.push(element);
        });
        this.pageTotal = res.d.results[0].Total;
      });
    },
    _getAuthlist () {
      this.authList = [];
      let uriNoStd = `authRespSet?$format=json&$filter=AgrName eq '' and Selected eq ''`;
      request({
        url: process.env.VUE_APP_BASE_API + uriNoStd, method: 'get', data: {}
      }).then(res => {
        res.d.results.forEach(element => {
          this.authList.push({
            Object: element.Object,
            Ttext: element.Ttext,
            disabled: false
          })
        });
      });

    },
    // 触发搜索按钮
    handleSearch () {
      this.$set(this.query, 'pageNum', 1);
      this.getData();
    },
    //批量删除操作
    delAllSelection () {
      const length = this.multipleSelection.length;
      let uriParam = new Array();
      uriParam.push('AgrName');
      uriParam.push('Text');
      let batchBody = this.$para.batchPack('DELETE', 'roleReqSet', uriParam, this.multipleSelection);
      if (length == 0) {
        this.$message.error(this.$t('m.plsSelectData'));
        return;
      }
      this.$confirm(this.$t('m.deleteConfirm'), this.$t('m.tips'), {
        type: 'warning'
      }).then((res) => {
        request({
          url: process.env.VUE_APP_BASE_API + '$batch', method: 'post',
          headers: {
            "Content-Type": "multipart/mixed; boundary=batch",
            'X-CSRF-Token': this.userInfo.token
          },
          data: batchBody,
        }).then(res => {
          if (res.status == 202) {
            let responseData = this.$para.batchUnpack(res.request, res.status);
            let errorMsg = new String();
            for (let i in responseData) {
              if (responseData[i].status != 204 && responseData[i].status) {
                errorMsg = errorMsg + responseData[i].data.error.message.value;
              }
            }
            if (errorMsg != '') {
              this.$message.error(errorMsg);
            } else {
              this.$message.success(this.$t('m.deleteSuccess'));
              this.getData();
              this.multipleSelection = [];
            }
          } else {
            this.$message.error(res.msg);
          }
        });
      }).catch((res) => {
        this.$message.success(this.$t('m.cancelOperation'));
      });
      this.multipleSelection = [];
    },
    // 多选操作
    handleSelectionChange (val) {
      this.multipleSelection = val;
    },
    renderFunc (h, option) {
      let title = option.Object + '-' + option.Ttext;
      return <span title={title} > {option.Object} - {option.Ttext}</span >;
    },
    // 新增
    handleNew () {
      this._getAuthlist();
      this.addform = { AgrName: '', AuthsStd: [] };
      this.editform = { AgrName: '', AuthsStd: [] };
      this.addVisible = true;
    },
    saveOne (vForm) {
      this.$refs['addform'].validate((valid) => {
        if (valid) {
          let roleAuths = new Array();
          vForm.AuthsStd.forEach(element => {
            let roleAuth = {};
            roleAuth.Object = element;
            roleAuth.AgrName = vForm.AgrName;
            roleAuths.push(roleAuth);
          });

          let add = {
            AgrName: vForm.AgrName,
            Text: vForm.Text,
            Operation: 'I',
            Crtusr: this.userInfo.loginName,
            RoleAuthRespNav: roleAuths,
          };
          this.addVisible = false;
          request({
            url: process.env.VUE_APP_BASE_API + 'roleReqSet', method: 'post', data: add,
            headers: {
              "Content-Type": "application/json;charset=UTF-8",
              'X-CSRF-Token': this.userInfo.token
            },
          }).then(res => {
            if (res.status == 201) {
              this.$message.success(this.$t('m.newSuccess'));
              this.getData();
            } else {
              this.$message.error(res.msg);
            }
          });
        }
      });

    },
    // 编辑操作
    handleEdit (index, row) {
      this._getAuthlist();
      this.addform = { AuthsStd: [] };
      this.editform = { AuthsStd: [] };
      let auths = new Array();
      this.editform = Object.assign({}, row);
      this.editform.RoleAuthRespNav.results.forEach(element => {
        auths.push(element.Object);
      });
      this.editform.AuthsStd = auths;
      this._translate(this.editform);
      this.editVisible = true;
    },
    saveEdit (vForm) {
      this.$refs['editform'].validate((valid) => {
        if (valid) {
          let roleAuths = new Array();
          vForm.AuthsStd.forEach(element => {
            let roleAuth = {};
            roleAuth.Object = element;
            roleAuth.AgrName = vForm.AgrName;
            roleAuths.push(roleAuth);
          });

          let edit = {
            AgrName: vForm.AgrName,
            Text: vForm.Text,
            Chgusr: this.userInfo.loginName,
            Operation: 'U',
            RoleAuthRespNav: roleAuths
          };

          this.editVisible = false;
          request({
            url: process.env.VUE_APP_BASE_API + 'roleReqSet', method: 'post', data: edit,
            headers: {
              "Content-Type": "application/json;charset=UTF-8",
              'X-CSRF-Token': this.userInfo.token
            },
          }).then(res => {
            if (res.status == 201) {
              this.$message.success(this.$t('m.modifySuccess'));
              this.getData();
            } else {
              this.$message.error(res.msg);
            }
          });
          this.$set(this.tableData, this.idx, this.editform);
        }
      });
    },
    // 分页导航
    handlePageChange (val) {
      this.$set(this.query, 'pageNum', val);
      this.getData();
    },
    handleDelete (index, row) {
      let rows = new Array();
      rows.push(row);

      let uriParam = new Array();
      uriParam.push('AgrName');
      uriParam.push('Text');

      let batchBody = this.$para.batchPack('DELETE', 'roleReqSet', uriParam, rows);

      this.$confirm(this.$t('m.deleteGoOn'), this.$t('m.tips'), {
        confirmButtonText: this.$t('m.confirm'),
        cancelButtonText: this.$t('m.cancel'),
        type: 'info'
      }).then(() => {
        request({
          url: process.env.VUE_APP_BASE_API + "$batch",
          headers: {
            "Content-Type": "multipart/mixed; boundary=batch",
            'X-CSRF-Token': this.userInfo.token
          },
          data: batchBody,
          method: 'post'
        }).then(res => {
          if (res.status == 202) {
            let responseData = this.$para.batchUnpack(res.request, res.status);
            let errorMsg = new String();
            for (let i in responseData) {
              if (responseData[i].status != 204 && responseData[i].status) {
                errorMsg = errorMsg + responseData[i].data.error.message.value;
              }
            }
            if (errorMsg != '') {
              this.$message.error(errorMsg);
            } else {
              this.$message.success(this.$t('m.deleteSuccess'));
              this.getData();
              this.multipleSelection = [];
            }
          } else {
            this.$message.error(res.msg);
          }
        });
      }).catch(() => {
        this.$message.info(this.$t('m.cancel'));
      });
    },
    handleChange (value, direction, movedKeys) {
      //console.log(value, direction, movedKeys);
    },
    async checkAgrName (rule, value, callback) {
      if (this.editVisible == true) {
        if (value == '' || value == undefined) {
          callback(new Error(this.$t('m.agrNameEmpty')));
        }
      } else if (this.addVisible == true) {
        if (value == '' || value == undefined) {
          callback(new Error(this.$t('m.agrNameEmpty')));
        } else {
          await request({
            url: process.env.VUE_APP_BASE_API + "roleReqSet(AgrName='" + value + "',Text='')",
            method: 'get'
          }).then(res => {
            if (res.d.Total == 1) {
              callback(new Error(this.$t('m.objectDuplicate')));
            }
          })
        }
      }
    },
    _translate (vForm) {
      vForm.Crtdt = this.$para.translateDate('', '', vForm.Crtdt, '');
      vForm.Crttm = this.$para.translateTime('', '', vForm.Crttm, '');
      vForm.Chgdt = this.$para.translateDate('', '', vForm.Chgdt, '');
      vForm.Chgtm = this.$para.translateTime('', '', vForm.Chgtm, '');
    }
  }
};
</script>

<style>
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
.el-checkbox {
    display: block;
}
.transfer {
    text-align: left;
    display: inline-block;
}
</style>

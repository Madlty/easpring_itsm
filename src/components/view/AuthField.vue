<template>
  <div>
    <div class="crumbs">

    </div>
    <div class="container">
      <div class="handle-box">
        <el-input
          v-model="queryField"
          width="100"
          :placeholder="$t('m.field')"
          maxlength="10"
          show-word-limit
          class="handle-input mr10"
          @keyup.enter.native="handleSearch"
        ></el-input>
        <el-input
          v-model="query.FieldDesc"
          :placeholder="$t('m.fieldDesc')"
          class="handle-input mr10"
          maxlength="50"
          show-word-limit
          @keyup.enter.native="handleSearch"
        ></el-input>
        <el-input
          v-model="queryAgval"
          :placeholder="$t('m.agval')"
          class="handle-input mr10"
          maxlength="40"
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
          prop="Field"
          :label="$t('m.field')"
          align="center"
        ></el-table-column>
        <el-table-column
          prop="FieldDesc"
          :label="$t('m.fieldDesc')"
          align="center"
          :show-overflow-tooltip="true"
        ></el-table-column>
        <el-table-column
          prop="Agval"
          :label="$t('m.agval')"
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
    <!-- ??????????????? -->
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
        label-width="120px"
        class="demo-ruleForm"
        :rules="ruleValidate"
      >

        <el-row>
          <el-col :span="12">
            <el-form-item
              :label="$t('m.field')"
              prop="Field"
            >
              <el-input
                v-model="addField"
                class="long-input"
                maxlength="10"
                show-word-limit
              > </el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item
              :label="$t('m.fieldDesc')"
              prop="FieldDesc"
            >
              <el-input
                v-model="addform.FieldDesc"
                class="long-input"
                maxlength="50"
                show-word-limit
              > </el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item
              :label="$t('m.agval')"
              prop="Agval"
            >
              <el-input
                v-model="addAgval"
                class="long-input"
                maxlength="40"
                show-word-limit
              > </el-input>
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

    <!-- ??????????????? -->
    <el-dialog
      :title="$t('m.modify')"
      :visible.sync="editVisible"
      width="60%"
      :close-on-click-modal="false"
    >
      <el-form
        ref="editform"
        :model="editform"
        label-width="120px"
        class="demo-ruleForm"
        :rules="ruleValidate"
      >
        <el-row>
          <el-col :span="12">
            <el-form-item
              :label="$t('m.field')"
              prop="Field"
            >
              <el-input
                v-model="editform.Field"
                class="long-input"
                maxlength="10"
                show-word-limit
                readonly='true'
              > </el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item
              :label="$t('m.fieldDesc')"
              prop="FieldDesc"
            >
              <el-input
                v-model="editform.FieldDesc"
                class="long-input"
                maxlength="50"
                show-word-limit
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item
              :label="$t('m.agval')"
              prop="Agval"
            >
              <el-input
                v-model="editform.Agval"
                class="long-input"
                maxlength="40"
                show-word-limit
                readonly='true'
              ></el-input>
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
        <el-button @click="editVisible = false">??? ???</el-button>
        <el-button
          type="primary"
          @click="saveEdit(editform)"
        >??? ???</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import request from '../../utils/request';
import rules from '../../utils/rules';
import { pack, unpack } from '../../utils/batch'

export default {
  name: 'authfield',
  data () {
    return {
      userInfo: JSON.parse(localStorage.getItem('userInfo')),
      query: {
        Field: '',
        FieldDesc: '',
        Agval: '',
        pageNum: 1,
        pageSize: 10,
      },
      tableData: [],
      multipleSelection: [],
      addVisible: false,
      editVisible: false,
      pageTotal: 0,
      editform: { Field: '', FieldDesc: '', Agval: '', sups: [] },
      addform: { Field: '', FieldDesc: '', Agval: '', sups: [] },
      idx: -1,
      id: -1,
      ruleValidate: {
        Object: { required: true, validator: this.checkObject, trigger: "blur" },
        Ttext: { required: true, message: this.$t('m.ttextEmpty'), trigger: "blur" },
      }
    }
  },
  computed: {
    queryField: {
      get: function () {
        return this.query.Field;
      },
      set: function (val) {
        this.query.Field = val.toUpperCase();
      }
    },
    queryAgval: {
      get: function () {
        return this.query.Agval;
      },
      set: function (val) {
        this.query.Agval = val.toUpperCase();
      }
    },
    addField: {
      get: function () {
        return this.addform.Field;
      },
      set: function (val) {
        this.addform.Field = val.toUpperCase();
      }
    },
    editField: {
      get: function () {
        return this.editform.Field;
      },
      set: function (val) {
        this.editform.Field = val.toUpperCase();
      }
    },
    addAgval: {
      get: function () {
        return this.addform.Agval;
      },
      set: function (val) {
        this.addform.Agval = val.toUpperCase();
      }
    },
    editAgval: {
      get: function () {
        return this.editform.Agval;
      },
      set: function (val) {
        this.editform.Agval = val.toUpperCase();
      }
    }
  },
  created () {
    this.getData();
  },
  methods: {
    getData () {
      let uri = `authFieldReqSet?$filter=Field eq '` + this.query.Field + `' and FieldDesc eq '` + this.query.FieldDesc + `' and Agval eq  '` + this.query.Agval + `' &$expand=AuthFieldRespNav&$skip=` + this.query.pageSize
        + '&$top=' + this.query.pageNum;
      request({
        url: process.env.VUE_APP_BASE_API + uri, method: 'get', data: {}
      }).then(res => {
        this.tableData = res.d.results[0].AuthFieldRespNav.results;
        this.pageTotal = res.d.results[0].Total;
      });
    },
    // ??????????????????
    handleSearch () {
      this.$set(this.query, 'pageNum', 1);
      this.getData();
    },
    // ??????????????????
    delAllSelection () {
      const length = this.multipleSelection.length;
      let uriParam = new Array();
      uriParam.push('Field');
      uriParam.push('FieldDesc');
      uriParam.push('Agval');
      let batchBody = this.$para.batchPack('DELETE', 'authFieldReqSet', uriParam, this.multipleSelection);
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

    },
    // ????????????
    handleSelectionChange (val) {
      this.multipleSelection = val;
    },
    // ??????
    handleNew () {
      this.addform = { Field: '', FieldDesc: '', Agval: '', sups: [] };
      this.editform = { Field: '', FieldDesc: '', Agval: '', sups: [] };
      this.addVisible = true;
    },
    // ????????????
    handleEdit (index, row) {
      this.addform = { Field: '', FieldDesc: '', Agval: '', sups: [] };
      this.idx = index;
      this.editform = Object.assign({}, row);
      this._translate(this.editform);

      this.editVisible = true;
    },
    saveOne (vForm) {
      this.$refs['addform'].validate((valid) => {
        if (valid) {
          let add = {
            Field: vForm.Field,
            FieldDesc: vForm.FieldDesc,
            Agval: vForm.Agval,
            Crtusr: this.userInfo.loginName,
          };

          this.addVisible = false;
          request({
            url: process.env.VUE_APP_BASE_API + 'authFieldReqSet', method: 'post', data: add,
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
    saveEdit (vForm) {
      this.$refs['editform'].validate((valid) => {
        if (valid) {
          let edit = {
            Field: vForm.Field,
            FieldDesc: vForm.FieldDesc,
            Agval: vForm.Agval,
            Chgusr: this.userInfo.loginName
          };

          this.editVisible = false;
          request({
            url: process.env.VUE_APP_BASE_API + "authFieldReqSet(Field='" + vForm.Field + "',Agval='" + vForm.Agval + "')", method: 'put', data: edit,
            headers: {
              "Content-Type": "application/json;charset=UTF-8",
              'X-CSRF-Token': this.userInfo.token
            },
          }).then(res => {
            // unpack()
            if (res.status == 204) {
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
    // ????????????
    handlePageChange (val) {
      this.$set(this.query, 'pageNum', val);
      this.getData();
    },
    handleDelete (index, row) {
      let rows = new Array();
      rows.push(row);

      let uriParam = new Array();
      uriParam.push('Field');
      uriParam.push('FieldDesc');
      uriParam.push('Agval');

      let batchBody = this.$para.batchPack('DELETE', 'authFieldReqSet', uriParam, rows);

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
    async checkObject (rule, value, callback) {
      if (this.editVisible == true) {
        if (value == '' || value == undefined) {
          callback(new Error(this.$t('m.objectEmpty')));
        }
      } else if (this.addVisible == true) {
        if (value == '' || value == undefined) {
          callback(new Error(this.$t('m.objectEmpty')));
        } else {
          await request({
            url: process.env.VUE_APP_BASE_API + "authReqSet(Object='" + value + "',Ttext='')",
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
.handle-input .long-input {
    width: 100%px;
}
.short-input {
    width: 150px;
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

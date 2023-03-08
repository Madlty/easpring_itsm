<template>
  <div>
    <div class="crumbs">
      <!-- <el-breadcrumb separator="/">
                <el-breadcrumb-item> <i class="el-icon-lx-friendadd"></i> 用户管理</el-breadcrumb-item>
            </el-breadcrumb> -->
    </div>
    <div class="container">
      <div class="handle-box">
        <el-button type="primary" icon="el-icon-plus" class="mr10" @click="handleNew">{{ $t('m.new') }}</el-button>
      </div>
      <el-table :data="tableData" border class="table" ref="multipleTable" row-key="Menuid" default-expand-all :tree-props="{ children: 'childMenu' }">
        <el-table-column prop="Menuid" :label="$t('m.menuId')" width="170" align="left"></el-table-column>
        <el-table-column prop="MenuName" :label="$t('m.menuName')" align="center" :show-overflow-tooltip="true"></el-table-column>
        <el-table-column prop="IsAct" label="状态" width="75" :formatter="$para.translateStatus"></el-table-column>
        <el-table-column prop="Icon" label="图标" width="50">
          <template slot-scope="scope">
            <i :class="scope.row.Icon"></i>
          </template>
        </el-table-column>
        <el-table-column prop="Url" :label="$t('m.url')" width="165" align="left"></el-table-column>
        <el-table-column prop="SortNum" :label="$t('m.sortNum')" width="65"></el-table-column>
        <el-table-column prop="Crtdt" :label="$t('m.crtdt')" align="center" width="95" :formatter="$para.translateDate"></el-table-column>
        <!-- <el-table-column prop="Crttm" :label="$t('m.crttm')" align="center" :formatter="$para.translateTime"></el-table-column> -->
        <el-table-column prop="Crtusr" :label="$t('m.crtusr')" width="95" align="center"></el-table-column>
        <el-table-column prop="Chgdt" :label="$t('m.chgdt')" width="95" align="center" :formatter="$para.translateDate"></el-table-column>
        <!-- <el-table-column prop="Chgtm" :label="$t('m.chgtm')" align="center" :formatter="$para.translateTime"></el-table-column> -->
        <el-table-column prop="Chgusr" :label="$t('m.chgusr')" width="95" align="center"></el-table-column>
        <el-table-column :label="$t('m.operation')" width="185" align="center">
          <template slot-scope="scope">
            <el-button type="success" icon="el-icon-edit" @click="handleEdit(scope.$index, scope.row)">
              {{ $t('m.modify') }}
            </el-button>
            <el-button type="danger" icon="el-icon-delete" @click="handleDelete(scope.$index, scope.row)">
              {{ $t('m.delete') }}
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- 新建弹出框 -->
    <el-dialog :title="$t('m.new')" :visible.sync="addVisible" width="60%" @close="$reset('addform')" :close-on-click-modal="false">
      <el-form ref="addform" :model="addform" label-width="120px" class="demo-ruleForm" :rules="ruleValidate">
        <el-row>
          <el-col :span="12">
            <el-form-item :label="$t('m.menuId')" prop="Menuid">
              <el-input v-model="addMenuid" maxlength="30" show-word-limit></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="$t('m.pmenuId')" prop="Pmenuid">
              <el-autocomplete v-model="addform.Pmenuid" :fetch-suggestions="querySearch" :trigger-on-focus="false"></el-autocomplete>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item :label="$t('m.menuName')" prop="MenuName">
              <el-input v-model="addform.MenuName" class="long-input" maxlength="80" show-word-limit> </el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item :label="$t('m.sortNum')" prop="SortNum">
              <el-input v-model="addform.SortNum"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="$t('m.url')" prop="Url">
              <el-input v-model="addUrl"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item :label="$t('m.isAct')" prop="IsAct">
              <el-select v-model="addform.IsAct" placeholder="请选择">
                <el-option key="" :label="$t('m.deActive')" value=""></el-option>
                <el-option key="X" :label="$t('m.active')" value="X"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="$t('m.icon')" prop="Icon">
              <e-icon-picker v-model="addform.Icon" />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addVisible = false">{{ $t('m.cancel') }}</el-button>
        <el-button type="primary" @click="saveOne(addform)">{{ $t('m.confirm') }}</el-button>
      </span>
    </el-dialog>

    <!-- 编辑弹出框 -->
    <el-dialog :title="$t('m.modify')" :visible.sync="editVisible" width="60%" :close-on-click-modal="false">
      <el-form ref="editform" :model="editform" label-width="120px" class="demo-ruleForm" :rules="ruleValidate">
        <el-row>
          <el-col :span="12">
            <el-form-item :label="$t('m.menuId')" prop="Menuid">
              <el-input v-model="editform.Menuid" maxlength="30" show-word-limit :readonly="true"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="$t('m.pmenuId')" prop="Pmenuid">
              <el-autocomplete v-model="editform.Pmenuid" :fetch-suggestions="querySearch" :trigger-on-focus="false"></el-autocomplete>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item :label="$t('m.menuName')" prop="MenuName">
              <el-input v-model="editform.MenuName" class="long-input" maxlength="80" show-word-limit></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item :label="$t('m.sortNum')" prop="SortNum">
              <el-input v-model="editform.SortNum"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="$t('m.url')" prop="Url">
              <el-input v-model="editform.Url"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item :label="$t('m.isAct')" prop="IsAct">
              <el-select v-model="editform.IsAct" :placeholder="$t('m.plsSelect')">
                <el-option key="" :label="$t('m.deActive')" value=""></el-option>
                <el-option key="X" :label="$t('m.active')" value="X"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="$t('m.icon')" prop="Icon">
              <e-icon-picker v-model="editform.Icon" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item :label="$t('m.crtdt')">
              <el-input v-model="editform.Crtdt" class="short-input" :readonly="true"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item :label="$t('m.crttm')">
              <el-input v-model="editform.Crttm" class="short-input" :readonly="true"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item :label="$t('m.crtusr')">
              <el-input v-model="editform.Crtusr" class="short-input" :readonly="true"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item :label="$t('m.chgdt')">
              <el-input v-model="editform.Chgdt" class="short-input" :readonly="true"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item :label="$t('m.chgtm')">
              <el-input v-model="editform.Chgtm" class="short-input" :readonly="true"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item :label="$t('m.chgusr')">
              <el-input v-model="editform.Chgusr" class="short-input" :readonly="true"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveEdit(editform)">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import request from '../../utils/request';
import rules from '../../utils/rules';

export default {
  name: 'menuManagement',
  data () {
    return {
      userInfo: JSON.parse(localStorage.getItem('userInfo')),
      tableData: [],
      addVisible: false,
      editVisible: false,
      editform: { Menuid: '', Url: '', sups: [] },
      addform: { Menuid: '', Url: '', sups: [] },
      ruleValidate: {
        Menuid: { required: true, validator: this.checkMenuid, trigger: "blur" },
        MenuName: { required: true, message: this.$t('m.ttextEmpty'), trigger: "blur" },
      },
      pmenus: [],
    }
  },
  mounted () {
    this.getData();
  },
  computed: {
    addMenuid: {
      get: function () {
        return this.addform.Menuid;
      },
      set: function (val) {
        this.addform.Menuid = val.toUpperCase();
      }
    },
    addUrl: {
      get: function () {
        return this.addform.Url;
      },
      set: function (val) {
        this.addform.Url = val.toUpperCase();
      }
    }
  },
  created () {

  },
  methods: {
    getData () {
      let uri = `menuSet?$filter=Method eq 'getMenu'`;
      request({
        url: process.env.VUE_APP_BASE_API + uri, method: 'get', data: {}
      }).then(res => {
        this.tableData = JSON.parse(res.d.results[0].Menujson);
      });
    },
    getPmenu () {
      this.pmenus = [];
      let uri = `menuSet?$filter=Method eq 'getPmenu'`;
      request({
        url: process.env.VUE_APP_BASE_API + uri, method: 'get', data: {}
      }).then(res => {
        res.d.results.forEach(element => {
          element.value = element.Menuid;
          this.pmenus.push(element);
        });
      });
    },
    // 新增
    handleNew () {
      this.getPmenu();
      this.addform = { Menuid: '', Url: '', sups: [] };
      this.editform = { Menuid: '', Url: '', sups: [] };
      this.addVisible = true;
    },
    saveOne (vForm) {
      this.$refs['addform'].validate((valid) => {
        if (valid) {
          let add = {
            Menuid: vForm.Menuid,
            MenuDesc: vForm.MenuName,
            Pmenuid: vForm.Pmenuid,
            IsAct: vForm.IsAct,
            SortNum: vForm.SortNum,
            Url: vForm.Url,
            Icon: vForm.Icon,
            Crtusr: this.userInfo.loginName,
          };
          this.addVisible = false;
          request({
            url: process.env.VUE_APP_BASE_API + 'menuSet', method: 'post', data: add,
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
      this.getPmenu();
      this.addform = { Menuid: '', Url: '', sups: [] };
      this.editform = Object.assign({}, row);
      this._translate(this.editform);
      this.editVisible = true;
    },

    saveEdit (vForm) {
      this.$refs['editform'].validate((valid) => {
        if (valid) {
          let edit = {
            Menuid: vForm.Menuid,
            MenuDesc: vForm.MenuName,
            Pmenuid: vForm.Pmenuid,
            IsAct: vForm.IsAct,
            SortNum: vForm.SortNum,
            Url: vForm.Url,
            Icon: vForm.Icon,
            Chgusr: this.userInfo.loginName
          };

          this.editVisible = false;
          request({
            url: process.env.VUE_APP_BASE_API + `menuSet(Menuid='` + vForm.Menuid + `')`, method: 'put', data: edit,
            headers: {
              "Content-Type": "application/json;charset=UTF-8",
              'X-CSRF-Token': this.userInfo.token
            },
          }).then(res => {
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
    handleDelete (index, row) {


      let rows = new Array();
      rows.push(row);

      let uriParam = new Array();
      uriParam.push('Menuid');

      let batchBody = this.$para.batchPack('DELETE', 'menuSet', uriParam, rows);

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
        }).catch(() => {
          this.$message.info(this.$t('m.cancel'));
        });
      })
    },
    async checkMenuid (rule, value, callback) {
      if (this.editVisible == true) {
        if (value == '' || value == undefined) {
          callback(new Error(this.$t('m.objectEmpty')));
        }
      } else if (this.addVisible == true) {
        if (value == '' || value == undefined) {
          callback(new Error(this.$t('m.objectEmpty')));
        } else {
          await request({
            url: process.env.VUE_APP_BASE_API + "menuSet(Menuid='" + value + "')",
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
    },
    querySearch (queryString, cb) {
      var pmenus = this.pmenus;
      var results = queryString ? pmenus.filter(this.createFilter(queryString)) : pmenus;
      // call callback function to return suggestions
      cb(results);
    },
    createFilter (queryString) {
      return (pmenu) => {
        return (pmenu.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0);
      };
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

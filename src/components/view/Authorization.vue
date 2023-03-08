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
          v-model="queryObject"
          width="100"
          :placeholder="$t('m.object')"
          maxlength="12"
          show-word-limit
          class="handle-input mr10"
          @keyup.enter.native="handleSearch"
        ></el-input>
        <el-input
          v-model="queryTtext"
          :placeholder="$t('m.ttext')"
          class="handle-input mr10"
          maxlength="60"
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
          prop="Object"
          :label="$t('m.object')"
          align="center"
        ></el-table-column>
        <el-table-column
          prop="Ttext"
          :label="$t('m.ttext')"
          align="center"
          :show-overflow-tooltip="true"
        ></el-table-column>
        <el-table-column
          prop="Crtdt"
          :label="$t('m.crtdt')"
          align="center"
          :formatter="$para.translateDate"
        ></el-table-column>
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
        label-width="120px"
        class="handle-form"
        :rules="ruleValidate"
      >
        <el-tabs
          v-model="activeName"
          @tab-click="handleClick"
          v-if="addVisible == true"
        >
          <el-tab-pane
            :label="$t('m.object')"
            name="object"
            class="uesr-tab-pane"
          >
            <el-row>
              <el-col :span="12">
                <el-form-item
                  :label="$t('m.object')"
                  prop="Object"
                >
                  <el-input
                    v-model="addObject"
                    class="handle-input"
                    maxlength="10"
                    show-word-limit
                  ></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="18">
                <el-form-item
                  :label="$t('m.ttext')"
                  prop="Ttext"
                >
                  <el-input
                    v-model="addform.Ttext"
                    class="long-input"
                    maxlength="60"
                    show-word-limit
                  > </el-input>
                </el-form-item>
              </el-col>
            </el-row>
          </el-tab-pane>
          <el-tab-pane
            :label="$t('m.field')"
            name="field"
            class="uesr-tab-pane"
          >
            <el-row>
              <el-col :span="24">
                <div class="handle-box">
                  <el-input
                    v-model="query.Field"
                    width="100"
                    :placeholder="$t('m.field')"
                    maxlength="10"
                    show-word-limit
                    class="handle-input mr10"
                    @keyup.enter.native="handleFieldSearch"
                  ></el-input>
                  <el-button
                    type="primary"
                    icon="el-icon-plus"
                    class="mr10"
                    @click="handleFieldNew"
                  >{{
                                                $t('m.new')
                                            }}</el-button>
                  <el-button
                    type="primary"
                    icon="el-icon-search"
                    class="mr10"
                    @click="handleFieldSearch"
                  >{{
                                                $t('m.search')
                                            }}</el-button>
                </div>
                <el-table
                  size="mini"
                  :data="tabFieldData"
                  border
                  style="width: 100%;"
                  highlight-current-row
                  height="230"
                >
                  <el-table-column
                    v-for="v in tabFieldCol"
                    v-bind:key="v.id"
                    :prop="v.field"
                    :label="v.title"
                    :width="v.width"
                    align="center"
                  >
                    <template slot-scope="scope">
                      <span v-if="scope.row.isSet">
                        <div v-if="v.field == 'Field'">
                          <el-autocomplete
                            v-model="sel[v.field]"
                            :fetch-suggestions="querySearch"
                            :trigger-on-focus="true"
                            :placeholder="$t('m.plsInput')"
                            @select="handleSelect"
                          >
                            <template slot-scope="{ item }">
                              <span class="mr10">{{ item.value }}</span>
                              <span class="mr10">{{ item.FieldDesc }}</span>
                              <span class="mr10">{{ item.Agval }}</span>
                            </template>
                          </el-autocomplete>
                        </div>
                        <div v-else>
                          <span>{{ sel[v.field] }}</span>
                        </div>
                      </span>
                      <span v-else>
                        <div>{{ scope.row[v.field] }}</div>
                      </span>
                    </template>
                  </el-table-column>
                  <el-table-column
                    :label="$t('m.operation')"
                    width="100"
                  >
                    <template slot-scope="scope">
                      <el-tooltip
                        class="item"
                        effect="dark"
                        :content="$t('m.save')"
                        placement="top-start"
                        v-if="scope.row.isSet == true"
                      >
                        <el-button
                          size="mini"
                          icon="el-icon-check"
                          type="success"
                          @click="handleFieldEdit(scope.row, scope.$index, true)"
                          circle
                        ></el-button>
                      </el-tooltip>
                      <el-tooltip
                        v-else
                        class="item"
                        effect="dark"
                        :content="$t('m.edit')"
                        placement="top-start"
                      >
                        <el-button
                          size="mini"
                          icon="el-icon-edit"
                          type="primary"
                          @click="handleFieldEdit(scope.row, scope.$index, true)"
                          circle
                        ></el-button>
                      </el-tooltip>
                      <el-tooltip
                        v-if="scope.row.isSet != true"
                        class="item"
                        effect="dark"
                        :content="$t('m.delete')"
                        placement="top-start"
                      >
                        <el-button
                          v-if="scope.row.isSet != true"
                          size="mini"
                          icon="el-icon-delete"
                          type="danger"
                          @click="handleFieldDelete(scope.row, scope.$index)"
                          circle
                        >
                        </el-button>
                      </el-tooltip>
                      <el-tooltip
                        v-else
                        class="item"
                        effect="dark"
                        :content="$t('m.cancel')"
                        placement="top-start"
                      >
                        <el-button
                          size="mini"
                          icon="el-icon-refresh-right"
                          type="warning"
                          @click="handleFieldEdit(scope.row, scope.$index, false)"
                          circle
                        >
                        </el-button>
                      </el-tooltip>
                    </template>
                  </el-table-column>
                </el-table>
              </el-col>
            </el-row>
          </el-tab-pane>
        </el-tabs>
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
      @close="$reset('editform')"
      :close-on-click-modal="false"
    >
      <el-form
        ref="editform"
        :model="editform"
        label-width="120px"
        class="handle-form"
        :rules="ruleValidate"
      >
        <el-tabs
          v-model="activeName"
          @tab-click="handleClick"
          v-if="editVisible == true"
        >
          <el-tab-pane
            :label="$t('m.object')"
            name="object"
            class="uesr-tab-pane"
          >
            <el-row>
              <el-col :span="12">
                <el-form-item
                  :label="$t('m.object')"
                  prop="Object"
                >
                  <el-input
                    v-model="editform.Object"
                    class="handle-input"
                    maxlength="10"
                    show-word-limit
                    :readonly="true"
                  ></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="18">
                <el-form-item
                  :label="$t('m.ttext')"
                  prop="Ttext"
                >
                  <el-input
                    v-model="editform.Ttext"
                    class="long-input"
                    maxlength="60"
                    show-word-limit
                  > </el-input>
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
          </el-tab-pane>
          <el-tab-pane
            :label="$t('m.field')"
            name="field"
            class="uesr-tab-pane"
          >
            <el-row>
              <el-col :span="24">
                <div class="handle-box">
                  <el-input
                    v-model="query.Field"
                    width="100"
                    :placeholder="$t('m.field')"
                    maxlength="10"
                    show-word-limit
                    class="handle-input mr10"
                    @keyup.enter.native="handleFieldSearch"
                  ></el-input>
                  <el-button
                    type="primary"
                    icon="el-icon-plus"
                    class="mr10"
                    @click="handleFieldNew"
                  >{{
                                                $t('m.new')
                                            }}</el-button>
                  <el-button
                    type="primary"
                    icon="el-icon-search"
                    class="mr10"
                    @click="handleFieldSearch"
                  >{{
                                                $t('m.search')
                                            }}</el-button>
                </div>
                <el-table
                  size="mini"
                  :data="tabFieldData"
                  border
                  style="width: 100%;"
                  highlight-current-row
                  height="230"
                >
                  <el-table-column
                    v-for="v in tabFieldCol"
                    v-bind:key="v.id"
                    :prop="v.field"
                    :label="v.title"
                    :width="v.width"
                    align="center"
                  >
                    <template slot-scope="scope">
                      <span v-if="scope.row.isSet">
                        <div v-if="v.field == 'Field'">
                          <el-autocomplete
                            v-model="sel[v.field]"
                            :fetch-suggestions="querySearch"
                            :trigger-on-focus="true"
                            :placeholder="$t('m.plsInput')"
                            @select="handleSelect"
                          >
                            <template slot-scope="{ item }">
                              <span class="mr10">{{ item.value }}</span>
                              <span class="mr10">{{ item.FieldDesc }}</span>
                              <span class="mr10">{{ item.Agval }}</span>
                            </template>
                          </el-autocomplete>
                        </div>
                        <div v-else>
                          <span>{{ sel[v.field] }}</span>
                        </div>
                      </span>
                      <span v-else>
                        <div>{{ scope.row[v.field] }}</div>
                      </span>
                    </template>
                  </el-table-column>
                  <el-table-column
                    :label="$t('m.operation')"
                    width="100"
                  >
                    <template slot-scope="scope">
                      <el-tooltip
                        class="item"
                        effect="dark"
                        :content="$t('m.save')"
                        placement="top-start"
                        v-if="scope.row.isSet == true"
                      >
                        <el-button
                          size="mini"
                          icon="el-icon-check"
                          type="success"
                          @click="handleFieldEdit(scope.row, scope.$index, true)"
                          circle
                        ></el-button>
                      </el-tooltip>
                      <el-tooltip
                        v-else
                        class="item"
                        effect="dark"
                        :content="$t('m.edit')"
                        placement="top-start"
                      >
                        <el-button
                          size="mini"
                          icon="el-icon-edit"
                          type="primary"
                          @click="handleFieldEdit(scope.row, scope.$index, true)"
                          circle
                        ></el-button>
                      </el-tooltip>
                      <el-tooltip
                        v-if="scope.row.isSet != true"
                        class="item"
                        effect="dark"
                        :content="$t('m.delete')"
                        placement="top-start"
                      >
                        <el-button
                          v-if="scope.row.isSet != true"
                          size="mini"
                          icon="el-icon-delete"
                          type="danger"
                          @click="handleFieldDelete(scope.row, scope.$index)"
                          circle
                        >
                        </el-button>
                      </el-tooltip>
                      <el-tooltip
                        v-else
                        class="item"
                        effect="dark"
                        :content="$t('m.cancel')"
                        placement="top-start"
                      >
                        <el-button
                          size="mini"
                          icon="el-icon-refresh-right"
                          type="warning"
                          @click="handleFieldEdit(scope.row, scope.$index, false)"
                          circle
                        >
                        </el-button>
                      </el-tooltip>
                    </template>
                  </el-table-column>
                </el-table>
              </el-col>
            </el-row>
          </el-tab-pane>
        </el-tabs>
      </el-form>
      <span
        slot="footer"
        class="dialog-footer"
      >
        <el-button @click="editVisible = false">{{ $t('m.cancel') }}</el-button>
        <el-button
          type="primary"
          @click="saveEdit(editform)"
        >{{ $t('m.confirm') }}</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
//id生成工具 这个不用看 示例而已 模拟后台返回的id
var generateId = {
  _count: 1,
  get () { return ((+new Date()) + "_" + (this._count++)) }
};
import request from '../../utils/request';
import rules from '../../utils/rules';
import { pack, unpack } from '../../utils/batch'

export default {
  name: 'authrization',
  data () {
    return {
      userInfo: JSON.parse(localStorage.getItem('userInfo')),
      query: {
        Object: '',
        Ttext: '',
        pageNum: 1,
        pageSize: 10,
      },
      tableData: [],
      multipleSelection: [],
      addVisible: false,
      editVisible: false,
      pageTotal: 0,
      editform: { Object: '', Ttext: '', tabFieldData: [] },
      addform: { Object: '', Ttext: '', tabFieldData: [] },
      idx: -1,
      id: -1,
      ruleValidate: {
        Object: { required: true, validator: this.checkObject, trigger: "blur" },
        Ttext: { required: true, message: this.$t('m.ttextEmpty'), trigger: "blur" },
      },
      tabFieldData: [],
      tabFieldCol: [{ id: 1, field: 'Field', title: '权限字段' },
      { id: 2, field: 'FieldDesc', title: '权限字段描述' },
      { id: 3, field: 'Agval', title: '权限值' }],
      fieldList: [],
      sel: { Field: '', FieldDesc: '', Agval: '' },
      activeName: 'object'
    }
  },
  computed: {
    queryObject: {
      get: function () {
        return this.query.Object;
      },
      set: function (val) {
        this.query.Object = val.toUpperCase();
      }
    },
    queryTtext: {
      get: function () {
        return this.query.Ttext;
      },
      set: function (val) {
        this.query.Ttext = val.toUpperCase();
      }
    },
    addObject: {
      get: function () {
        return this.addform.Object;
      },
      set: function (val) {
        this.addform.Object = val.toUpperCase();
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
      let uri = `authReqSet?$filter=Object eq '` + this.query.Object + `' and Ttext eq '` + this.query.Ttext + `' &$expand=AuthAuthField&$skip=` + this.query.pageSize
        + '&$top=' + this.query.pageNum;
      request({
        url: process.env.VUE_APP_BASE_API + uri, method: 'get', data: {}
      }).then(res => {
        this.tableData = res.d.results;
        this.pageTotal = res.d.results[0].Total;
      });
    },
    // 触发搜索按钮
    handleSearch () {
      this.$set(this.query, 'pageNum', 1);
      this.getData();
    },
    // 批量删除操作
    delAllSelection () {
      const length = this.multipleSelection.length;
      let uriParam = new Array();
      uriParam.push('Object');
      uriParam.push('Ttext');
      let batchBody = this.$para.batchPack('DELETE', 'authReqSet', uriParam, this.multipleSelection);
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
    // 多选操作
    handleSelectionChange (val) {
      this.multipleSelection = val;
    },
    // 新增
    handleNew () {
      this.addform = { Object: '', Agval: '', tabFieldData: [] };
      this.editform = { Object: '', Agval: '', tabFieldData: [] };
      this.addVisible = true;
      this.getFieldList();
      this.tabFieldData = [];
      this.activeName = 'object';
    },
    // 编辑操作
    handleEdit (index, row) {
      this.addform = { Object: '', Agval: '', tabFieldData: [] };
      this.idx = index;
      this.editformAssign(row);
      this._translate(this.editform);

      this.editVisible = true;
      this.getFieldList();
      this.activeName = 'object';
    },
    saveOne (vForm) {
      if (this.tabFieldData.length == 0) {
        this.$message.error(this.$t('m.fieldOneRow'));
        return;
      }
      this.$refs['addform'].validate((valid) => {
        if (valid) {
          let fields = new Array();
          this.tabFieldData.forEach(element => {
            fields.push({
              Object: vForm.Object,
              Ttext: vForm.Ttext,
              Field: element.Field,
              Agval: element.Agval
            })
          });

          let add = {
            Operation: 'I',
            Object: vForm.Object,
            Ttext: vForm.Ttext,
            AuthAuthField: fields,
            Crtusr: this.userInfo.loginName,
          };

          this.addVisible = false;
          request({
            url: process.env.VUE_APP_BASE_API + 'authReqSet', method: 'post', data: add,
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

      if (this.tabFieldData.length == 0) {
        this.$message.error(this.$t('m.fieldOneRow'));
        return;
      }
      this.$refs['editform'].validate((valid) => {
        if (valid) {

          let fields = new Array();
          this.tabFieldData.forEach(element => {
            fields.push({
              Object: vForm.Object,
              Ttext: vForm.Ttext,
              Field: element.Field,
              Agval: element.Agval
            })
          });

          let edit = {
            Operation: 'U',
            Object: vForm.Object,
            Ttext: vForm.Ttext,
            AuthAuthField: fields,
            Chgusr: this.userInfo.loginName,
          };

          this.editVisible = false;
          request({
            url: process.env.VUE_APP_BASE_API + "authReqSet", method: 'post', data: edit,
            headers: {
              "Content-Type": "application/json;charset=UTF-8",
              'X-CSRF-Token': this.userInfo.token
            },
          }).then(res => {
            // unpack()
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
      uriParam.push('Object');
      uriParam.push('Ttext');

      let batchBody = this.$para.batchPack('DELETE', 'authReqSet', uriParam, rows);

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
    },
    handleFieldSearch () {

    },
    handleFieldNew () {
      for (let i of this.tabFieldData) {
        if (i.isSet) return this.$message.warning(this.$t('m.plsSaveCurrent'));
      }
      let j = { id: 0, "Field": "", "FieldDesc": "", "Agval": "", "isSet": true, "_temporary": true };

      this.tabFieldData.push(j);
      this.sel = JSON.parse(JSON.stringify(j));
    },
    querySearch (queryString, cb) {
      var fieldList = this.fieldList;
      var results = queryString ? fieldList.filter(this.createFilter(queryString, 'value')) : fieldList;
      // call callback function to return suggestions
      cb(results);
    },
    createFilter (queryString, field) {
      return (ele) => {
        return (ele[field].toLowerCase().indexOf(queryString.toLowerCase()) >= 0);
      };
    },
    getFieldList () {
      this.fieldList = [];
      let uri = `authFieldReqSet`;
      request({
        url: process.env.VUE_APP_BASE_API + uri, method: 'get', data: {}
      }).then(res => {
        res.d.results.forEach(element => {
          this.fieldList.push({
            value: element.Field,
            FieldDesc: element.FieldDesc,
            Agval: element.Agval
          })
        });
      })
    },
    handleFieldEdit (row, index, cg) {
      //点击修改 判断是否已经保存所有操作
      for (let i of this.tabFieldData) {
        if (i.isSet && i.id != row.id) {
          this.$message.warning(this.$t('m.plsSaveCurrent'));
          return false;
        }
      }
      //是否是取消操作
      if (!cg) {
        if (!this.sel.id) this.tabFieldData.splice(index, 1);
        return row.isSet = !row.isSet;
      }
      //提交数据
      if (row.isSet) {
        if (this.sel.Field) {
          //项目是模拟请求操作  自己修改下
          (() => {
            let data = JSON.parse(JSON.stringify(this.sel));
            data['FieldDesc'] = this.fieldList.filter(this.createFilter(data.Field, 'value'))[0]['FieldDesc'];
            for (let k in data) row[k] = data[k];

            //然后这边重新读取表格数据
            this.getLocalFieldData();
            row.isSet = false;
          })();
        } else {
          this.$message.error(this.$t('m.fieldEmpty'));
        }
      } else {
        row.isSet = true;
        this.sel = JSON.parse(JSON.stringify(row));

      }
    },
    //读取表格数据
    getLocalFieldData () {
      //根据实际情况，自己改下啊 
      this.tabFieldData.map(i => {
        typeof i.id == "undefined" || i.id == 0 ? i.id = generateId.get() : i.id;//模拟后台插入成功后有了id
        i.isSet = false;//给后台返回数据添加`isSet`标识
        i._temporary = true;
        return i;
      });
    },
    handleFieldDelete (row, index) {
      //点击删除 判断是否已经保存所有操作
      for (let i of this.tabFieldData) {
        if (i.isSet && i.id != row.id) {
          this.$message.warning(this.$t('m.plsSaveCurrent'));
          return false;
        }
      }
      //是否是取消操作
      this.tabFieldData.splice(index, 1);
    },
    handleSelect (item) {
      this.sel.Agval = item.Agval;
      this.sel.FieldDesc = item.FieldDesc;
    },
    editformAssign (row) {
      this.editform = Object.assign({}, row);
      this.tabFieldData = Object.assign([], row.AuthAuthField.results);
    },
    handleClick () {

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
.handle-form {
    height: 340px;
}
</style>

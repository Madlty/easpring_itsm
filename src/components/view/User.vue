<template>
  <div>
    <div class="container">
      <div class="handle-box">
        <el-input
          v-model="queryBname"
          width="100"
          :placeholder="$t('m.bname')"
          maxlength="12"
          show-word-limit
          class="handle-input mr10"
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
          width="38"
          align="center"
        ></el-table-column>
        <el-table-column
          prop="Bname"
          :label="$t('m.bname')"
          width="95"
          align="center"
        ></el-table-column>
        <el-table-column
          prop="Uflag"
          :label="$t('m.uflag')"
          align="center"
          :show-overflow-tooltip="true"
          :formatter="$para.translateUflag"
        ></el-table-column>
        <el-table-column
          prop="NameLast"
          width="100"
          :label="$t('m.nameLast')"
          align="center"
          :show-overflow-tooltip="true"
        ></el-table-column>
        <el-table-column
          prop="NameFirst"
          width="100"
          :label="$t('m.nameFirst')"
          align="center"
          :show-overflow-tooltip="true"
        ></el-table-column>
        <el-table-column
          prop="Gltgv"
          :label="$t('m.gltgv')"
          align="center"
          :formatter="$para.translateDate"
          :show-overflow-tooltip="true"
          width="95"
        ></el-table-column>
        <el-table-column
          prop="Gltgb"
          :label="$t('m.gltgb')"
          align="center"
          :formatter="$para.translateDate"
          width="100"
          :show-overflow-tooltip="true"
        ></el-table-column>
        <el-table-column
          prop="Crtdt"
          :label="$t('m.crtdt')"
          align="center"
          width="100"
          :formatter="$para.translateDate"
        ></el-table-column>
        <!-- <el-table-column prop="Crttm" :label="$t('m.crttm')" align="center" :formatter="$para.translateTime"></el-table-column> -->
        <el-table-column
          prop="Crtusr"
          :label="$t('m.crtusr')"
          width="100"
          align="center"
        ></el-table-column>
        <el-table-column
          prop="Chgdt"
          :label="$t('m.chgdt')"
          align="center"
          width="105"
          :formatter="$para.translateDate"
        ></el-table-column>
        <!-- <el-table-column prop="Chgtm" :label="$t('m.chgtm')" align="center" :formatter="$para.translateTime"></el-table-column> -->
        <el-table-column
          prop="Chgusr"
          :label="$t('m.chgusr')"
          width="100"
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
      <el-row>
        <el-col :span="24">
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
                :label="$t('m.userInfo')"
                name="userInfo"
                class="uesr-tab-pane"
              >
                <el-row>
                  <el-col :span="12">
                    <el-form-item
                      :label="$t('m.bname')"
                      prop="Bname"
                    >
                      <el-input
                        v-model="addBname"
                        maxlength="12"
                        show-word-limit
                      ></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item
                      :label="$t('m.nameLast')"
                      prop="NameLast"
                    >
                      <el-input
                        v-model="addform.NameLast"
                        maxlength="40"
                        show-word-limit
                      ></el-input>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="12">
                    <el-form-item
                      :label="$t('m.uflag')"
                      prop="Uflag"
                    >
                      <el-select
                        v-model="addform.Uflag"
                        :placeholder="$t('m.plsSelect')"
                        class="handle-select"
                      >
                        <el-option
                          v-for="item in uflagList"
                          :key="item.code"
                          :label="item.name"
                          :value="item.code"
                        >
                          <span style="float: left; color: #8492a6; font-size: 13px;">{{ item.code }}</span>
                          <span style="float: right;">{{ item.name }}</span>
                        </el-option>
                      </el-select>
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item
                      :label="$t('m.nameFirst')"
                      prop="NameFirst"
                    >
                      <el-input
                        v-model="addform.NameFirst"
                        maxlength="40"
                        show-word-limit
                      ></el-input>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="12">
                    <el-form-item
                      :label="$t('m.mobNumber')"
                      prop="MobNumber"
                    >
                      <el-input v-model="addform.MobNumber"></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item
                      :label="$t('m.smtpAddr')"
                      prop="SmtpAddr"
                    >
                      <el-input v-model="addform.SmtpAddr"></el-input>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="24">
                    <el-form-item
                      :label="$t('m.headerImg')"
                      prop="headerImage"
                    >
                      <el-upload
                        :class="{hide:this.hideUpload}"
                        action="#"
                        ref="addUploadImg"
                        list-type="picture-card"
                        accept="image/png,image/jpg,image/jpeg"
                        :on-success="uploadSuccess"
                        :on-error="uploadError"
                        :auto-upload="false"
                        :limit="1"
                        :data="imageData"
                        :on-change="handleChange"
                        :headers="headersObj"
                        :http-request="handleUpload"
                        :file-list="addFileList"
                      >
                        <i
                          slot="default"
                          class="el-icon-plus"
                        ></i>
                        <div
                          slot="file"
                          slot-scope="{ file }"
                        >
                          <img
                            class="el-upload-list__item-thumbnail"
                            :src="file.url"
                            alt=""
                          />
                          <span class="el-upload-list__item-actions">
                            <span
                              class="el-upload-list__item-preview"
                              @click="handlePictureCardPreview(file)"
                            >
                              <i class="el-icon-zoom-in"></i>
                            </span>
                            <span
                              class="el-upload-list__item-delete"
                              @click="handleRemove(file)"
                            >
                              <i class="el-icon-delete"></i>
                            </span>
                          </span>
                        </div>
                      </el-upload>
                      <el-dialog
                        append-to-body
                        :visible.sync="imageDialogVisible"
                      >
                        <el-image
                          width="80%"
                          :src="dialogImageUrl"
                          alt=""
                        />
                      </el-dialog>
                    </el-form-item>
                  </el-col>
                </el-row>
              </el-tab-pane>
              <el-tab-pane
                :label="$t('m.userLogin')"
                name="userLogin"
                class="uesr-tab-pane"
              >
                <el-row>
                  <el-col :span="12">
                    <el-form-item
                      :label="$t('m.gltgv')"
                      prop="Gltgv"
                    >
                      <el-date-picker
                        :format="this.$para.datePickerType()"
                        v-model="addform.Gltgv"
                      ></el-date-picker>
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item
                      :label="$t('m.gltgb')"
                      prop="Gltgb"
                    >
                      <el-date-picker
                        :format="this.$para.datePickerType()"
                        v-model="addform.Gltgb"
                      ></el-date-picker>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="12">
                    <el-form-item
                      :label="$t('m.password')"
                      prop="Password"
                    >
                      <el-input
                        v-model="addform.Password"
                        class="handle-input"
                        type="password"
                      ></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item
                      :label="$t('m.passConfirm')"
                      prop="PassConfirm"
                    >
                      <el-input
                        v-model="addform.PassConfirm"
                        class="handle-input"
                        type="password"
                      ></el-input>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="12">
                    <el-form-item
                      :label="$t('m.theme')"
                      prop="theme"
                    >
                      <el-select
                        v-model="addform.Theme"
                        filterable
                        clearable
                        class="handle-select"
                      >
                        <el-option
                          v-for="item in themeList"
                          :key="item.code"
                          :label="item.name"
                          :value="item.code"
                        >
                          <span style="float: left; color: #8492a6; font-size: 13px;">{{ item.code }}</span>
                          <span style="float: right;">{{ item.name }}</span>
                        </el-option>
                      </el-select>

                    </el-form-item>
                  </el-col>
                </el-row>
              </el-tab-pane>
              <el-tab-pane
                :label="$t('m.defaultPara')"
                name="defaultPara"
                class="uesr-tab-pane"
              >
                <el-row>
                  <el-col :span="12">
                    <el-form-item
                      :label="$t('m.dcpfm')"
                      prop="Dcpfm"
                    >
                      <el-select
                        v-model="addform.Dcpfm"
                        filterable
                        clearable
                        class="handle-select"
                      >
                        <el-option
                          v-for="item in dcpfmList"
                          :key="item.code"
                          :label="item.name"
                          :value="item.code"
                        >
                          <span style="float: left; color: #8492a6; font-size: 13px;">{{ item.code }}</span>
                          <span style="float: right;">{{ item.name }}</span>
                        </el-option>
                      </el-select>
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item
                      :label="$t('m.datfm')"
                      prop="Datfm"
                    >
                      <el-select
                        v-model="addform.Datfm"
                        filterable
                        clearable
                        class="handle-select"
                      >
                        <el-option
                          v-for="item in datfmList"
                          :key="item.code"
                          :label="item.name"
                          :value="item.code"
                        >
                          <span style="float: left; color: #8492a6; font-size: 13px;">{{ item.code }}</span>
                          <span style="float: right;">{{ item.name }}</span>
                        </el-option>
                      </el-select>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="12">
                    <el-form-item
                      :label="$t('m.timefm')"
                      prop="Timefm"
                    >
                      <el-select
                        v-model="addform.Timefm"
                        filterable
                        clearable
                        class="handle-select"
                      >
                        <el-option
                          v-for="item in timefmList"
                          :key="item.code"
                          :label="item.name"
                          :value="item.code"
                        >
                          <span style="float: left; color: #8492a6; font-size: 13px;">{{ item.code }}</span>
                          <span style="float: right;">{{ item.name }}</span>
                        </el-option>
                      </el-select>
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item
                      :label="$t('m.langu')"
                      prop="Langu"
                    >
                      <el-select
                        v-model="addform.Langu"
                        filterable
                        clearable
                        class="handle-select"
                      >
                        <el-option
                          v-for="item in languList"
                          :key="item.code"
                          :label="item.name"
                          :value="item.code"
                        >
                          <span style="float: left; color: #8492a6; font-size: 13px;">{{ item.code }}</span>
                          <span style="float: right;">{{ item.name }}</span>
                        </el-option>
                      </el-select>
                    </el-form-item>
                  </el-col>
                </el-row>
              </el-tab-pane>
              <el-tab-pane
                :label="$t('m.userMenu')"
                name="userMenu"
                class="uesr-tab-pane"
              >
                <div class="tree mt10">
                  <el-tree
                    ref="addMenuTree"
                    :props="{
                                            label: 'MenuName',
                                            children: 'childMenu'
                                        }"
                    node-key="Menuid"
                    :data="menuList"
                    show-checkbox
                    default-expand-all
                    @check-change="handleCheckChange"
                  >
                  </el-tree>
                </div>
              </el-tab-pane>
              <el-tab-pane
                :label="$t('m.userRole')"
                name="userRole"
                class="uesr-tab-pane"
              >
                <el-row>
                  <el-col :span="24">
                    <div class="handle-box">
                      <el-input
                        v-model="query.AgrName"
                        width="100"
                        :placeholder="$t('m.agrname')"
                        maxlength="30"
                        show-word-limit
                        class="handle-input mr10"
                        @keyup.enter.native="handleRoleSearch"
                      ></el-input>
                      <el-button
                        type="primary"
                        icon="el-icon-plus"
                        class="mr10"
                        @click="handleRoleNew"
                      >{{
                                                $t('m.new')
                                            }}</el-button>
                      <el-button
                        type="primary"
                        icon="el-icon-search"
                        class="mr10"
                        @click="handleRoleSearch"
                      >{{
                                                $t('m.search')
                                            }}</el-button>
                    </div>
                    <el-table
                      size="mini"
                      :data="tabRoleData"
                      border
                      style="width: 100%;"
                      highlight-current-row
                      height="230"
                    >
                      <el-table-column
                        v-for="v in tabRoleCol"
                        v-bind:key="v.id"
                        :prop="v.field"
                        :label="v.title"
                        :width="v.width"
                        align="center"
                      >
                        <template slot-scope="scope">
                          <span v-if="scope.row.isSet">
                            <div v-if="v.field == 'AgrName'">
                              <el-autocomplete
                                v-model="sel[v.field]"
                                :fetch-suggestions="querySearch"
                                :trigger-on-focus="true"
                                :placeholder="$t('m.plsInput')"
                              ></el-autocomplete>
                            </div>
                            <div v-else-if="v.field == 'FromDat'">
                              <el-date-picker
                                :format="$para.datePickerType()"
                                v-model="sel[v.field]"
                              ></el-date-picker>
                            </div>
                            <div v-else-if="v.field == 'ToDat'">
                              <el-date-picker
                                :format="$para.datePickerType()"
                                v-model="sel[v.field]"
                              ></el-date-picker>
                            </div>
                            <div v-else>
                              <span>{{ sel[v.field] }}</span>
                            </div>
                          </span>
                          <span v-else>
                            <div v-if="v.field == 'FromDat' || v.field == 'ToDat'">
                              <el-date-picker
                                :format="$para.datePickerType()"
                                v-model="scope.row[v.field]"
                                readonly
                              ></el-date-picker>
                            </div>
                            <div v-else>{{ scope.row[v.field] }}</div>
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
                              @click="handleRoleEdit(scope.row, scope.$index, true)"
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
                              @click="handleRoleEdit(scope.row, scope.$index, true)"
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
                              @click="handleRoleDelete(scope.row, scope.$index)"
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
                              @click="handleRoleEdit(scope.row, scope.$index, false)"
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
              <el-tab-pane
                :label="$t('m.configPara')"
                name="configPara"
                class="uesr-tab-pane"
              >
                <el-row>
                  <el-col :span="24">
                    <div class="handle-box">
                      <el-input
                        v-model="query.PersKey"
                        width="100"
                        :placeholder="$t('m.persKey')"
                        maxlength="30"
                        show-word-limit
                        class="handle-input mr10"
                        @keyup.enter.native="handleParaSearch"
                      ></el-input>

                      <el-button
                        type="primary"
                        icon="el-icon-plus"
                        class="mr10"
                        @click="handleParaNew"
                      >
                        {{ $t('m.new') }}
                      </el-button>
                      <el-button
                        type="primary"
                        icon="el-icon-search"
                        class="mr10"
                        @click="handleParaSearch"
                      >{{
                                                $t('m.search')
                                            }}</el-button>
                    </div>
                    <el-table
                      size="mini"
                      :data="tabParaData"
                      me="table-header"
                      border
                      style="width: 100%;"
                      highlight-current-row
                      header-cell-class-nickna
                      height="230"
                    >
                      <el-table-column
                        prop="PersKey"
                        :label="$t('m.persKey')"
                        width="200"
                        align="center"
                      >
                        <template slot-scope="scope">
                          <span v-if="scope.row.isSet">
                            <el-input
                              size="mini"
                              :placeholder="$t('m.plsInput')"
                              v-model="sel['PersKey']"
                            >
                            </el-input>
                          </span>
                          <span v-else>{{ scope.row['PersKey'] }}</span>
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
                              @click="handleParaEdit(scope.row, scope.$index, true)"
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
                              @click="handleParaEdit(scope.row, scope.$index, true)"
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
                              @click="handleParaDelete(scope.row, scope.$index)"
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
                              @click="handleParaEdit(scope.row, scope.$index, false)"
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
        </el-col>
      </el-row>

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
      <el-row>
        <el-col :span="24">
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
                :label="$t('m.userInfo')"
                name="userInfo"
                class="uesr-tab-pane"
              >
                <el-row>
                  <el-col :span="12">
                    <el-form-item
                      :label="$t('m.bname')"
                      prop="Bname"
                    >
                      <el-input
                        v-model="editBname"
                        maxlength="12"
                        show-word-limit
                      ></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item
                      :label="$t('m.nameLast')"
                      prop="NameLast"
                    >
                      <el-input
                        v-model="editform.NameLast"
                        maxlength="40"
                        show-word-limit
                      ></el-input>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="12">
                    <el-form-item
                      :label="$t('m.uflag')"
                      prop="Uflag"
                    >
                      <el-select
                        v-model="editform.Uflag"
                        :placeholder="$t('m.plsSelect')"
                        class="handle-select"
                      >
                        <el-option
                          v-for="item in uflagList"
                          :key="item.code"
                          :label="item.name"
                          :value="item.code"
                        >
                          <span style="float: left; color: #8492a6; font-size: 13px;">{{ item.code }}</span>
                          <span style="float: right;">{{ item.name }}</span>
                        </el-option>
                      </el-select>
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item
                      :label="$t('m.nameFirst')"
                      prop="NameFirst"
                    >
                      <el-input
                        v-model="editform.NameFirst"
                        maxlength="40"
                        show-word-limit
                      ></el-input>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="12">
                    <el-form-item
                      :label="$t('m.mobNumber')"
                      prop="MobNumber"
                    >
                      <el-input v-model="editform.MobNumber"></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item
                      :label="$t('m.smtpAddr')"
                      prop="SmtpAddr"
                    >
                      <el-input v-model="editform.SmtpAddr"></el-input>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="24">
                    <el-form-item
                      :label="$t('m.headerImg')"
                      prop="headerImage"
                    >
                      <el-upload
                        :class="{ hide: hideUpload }"
                        action="#"
                        ref="editUploadImg"
                        list-type="picture-card"
                        accept="image/png,image/jpg,image/jpeg"
                        :on-success="uploadSuccess"
                        :on-error="uploadError"
                        :auto-upload="false"
                        :limit="1"
                        :data="imageData"
                        :on-change="handleChange"
                        :headers="headersObj"
                        :http-request="handleUpload"
                        :file-list="fileList"
                      >
                        <i
                          slot="default"
                          class="el-icon-plus"
                        ></i>
                        <div
                          slot="file"
                          slot-scope="{ file }"
                        >
                          <img
                            class="el-upload-list__item-thumbnail"
                            :src="file.url"
                            alt=""
                          />
                          <span class="el-upload-list__item-actions">
                            <span
                              class="el-upload-list__item-preview"
                              @click="handlePictureCardPreview(file)"
                            >
                              <i class="el-icon-zoom-in"></i>
                            </span>
                            <span
                              class="el-upload-list__item-delete"
                              @click="handleRemove(file)"
                            >
                              <i class="el-icon-delete"></i>
                            </span>
                          </span>
                        </div>
                      </el-upload>
                      <el-dialog
                        append-to-body
                        :visible.sync="imageDialogVisible"
                      >
                        <el-image
                          width="80%"
                          :src="dialogImageUrl"
                          alt=""
                        />
                      </el-dialog>
                    </el-form-item>
                  </el-col>
                </el-row>
              </el-tab-pane>
              <el-tab-pane
                :label="$t('m.userLogin')"
                name="userLogin"
                class="uesr-tab-pane"
              >
                <el-row>
                  <el-col :span="12">
                    <el-form-item
                      :label="$t('m.gltgv')"
                      prop="Gltgv"
                    >
                      <el-date-picker
                        :format="this.$para.datePickerType()"
                        v-model="editform.Gltgv"
                      ></el-date-picker>
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item
                      :label="$t('m.gltgb')"
                      prop="Gltgb"
                    >
                      <el-date-picker
                        :format="this.$para.datePickerType()"
                        v-model="editform.Gltgb"
                      ></el-date-picker>
                    </el-form-item>
                  </el-col>

                </el-row>
                <el-row>
                  <el-col :span="12">
                    <el-form-item
                      :label="$t('m.password')"
                      prop="Password"
                    >
                      <el-input
                        v-model="editform.Password"
                        class="handle-input"
                        type="password"
                      ></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item
                      :label="$t('m.passConfirm')"
                      prop="PassConfirm"
                    >
                      <el-input
                        v-model="editform.PassConfirm"
                        class="handle-input"
                        type="password"
                      ></el-input>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="12">
                    <el-form-item
                      :label="$t('m.theme')"
                      prop="theme"
                    >
                      <el-select
                        v-model="editform.Theme"
                        filterable
                        clearable
                        class="handle-select"
                      >
                        <el-option
                          v-for="item in themeList"
                          :key="item.code"
                          :label="item.name"
                          :value="item.code"
                        >
                          <span style="float: left; color: #8492a6; font-size: 13px;">{{ item.code }}</span>
                          <span style="float: right;">{{ item.name }}</span>
                        </el-option>
                      </el-select>

                    </el-form-item>
                  </el-col>
                </el-row>
              </el-tab-pane>
              <el-tab-pane
                :label="$t('m.defaultPara')"
                name="defaultPara"
                class="uesr-tab-pane"
              >
                <el-row>
                  <el-col :span="12">
                    <el-form-item
                      :label="$t('m.dcpfm')"
                      prop="Dcpfm"
                    >
                      <el-select
                        v-model="editform.Dcpfm"
                        filterable
                        clearable
                        class="handle-select"
                      >
                        <el-option
                          v-for="item in dcpfmList"
                          :key="item.code"
                          :label="item.name"
                          :value="item.code"
                        >
                          <span style="float: left; color: #8492a6; font-size: 13px;">{{ item.code }}</span>
                          <span style="float: right;">{{ item.name }}</span>
                        </el-option>
                      </el-select>
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item
                      :label="$t('m.datfm')"
                      prop="Datfm"
                    >
                      <el-select
                        v-model="editform.Datfm"
                        filterable
                        clearable
                        class="handle-select"
                      >
                        <el-option
                          v-for="item in datfmList"
                          :key="item.code"
                          :label="item.name"
                          :value="item.code"
                        >
                          <span style="float: left; color: #8492a6; font-size: 13px;">{{ item.code }}</span>
                          <span style="float: right;">{{ item.name }}</span>
                        </el-option>
                      </el-select>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="12">
                    <el-form-item
                      :label="$t('m.timefm')"
                      prop="Timefm"
                    >
                      <el-select
                        v-model="editform.Timefm"
                        filterable
                        clearable
                        class="handle-select"
                      >
                        <el-option
                          v-for="item in timefmList"
                          :key="item.code"
                          :label="item.name"
                          :value="item.code"
                        >
                          <span style="float: left; color: #8492a6; font-size: 13px;">{{ item.code }}</span>
                          <span style="float: right;">{{ item.name }}</span>
                        </el-option>
                      </el-select>
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item
                      :label="$t('m.langu')"
                      prop="Langu"
                    >
                      <el-select
                        v-model="editform.Langu"
                        filterable
                        clearable
                        class="handle-select"
                      >
                        <el-option
                          v-for="item in languList"
                          :key="item.code"
                          :label="item.name"
                          :value="item.code"
                        >
                          <span style="float: left; color: #8492a6; font-size: 13px;">{{ item.code }}</span>
                          <span style="float: right;">{{ item.name }}</span>
                        </el-option>
                      </el-select>
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
                :label="$t('m.userMenu')"
                name="userMenu"
                class="uesr-tab-pane"
              >
                <div class="tree mt10">
                  <el-tree
                    ref="editMenuTree"
                    :props="{
                                            label: 'MenuName',
                                            children: 'childMenu'
                                        }"
                    node-key="Menuid"
                    :data="menuList"
                    show-checkbox
                    default-expand-all
                    :default-checked-keys="menuChecked"
                    @check-change="handleCheckChange"
                  >
                  </el-tree>
                </div>
              </el-tab-pane>
              <el-tab-pane
                :label="$t('m.userRole')"
                name="userRole"
                class="uesr-tab-pane"
              >
                <el-row>
                  <el-col :span="24">
                    <div class="handle-box">
                      <el-input
                        v-model="query.AgrName"
                        width="100"
                        :placeholder="$t('m.agrname')"
                        maxlength="30"
                        show-word-limit
                        class="handle-input mr10"
                        @keyup.enter.native="handleRoleSearch"
                      ></el-input>
                      <el-button
                        type="primary"
                        icon="el-icon-plus"
                        class="mr10"
                        @click="handleRoleNew"
                      >{{
                                                $t('m.new')
                                            }}</el-button>
                      <el-button
                        type="primary"
                        icon="el-icon-search"
                        class="mr10"
                        @click="handleRoleSearch"
                      >{{
                                                $t('m.search')
                                            }}</el-button>
                    </div>
                    <el-table
                      size="mini"
                      :data="tabRoleData"
                      border
                      style="width: 100%;"
                      highlight-current-row
                      height="230"
                    >
                      <el-table-column
                        v-for="v in tabRoleCol"
                        v-bind:key="v.id"
                        :prop="v.field"
                        :label="v.title"
                        :width="v.width"
                        align="center"
                      >
                        <template slot-scope="scope">
                          <span v-if="scope.row.isSet">
                            <div v-if="v.field == 'AgrName'">
                              <el-autocomplete
                                v-model="sel[v.field]"
                                :fetch-suggestions="querySearch"
                                :trigger-on-focus="true"
                                :placeholder="$t('m.plsInput')"
                              ></el-autocomplete>
                            </div>
                            <div v-else-if="v.field == 'FromDat'">
                              <el-date-picker
                                :format="$para.datePickerType()"
                                v-model="sel[v.field]"
                                width="100px"
                              ></el-date-picker>
                            </div>
                            <div v-else-if="v.field == 'ToDat'">
                              <el-date-picker
                                :format="$para.datePickerType()"
                                v-model="sel[v.field]"
                              ></el-date-picker>
                            </div>
                            <div v-else>
                              <span>{{ sel[v.field] }}</span>
                            </div>
                          </span>
                          <span v-else>
                            <div v-if="v.field == 'FromDat' || v.field == 'ToDat'">
                              <el-date-picker
                                :format="$para.datePickerType()"
                                v-model="scope.row[v.field]"
                                readonly
                              ></el-date-picker>
                            </div>
                            <div v-else>{{ scope.row[v.field] }}</div>
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
                            v-if="scope.row.isSet"
                          >
                            <el-button
                              size="mini"
                              icon="el-icon-check"
                              type="success"
                              @click="handleRoleEdit(scope.row, scope.$index, true)"
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
                              @click="handleRoleEdit(scope.row, scope.$index, true)"
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
                              size="mini"
                              icon="el-icon-delete"
                              type="danger"
                              @click="handleRoleDelete(scope.row, scope.$index)"
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
                              @click="handleRoleEdit(scope.row, scope.$index, false)"
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
              <el-tab-pane
                :label="$t('m.configPara')"
                name="configPara"
                class="uesr-tab-pane"
              >
                <el-row>
                  <el-col :span="24">
                    <div class="handle-box">
                      <el-input
                        v-model="query.PersKey"
                        width="100"
                        :placeholder="$t('m.persKey')"
                        maxlength="30"
                        show-word-limit
                        class="handle-input mr10"
                        @keyup.enter.native="handleParaSearch"
                      ></el-input>

                      <el-button
                        type="primary"
                        icon="el-icon-plus"
                        class="mr10"
                        @click="handleParaNew"
                      >
                        {{ $t('m.new') }}
                      </el-button>
                      <el-button
                        type="primary"
                        icon="el-icon-search"
                        class="mr10"
                        @click="handleParaSearch"
                      >{{
                                                $t('m.search')
                                            }}</el-button>
                    </div>
                    <el-table
                      size="mini"
                      :data="tabParaData"
                      me="table-header"
                      border
                      style="width: 100%;"
                      highlight-current-row
                      header-cell-class-nickna
                      height="230"
                    >
                      <el-table-column
                        prop="PersKey"
                        :label="$t('m.persKey')"
                        width="200"
                        align="center"
                      >
                        <template slot-scope="scope">
                          <span v-if="scope.row.isSet">
                            <el-input
                              size="mini"
                              :placeholder="$t('m.plsInput')"
                              v-model="sel['PersKey']"
                            >
                            </el-input>
                          </span>
                          <span v-else>{{ scope.row['PersKey'] }}</span>
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
                              @click="handleParaEdit(scope.row, scope.$index, true)"
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
                              @click="handleParaEdit(scope.row, scope.$index, true)"
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
                              @click="handleParaDelete(scope.row, scope.$index)"
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
                              @click="handleParaEdit(scope.row, scope.$index, false)"
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
        </el-col>
      </el-row>

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

export default {
  name: 'user',
  data () {
    return {
      userInfo: JSON.parse(localStorage.getItem('userInfo')),
      query: {
        Bname: '',
        AgrName: '',
        pageNum: 1,
        pageSize: 10,
      },
      tableData: [],
      multipleSelection: [],
      addVisible: false,
      editVisible: false,
      pageTotal: 0,
      editform: {},
      addform: { Bname: '' },
      idx: -1,
      id: -1,
      ruleValidate: {
        Bname: { required: true, validator: this.checkBname, trigger: "blur" },
        Password: { required: true, message: this.$t('m.passwordEmpty'), trigger: "blur" },
        MobNumber: { required: true, validator: rules.phone, trigger: 'change' },
        SmtpAddr: { required: true, validator: rules.email, trigger: 'change' },
        headerImage: { required: true, validator: this.checkHeaderImages, trigger: "blur" },
      },
      activeName: 'userInfo',
      uflagList: [{ code: '0', name: '未锁定' }, { code: '32', name: '被管理员全局锁定' }, { code: '64', name: '被管理员本地锁定' }, { code: '132', name: '因不正确登录（限制条款）而被锁定' }],
      dcpfmList: [{ code: '', name: '1.234.567,89' }, { code: 'X', name: '1,234,567.89' }, { code: 'Y', name: '1 234 567,89' }],
      themeList: [{ code: 'DARK', name: this.$t('m.themeDark') }, { code: 'WHITE', name: this.$t('m.themeWhite') }],
      datfmList: [{ code: '1', name: 'DD.MM.YYYY' }, { code: '2', name: 'MM/DD/YYYY' }, { code: '3', name: 'MM-DD-YYYY' }, { code: '4', name: 'YYYY.MM.DD' }, { code: '5', name: 'YYYY/MM/DD' }, { code: '6', name: 'YYYY-MM-DD' }],
      timefmList: [{ code: '0', name: '24 小时格式（例如：12:05:10） ' }, { code: '1', name: '12 小时格式（例如：12:05:10 PM） ' }, { code: '2', name: '12 小时格式（例如：12:05:10 pm）' }],
      languList: [{ code: 'ZH', name: '中文' }, { code: 'EN', name: 'English' }],
      tabParaData: [],
      tabRoleData: [],
      sel: { AgrName: '', Text: '' },
      tabRoleCol: [{ id: 1, field: 'AgrName', title: '角色名' },
      { id: 2, field: 'Text', title: '角色描述' },
      { id: 3, field: 'FromDat', title: '有效从', width: '230' },
      { id: 4, field: 'ToDat', title: '有效至', width: '230' },],
      roleList: [],
      menuList: [],
      hideUpload: false,
      actionUrl: process.env.VUE_APP_BASE_API + "fileSet",
      importVisible: false,
      imageData: {},
      dialogImageUrl: '',
      imageDialogVisible: false,
      headersObj: {
        'Content-Type': 'image/jpeg',
        'SLUG': JSON.parse(localStorage.getItem('userInfo')).loginName,
        'X-CSRF-Token': JSON.parse(localStorage.getItem('userInfo')).token
      },
      addFileList: [{
        name: "defaulth",
        url: process.env.VUE_APP_BASE_API + `fileSet('default')/$value?cust_token=` + JSON.parse(localStorage.getItem('userInfo')).CustToken + `&bname=` + JSON.parse(localStorage.getItem('userInfo')).loginName
      }],
      fileList: [],
      menuChecked: [],
      limitCount: 1
    }
  },
  computed: {

    queryBname: {
      get: function () {
        return this.query.Bname;
      },
      set: function (val) {
        this.query.Bname = val.toUpperCase();
      }
    },
    addBname: {
      get: function () {
        return this.addform.Bname;
      },
      set: function (val) {
        this.addform.Bname = val.toUpperCase();
      }
    },
    editBname: {
      get: function () {
        return this.editform.Bname;
      },
      set: function (val) {
        this.editform.Bname = val.toUpperCase();
      }
    }
  },
  mounted () {
    this.getData();
  },
  created () {

  },
  methods: {
    getData () {
      let uri = `userReqSet?$filter=Bname eq '` + this.query.Bname + `'&$expand=UserRespNav/menuSet,UserRespNav/userRoleSet,UserRespNav/uparaSet&$skip=` + this.query.pageSize
        + '&$top=' + this.query.pageNum;
      request({
        url: process.env.VUE_APP_BASE_API + uri, method: 'get', data: {}
      }).then(res => {
        this.tableData = res.d.results[0].UserRespNav.results;
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
      uriParam.push('Bname');
      let batchBody = this.$para.batchPack('DELETE', 'userSet', uriParam, this.multipleSelection);
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
            this.$message.success(this.$t('m.deleteSuccess'));
            this.getData();
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
    // 新增
    handleNew () {
      this.addform = {
        Bname: '',
        Uflag: '0',
        Gltgv: new Date(),
        Gltgb: new Date('9999-12-31'),
        Dcpfm: 'X', Datfm: '4',
        Timefm: '0',
        Langu: 'ZH',
        Theme: 'DARK'
      };
      this.editform = {};
      this.tabRoleData = [];
      this.tabParaData = [];
      this.menuChecked = [];
      this.getMenuList();
      this.getRoleList();
      this.addVisible = true;
      this.activeName = 'userInfo';
    },
    saveOne (vForm) {
      this.$refs['addform'].validate((valid, errorObject) => {
        if (valid) {
          if (vForm.Password !== vForm.PassConfirm) {
            this.$message.error(this.$t('m.passwordNotMatch'));
            return;
          }

          for (let i of this.tabRoleData) {
            if (i.isSet) returnthis.$message.warning(this.$t('m.plsSaveCurrent'));
          }
          for (let i of this.tabParaData) {
            if (i.isSet) return this.$message.warning(this.$t('m.plsSaveCurrent'));
          }

          let menus = new Array();
          this.$refs['addMenuTree'].getCheckedNodes().forEach(element => {
            menus.push({
              Bname: vForm.Bname,
              Menuid: element.Menuid,
              Pmenuid: element.Pmenuid,
              Crtusr: this.userInfo.loginName,
            })
          });
          this.$refs['addMenuTree'].getHalfCheckedNodes().forEach(element => {
            menus.push({
              Bname: vForm.Bname,
              Menuid: element.Menuid,
              Pmenuid: element.Pmenuid,
              Crtusr: this.userInfo.loginName,
            })
          });
          let roles = new Array();
          this.tabRoleData.forEach(element => {
            roles.push({
              Bname: vForm.Bname,
              AgrName: element.AgrName,
              Crtusr: this.userInfo.loginName,
              FromDat: this.$para.convertToBackEndDate(element.FromDat),
              ToDat: this.$para.convertToBackEndDate(element.ToDat)
            })
          })
          let paras = new Array();
          this.tabParaData.forEach(element => {
            paras.push({
              Bname: vForm.Bname,
              PersKey: element.PersKey,
              Crtusr: this.userInfo.loginName
            })
          })

          let add = {
            Bname: vForm.Bname,
            Uflag: parseInt(vForm.Uflag),
            NameLast: vForm.NameLast,
            NameFirst: vForm.NameFirst,
            MobNumber: vForm.MobNumber,
            SmtpAddr: vForm.SmtpAddr,
            Gltgv: this.$para.convertToBackEndDate(vForm.Gltgv),
            Gltgb: this.$para.convertToBackEndDate(vForm.Gltgb),
            Dcpfm: vForm.Dcpfm,
            Datfm: vForm.Datfm,
            Timefm: vForm.Timefm,
            Password: vForm.Password,
            Langu: vForm.Langu,
            Crtusr: this.userInfo.loginName,
            Filename: vForm.Bname,
            Operation: 'I',
            menuSet: menus,
            userRoleSet: roles,
            uparaSet: paras,
            Theme: vForm.Theme
          };

          if (this.$refs['addUploadImg'].uploadFiles.length > 0) {
            console.log(this.$refs['addUploadImg'].uploadFiles)
            this.$refs['addUploadImg'].uploadFiles[0].name = vForm.Bname;
            this.$refs['addUploadImg'].submit();
          }
          this.addVisible = false;
          request({
            url: process.env.VUE_APP_BASE_API + 'userSet', method: 'post', data: add,
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
        } else {
          let errStr = ''
          Object.keys(errorObject).forEach(key => {
            errStr = errStr + errorObject[key][0].field + ' : ' + errorObject[key][0].message + '<br/>';
          });
          this.$message({
            dangerouslyUseHTMLString: true,
            message: errStr,
            type: 'error'
          });
        }

      });
    },
    // 编辑操作
    handleEdit (index, row) {
      this.addform = {};
      this.tabRoleData = [];
      this.tabParaData = [];
      this.menuChecked = [];
      this.getMenuList();
      this.getRoleList();
      this.convertToeditForm(row);
      this.translate(this.editform);
      this.editVisible = true;
      this.activeName = 'userInfo';
    },
    saveEdit (vForm) {
      this.$refs['editform'].validate((valid) => {
        if (valid) {
          if (vForm.Password !== vForm.PassConfirm) {
            this.$message.error(this.$t('m.passwordNotMatch'));
            return;
          }
          for (let i of this.tabRoleData) {
            if (i.isSet) returnthis.$message.warning(this.$t('m.plsSaveCurrent'));
          }
          for (let i of this.tabParaData) {
            if (i.isSet) return this.$message.warning(this.$t('m.plsSaveCurrent'));
          }
          let menus = new Array();
          this.$refs['editMenuTree'].getCheckedNodes().forEach(element => {
            menus.push({
              Bname: vForm.Bname,
              Menuid: element.Menuid,
              Pmenuid: element.Pmenuid,
              Crtusr: this.userInfo.loginName,
            })
          });
          this.$refs['editMenuTree'].getHalfCheckedNodes().forEach(element => {
            menus.push({
              Bname: vForm.Bname,
              Menuid: element.Menuid,
              Pmenuid: element.Pmenuid,
              Crtusr: this.userInfo.loginName,
            })
          });
          let roles = new Array();
          this.tabRoleData.forEach(element => {
            roles.push({
              Bname: vForm.Bname,
              AgrName: element.AgrName,
              Crtusr: this.userInfo.loginName,
              FromDat: this.$para.convertToBackEndDate(element.FromDat),
              ToDat: this.$para.convertToBackEndDate(element.ToDat)
            })
          })
          let paras = new Array();
          this.tabParaData.forEach(element => {
            paras.push({
              Bname: vForm.Bname,
              PersKey: element.PersKey,
              Crtusr: this.userInfo.loginName
            })
          })

          let edit = {
            Bname: vForm.Bname,
            Uflag: parseInt(vForm.Uflag),
            NameLast: vForm.NameLast,
            NameFirst: vForm.NameFirst,
            MobNumber: vForm.MobNumber,
            SmtpAddr: vForm.SmtpAddr,
            Gltgv: this.$para.convertToBackEndDate(vForm.Gltgv),
            Gltgb: this.$para.convertToBackEndDate(vForm.Gltgb),
            Dcpfm: vForm.Dcpfm,
            Datfm: vForm.Datfm,
            Timefm: vForm.Timefm,
            Password: vForm.Password,
            Langu: vForm.Langu,
            Chgusr: this.userInfo.loginName,
            Filename: vForm.Bname,
            Operation: 'U',
            menuSet: menus,
            userRoleSet: roles,
            uparaSet: paras,
            Theme: vForm.Theme
          };


          if (this.$refs['editUploadImg'].uploadFiles.length > 0) {
            this.$refs['editUploadImg'].submit();
          }
          this.editVisible = false;

          request({
            url: process.env.VUE_APP_BASE_API + 'userSet', method: 'post', data: edit,
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
      uriParam.push('Bname');

      let batchBody = this.$para.batchPack('DELETE', 'userSet', uriParam, rows);

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
            this.$message.success(this.$t('m.deleteSuccess'));
            this.getData();
          } else {
            this.$message.error(res.msg);
          }
        });
      }).catch(() => {
        this.$message.info(this.$t('m.cancel'));
      });
    },
    async checkBname (rule, value, callback) {
      if (this.editVisible == true) {
        if (value == '' || value == undefined) {
          callback(new Error(this.$t('m.bnameEmpty')));
        }
      } else if (this.addVisible == true) {
        if (value == '' || value == undefined) {
          callback(new Error(this.$t('m.bnameEmpty')));
        } else {
          await request({
            url: process.env.VUE_APP_BASE_API + "userReqSet(Bname='" + value + "')",
            method: 'get'
          }).then(res => {
            if (res.d.Total == 1) {
              callback(new Error(this.$t('m.bnameDuplicate')));
            }
          })
        }
      }
    },
    async checkHeaderImages (rule, value, callback) {
      if (this.editVisible == true) {
        if (this.$refs.editUploadImg.uploadFiles[0] == undefined) {
          callback(new Error(this.$t('m.headerImgEmpty')));
        }
      } else if (this.addVisible == true) {
        if (this.$refs.addUploadImg.uploadFiles[0] == undefined) {
          callback(new Error(this.$t('m.headerImgEmpty')));
        }
      }
    },
    translate (vForm) {
      vForm.Crtdt = this.$para.translateDate('', '', vForm.Crtdt, '');
      vForm.Crttm = this.$para.translateTime('', '', vForm.Crttm, '');
      vForm.Chgdt = this.$para.translateDate('', '', vForm.Chgdt, '');
      vForm.Chgtm = this.$para.translateTime('', '', vForm.Chgtm, '');
    },
    async passConfirm (rule, value, callback) {
      if (this.editVisible == true) {
        if (this.editform.PassConfirm == "" || this.editform.PassConfirm == undefined) {
          callback(new Error("确认密码不能为空"));
        }
      } else if (this.addVisible == true) {
        if (this.addform.PassConfirm == "" || this.addform.PassConfirm == undefined) {
          callback(new Error("确认密码不能为空"));
        }
      }
    },
    getRoleList () {
      this.roleList = [];
      let uri = `rolesReqSet`;
      request({
        url: process.env.VUE_APP_BASE_API + uri, method: 'get', data: {}
      }).then(res => {
        res.d.results.forEach(element => {
          this.roleList.push({
            value: element.AgrName,
            Text: element.Text
          })
        });
      })
    },
    getMenuList () {
      this.menuList = [];
      let uri = `menuSet?$filter=Method eq 'getMenu'`;
      request({
        url: process.env.VUE_APP_BASE_API + uri, method: 'get', data: {}
      }).then(res => {
        this.menuList = JSON.parse(res.d.results[0].Menujson);
      });
    },
    //读取表格数据
    getLocalRoleData () {
      //根据实际情况，自己改下啊 
      this.tabRoleData.map(i => {
        typeof i.id == "undefined" || i.id == 0 ? i.id = generateId.get() : i.id;//模拟后台插入成功后有了id
        i.isSet = false;//给后台返回数据添加`isSet`标识
        i._temporary = true;
        return i;
      });
    },
    //添加账号
    handleRoleNew () {
      for (let i of this.tabRoleData) {
        if (i.isSet) return this.$message.warning(this.$t('m.plsSaveCurrent'));
      }
      let j = { id: 0, "AgrName": "", "Text": "", "FromDat": new Date(), "ToDat": new Date('9999-12-31'), "isSet": true, "_temporary": true };

      this.tabRoleData.push(j);
      this.sel = JSON.parse(JSON.stringify(j));
    },
    //修改
    handleRoleEdit (row, index, cg) {
      //点击修改 判断是否已经保存所有操作
      for (let i of this.tabRoleData) {
        if (i.isSet && i.id != row.id) {
          this.$message.warning(this.$t('m.plsSaveCurrent'));
          return false;
        }
      }
      //是否是取消操作
      if (!cg) {
        if (!this.sel.id) this.tabRoleData.splice(index, 1);
        return row.isSet = !row.isSet;
      }
      //提交数据
      if (row.isSet) {
        if (this.sel.AgrName) {
          //项目是模拟请求操作  自己修改下
          (() => {
            let data = JSON.parse(JSON.stringify(this.sel));
            data['Text'] = this.roleList.filter(this.createFilter(data.AgrName, 'value'))[0]['Text'];
            for (let k in data) row[k] = data[k];

            //然后这边重新读取表格数据
            this.getLocalRoleData();
            row.isSet = false;
          })();
        } else {
          this.$message.error(this.$t('m.agrNameEmpty'));
        }
      } else {
        row.isSet = true;
        this.sel = JSON.parse(JSON.stringify(row));

      }
    },
    handleRoleDelete (row, index) {
      //点击删除 判断是否已经保存所有操作
      for (let i of this.tabRoleData) {
        if (i.isSet && i.id != row.id) {
          this.$message.warning(this.$t('m.plsSaveCurrent'));
          return false;
        }
      }
      //是否是取消操作
      this.tabRoleData.splice(index, 1);
    },
    handleClick () {

    },
    handleParaNew () {
      for (let i of this.tabParaData) {
        if (i.isSet) return this.$message.warning(this.$t('m.plsSaveCurrent'));
      }
      let j = { id: 0, "PersKey": "", "isSet": true, "_temporary": true };
      this.tabParaData.push(j);
      this.sel = JSON.parse(JSON.stringify(j));
    },
    //读取表格数据
    getLocalParaData () {
      //根据实际情况，自己改下啊 
      this.tabParaData.map(i => {
        i.id = generateId.get();//模拟后台插入成功后有了id
        i.isSet = false;//给后台返回数据添加`isSet`标识
        return i;
      });
    },
    handleParaEdit (row, index, cg) {
      //点击修改 判断是否已经保存所有操作
      for (let i of this.tabParaData) {
        if (i.isSet && i.id != row.id) {
          this.$message.warning(this.$t('m.plsSaveCurrent'));
          return false;
        }
      }
      //是否是取消操作
      if (!cg) {
        if (!this.sel.id) this.tabParaData.splice(index, 1);
        return row.isSet = !row.isSet;
      }
      //提交数据
      if (row.isSet) {

        //项目是模拟请求操作  自己修改下
        (() => {
          let data = JSON.parse(JSON.stringify(this.sel));
          for (let k in data) row[k] = data[k];

          //判断当前行参数是否与其他行重复
          for (let i of this.tabParaData) {
            if (!i.isSet && i.PersKey == row.PersKey) {
              this.$message.warning(this.$t('m.paraDuplicate'));
              return false;
            }
          }
          //然后这边重新读取表格数据
          this.getLocalParaData();
          row.isSet = false;
        })();
      } else {
        this.sel = JSON.parse(JSON.stringify(row));
        row.isSet = true;
      }
    },
    handleParaDelete (row, index) {
      //点击删除 判断是否已经保存所有操作
      for (let i of this.tabParaData) {
        if (i.isSet && i.id != row.id) {
          this.$message.warning(this.$t('m.plsSaveCurrent'));
          return false;
        }
      }
      //是否是取消操作
      this.tabParaData.splice(index, 1);
    },
    handleRoleSearch () {

    },
    querySearch (queryString, cb) {
      var roleList = this.roleList;
      var results = queryString ? roleList.filter(this.createFilter(queryString, 'value')) : roleList;
      // call callback function to return suggestions
      cb(results);
    },
    createFilter (queryString, field) {
      return (ele) => {
        return (ele[field].toLowerCase().indexOf(queryString.toLowerCase()) >= 0);
      };
    },
    handleCheckChange (data, checked, indeterminate) {
      console.log(data, checked, indeterminate);
    },
    handleParaSearch () {

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
    handlePictureCardPreview (file) {
      this.dialogImageUrl = file.url;
      this.imageDialogVisible = true;
    },
    handleChange (file, fileList) {
      this.hideUpload = fileList.length >= this.limitCount;
    },
    handleRemove (file) {
      console.log(file);
      if (this.addVisible) {
        this.$refs.addUploadImg.clearFiles();
      };
      if (this.editVisible) {
        this.$refs.editUploadImg.clearFiles();
      }

      //this.hideUpload = fileList.length >= this.limitCount;
    },
    handleUpload () {
      debugger
      let file = new Object();
      let operation = '';
      let bname = '';
      if (this.addVisible) {
        file = this.$refs.addUploadImg.uploadFiles[0];
        operation = 'I';
        bname = this.addform.Bname;
      };
      if (this.editVisible) {
        file = this.$refs.editUploadImg.uploadFiles[0];
        operation = 'U';
        bname = this.editform.Bname;
      }

      request({
        url: process.env.VUE_APP_BASE_API + `fileSet?cust_token=` + this.userInfo.CustToken + `&bname=` + this.userInfo.loginName, method: 'post', data: file.raw,
        headers: {
          'Content-Type': 'image/jpeg',
          'SLUG': bname + '/' + this.userInfo.loginName + '/' + operation,
          'X-CSRF-Token': this.userInfo.token
        }
      }).then(res => {

      })
    },
    convertToeditForm (row) {
      this.fileList = []
      this.editform = Object.assign({ PassConfirm: '' }, row);
      this.editform.Uflag = row.Uflag.toString();
      this.editform.PassConfirm = this.editform.Password;
      this.editform.Gltgv = new Date(this.$para.convertToFrontEndDate(this.editform.Gltgv));
      this.editform.Gltgb = new Date(this.$para.convertToFrontEndDate(this.editform.Gltgb));
      this.fileList.push({
        name: this.editform.Bname,
        url: process.env.VUE_APP_BASE_API + `fileSet('` + this.editform.Bname + `')/$value?cust_token=` + this.userInfo.CustToken + `&bname=` + this.userInfo.loginName || "@/assets/img/share.jpg"
      });
      let childrenMenu = row.menuSet.results.filter(this.createFilter('', 'ExistChild'));
      childrenMenu.forEach(ele => {
        this.menuChecked.push(
          ele.Menuid
        );
      });
      row.userRoleSet.results.forEach(ele => {
        this.tabRoleData.push({
          id: generateId.get(),
          AgrName: ele.AgrName,
          FromDat: new Date(this.$para.convertToFrontEndDate(ele.FromDat)),
          Text: ele.Text,
          ToDat: new Date(this.$para.convertToFrontEndDate(ele.ToDat)),
          isSet: false
        })
      });
      row.uparaSet.results.forEach(ele => {
        this.tabParaData.push(
          {
            PersKey: ele.PersKey,
          }
        )
      });
      this.getLocalParaData();
    }
  }
};
</script>

<style lang="scss" scoped>
.handle-box {
    margin-bottom: 20px;
}

.handle-select {
    width: 100%;
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
.custom-tree-node {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 14px;
    padding-right: 8px;
}
.el-tree {
    min-width: 100%;
    display: inline-block;
}
.tree {
    overflow: auto;
    max-height: 300px;
}
</style>

<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>分类参数</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-alert
        title="注意:只可以给三级分类设置相关的参数"
        type="warning"
        effect="dark"
        :closable="false"
        show-icon
        center
      >
      </el-alert>
      <el-row class="cat_opt">
        <el-col>
          <span><h4>商品分类:</h4></span>
          <el-cascader
            v-model="selectedCateKeys"
            :options="cateList"
            expandTrigger="hover"
            :props="cateProps"
            @change="handleChange"
            placeholder="默认为一级分类,如果需要添加子级分类请选择"
            clearable
            change-on-select
          ></el-cascader>
        </el-col>
      </el-row>
      <el-tabs v-model="activeName" @tab-click="handleTabClick">
        <el-tab-pane label="动态参数" name="many">
          <el-button
            type="primary"
            size="small"
            :disabled="setBtnDisabled"
            @click="addDialogVisible = true"
          >
            添加参数
          </el-button>
          <el-table :data="manyTableData" border stripe>
            <el-table-column type="expand">
              <template slot-scope="scope">
                <el-tag
                  v-for="(item, i) in scope.row.attr_vals"
                  :key="i"
                  closable
                  @close="handleTagClose(i, scope.row)"
                >
                  {{ item }}
                </el-tag>
                <el-input
                  class="input-new-tag"
                  v-if="scope.row.inputVisible"
                  v-model="scope.row.inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)"
                >
                </el-input>
                <el-button
                  v-else
                  class="button-new-tag"
                  size="small"
                  @click="showInput(scope.row)"
                >
                  添加新的分类属性
                </el-button>
              </template>
            </el-table-column>
            <el-table-column type="index"></el-table-column>
            <el-table-column label="参数名称" prop="attr_name">
            </el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button
                  size="mini"
                  type="primary"
                  icon="el-icon-edit"
                  @click="showEditDialog(scope.row.attr_id)"
                >
                  编辑
                </el-button>
                <el-button
                  size="mini"
                  type="danger"
                  icon="el-icon-delete"
                  @click="removeParames(scope.row.attr_id)"
                >
                  删除
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="静态属性" name="only">
          <el-button
            type="primary"
            size="small"
            :disabled="setBtnDisabled"
            @click="addDialogVisible = true"
          >
            添加属性
          </el-button>
          <el-table :data="onylTableData" border stripe>
            <el-table-column type="expand">
              <template slot-scope="scope">
                <el-tag
                  v-for="(item, i) in scope.row.attr_vals"
                  :key="i"
                  closable
                  @close="handleTagClose(i, scope.row)"
                >
                  {{ item }}
                </el-tag>
                <el-input
                  class="input-new-tag"
                  v-if="scope.row.inputVisible"
                  v-model="scope.row.inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)"
                >
                </el-input>
                <el-button
                  v-else
                  class="button-new-tag"
                  size="small"
                  @click="showInput(scope.row)"
                >
                  添加新的分类属性
                </el-button>
              </template>
            </el-table-column>
            <el-table-column type="index"></el-table-column>
            <el-table-column label="属性名称" prop="attr_name">
            </el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button
                  size="mini"
                  type="primary"
                  icon="el-icon-edit"
                  @click="showEditDialog(scope.row.attr_id)"
                >
                  编辑
                </el-button>
                <el-button
                  size="mini"
                  type="danger"
                  icon="el-icon-delete"
                  @click="removeParames(scope.row.attr_id)"
                >
                  删除
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-card>
    <el-dialog
      :title="`添加${setDialogTitle}`"
      :visible.sync="addDialogVisible"
      width="50%"
      @close="addDialogClose"
    >
      <el-form
        ref="addFormRef"
        :model="addFrom"
        :rules="addFromRules"
        label-width="80px"
      >
        <el-form-item :label="setDialogTitle" prop="attr_name">
          <el-input v-model="addFrom.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false"> 取 消 </el-button>
        <el-button type="primary" @click="addParams"> 确 定 </el-button>
      </span>
    </el-dialog>
    <el-dialog
      :title="`修改${setDialogTitle}`"
      :visible.sync="editDialogVisible"
      width="50%"
      @close="editDialogClose"
    >
      <el-form
        ref="editFormRef"
        :model="editFrom"
        :rules="editFromRules"
        label-width="80px"
      >
        <el-form-item :label="setDialogTitle" prop="attr_name">
          <el-input v-model="editFrom.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false"> 取 消 </el-button>
        <el-button type="primary" @click="editParams"> 确 定 </el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data () {
    return {
      cateList: [],
      cateProps: { value: 'cat_id', label: 'cat_name', children: 'children' },
      selectedCateKeys: [],
      activeName: 'many',
      manyTableData: [],
      onylTableData: [],
      addDialogVisible: false,
      addFrom: { attr_name: '' },
      addFromRules: {
        attr_name: [
          {
            required: true,
            message: '请输入参数名',
            trigger: 'blur'
          }
        ]
      },
      editDialogVisible: false,
      editFrom: { attr_name: '' },
      editFromRules: {
        attr_name: [
          {
            required: true,
            message: '请输入参数名',
            trigger: 'blur'
          }
        ]
      }
    }
  },
  created () {
    this.getCateList()
  },
  methods: {
    async getCateList () {
      const { data: res } = await this.$http.get('categories')
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.cateList = res.data
    },
    handleChange () {
      this.getParamsData()
    },
    handleTabClick () {
      console.log(this.activeName)
      this.getParamsData()
    },
    async getParamsData () {
      if (this.selectedCateKeys.length !== 3) {
        this.selectedCateKeys = []
        this.manyTableData = []
        this.onylTableData = []
        return
      }
      const { data: res } = await this.$http.get(
        `categories/${this.cataId}/attributes`,
        {
          params: { sel: this.activeName }
        }
      )
      if (res.meta.status !== 200) return this.$message.error(res.meta.status)
      res.data.forEach((item) => {
        item.attr_vals = item.attr_vals ? item.attr_vals.split(' ') : []
        item.inputVisible = false
        item.inputValue = ''
      })
      if (this.activeName === 'many') {
        this.manyTableData = res.data
      } else {
        this.onylTableData = res.data
      }
      console.log(this.manyTableData)
    },
    addDialogClose () {
      this.$refs.addFormRef.resetFields()
    },
    addParams () {
      this.$refs.addFormRef.validate(async (valid) => {
        if (!valid) return
        const { data: res } = await this.$http.post(
          `categories/${this.cataId}/attributes`,
          {
            attr_name: this.addFrom.attr_name,
            attr_sel: this.activeName
          }
        )
        if (res.meta.status !== 201) return this.$message.error(res.meta.msg)
        this.$message.success(res.meta.msg)
        this.getParamsData()
        this.addDialogVisible = false
      })
    },
    async showEditDialog (attr_id) {
      const {
        data: res
      } = await this.$http.get(
        `categories/${this.cataId}/attributes/${attr_id}`,
        { params: { attr_sel: this.activeName } }
      )
      this.editDialogVisible = true
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.editFrom = res.data
    },
    editDialogClose () {
      this.$refs.editFormRef.resetFields()
    },
    editParams () {
      this.$refs.editFormRef.validate(async (valid) => {
        if (!valid) return
        const { data: res } = await this.$http.put(
          `categories/${this.cataId}/attributes/${this.editFrom.attr_id}`,
          {
            attr_name: this.editFrom.attr_name,
            attr_sel: this.activeName
          }
        )
        if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
        this.$message.success(res.meta.msg)
        this.getParamsData()
        this.editDialogVisible = false
      })
    },
    async removeParames (id) {
      const confirmResult = await this.$confirm(
        '此操作将永久删除该属性参数, 是否继续?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).catch((err) => err)
      if (confirmResult !== 'confirm') return
      const { data: res } = await this.$http.delete(
        `categories/${this.cataId}/attributes/${id}`
      )
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.$message.success(res.meta.msg)
      this.getParamsData()
    },
    async handleInputConfirm (row) {
      if (row.inputValue.trim().length === 0) {
        row.inputValue = ''
        row.inputVisible = false
        return
      }
      row.attr_vals.push(row.inputValue.trim())
      row.inputValue = ''
      row.inputVisible = false
      this.saveTagAttrVals(row)
    },
    showInput (row) {
      row.inputVisible = true
      // $nextTick 方法的作用,就是当页面上的元素被重新渲染之后,才会指定回调函数中的代码
      this.$nextTick((_) => {
        this.$refs.saveTagInput.$refs.input.focus()
      })
    },
    async handleTagClose (i, row) {
      row.attr_vals.splice(i, 1)
      this.saveTagAttrVals(row)
    },
    // 讲相同的请求进行封装
    async saveTagAttrVals (row) {
      const { data: res } = await this.$http.put(
        `categories/${this.cataId}/attributes/${row.attr_id}`,
        {
          attr_name: row.attr_name,
          attr_sel: row.attr_sel,
          attr_vals: row.attr_vals.join(' ')
        }
      )
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.$message.success(res.meta.msg)
    }
  },
  computed: {
    setBtnDisabled () {
      if (this.selectedCateKeys.length !== 3) {
        return true
      }
      return false
    },
    cataId () {
      if (this.selectedCateKeys.length === 3) return this.selectedCateKeys[2]
      return null
    },
    setDialogTitle () {
      if (this.activeName === 'many') {
        return '动态参数'
      }
      return '静态属性'
    }
  }
}
</script>

<style lang="less" scoped>
.cat_opt {
  margin: 15px 0;
}
.el-cascader {
  width: 350px;
}
.el-tag {
  margin: 0 5px;
}
.el-input {
  width: 200px;
}
</style>

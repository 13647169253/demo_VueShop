<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-row>
        <el-col>
          <el-button type="primary" @click="showAddCateDialog">
            添加分类
          </el-button>
        </el-col>
      </el-row>
      <tree-table
        class="treeTable"
        :data="cateList"
        :columns="columns"
        :selection-type="false"
        :expand-type="false"
        show-index
        index-text=""
        border
        :show-row-hover="false"
      >
        <template slot="isOn" slot-scope="scope">
          <i
            class="el-icon-success"
            v-if="scope.row.cat_deleted == false"
            style="color: yellowgreen"
          ></i>
          <i class="el-icon-error" v-else style="color: yellowgreen"></i>
        </template>
        <template slot="order" slot-scope="scope">
          <el-tag size="mini" v-if="scope.row.cat_level == 0">一级</el-tag>
          <el-tag
            size="mini"
            type="success"
            v-else-if="scope.row.cat_level == 1"
          >
            二级
          </el-tag>
          <el-tag size="mini" type="warning" v-else>三级</el-tag>
        </template>
        <template slot="opt" slot-scope="">
          <el-button type="primary" icon="el-icon-edit" size="mini">
            编辑
          </el-button>
          <el-button type="danger" icon="el-icon-delete" size="mini">
            删除
          </el-button>
        </template>
      </tree-table>
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[5, 10, 20]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
      <el-dialog
        title="添加分类"
        :visible.sync="addCataDialogVisible"
        width="50%"
        @close="addCateDialogClose"
      >
        <el-form
          label-width="80px"
          ref="addCateFormRef"
          :model="addCateForm"
          :rules="addCateFormRules"
        >
          <el-form-item label="分类名称" prop="cat_name">
            <el-input v-model="addCateForm.cat_name"></el-input>
          </el-form-item>
          <el-form-item label="父级分类">
            <el-cascader
              v-model="selectedKeys"
              :options="parentCateList"
              expandTrigger="hover"
              :props="cascaderProps"
              @change="parentCateChange"
              placeholder="默认为一级分类,如果需要添加子级分类请选择"
              clearable
              change-on-select
            ></el-cascader>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="addCataDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="addCate">确 定</el-button>
        </span>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      queryInfo: { type: 3, pagenum: 1, pagesize: 5 },
      cateList: [],
      total: 0,
      columns: [
        { label: "分类名称", prop: "cat_name" },
        { label: "是否生效", type: "template", template: "isOn" },
        { label: "排序", type: "template", template: "order" },
        { label: "操作", type: "template", template: "opt" },
      ],
      addCataDialogVisible: false,
      addCateForm: { cat_pid: 0, cat_name: "", cat_level: 0 },
      addCateFormRules: {
        cat_name: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          {
            min: 2,
            max: 10,
            message: "分类名的长度为2~10个字符",
            trigger: "blur",
          },
        ],
      },
      parentCateList: [],
      cascaderProps: {
        value: "cat_id",
        label: "cat_name",
        children: "children",
      },
      selectedKeys: [],
    };
  },
  created() {
    this.getCateList();
  },
  methods: {
    async getCateList() {
      const { data: res } = await this.$http.get("categories", {
        params: this.queryInfo,
      });
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg);
      this.cateList = res.data.result;
      this.total = res.data.total;
    },
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize;
      this.getCateList();
    },
    handleCurrentChange(newPage) {
      this.queryInfo.pagenum = newPage;
      this.getCateList();
    },
    showAddCateDialog() {
      this.getParentCateList();
      this.addCataDialogVisible = true;
    },
    async getParentCateList() {
      const { data: res } = await this.$http.get("categories", {
        params: { type: 2 },
      });
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg);
      this.parentCateList = res.data;
    },
    parentCateChange() {
      if (this.selectedKeys.length > 0) {
        this.addCateForm.cat_pid = this.selectedKeys[
          this.selectedKeys.length - 1
        ];
        this.addCateForm.cat_level = this.selectedKeys.length;
      } else {
        this.addCateForm.cat_pid = 0;
        this.addCateForm.cat_level = 0;
      }
    },
    addCate() {
      this.$refs.addCateFormRef.validate(async (valid) => {
        if (!valid) return;
        const { data: res } = await this.$http.post(
          "categories",
          this.addCateForm
        );
        if (res.meta.status !== 201) {
          return this.$message.error(res.meta.msg);
        }
        this.$message.success(res.meta.msg);
        this.getCateList();
        this.addCataDialogVisible = false;
        console.log(res);
      });
    },
    addCateDialogClose() {
      this.$refs.addCateFormRef.resetFields();
      this.selectedKeys = [];
      this.addCateForm.cat_pid = 0;
      this.addCateForm.cat_level = 0;
    },
  },
};
</script>

<style lang="less" scoped>
i {
  font-size: 16px;
}
.treeTable {
  margin-top: 15px;
  font-size: 14px !important;
}
.el-cascader {
  width: 100%;
}
</style>
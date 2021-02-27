<template>
  <div class="user-page">
    <el-row>
      <el-col :span="24">
        <div class="table-tool">
          <el-button type="primary" plain @click="addGrade">新增班级</el-button>
        </div>
        <el-table
          :data="tableData"
          border
          :default-sort="{ prop: 'week', order: 'ascending' }"
        >
          <el-table-column prop="id" label="id" width="50" />
          <el-table-column prop="gradeName" label="班级" width="200">
            <!-- <template scope="scope">
              <span class="link-type" @click="showMemberDetail(scope.row)">{{ scope.row.name }}</span>
            </template>-->
          </el-table-column>
          <el-table-column sortable prop="week" label="星期" width="100" />
          <el-table-column
            sortable
            prop="startTime"
            label="开始时间"
            width="200"
          />
          <el-table-column prop="endTime" label="结束时间" width="200" />
          <el-table-column prop="members" label="学生">
            <template scope="scope">
              <el-tag
                class="tag"
                v-for="m in scope.row.members"
                :key="m.id"
                closable
                @close="handleClose(scope.row, m)"
                >{{ m.name }}</el-tag
              >
              <i
                class="el-icon-edit bind-members"
                @click="bindMembers(scope.row)"
              ></i>
            </template>
          </el-table-column>
          <el-table-column align="center" label="操作" width="150">
            <template scope="scope">
              <el-button
                size="small"
                type="success"
                @click="editGrade(scope.row)"
                >编辑</el-button
              >
              <el-button size="small" @click="delGrade(scope.row)"
                >删除</el-button
              >
            </template>
          </el-table-column>
        </el-table>
      </el-col>
    </el-row>
    <add-grade
      :isShow.sync="isShowDialog"
      :gradeId="gradeId"
      :gradeDetail="gradeDetail"
      :isEdit.sync="isEdit"
      @closeDialog="closeAddDialog"
    ></add-grade>
    <bind-members
      :isShow.sync="isShowBindMembers"
      :gradeId="bindGradeId"
      @closeDialog="closeAddDialog"
    ></bind-members>
  </div>
</template>
<script>
import { param, parseTime } from "@/utils";
import AddGrade from "@/new-views/members/grade/dialog/AddGrade";
import BindMembers from "@/new-views/members/grade/dialog/BindMembers";

export default {
  components: {
    AddGrade,
    BindMembers
  },
  data() {
    return {
      isEdit: false,
      isShowDialog: false,
      isShowBindMembers: false,
      loading: false,
      gradeDetail: {},
      gradeId: "",
      bindGradeId: "",
      tableData: [],
      pagination: {
        total: 0,
        page: 1,
        limit: 10
      }
    };
  },
  created() {
    this.init();
  },
  methods: {
    bindMembers(row) {
      // 需要绑定的班级
      this.bindGradeId = row.id;
      this.isShowBindMembers = true;
    },
    addGrade() {
      this.isEdit = false;
      this.isShowDialog = true;
    },
    init() {
      const params = {
        page: this.pagination.page,
        limit: this.pagination.limit
      };
      this.$store.dispatch("user/getGrades", params).then(response => {
        const { count, data } = response;
        this.tableData = data.map(item => {
          return {
            id: item.id,
            week: item.week,
            gradeName: item.grade_name,
            startTime: item.start_time,
            endTime: item.end_time,
            createTime: item.create_time,
            members: item.members,
            supports: []
          };
        });
        this.pagination.total = count;
      });
    },
    editGrade(row) {
      this.isEdit = true;
      this.isShowDialog = true;
      this.gradeId = row.id;
      this.gradeDetail = row;
    },
    delGrade(row) {
      this.$confirm("确定要删除这个班级吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          return this.$store.dispatch("user/deleteGrade", row.id);
        })
        .then(response => {
          this.init();
        });
    },
    handleClose(row, member) {
      const gradeId = row.id;
      const memberIds = member.id;
      this.$store
        .dispatch("user/unBindMembers", {
          gradeId,
          memberIds
        })
        .then(response => {
          this.pagination.page = 1;
          this.init();
        });
    },
    closeAddDialog(event) {
      this.isShowDialog = false;
      this.isShowBindMembers = false;
      this.init();
    }
  }
};
</script>
<style lang="scss" scoped>
.user-page {
  padding: 20px;
  .table-tool {
    height: 50px;
  }

  .tag {
    margin: 0 8px 8px 0;
  }

  .bind-members {
    cursor: pointer;
  }
}
</style>

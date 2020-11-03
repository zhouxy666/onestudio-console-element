<template>
  <div class="user-page">
    <el-row>
      <el-col :span="24">
        <div class="table-tool">
          <el-button type="primary" plain @click="addMember"
            >新增会员</el-button
          >
          <el-input
            class="searchInput"
            v-model="searchContent"
            placeholder="请输入内容"
          >
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="searchMember"
            ></el-button>
          </el-input>
        </div>
        <el-table :data="tableData" border>
          <el-table-column prop="id" label="id" width="150" />
          <el-table-column label="姓名" width="200">
            <template scope="scope">
              <span class="link-type" @click="showMemberDetail(scope.row)">{{
                scope.row.name
              }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="nickname" label="昵称" width="200" />
          <el-table-column
            prop="gender"
            label="性别"
            :formatter="formatGender"
            width="150"
          />
          <el-table-column prop="age" label="年龄" width="200" />
          <el-table-column label="创建时间" width="250">
            <template scope="scope">
              <span>{{
                scope.row.createTime | parseTime("{y}-{m}-{d} {h}:{i}")
              }}</span>
            </template>
          </el-table-column>
          <el-table-column label="班级">
            <template scope="scope">
              <el-tag
                class="tag"
                v-for="grade in scope.row.grades"
                :key="grade.id"
                closable
                @close="handleClose(scope.row, grade)"
                >{{ grade.grade_name }}</el-tag
              >
              <i
                class="el-icon-edit bind-members"
                @click="bindGrades(scope.row)"
              ></i>
            </template>
          </el-table-column>
          <el-table-column align="center" label="操作" width="150">
            <template scope="scope">
              <el-button
                size="small"
                type="success"
                @click="editMember(scope.row)"
                >编辑</el-button
              >
              <el-button size="small" @click="delMember(scope.row)"
                >删除</el-button
              >
            </template>
          </el-table-column>
        </el-table>
        <el-pagination
          :current-page.sync="pagination.page"
          layout="total, sizes, prev, pager, next"
          :page-sizes="[10, 20, 30, 50]"
          :page-size.sync="pagination.limit"
          :total="pagination.total"
          @current-change="handleCurrentChange"
          @size-change="handleSizeChange"
        />
        <add-user
          :is-edit.sync="isEdit"
          :is-show.sync="isShowDialog"
          :member-detail="memberDetail"
          :member-id="memberId"
          @closeDialog="closeAddDialog"
        ></add-user>
        <bind-grades
          :isShow.sync="isShowBindGrades"
          :memberId="bindMemberId"
          @closeDialog="closeAddDialog"
        ></bind-grades>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import AddUser from "@/new-views/members/user/dialog/AddUser";
import BindGrades from "@/new-views/members/user/dialog/BindGrades";
import { parseTime } from "@/utils";
export default {
  name: "UserPage",
  components: {
    AddUser,
    BindGrades,
  },
  data() {
    return {
      tableData: [],
      searchContent: "",
      isEdit: false,
      isShowDialog: false,
      isShowBindGrades: false,
      bindMemberId: "",
      memberDetail: {},
      memberId: "",
      pagination: {
        total: 0,
        page: 1,
        limit: 10,
      },
    };
  },
  computed: {},
  created() {
    this.init();
  },
  methods: {
    init() {
      const params = {
        page: this.pagination.page,
        limit: this.pagination.limit,
      };
      this.$store.dispatch("user/getMembers", params).then((response) => {
        const { count, data } = response;
        this.tableData = this.genSrcData(data);
        this.pagination.total = count;
      });
    },
    genSrcData(data = []) {
      return data.map((item) => {
        return {
          id: item.id,
          name: item.name,
          nickname: item.nickname,
          gender: item.gender,
          age: item.age,
          mobile: item.mobile,
          createTime: item.create_time,
          grades: item.grades,
        };
      });
    },
    editMember(row) {
      // 设置展示的详情
      this.memberDetail = {
        id: row.id,
        name: row.name,
        nickname: row.nickname,
        gender: row.gender,
        age: row.age,
        mobile: row.mobile,
      };
      this.memberId = row.id;
      this.isEdit = true;
      this.isShowDialog = true;
    },
    delMember(row) {
      this.$confirm("确定要删除这个学生吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          return this.$store.dispatch("user/deleteMember", row.id);
        })
        .then((response) => {
          this.$message.success("删除成功");
          this.pagination.page = 1;
          this.init();
        });
    },
    addMember() {
      this.isEdit = false;
      this.memberId = "";
      this.isShowDialog = true;
    },
    closeAddDialog(event) {
      this.isShowDialog = false;
      this.isShowBindGrades = false;
      this.init();
    },
    formatGender(row) {
      const val = Number(row.gender);
      return val === 1 ? "男" : val === 2 ? "女" : "";
    },
    handleCurrentChange(event) {
      const page = event;
      this.search(page).then(() => {
        this.pagination.page = page;
      });
    },
    handleSizeChange(event) {
      const limit = event;
      this.search(this.pagination.page, limit).then(() => {
        this.pagination.limit = limit;
      });
    },
    showMemberDetail(row) {
      const memberId = row.id;
      console.log("查看该会员的详情", memberId);
    },
    bindGrades(row) {
      // 需要绑定的班级
      this.bindMemberId = row.id;
      this.isShowBindGrades = true;
    },
    handleClose(row, grade) {
      const memberId = row.id;
      const gradeIds = grade.id;
      this.$store
        .dispatch("user/unBindGrades", {
          memberId,
          gradeIds,
        })
        .then((response) => {
          this.init();
        });
    },
    searchMember() {
      this.search().then(() => {
        this.pagination.page = 1;
        this.pagination.limit = 10;
      });
    },
    search(page = 1, limit = 10) {
      return new Promise((resolve, reject) => {
        const val = this.searchContent.trim();
        this.$store
          .dispatch("user/searchMember", {
            name: val,
            page,
            limit,
          })
          .then((response) => {
            const { data, count } = response;
            this.tableData = this.genSrcData(data);
            this.pagination.total = count;
            return resolve();
          });
      });
    },
  },
};
</script>

<style lang="scss">
.user-page {
  padding: 20px;
  .searchInput {
    width: 200px;
    float: right;
  }
  .table-tool {
    height: 50px;
  }
  .tag {
    margin-right: 8px;
  }
  .bind-members {
    cursor: pointer;
  }
}
</style>

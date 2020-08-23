<template>
  <div class="user-page">
    <el-row>
      <el-col :span="24">
        <div class="table-tool">
          <el-button type="primary" plain @click="addMember">新增会员</el-button>
        </div>
        <el-table :data="tableData" border>
          <el-table-column label="姓名">
            <template scope="scope">
              <span class="link-type" @click="showMemberDetail(scope.row)">{{scope.row.name}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="nickname" label="昵称"></el-table-column>
          <el-table-column prop="gender" label="性别" :formatter="formatGender"></el-table-column>
          <el-table-column prop="age" label="年龄"></el-table-column>
          <el-table-column label="创建时间">
            <template scope="scope">
              <span>{{scope.row.createTime | parseTime('{y}-{m}-{d} {h}:{i}')}}</span>
            </template>
          </el-table-column>
          <el-table-column align="center" label="操作" width="150">
            <template scope="scope">
              <el-button size="small" type="success" @click="editMember(scope.row)">编辑</el-button>
              <el-button size="small" @click="delMember(scope.row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination
          @current-change="handleCurrentChange"
          @size-change="handleSizeChange"
          :current-page.sync="pagination.page"
          layout="total, sizes, prev, pager, next"
          :page-sizes="[10,20,30, 50]"
          :page-size.sync="pagination.limit"
          :total="pagination.total"
        ></el-pagination>
        <add-user
          :isEdit.sync="isEdit"
          :isShow.sync="isShowAddUserDialog"
          :memberDetail="memberDetail"
          @closeDialog="closeAddDialog"
        ></add-user>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import AddUser from "@/new-views/members/user/add/AddUser";
import { parseTime } from "@/utils";
export default {
  name: "userPage",
  components: {
    AddUser,
  },
  data() {
    return {
      tableData: [],
      isEdit: false,
      isShowAddUserDialog: false,
      memberDetail: {},
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
      let params = {
        page: this.pagination.page,
        limit: this.pagination.limit,
      };
      this.$store.dispatch("user/getMembers", params).then((response) => {
        let { count, data } = response;
        this.tableData = data.map((item) => {
          return {
            id: item.id,
            name: item.name,
            nickname: item.nickname,
            gender: item.gender,
            age: item.age,
            mobile: item.mobile,
            createTime: item.create_time,
          };
        });
        this.pagination.total = count;
      });
    },
    editMember(row) {
      let memberId = row.id;
      // 设置展示的详情
      this.memberDetail = {
        id: row.id,
        name: row.name,
        nickname: row.nickname,
        gender: row.gender,
        age: row.age,
        mobile: row.mobile,
      };
      this.isEdit = true;
      this.isShowAddUserDialog = true;
    },
    delMember(row) {
      let memberId = row.id;
      this.$alert("确定要删除吗", "删除", {
        confirmButtonText: "确定",
        callback: (action) => {
          this.$store.dispatch("user/deleteMember", memberId).then((data) => {
            this.$message.success("删除成功");
            this.pagination.page = 1;
            this.init();
          });
        },
      });
    },
    addMember() {
      this.isEdit = false;
      this.isShowAddUserDialog = true;
    },
    closeAddDialog(event) {
      this.isShowAddUserDialog = false;
      this.init();
    },
    formatGender(row) {
      let val = Number(row.gender);
      return val === 1 ? "男" : val === 2 ? "女" : "";
    },
    handleCurrentChange(event) {
      this.init();
    },
    handleSizeChange(event) {
      this.init();
    },
    showMemberDetail(row) {
      let memberId = row.id;
      console.log("查看该会员的详情", memberId);
    },
  },
};
</script>

<style lang="scss">
.user-page {
  padding: 20px;
  .table-tool {
    height: 50px;
  }
}
</style>

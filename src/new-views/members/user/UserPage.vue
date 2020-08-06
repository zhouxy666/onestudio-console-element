<template>
  <div class="user-page">
    <el-row>
      <el-col :span="24">
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item :to="{ path: '/overview' }">总览</el-breadcrumb-item>
          <el-breadcrumb-item>会员目录</el-breadcrumb-item>
        </el-breadcrumb>
      </el-col>
    </el-row>

    <el-row>
      <el-col :span="24">
        <div class="table-tool">
          <el-button type="primary" plain @click="showAddDialog">新增会员</el-button>
        </div>
        <el-table
          :data="tableData"
          border>
          <el-table-column
            prop="name"
            label="姓名">
          </el-table-column>
          <el-table-column
            prop="email"
            label="电子邮件">
          </el-table-column>
          <el-table-column
            prop="nickname"
            label="昵称">
          </el-table-column>
          <el-table-column
            prop="gender"
            label="性别">
          </el-table-column>
          <el-table-column
            prop="age"
            label="年龄">
          </el-table-column>
          <el-table-column
            prop="leftLessons"
            label="剩余课时">
          </el-table-column>
          <el-table-column
            prop="vipLevel"
            label="会员等级">
          </el-table-column>
          <el-table-column
            prop="auth"
            label="管理员">
          </el-table-column>
          <el-table-column
            prop="birthday"
            label="出生年月">
          </el-table-column>
          <el-table-column
            prop="phone"
            label="电话">
          </el-table-column>
          <el-table-column
            prop="address"
            label="住址">
          </el-table-column>
        </el-table>
        <!--<add-user :isShow="isShowAddUserDialog" @closeDialog="closeAddDialog"></add-user>-->
      </el-col>
    </el-row>
  </div>
</template>

<script>
  //  import AddUser from '@/new-views/userManage/user/add/AddUser'
  export default {
    name: 'userPage',
    components: {
//      AddUser
    },
    data() {
      return {
        tableData: [
          {
            name: '刘思杰',
            email: '',
            nickname: '1',
            gender: '2',
            age: '3',
            leftLessons: '4',
            vipLevel: '5',
            birthday: '6',
            phone: '7',
            address: '8'
          }
        ],
        isShowAddUserDialog: false
      }
    },
    methods: {
      showAddDialog(){
        this.isShowAddUserDialog = true
      },
      closeAddDialog(){
        this.isShowAddUserDialog = false
      }
    }
  }
</script>

<style lang="scss">
  .user-page {
    .table-tool {
      height: 50px;
      padding-top: 20px;
    }
  }
</style>

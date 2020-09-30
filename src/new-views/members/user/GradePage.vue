<template>
  <div class="user-page">
    <el-row>
      <el-col :span="24">
        <div class="table-tool">
          <el-button type="primary" plain @click="addGrade">新增班级</el-button>
        </div>
        <el-table :data="tableData" border>
          <el-table-column prop="id" label="id" />
          <el-table-column prop="gradeName" label="班级">
            <!-- <template scope="scope">
              <span class="link-type" @click="showMemberDetail(scope.row)">{{ scope.row.name }}</span>
            </template>-->
          </el-table-column>
          <el-table-column prop="startTime" label="开始时间" />
          <el-table-column prop="endTime" label="结束时间" />
          <el-table-column label="创建时间">
            <template scope="scope">
              <span>{{ scope.row.createTime | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
            </template>
          </el-table-column>
          <el-table-column align="center" label="操作" width="150">
            <template scope="scope">
              <el-button size="small" type="success" @click="editGrade(scope.row)">编辑</el-button>
              <el-button size="small" @click="delGrade(scope.row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-col>
    </el-row>
  </div>
</template>
<script>
import { parseTime } from '@/utils'

export default {
  data() {
    return {
      isEdit: false,
      isShowDialog: false,
      gradeDetail: {},
      gradeId: '',
      tableData: [],
      pagination: {
        total: 0,
        page: 1,
        limit: 10
      }
    }
  },
  created() {
    this.init()
  },
  methods: {
    addGrade() {
      alert(1)
    },
    init() {
      const params = {
        page: this.pagination.page,
        limit: this.pagination.limit
      }
      this.$store.dispatch('user/getGrades', params).then((response) => {
        const { count, data } = response
        this.tableData = data.map((item) => {
          return {
            id: item.id,
            gradeName: item.grade_name,
            startTime: item.start_time,
            endTime: item.end_time,
            createTime: item.create_time
          }
        })
        this.pagination.total = count
      })
    },
    editGrade(row) {
      console.log(row)
    },
    delGrade(row) {
      console.log(row)
    }
  }
}
</script>
<style lang="scss" scoped>
.user-page {
  padding: 20px;
  .table-tool {
    height: 50px;
  }
}
</style>

<template>
  <div class="courseware-wrapper">
    <div class="table-tool">
      <el-button type="primary" plain @click="addCourseware"
        >创建课件</el-button
      >
    </div>
    <el-row>
      <el-col :span="24">
        <el-table :data="tableData" border>
          <el-table-column prop="id" label="id" />
          <el-table-column prop="name" label="名称" />
          <el-table-column prop="desc" label="描述" />
          <el-table-column prop="pic" label="图片" />
          <el-table-column prop="ageGroup.desc" label="年龄段" />
          <el-table-column label="操作">
            <template scope="scope">
              <el-button size="mini" type="success" @click="edit(scope.row)"
                >编辑</el-button
              >
              <el-button size="mini" @click="del(scope.row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-col>
    </el-row>
    <add-courseware
      :isShow.sync="isShowDialog"
      :coursewareId="coursewareId"
      :coursewareDetail="coursewareDetail"
      @closeDialog="closeAddDialog"
    ></add-courseware>
  </div>
</template>

<script>
import {
  reactive,
  ref,
  computed,
  watch,
  onMounted
} from "@vue/composition-api";
import AddCourseware from "./dialog/AddCourseware.vue";
export default {
  components: {
    AddCourseware
  },
  setup(props, context) {
    const $store = context.parent.$store;
    const message = ref("this is courseware page");
    const tableData = ref([]);
    const isShowDialog = ref(false);
    const coursewareDetail = ref({});
    const coursewareId = ref("");

    onMounted(() => {
      init();
    });

    // 请求数据
    function init() {
      $store.dispatch("user/getCourseware").then(response => {
        const { data } = response;
        tableData.value = data.map(item => {
          return {
            id: item.id,
            name: item.name,
            desc: item.desc,
            pic: item.pic,
            ageGroup: item.age_group
          };
        });
      });
    }

    function edit(event) {
      // 课件Id
      coursewareId.value = event.id;
      // 课件的详细数据
      coursewareDetail.value = event;
      isShowDialog.value = true;
    }

    function del(event) {
      alert(event);
    }

    function addCourseware() {
      isShowDialog.value = true;
    }

    function closeAddDialog() {
      isShowDialog.value = false;
      init();
    }

    return {
      message,
      tableData,
      isShowDialog,
      coursewareDetail,
      coursewareId,
      edit,
      del,
      addCourseware,
      closeAddDialog
    };
  }
};
</script>
<style lang="scss" scoped>
.courseware-wrapper {
  padding: 20px;
  .table-tool {
    height: 50px;
  }
}
</style>

<template>
  <div class="bind-members-wrapper">
    <el-dialog :visible="isShow" @close="close" width="40%">
      <div slot="title">
        <div class="el-icon-share title-icon">
          <span class="title-font">分配班级</span>
        </div>
      </div>
      <div class="bind-content">
        <span class="label">分配班级</span>
        <el-select
          class="bind-input"
          v-model="state.selectGrades"
          multiple
          filterable
          remote
          reserve-keyword
          placeholder="输入班级"
          :remote-method="queryGrades"
          :loading="loading"
        >
          <el-option
            v-for="sup in state.supportGrades"
            :key="sup.value"
            :label="sup.label"
            :value="sup.value"
          >
          </el-option>
        </el-select>
      </div>
      <div slot="footer">
        <el-button @click="close">取 消</el-button>
        <el-button type="primary" @click="submit">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { reactive, ref, onMounted, watch } from "@vue/composition-api";
export default {
  props: {
    isShow: Boolean,
    memberId: String | Number,
  },
  setup(props, context) {
    const loading = ref(false);
    const state = reactive({
      selectGrades: [],
      supportGrades: [],
    });
    watch(
      () => props.memberId,
      (newGradeId) => {
        state.selectGrades = [];
        state.supportGrades = [];
      }
    );

    function close() {
      context.emit("closeDialog");
    }

    function submit() {
      this.$store
        .dispatch("user/bindGrades", {
          memberId: props.memberId,
          gradeIds: state.selectGrades.join(","),
        })
        .then((response) => {
          close();
          this.$message({
            message: "分班成功",
            type: "success",
          });
        });
    }

    function queryGrades() {
      this.$store.dispatch("user/getGrades").then((response) => {
        const { count, data } = response;
        state.supportGrades = data.map((item) => {
          return {
            value: item.id,
            label: item.grade_name,
          };
        });
      });
    }

    return {
      loading,
      state,
      close,
      submit,
      queryGrades,
    };
  },
};
</script>
<style lang="scss">
.bind-members-wrapper {
  .bind-content {
    .label {
      margin-right: 8px;
    }
    .bind-input {
      width: calc(100% - 200px);
    }
  }
  .title-icon {
    color: #409eff;
    font-size: 18px;

    .title-font {
      padding-left: 10px;
      color: #575249;
      font-size: 16px;
      font-weight: bold;
    }
  }
}
</style>
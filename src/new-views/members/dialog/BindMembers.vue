<template>
  <div class="bind-members-wrapper">
    <el-dialog :visible="isShow" @close="close" width="40%">
      <div slot="title">
        <div class="el-icon-share title-icon">
          <span class="title-font">添加学生</span>
        </div>
      </div>
      <div class="bind-content">
        <span class="label">添加学生</span>
        <el-select
          class="bind-input"
          v-model="state.selectMembers"
          multiple
          filterable
          remote
          reserve-keyword
          placeholder="输入学生姓名"
          :remote-method="queryMembers"
          :loading="loading"
        >
          <el-option
            v-for="sup in state.supportMembers"
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
    gradeId: String | Number,
  },
  setup(props, context) {
    const loading = ref(false);
    const state = reactive({
      selectMembers: [],
      supportMembers: [],
    });
    watch(
      () => props.gradeId,
      (newGradeId) => {
        state.selectMembers = [];
        state.supportMembers = [];
      }
    );

    function close() {
      context.emit("closeDialog");
    }

    function submit() {
      this.$store
        .dispatch("user/bindMembers", {
          gradeId: props.gradeId,
          memberIds: state.selectMembers.join(","),
        })
        .then((response) => {
          close();
          this.$message({
            message: "添加成功",
            type: "success",
          });
        });
    }

    function queryMembers(content) {
      console.log(content);
      this.$store
        .dispatch("user/searchMember", {
          name: content,
        })
        .then((response) => {
          const { count, data } = response;
          state.supportMembers = data.map((item) => {
            return {
              value: item.id,
              label: item.name,
            };
          });
        });
    }

    return {
      loading,
      state,
      close,
      submit,
      queryMembers,
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
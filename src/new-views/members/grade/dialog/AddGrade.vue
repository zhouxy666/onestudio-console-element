<template>
  <div class="add-user-wrapper">
    <el-dialog
      :visible="isShow"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      top="8vh"
      @close="close"
    >
      <div slot="title">
        <div class="el-icon-user-solid title-icon">
          <span class="title-font">添加会员</span>
        </div>
      </div>
      <div class="user-form">
        <el-form
          ref="grade-form"
          :model="form"
          :label-width="'80px'"
          :rules="rules"
        >
          <el-form-item prop="gradeName" label="班级">
            <el-input v-model="form.gradeName" />
          </el-form-item>

          <el-form-item prop="week" label="星期">
            <el-select v-model="form.week" placeholder="请选择">
              <el-option
                v-for="w in CONSTANT.WEEKS"
                v-bind:key="w"
                :label="getWeekLabel(w)"
                :value="w"
              ></el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="起始时间" prop="startTime">
            <el-time-select
              placeholder="起始时间"
              v-model="form.startTime"
              :picker-options="{
                start: CONSTANT.START_TIME,
                step: CONSTANT.STEP,
                end: CONSTANT.END_TIME,
              }"
            >
            </el-time-select>
          </el-form-item>
          <el-form-item label="结束时间" prop="endTime">
            <el-time-select
              placeholder="结束时间"
              v-model="form.endTime"
              :picker-options="{
                start: CONSTANT.START_TIME,
                step: CONSTANT.STEP,
                end: CONSTANT.END_TIME,
                minTime: form.startTime,
              }"
            >
            </el-time-select>
          </el-form-item>
        </el-form>
      </div>
      <div slot="footer" class="footer">
        <el-button @click="close">取 消</el-button>
        <el-button type="primary" @click="submit">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  reactive,
  ref,
  toRefs,
  computed,
  isRef,
  watch,
  onMounted,
} from "@vue/composition-api";
export default {
  props: {
    isShow: Boolean,
    isEdit: Boolean,
    gradeId: String | Number,
    gradeDetail: {
      type: Object,
      default: {},
    },
  },
  setup(props, context) {
    const $store = context.parent.$store;
    const CONSTANT = reactive({
      WEEKS: ["1", "2", "3", "4", "5", "6", "7"],
      START_TIME: "08:00",
      STEP: "00:15",
      END_TIME: "20:00",
    });

    const form = reactive({
      id: "",
      gradeName: "",
      week: "1",
      startTime: "",
      endTime: "",
    });

    const rules = reactive({
      gradeName: [
        { required: true, message: "请输入班级名称", trigger: "blur" },
      ],
      week: [
        {
          required: true,
          message: "请输入星期",
          trigger: "blur",
        },
      ],
      startTime: [
        {
          required: true,
          message: "请输入上课时间",
          trigger: "blur",
        },
        {
          message: "上课时间要小于下课时间",
          trigger: "blur",
          validator: function (rule, startTime, callback) {
            if (startTime < form.endTime) {
              callback();
            } else {
              callback(rule);
            }
          },
        },
      ],
      endTime: [
        {
          required: true,
          message: "请输入下课时间",
          trigger: "blur",
        },
        {
          message: "下课时间要大于上课时间",
          trigger: "blur",
          validator: function (rule, endTime, callback) {
            if (endTime > form.startTime) {
              callback();
            } else {
              callback(rule);
            }
          },
        },
      ],
    });

    onMounted(() => {
      console.log(props);
      console.log(context);
    });

    watch(
      () => props.gradeId,
      (gradeId) => {
        console.log("gradeId", gradeId);
        console.log("isEdit", props.isEdit);
        $store.dispatch("user/getGrade", gradeId).then((data) => {
          const detail = data.data;
          form.id = detail.id;
          form.gradeName = detail.grade_name;
          form.week = detail.week;
          form.startTime = detail.start_time;
          form.endTime = detail.end_time;
        });
      }
    );

    function getWeekLabel(week) {
      return `星期${week}`;
    }


    function submit() {
      console.log("submit submit");
      console.log(context);
      const actionUrl = this.isEdit ? `user/updateGrade` : `user/createGrade`;
      context.refs["grade-form"].validate((valid, event) => {
        if (valid) {
          // 发送请求
          const params = {
            grade_id: form.id,
            grade_name: form.gradeName,
            week: form.week,
            start_time: form.startTime,
            end_time: form.endTime,
          };
          $store.dispatch(actionUrl, params).then((data) => {
            let message = "新班级创建成功";
            if (this.isEdit) {
              message = "更新成功";
            }
            this.$message.success(message);
            this.close();
          });
        }
      });
    }

    const close = () => {
      context.emit("closeDialog");
    };

    return {
      CONSTANT,
      form,
      rules,
      getWeekLabel,
      close,
      submit,
    };
  },
};
</script>

<style lang="scss">
.add-user-wrapper {
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

  .el-form-item {
    width: 600px;
  }

  .footer {
    text-align: center;
  }
}
</style>
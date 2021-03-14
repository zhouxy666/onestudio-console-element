<template>
  <div class="add-courseware-wrapper">
    <el-dialog :visible="isShow" top="8vh">
      <div slot="title">
        <div class="el-icon-user-solid title-icon">
          <span class="title-font">添加课件</span>
        </div>
      </div>
      <div class="user-form">
        <el-form
          ref="courseware-form"
          :model="form"
          :label-width="'80px'"
          :rules="rules"
        >
          <el-form-item prop="name" label="课件名">
            <el-input v-model="form.name" />
          </el-form-item>

          <el-form-item prop="desc" label="描述">
            <el-input v-model="form.desc" />
          </el-form-item>

          <el-form-item prop="ageGroup" label="年龄段">
            <el-select
              v-model="form.ageGroup.id"
              filterable
              remote
              placeholder="请输入关键词"
              :remote-method="remoteAgeGroup"
            >
              <el-option
                v-for="item in ageGroupOptions"
                :key="item.id"
                :label="item.label"
                :value="item.id"
              >
              </el-option>
            </el-select>
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
  watchEffect
} from "@vue/composition-api";
export default {
  props: {
    isShow: Boolean,
    coursewareId: String | Number,
    coursewareDetail: {
      type: Object,
      default: {}
    }
  },
  setup(props, context) {
    const $store = context.root.$store;
    const $message = context.root.$message;
    let isEdit = ref(false);

    const form = reactive({
      id: "",
      name: "",
      desc: "",
      ageGroup: {
        id: "",
        label: ""
      }
    });

    const rules = reactive({
      name: [{ required: true, message: "请输入班级名称", trigger: "blur" }],
      desc: [],
      ageGroup: [{ required: true, message: "请选择年龄段", trigger: "blur" }]
    });

    // 年龄段
    let ageGroupOptions = ref([]);
    // lodding
    let loadding = ref(false);

    function remoteAgeGroup() {
      loadding.value = true;
      $store.dispatch("user/queryAgeGroup").then(respone => {
        loadding.value = false;
        const { data } = respone;
        ageGroupOptions.value = handleAgeGroupData(data);
      });
    }

    // 处理年龄段的接口数据
    function handleAgeGroupData(srcData) {
      if (!srcData || !srcData.length) {
        return [];
      }

      return srcData.map(item => {
        return {
          id: item.id,
          label: item.desc
        };
      });
    }

    onMounted(() => {
      console.log("props.coursewareDetail", props.coursewareDetail);
    });

    watchEffect(onInvalidate => {
      console.log("watchEffect 开始运行");
      // 在副作用函数中定义isEdit
      isEdit.value = !!props.coursewareId;
      if (props.coursewareId) {
        Promise.all([
          $store.dispatch("user/queryAgeGroup"),
          $store.dispatch("user/getCoursewareById", props.coursewareId)
        ]).then(result => {
          const ageGroupData = result[0].data;
          const coursewareData = result[1].data;

          // 处理年龄段的数据
          ageGroupOptions.value = handleAgeGroupData(ageGroupData);

          // 设置课件信息
          form.id = coursewareData.id;
          form.name = coursewareData.name;
          form.desc = coursewareData.desc;
          form.ageGroup = {
            id: coursewareData.age_group.id,
            label: coursewareData.age_group.desc
          };
        });
      }
    });

    function submit() {
      const actionUrl = isEdit.value
        ? `user/updateCourseware`
        : `user/createCourseware`;
      context.refs["courseware-form"].validate((valid, event) => {
        if (valid) {
          // 发送请求
          const params = {
            coursewareId: props.coursewareId,
            name: form.name,
            desc: form.desc,
            age_group_id: form.ageGroup.id
          };
          $store.dispatch(actionUrl, params).then(data => {
            let message = "新的课程创建成功";
            if (isEdit.value) {
              message = "课程更新成功";
            }
            $message.success(message);
            // 清空form
            // clearForm();
            // 关闭弹窗
            close();
          });
        }
      });
    }

    const close = () => {
      context.emit("closeDialog");
    };

    function clearForm() {
      Object.assign(form, {
        id: "",
        name: "",
        desc: "",
        ageGroup: null
      });
    }

    return {
      form,
      ageGroupOptions,
      rules,
      remoteAgeGroup,
      close,
      submit,
      loadding
    };
  }
};
</script>

<style lang="scss">
.add-courseware-wrapper {
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

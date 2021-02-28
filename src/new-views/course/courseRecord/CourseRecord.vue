<template>
  <div class="course-record-page">
    <h1>{{ msg }}</h1>
    <h3>{{ historyCourses.title }}</h3>
    <a @click="changeTitle">点击</a>
  </div>
</template>
<script>
import {
  reactive,
  ref,
  toRefs,
  watchEffect,
  onInvalidat,
  toRefse
} from "@vue/composition-api";

export default {
  setup() {
    const msg = ref("开始开发课程管理模块");

    let historyCourses = reactive({
      title: "跳舞的小白兔"
    });

    watchEffect(onInvalidate => {
      console.log(historyCourses.title);
      const timeHandle = setTimeout(() => {
        console.log(historyCourses.title);
      }, 1000);

      onInvalidate(() => {
        if (timeHandle) {
          console.log("xxxx");
          clearTimeout(timeHandle);
        }
      });
    });

    function changeTitle() {
      historyCourses.title = "xsdfsf" + Math.random(1, 10);
    }

    // return { msg, ...toRefs(historyCourses), changeTitle };
    return { msg, historyCourses, changeTitle };
  }
};
</script>
<style lang="scss" scoped></style>

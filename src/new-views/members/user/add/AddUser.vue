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
          ref="userForm"
          :model="form"
          :rules="rules"
          :label-position="labelPosition"
          :status-icon="true"
          :label-width="'80px'"
        >
          <el-form-item prop="name" label="姓名">
            <el-input v-model="form.name" />
          </el-form-item>

          <el-form-item prop="gender" label="性别">
            <el-select v-model="form.gender" placeholder="请选择">
              <el-option label="男" value="1" />
              <el-option label="女" value="2" />
            </el-select>
          </el-form-item>

          <el-form-item prop="age" label="年龄">
            <el-input v-model="form.age" />
          </el-form-item>

          <el-form-item prop="mobile" label="电话">
            <el-input v-model="form.mobile" />
          </el-form-item>

          <el-form-item prop="nickName" label="小名">
            <el-input v-model="form.nickname" />
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
export default {
  name: 'AddUser',
  props: {
    isShow: Boolean,
    memberDetail: {
      type: Object,
      default: {}
    },
    memberId: String | Number,
    isEdit: Boolean
  },
  // props: ['isShow', 'memberDetail', 'isEdit'],
  data: () => {
    return {
      labelPosition: 'right',
      form: {
        gender: '1'
      },
      rules: {
        name: [{ required: true, message: '请输入姓名', trigger: 'blur' }],
        gender: [{ required: true, message: '请输入性别', trigger: 'change' }],
        // age: [
        //   { required: false, message: "请输入年龄", trigger: "change" },
        //   {
        //     message: "必须是1-120之间的正整数。",
        //     trigger: "change",
        //     validator: function (rule, age, callback) {
        //       console.log(rule, age);
        //       if (/^(?:[1-9][0-9]?|1[01][0-9]|120)$/.test(Number(age))) {
        //         callback();
        //       }
        //       callback(rule);
        //     },
        //   },
        // ],
        age: [],
        mobile: [],
        nickname: []
      }
    }
  },
  computed: {
    isShowDialog() {
      return this.isShow
    }
  },
  watch: {
    memberId(memberId, oldMemberId) {
      if (memberId) {
        this.$store.dispatch(`user/getMember`, memberId).then((data) => {
          console.log('detail', data.data)
          this.form = { ...this.form, ...data.data }
        })
      } else {
        this.form = {
          gender: '1'
        }
      }
    }
  },
  methods: {
    close(event) {
      this.$emit('closeDialog')
    },
    submit() {
      console.log('this.isEdit', this.isEdit)
      const actionUrl = this.isEdit ? `user/updateMember` : `user/addMember`
      this.$refs['userForm'].validate((valid, event) => {
        if (valid) {
          this.form.gender = Number(this.form.gender)
          // 发送请求
          // this.close();
          this.$store.dispatch(actionUrl, this.form).then((data) => {
            let message = '新成员添加成功'
            if (this.isEdit) {
              message = '更新成功'
            }
            this.$message.success(message)
            this.close()
          })
        }
      })
    }
  }
}
</script>

<style lang="scss">
.add-user-wrapper {
  .title-icon {
    color: #409eff;
    font-size: 20px;

    .title-font {
      padding-left: 10px;
      color: #333;
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

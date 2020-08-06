<template>
  <div class="add-user-wrapper">
    <el-dialog
      :visible="isShow"
      @close="close"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      top="8vh"
    >
      <div slot="title">
        <div class="el-icon-user-solid title-icon">
          <span class="title-font">添加会员</span>
        </div>
      </div>
      <div class="user-form">
        <el-form ref="userForm"
                 :model="form"
                 :rules="rules"
                 :label-position="labelPosition"
                 :status-icon="true"
                 :label-width="'80px'">
          <el-form-item prop="name" label="姓名">
            <el-input v-model="form.name"></el-input>
          </el-form-item>

          <el-form-item prop="age" label="年龄">
            <el-input v-model="form.age"></el-input>
          </el-form-item>

          <el-form-item prop="gender" label="性别">
            <el-select v-model="form.gender" placeholder="请选择">
              <el-option label="男" value="male"></el-option>
              <el-option label="女" value="female"></el-option>
            </el-select>
          </el-form-item>

          <el-form-item prop="vipLevel" label="会员等级">
            <el-select v-model="form.vipLevel" placeholder="请选择">
              <el-option label="普通会员" value="2"></el-option>
              <el-option label="管理员" value="1"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item prop="phone" label="电话">
            <el-input v-model="form.phone"></el-input>
          </el-form-item>

          <el-form-item prop="nickName" label="小名">
            <el-input v-model="form.nickname"></el-input>
          </el-form-item>

          <el-form-item prop="birthday" label="生日">
            <el-date-picker
              v-model="form.birthday"
              type="date"
              placeholder="选择日期">
            </el-date-picker>
          </el-form-item>

          <el-form-item prop="email" label="邮件">
            <el-input v-model="form.email"></el-input>
          </el-form-item>

          <el-form-item prop="address" label="家庭住址">
            <el-input v-model="form.address"></el-input>
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
    data: () => {
      return {
        labelPosition: 'right',
        form: {
          name: '刘思杰',
          email: '',
          nickname: '',
          gender: '',
          age: '',
          leftLessons: '',
          vipLevel: '2',
          birthday: '',
          phone: '',
          address: ''
        },
        rules: {
          name: [
            { required: true, message: '请输入姓名', trigger: 'blur' }
          ],
          gender: [
            { required: true, message: '请输入性别', trigger: 'change' }
          ],
          age: [
            { required: true, message: '请输入年龄', trigger: 'change' },
            {
              message: '必须是1-120之间的正整数。',
              trigger: 'change',
              validator: function (rule, age, callback) {
                console.log(rule, age)
                if (/^(?:[1-9][0-9]?|1[01][0-9]|120)$/.test(Number(age))) {
                  callback()
                }
                callback(rule)
              }
            }
          ],
          vipLevel: [
            { required: true, message: '请输入会员等级', trigger: 'change' }
          ],
          phone: [],
          email: [],
          nickname: [],
          leftLessons: [],
          birthday: [],
          address: []
        }
      }
    },
    props: {
      isShow: false
    },
    computed: {
      isShowDialog() {
        return this.isShow
      }
    },
    methods: {
      close(event) {
        this.$emit('closeDialog')
      },
      submit() {
        this.$refs['userForm'].validate((valid, event) => {
          if (valid) {
            // 发送请求
            this.close()
          }
        })
      }
    }
  }
</script>

<style lang="less">
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

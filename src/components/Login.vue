<template>
  <div id="app">
    <div class="login_container">
      <div class="login_box">
        <div class="avatar_box">
          <img src="../assets/logo.png" alt="" />
        </div>
        <el-form
          label-width="65px"
          class="login_form"
          :model="loginForm"
          :rules="loginFormRules"
          ref="loginFormRef"
        >
          <el-form-item label="用户名" prop="username">
            <el-input
              prefix-icon="iconfont icon-user"
              v-model="loginForm.username"
            ></el-input>
          </el-form-item>
          <el-form-item label="密码" prop="password">
            <el-input
              type="password"
              prefix-icon="iconfont icon-3702mima"
              v-model="loginForm.password"
            ></el-input>
          </el-form-item>
          <el-form-item class="btns">
            <el-button type="success" @click="login">登录</el-button>
            <el-button type="info" @click="resetLoginForm">重置</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      loginForm: { username: 'admin', password: '123456' },
      loginFormRules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 3, max: 10, message: '长度在3~10个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, max: 15, message: '长度在6~15个字符', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    // 重置表单
    resetLoginForm () {
      this.$refs.loginFormRef.resetFields()
    },
    // 表单内容预验证;validate()返回false或者true
    login () {
      this.$refs.loginFormRef.validate(async (valid) => {
        if (!valid) return
        // 重新给dada 命名为res
        const { data: res } = await this.$http.post('login', this.loginForm)
        if (res.meta.status !== 200) return this.$message.error('登陆失败')
        this.$message.success('登陆成功')
        window.sessionStorage.setItem('token', res.data.token)
        this.$router.push('/home')
      })
    }
  }
}
</script>

<style lang="less" scoped>
.login_container {
  background-color: #2b4b6b;
  height: 100%;
}
.login_box {
  width: 450px;
  height: 300px;
  background-color: #fff;
  border-radius: 3px;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
}
.avatar_box {
  height: 130px;
  width: 130px;
  border: 1px solid #eee;
  border-radius: 50%;
  padding: 6px;
  box-shadow: 0 0 10px;
  position: absolute;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: #fff;
  img {
    height: 130px;
    width: 130px;
    border-radius: 50%;
    background-color: #eee;
  }
}

.login_form {
  position: absolute;
  bottom: 20px;
  width: 100%;
  padding: 0px 20px;
  box-sizing: border-box;
}
.btns {
  display: flex;
  justify-content: flex-end;
}
</style>

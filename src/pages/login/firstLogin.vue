<template>
    <a-form-model ref="ruleForm" :model="ruleForm" :rules="rules" v-bind="layout">
        <a-form-model-item has-feedback label="用户" prop="user">
            <a-input :value="account.user.lastname" :disabled="true" />
        </a-form-model-item>
        <a-form-model-item label="手机号" prop="mobile" >
            <a-input-search validateStatus="false" v-model.number="ruleForm.mobile"  @search="sendMsg('ruleForm')">
                <a-button :disabled="buttonStatus" slot="enterButton">
                    {{button}}
                </a-button>
            </a-input-search>
        </a-form-model-item>

        <a-form-model-item has-feedback label="验证码" prop="captcha">
            <a-input v-model.number="ruleForm.captcha" />
        </a-form-model-item>
        <a-form-model-item has-feedback label="密码" prop="password">
            <a-input-password v-model="ruleForm.password" type="password" autocomplete="off" />
        </a-form-model-item>
        <a-form-model-item has-feedback label="确认密码" prop="checkPass">
            <a-input-password v-model="ruleForm.checkPass" type="password" autocomplete="off" />
        </a-form-model-item>

        <a-form-model-item :wrapper-col="{ span: 14, offset: 4 }">
            <a-button type="primary" @click="submitForm('ruleForm')">
                确认修改
            </a-button>
        </a-form-model-item>
    </a-form-model>
</template>
<script>
    import {mapState,mapMutations} from "vuex"
    import {sendMobile,modifyPassword} from '@/services/user'
    export default {
        data() {
            let checkPending;
            let checkMobile = (rule, value, callback) => {
                if (value === '') {
                    callback(new Error('请输入手机号'));
                }else if(!(/^1[3456789]\d{9}$/.test(this.ruleForm.mobile))){
                    callback(new Error("手机号码格式错误"));
                }else{
                    callback();
                }
            };


            let validateCaptcha = (rule, value, callback) => {
                if (value === '') {
                    callback(new Error('请输入验证码'));
                } else {
                    callback();
                }
            };

            let validatePass = (rule, value, callback) => {
                if (value === '') {
                    callback(new Error('请输入密码'));
                } else {
                    if (this.ruleForm.checkPass !== '') {
                        this.$refs.ruleForm.validateField('checkPass');
                    }
                    callback();
                }
            };
            let validatePass2 = (rule, value, callback) => {
                if (value === '') {
                    callback(new Error('请确认密码'));
                } else if (value !== this.ruleForm.password) {
                    callback(new Error("两次密码不一致"));
                } else {
                    callback();
                }
            };
            return {
                button:'发送',
                buttonStatus:false,
                buttonInterval:null,
                ruleForm: {
                    password: '',
                    checkPass: '',
                    mobile: '',
                    captcha: '',
                },
                rules: {
                    password: [{ validator: validatePass, trigger: 'blur' }],
                    checkPass: [{ validator: validatePass2, trigger: 'blur' }],
                    mobile: [{ validator: checkMobile, trigger: 'blur' }],
                    captcha: [{ validator: validateCaptcha, trigger: 'blur' }],
                },
                layout: {
                    labelCol: { span: 4 },
                    wrapperCol: { span: 14 },
                },
            };
        },
        methods: {
            ...mapMutations('account', ['setUser']),
            isMobile() {
                let flag = navigator.userAgent.match(/(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i);
                return flag;
            },
            sendMsg(formName){
                let that = this;
                this.$refs[formName].validateField("mobile",valid => {
                    if (!valid) {
                        sendMobile(this.account.user.loginid, this.ruleForm.mobile).then(res=>{
                            this.buttonStatus = true
                            this.button = 60
                            this.buttonInterval = setInterval(()=>{
                                this.button = this.button-1
                                if(this.button==1){
                                    this.button = '发送'
                                    this.buttonStatus = false
                                    clearInterval(this.buttonInterval)
                                }
                            }, 1000)
                        }).catch(function (error) {
                            console.log(error)
                        })
                    } else {
                        return false;
                    }
                });
            },
            submitForm(formName) {
                this.$refs[formName].validate(valid => {
                    if (valid) {
                        const sha256 = require('js-sha256').sha256
                        const sha256_password = sha256(this.ruleForm.password)
                        const sha256_checkPass = sha256(this.ruleForm.checkPass)
                        modifyPassword(this.account.user.workcode,this.ruleForm.mobile, sha256_password, sha256_checkPass, this.ruleForm.captcha).then(res=>{
                          if(res.data.code==200){
                              const user = localStorage.getItem(process.env.VUE_APP_USER_KEY)
                              const userJson = JSON.parse(user)
                              userJson.first_login = 1
                              this.setUser(userJson)
                              if(this.isMobile()){
                                  this.$router.push('/mobile/query')
                              }else{
                                  this.$router.push('/index')
                              }
                          }
                        }).catch(function (error) {
                            console.log(error)
                        })

                    } else {
                        console.log('error submit!!');
                        return false;
                    }
                });
            },
            resetForm(formName) {
                this.$refs[formName].resetFields();
            },
        },
        computed:{
            ...mapState(["account"]),
        }
    };
</script>
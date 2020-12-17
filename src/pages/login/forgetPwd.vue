<template>
    <a-form-model ref="ruleForm" :model="ruleForm" :rules="rules" v-bind="layout">
        <a-form-model-item has-feedback label="工号" prop="workcode">
            <a-input  v-model="ruleForm.workcode"/>
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
        <a-form-model-item has-feedback label="新密码" prop="password">
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
    import {logout} from '@/services'
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
            let validateWorkcode = (rule, value, callback) => {
                if (value === '') {
                    callback(new Error('请输入工号'));
                } else {
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
                } else if (!(/^\d{6}$/.test(value))){
                    callback(new Error('请输入6位数字'));
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
                    workcode: '',
                    password: '',
                    checkPass: '',
                    mobile: '',
                    captcha: '',
                },
                rules: {
                    workcode: [{ validator: validateWorkcode, trigger: 'blur' }],
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
            sendMsg(formName){
                let that = this;
                this.$refs[formName].validateField("workcode",valid1 => {
                    if (!valid1) {
                        this.$refs[formName].validateField("mobile",valid => {
                            if (!valid) {
                                sendMobile(this.ruleForm.workcode,'-1', this.ruleForm.mobile).then(res=>{
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
                    }
                });

            },
            submitForm(formName) {
                this.$refs[formName].validate(valid => {
                    if (valid) {
                        const sha256 = require('js-sha256').sha256
                        const sha256_password = sha256(this.ruleForm.password)
                        const sha256_checkPass = sha256(this.ruleForm.checkPass)
                        modifyPassword(this.ruleForm.workcode, this.ruleForm.mobile, sha256_password, sha256_checkPass, this.ruleForm.captcha).then(res=>{
                            if(res.data.code==200){
                                this.$message.success("修改成功！")
                                logout()
                                this.$router.push('/login')
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
        }
    };
</script>
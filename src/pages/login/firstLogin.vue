<template>
    <a-form-model ref="ruleForm" :model="ruleForm" :rules="rules" v-bind="layout">
        <a-form-model-item has-feedback label="用户" prop="user">
            <a-input :value="account.user.lastname" :disabled="true" />
        </a-form-model-item>
        <a-form-model-item has-feedback label="手机号" prop="mobile">
            <a-row>
                <a-col :span="22">
                    <a-input v-model.number="ruleForm.mobile" />
                </a-col>
                <a-col :span="2">
                    <a-button  @click="sendMessage()" :disabled="buttonStatus">
                        {{button}}
                    </a-button>
                </a-col>
            </a-row>
        </a-form-model-item>
        <a-form-model-item has-feedback label="验证码" prop="captcha">
            <a-input v-model.number="ruleForm.captcha" />
        </a-form-model-item>
        <a-form-model-item has-feedback label="密码" prop="pass">
            <a-input v-model="ruleForm.pass" type="password" autocomplete="off" />
        </a-form-model-item>
        <a-form-model-item has-feedback label="确认密码" prop="checkPass">
            <a-input v-model="ruleForm.checkPass" type="password" autocomplete="off" />
        </a-form-model-item>

        <a-form-model-item :wrapper-col="{ span: 14, offset: 4 }">
            <a-button type="primary" @click="submitForm('ruleForm')">
                确认修改
            </a-button>
        </a-form-model-item>
    </a-form-model>
</template>
<script>
    import {mapState} from "vuex"
    export default {
        data() {
            let checkPending;
            let checkAge = (rule, value, callback) => {
                clearTimeout(checkPending);
                if (!value) {
                    return callback(new Error('Please input the age'));
                }
                checkPending = setTimeout(() => {
                    if (!Number.isInteger(value)) {
                        callback(new Error('Please input digits'));
                    } else {
                        if (value < 18) {
                            callback(new Error('Age must be greater than 18'));
                        } else {
                            callback();
                        }
                    }
                }, 1000);
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
                } else if (value !== this.ruleForm.pass) {
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
                    pass: '',
                    checkPass: '',
                    age: '',
                },
                rules: {
                    pass: [{ validator: validatePass, trigger: 'change' }],
                    checkPass: [{ validator: validatePass2, trigger: 'change' }],
                    age: [{ validator: checkAge, trigger: 'change' }],
                },
                layout: {
                    labelCol: { span: 4 },
                    wrapperCol: { span: 14 },
                },
            };
        },
        methods: {
            sendMessage(){
                let that = this;
                this.buttonStatus = true
                this.button = 60
                this.buttonInterval = setInterval(function(){
                    that.button = that.button-1
                    if(that.button==0){
                        that.button = '发送'
                        that.buttonStatus = false
                        clearInterval(that.buttonInterval)
                    }
                },1000)
            },
            submitForm(formName) {
                this.$refs[formName].validate(valid => {
                    if (valid) {
                        alert('submit!');
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
<template>
    <common-layout>
        <div class="top">
            <div class="header">
                <img alt="logo" class="logo" src="@/assets/img/logo_inzb.png"/>
                <span class="title">{{systemName}}</span>
            </div>
            <div class="desc">通富微电工资管理系统</div>
        </div>
        <div class="login">
            <a-form @submit="onSubmit" :form="form">
                <a-alert type="error" :closable="true" v-show="error" :message="error" showIcon
                         style="margin-bottom: 24px;"/>
                <a-form-item>
                    <a-input
                            autocomplete="autocomplete"
                            size="large"
                            v-decorator="['loginid', {rules: [{ required: true, message: '请输入用户名', whitespace: true}]}]"
                    >
                        <a-icon slot="prefix" type="user"/>
                    </a-input>
                </a-form-item>
                <a-form-item>
                    <a-input
                            size="large"
                            autocomplete="autocomplete"
                            type="password"
                            v-decorator="['password', {rules: [{ required: true, message: '请输入密码', whitespace: true}]}]"
                    >
                        <a-icon slot="prefix" type="lock"/>
                    </a-input>
                </a-form-item>
                <div>
                    <a-checkbox :checked="true">自动登录</a-checkbox>
                </div>
                <a-form-item>
                    <a-button :loading="logging" style="width: 100%;margin-top: 24px" size="large" htmlType="submit"
                              type="primary">登录
                    </a-button>
                </a-form-item>
            </a-form>
        </div>

        <a-modal
                title="验证手机号"
                :maskClosable=false
                :visible="checkPasswordModalVisible"
                :confirm-loading="checkPasswordConfirmLoading"
                @ok="commitCheckPassword('checkForm')"
                @cancel="cancelCheckPassword"
        >
            <div>
                <a-form-model ref="checkForm" :model="checkForm" :rules="rules" v-bind="layout">
                    <a-form-model-item label="手机号" prop="mobile" >
                        <a-input-search validateStatus="false" v-model.number="checkForm.mobile"  @search="sendMsg('checkForm')">
                            <a-button :disabled="buttonStatus" slot="enterButton">
                                {{button}}
                            </a-button>
                        </a-input-search>
                    </a-form-model-item>
                    <a-form-model-item has-feedback label="验证码" prop="captcha">
                        <a-input v-model.number="checkForm.captcha" />
                    </a-form-model-item>
                </a-form-model>
            </div>
        </a-modal>
    </common-layout>
</template>

<script>
    import CommonLayout from '@/layouts/CommonLayout'
    import {login,logout} from '@/services'
    import {setAuthorization} from '@/utils/request'
    import {loadRoutes} from '@/utils/routerUtil'
    import {checMobileCaptcha} from '@/services/salaryQuery'
    import {mapMutations} from 'vuex'
    import {loginInfo} from '@/services/user'
    import {sendMobile} from '@/services/user'
    import Cookie from 'js-cookie'
    export default {
        name: 'Login',
        components: {CommonLayout},
        data() {
            let checkMobile = (rule, value, callback) => {
                if (value === '') {
                    callback(new Error('请输入手机号'));
                }else if(!(/^1[3456789]\d{9}$/.test(this.checkForm.mobile))){
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

            return {
                user:{},
                logging: false,
                error: '',
                form: this.$form.createForm(this),
                button:'发送',
                buttonStatus:false,
                checkForm: {
                    mobile: '',
                    captcha: '',
                },
                rules: {
                    mobile: [{ validator: checkMobile, trigger: 'blur' }],
                    captcha: [{ validator: validateCaptcha, trigger: 'blur' }],
                },
                checkPasswordModalVisible: false,
                checkPasswordConfirmLoading: false,
                isSendMessageToday: Cookie.get('checkMobile'),
                layout: {
                    labelCol: { span: 4 },
                    wrapperCol: { span: 14 },
                },
            }
        },
        computed: {
            systemName() {
                return this.$store.state.setting.systemName
            }
        },
        methods: {
            ...mapMutations('account', ['setUser', 'setPermissions', 'setRoles']),
            onSubmit(e) {
                e.preventDefault()
                this.form.validateFields((err) => {
                    if (!err) {
                        let that = this
                        this.logging = true
                        const loginid = this.form.getFieldValue('loginid')
                        const password = this.form.getFieldValue('password')
                        const sha256 = require('js-sha256').sha256
                        const sha256_password = sha256(password)
                        login(loginid, sha256_password).then(this.afterLogin)
                            .catch(function (error) {
                                console.log(error)
                                that.logging = false
                            })
                    }
                })
            },
            afterLogin: function (res) {
                if (res.data.code == 200) {
                    const loginRes = res.data
                    let user = {}
                    user.loginid = loginRes.data.loginid
                    user.workcode = loginRes.data.workcode
                    user.lastname = loginRes.data.lastname
                    user.roleId = loginRes.data.roleId
                    user.first_login = loginRes.data.first_login
                    user.site = loginRes.data.site
                    this.setUser(user)
                    setAuthorization({token: loginRes.data.token, expireAt: new Date(loginRes.data.expireTime)})
                    // 获取路由配置(使用本地配置)
                    let routesConfig = require('../../router/config').default
                    loadRoutes({router: this.$router, store: this.$store, i18n: this.$i18n}, routesConfig)
                    localStorage.removeItem(process.env.VUE_APP_TABS)
                    this.user.loginid = loginRes.data.loginid
                    this.user.workcode = loginRes.data.workcode
                    this.user.roleId = loginRes.data.roleId
                    if(!this.isSendMessageToday){
                        this.checkPasswordModalVisible = true
                    }else{
                        if(this.user.roleId==2){
                            this.$router.push('/index')
                        }else{
                            this.$router.push('/salary')
                        }
                        this.loginInfo(this.user)
                        this.$message.success(res.data.message, 3)
                        this.checkPasswordModalVisible = false;
                    }
                }
            },
            loginInfo(user){
                if (!Cookie.get('login-info')) {
                    loginInfo(
                        user.workcode,0
                    ).then(res=>{
                        if (res.data.success) {
                            if(res.data.data.length>1){
                                const h = this.$createElement;
                                this.$info({
                                    title: '登录提示',
                                    content: h('div', {}, [
                                        h('p', '上次登陆时间：'+res.data.data[1].operateTime),
                                        h('p', '上次登录IP：'+res.data.data[1].ip)
                                    ]),
                                    onOk() {

                                    },
                                });
                                Cookie.set("login-info", true, {expires: new Date(new Date(new Date().toLocaleDateString()).getTime()+24*60*60*1000-1)})
                            }
                        }
                    }).catch(function (error) {
                        console.log(error)
                    })
                }
            },
            sendMsg(formName){
                this.$refs[formName].validateField("mobile",valid => {
                    if (!valid) {
                        const password = this.form.getFieldValue('password')
                        const sha256 = require('js-sha256').sha256
                        const sha256_password = sha256(password)
                        sendMobile(this.user.workcode, sha256_password,this.checkForm.mobile).then(res=>{
                            this.$message.success(res.data.message, 3)
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
            cancelCheckPassword(){
                this.logging = false
                this.checkPasswordModalVisible = false;
                logout()

            },
            commitCheckPassword(formName){
                this.$refs[formName].validate(valid => {
                    if (valid) {
                        checMobileCaptcha(
                            this.user.workcode,
                            this.checkForm.mobile,
                            this.checkForm.captcha
                        ).then(res=>{
                            if (res.data.success) {
                                this.logging = false
                                Cookie.set("checkMobile", true, {expires: new Date(new Date(new Date().toLocaleDateString()).getTime()+24*60*60*1000-1)})
                                if(this.user.roleId==2){
                                    this.$router.push('/index')
                                }else{
                                    this.$router.push('/salary')
                                }
                                this.loginInfo(this.user)
                                this.$message.success(res.data.message, 3)
                                this.checkPasswordModalVisible = false;
                            }
                        }).catch(function (error) {
                            console.log(error)
                        })

                    } else {
                        console.log('error submit!!');
                        return false;
                    }
                })
            }
        }
    }
</script>

<style lang="less" scoped>
    .common-layout {
        .top {
            text-align: center;

            .header {
                height: 44px;
                line-height: 44px;

                a {
                    text-decoration: none;
                }

                .logo {
                    height: 44px;
                    vertical-align: top;
                    margin-right: 16px;
                }

                .title {
                    font-size: 33px;
                    color: @title-color;
                    font-family: 'Myriad Pro', 'Helvetica Neue', Arial, Helvetica, sans-serif;
                    font-weight: 600;
                    position: relative;
                    top: 2px;
                }
            }

            .desc {
                font-size: 14px;
                color: @text-color-second;
                margin-top: 12px;
                margin-bottom: 40px;
            }
        }

        .login {
            width: 368px;
            margin: 0 auto;
            @media screen and (max-width: 576px) {
                width: 95%;
            }
            @media screen and (max-width: 320px) {
                .captcha-button {
                    font-size: 14px;
                }
            }

            .icon {
                font-size: 24px;
                color: @text-color-second;
                margin-left: 16px;
                vertical-align: middle;
                cursor: pointer;
                transition: color 0.3s;

                &:hover {
                    color: @primary-color;
                }
            }
        }
    }
</style>

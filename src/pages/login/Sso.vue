<template>
    <div>
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
    </div>
</template>
<script>
    import {checkSso} from '@/services'
    import {logout} from '@/services'
    import {setAuthorization} from '@/utils/request'
    import {loadRoutes} from '@/utils/routerUtil'
    import {checMobileCaptcha} from '@/services/salaryQuery'
    import {mapMutations} from 'vuex'
    import {loginInfo} from '@/services/user'
    import {sendMobile} from '@/services/user'
    import Cookie from 'js-cookie'
    export default {
        name: 'Sso',
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
                button:'发送',
                buttonStatus:false,
                checkForm: {
                    mobile: '',
                    captcha: '',
                },
                layout: {
                    labelCol: { span: 4 },
                    wrapperCol: { span: 14 },
                },
                rules: {
                    mobile: [{ validator: checkMobile, trigger: 'blur' }],
                    captcha: [{ validator: validateCaptcha, trigger: 'blur' }],
                },
                checkPasswordModalVisible: false,
                checkPasswordConfirmLoading: false,
                isSendMessageToday: Cookie.get('checkMobile'),

            }
        },
        created () {
            //1.获取路由参数
            this.sso()
        },
        methods: {
            ...mapMutations('account', ['setUser', 'setPermissions', 'setRoles']),
            isMobile() {
                let flag = navigator.userAgent.match(/(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i);
                return flag;
            },
            sso() {
                const loginid = this.$route.params.loginid
                const token = this.$route.params.token
                checkSso(loginid,token).then(res => {
                    const loginRes = res.data
                    if (loginRes.code == 200) {
                        let user = {}
                        user.loginid = loginRes.data.loginid
                        user.workcode = loginRes.data.workcode
                        user.lastname = loginRes.data.lastname
                        user.roleId = loginRes.data.roleId
                        user.first_login = loginRes.data.first_login
                        user.site = loginRes.data.site
                        this.setUser(user)
                        setAuthorization({token: loginRes.data.token, expireAt: new Date(loginRes.data.expireTime)})
                        this.user.loginid = loginRes.data.loginid
                        this.user.workcode = loginRes.data.workcode
                        this.user.roleId = loginRes.data.roleId
                        if(!this.isSendMessageToday){
                            this.checkPasswordModalVisible = true
                        }else{
                            // 获取路由配置(使用本地配置)
                            let routesConfig = require('../../router/config').default
                            loadRoutes({router: this.$router, store: this.$store, i18n: this.$i18n}, routesConfig)
                            if(this.isMobile()){
                                this.$router.push('/mobile/query')
                            }else{
                                if(user.roleId==2){
                                    this.$router.push('/index')
                                }else{
                                    this.$router.push('/salary')
                                }
                            }
                            this.loginInfo(this.user)
                            this.$message.success(res.data.message, 3)
                            this.checkPasswordModalVisible = false;
                        }



                    }
                }).catch(function (error) {
                    console.log(error)
                })
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
                        sendMobile(this.user.workcode, '-1',this.checkForm.mobile).then(res=>{
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
                                if(this.isMobile()){
                                    this.$router.push('/mobile/query')
                                }else{
                                    if(this.user.roleId==2){
                                        this.$router.push('/index')
                                    }else{
                                        this.$router.push('/salary')
                                    }
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

</style>
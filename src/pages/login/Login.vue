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
    </common-layout>
</template>

<script>
    import CommonLayout from '@/layouts/CommonLayout'
    import {login} from '@/services'
    import {setAuthorization} from '@/utils/request'
    import {loadRoutes} from '@/utils/routerUtil'
    import {mapMutations} from 'vuex'
    import {loginInfo} from '@/services/user'
    import Cookie from 'js-cookie'
    export default {
        name: 'Login',
        components: {CommonLayout},
        data() {
            return {
                logging: false,
                error: '',
                form: this.$form.createForm(this)
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
                                that.logging = false
                            })
                    }
                })
            },
            afterLogin: function (res) {
                this.logging = false
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
                    // 获取路由配置(使用本地配置)
                    let routesConfig = require('../../router/config').default
                    loadRoutes({router: this.$router, store: this.$store, i18n: this.$i18n}, routesConfig)
                    localStorage.removeItem(process.env.VUE_APP_TABS)
                    if(user.roleId==2){
                        this.$router.push('/index')
                    }else{
                        this.$router.push('/salary')
                    }
                    this.loginInfo(user)
                    this.$message.success(loginRes.message, 3)

                } else {
                    this.error = loginRes.message
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
                                    onOk() {},
                                });
                                Cookie.set("login-info", 'true', 3600)
                            }
                        }
                    }).catch(function (error) {
                        console.log(error)
                    })
                }
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

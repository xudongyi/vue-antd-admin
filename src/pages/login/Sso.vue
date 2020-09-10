<template>
    <div>

    </div>
</template>
<script>
    import {checkSso} from '@/services'
    import {mapMutations} from 'vuex'
    import {setAuthorization} from '@/utils/request'
    import {loadRoutes} from '@/utils/routerUtil'
    export default {
        name: 'Sso',
        //components: {CommonLayout},
        data() {
            return {
                logging: false,
                error: ''
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
                let that = this
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
                        this.setUser(user)
                        setAuthorization({token: loginRes.data.token, expireAt: new Date(loginRes.data.expireTime)})
                        // 获取路由配置(使用本地配置)
                        let routesConfig = require('../../router/config').default
                        loadRoutes({router: this.$router, store: this.$store, i18n: this.$i18n}, routesConfig)
                        if(this.isMobile()){
                            this.$router.push('/mobile/query')
                        }else{
                            this.$router.push('/index')
                            this.$message.success(loginRes.message, 3)
                        }

                    }
                }).catch(function (error) {
                    console.log(error)
                })
            }
        }
    }
</script>
<style lang="less" scoped>

</style>
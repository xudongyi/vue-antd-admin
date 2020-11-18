<template>
    <div name="salaryReport">
        <a-card style="margin-top: 24px" :bordered="false" :body-style="{padding: '24px'}">
            <a-row>
                <a-tabs  default-active-key="1"
                         @change="tabPanelChange"
                         tab-position="top"
                         :tab-bar-style="{marginBottom: '24px', paddingLeft: '16px'}">
                    <a-tab-pane :forceRender="true" loading="true" tab="按人员类别统计" key="1">
                        <MonthlyLaborCostByTypeReport></MonthlyLaborCostByTypeReport>
                    </a-tab-pane>
                    <a-tab-pane :forceRender="true" loading="true" tab="管技人员按部门统计" key="2">
                        <MonthlyLaborCostByManageReport></MonthlyLaborCostByManageReport>
                    </a-tab-pane>
                    <a-tab-pane :forceRender="true" loading="true" tab="制造部门每月人工成本" key="3">
                        <MonthlyLaborCostByManufacturingDept></MonthlyLaborCostByManufacturingDept>
                    </a-tab-pane>
                    <a-tab-pane :forceRender="true" loading="true" tab="各部门每月人工成本" key="4">
                        <MonthlyLaborCostByDeptReport></MonthlyLaborCostByDeptReport>
                    </a-tab-pane>
                    <a-tab-pane :forceRender="true" loading="true" tab="每月人工成本" key="5">
                        <MonthlyLaborCostReport></MonthlyLaborCostReport>
                    </a-tab-pane>
<!--                    <a-tab-pane :forceRender="true" tab="短信" key="2"><a-row>-->
<!--                        <a-col :xl="16" :lg="12" :md="12" :sm="24" :xs="24">-->
<!--                        </a-col>-->
<!--                        <a-col :xl="8" :lg="12" :md="12" :sm="24" :xs="24">-->
<!--                        </a-col>-->
<!--                    </a-row>-->
<!--                    </a-tab-pane>-->
<!--                    <a-tab-pane v-for="i in 30" :key="i" :tab="`Tab-${i}`"> Content of tab {{ i }} </a-tab-pane>-->
                </a-tabs>
            </a-row>
        </a-card>
    </div>
</template>
<script>
    import  MonthlyLaborCostReport from '../../../components/salary/MonthlyLaborCostReport'
    import MonthlyLaborCostByDeptReport from '../../../components/salary/MonthlyLaborCostByDeptReport'
    import MonthlyLaborCostByTypeReport from '../../../components/salary/MonthlyLaborCostByTypeReport'
    import MonthlyLaborCostByManageReport from '../../../components/salary/MonthlyLaborCostByManageReport'
    import MonthlyLaborCostByManufacturingDept from '../../../components/salary/MonthlyLaborCostByManufacturingDept'
    import {loginInfo} from '@/services/user.js'
    import {mapGetters} from 'vuex'
    import Cookie from 'js-cookie'

    export default {
        data () {
            return {
            };
        },
        created(){

            this.loginInfo()
        },
        computed: {
            ...mapGetters('account', ['user']),
        },
        methods: {
            tabPanelChange(av){

            },
            loginInfo(){
                if (!Cookie.get('login-info')) {
                    loginInfo(
                        this.user.workcode,0
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
        },
        components: {
            MonthlyLaborCostReport,
            MonthlyLaborCostByDeptReport,
            MonthlyLaborCostByTypeReport,
            MonthlyLaborCostByManageReport,
            MonthlyLaborCostByManufacturingDept
        }
    }
</script>

<style lang="less" scoped>
    .extra-wrap{
        .extra-item{
            display: inline-block;
            margin-right: 24px;
            a:not(:first-child){
                margin-left: 24px;
            }
        }
    }
    @media screen and (max-width: 992px){
        .extra-wrap .extra-item{
            display: none;
        }
    }
    @media screen and (max-width: 576px){
        .extra-wrap{
            display: none;
        }
    }
    .card-header{
        font-size: 14px;
        line-height: 22px;
        color:rgba(0, 0, 0, 0.45);
        width: 100%;
    }
    .card-body{
        height:76px;
        font-size:28px;
        line-height:76px;
    }
    .card-footer{
        white-space: nowrap;
        border-top: 1px solid #d9d9d9;
        color:rgba(0, 0, 0, 0.65);
        padding:8px 0px;
        font-variant: tabular-nums;
    }

</style>
<style>
    .ant-calendar-range .ant-calendar-footer-extra{
        float: right !important;
    }
</style>

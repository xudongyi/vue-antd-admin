<template>
    <div name="salaryReport">
        <a-card style="margin-top: 24px" :bordered="false" :body-style="{padding: '24px'}">
            <a-row>
                <a-tabs  default-active-key="1"
                         @change="tabPanelChange"
                         tab-position="top"
                         :tab-bar-style="{marginBottom: '24px', paddingLeft: '16px'}">
                    <div class="extra-wrap" slot="tabBarExtraContent">
                        <div class="extra-item" style="width:240px">
                            <a-input-number placeholder="比率" v-model="rateNumberValue" style="width: 90px;margin-right: 18px;"/>
                            <a-input-number placeholder="年份" id="yearNumber" style="width: 90px;margin-right: 10px;" v-model="yearNumberValue" :min="yearNumberMin" :max="yearNumberMax"/>
                            <a-button shape="circle" icon="search" @click="doReportSearch" style="width: 28px;height: 28px;" size="small"/>
                        </div>
                    </div>
                    <a-tab-pane :forceRender="true" loading="true" tab="每月人工成本" key="1">
                        <MonthlyLaborCostReport :year-number="yearNumberValue" :rate-number="rateNumberValue" ref='monthlyLaborCostReport'></MonthlyLaborCostReport>
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
    import MonthlyLaborCostReport from '../../../components/salary/MonthlyLaborCostReport'

    export default {
        data () {
            return {
                yearNumberValue:2020,
                rateNumberValue:null,
                yearNumberMin:1949,
                yearNumberMax:2020,
            };
        },
        methods: {
            tabPanelChange(av){

            },
            exportData(){

            },
            doReportSearch(){
                if(this.rateNumberValue==""||this.rateNumberValue==null||this.yearNumberValue==""||this.yearNumberValue==null){
                    return;
                }else{
                    console.log("doReportSearch");
                    this.$refs.monthlyLaborCostReport.getMonthlyLaborCost(this.yearNumberValue,this.rateNumberValue);
                }
            }
        },
        created() {
            this.yearNumberMax = new Date().getFullYear()+1;
            this.yearNumberValue = new Date().getFullYear();
            // this.getMonthlyLaborCost();
            // this.yearNumberMax = new Date().getFullYear+1
        },
        mounted() {

        },
        components: {
            MonthlyLaborCostReport
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

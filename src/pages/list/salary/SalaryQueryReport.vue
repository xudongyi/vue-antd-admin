<template>
    <div style="">
        <a-row :gutter="[24, 24]">
            <a-col :sm="24" :md="12" :xl="6">
                <a-card size="small" :bodyStyle="topCardBodyStyle">
                    <div class="card-header">当月导入薪资</div>
                    <div class="card-body">
                        ￥ {{reportData.currentMonthSalary}}
                    </div>
                    <div class="card-footer">
                        上月导入薪资 ￥ {{reportData.lastMonthSalary}}
                    </div>
                </a-card>
            </a-col>
            <a-col :sm="24" :md="12" :xl="6">
                <a-card size="small" :bodyStyle="topCardBodyStyle">
                    <div class="card-header">当月导入人数</div>
                    <div class="card-body">
                        {{reportData.currentMonthImportNumber}}
                    </div>
                    <div class="card-footer">
                        上月导入人数  {{reportData.lastMonthImportNumber}}
                    </div>
                </a-card>
            </a-col>
            <a-col :sm="24" :md="12" :xl="6">
                <a-card size="small" :bodyStyle="topCardBodyStyle">
                    <div class="card-header">当月访问人数</div>
                    <div class="card-body">
                        {{reportData.currentMonthVisitTimes}}
                    </div>
                    <div class="card-footer">
                        上月访问人数  {{reportData.lastMonthVisitTimes}}
                    </div>
                </a-card>
            </a-col>
            <a-col :sm="24" :md="12" :xl="6">
                <a-card size="small" :bodyStyle="topCardBodyStyle">
                    <div class="card-header">当月短信条数</div>
                    <div class="card-body">
                        {{reportData.currentMonthNoteNumber}}
                    </div>
                    <div class="card-footer">
                        上月短信条数  {{reportData.lastMonthNoteNumber}}
                    </div>
                </a-card>
            </a-col>
        </a-row>
        <a-card style="margin-top: 24px" :bordered="false" :body-style="{padding: '24px'}">
            <a-row>
                <a-tabs  default-active-key="1" @change="tabPanelChange" size="large" :tab-bar-style="{marginBottom: '24px', paddingLeft: '16px'}">
                    <div class="extra-wrap" slot="tabBarExtraContent">
                        <div class="extra-item">
                        </div>
                        <a-range-picker :style="{width: '256px'}" format="YYYY-MM"
                                        :open="rangePickerOpen"
                                        :mode="rangePickerMode"
                                        :value="rangePickerValue"
                                        @panelChange="rangePickerHandlePanelChange"
                                        @change="rangePickerHandleChange"
                                        @openChange="rangePickerOpenChange">
                            <div slot="renderExtraFooter">
                                <a-button size="small" type="primary" @click="rangePickerCommit" ghost>
                                    确定
                                </a-button>
                            </div>
                        </a-range-picker>
                    </div>
                    <a-tab-pane :forceRender="true" loading="true" tab="薪资" key="1">
                        <a-col :xl="16" :lg="12" :md="12" :sm="24" :xs="24">
                                <SalaryBarReport ref='salaryBarReport'></SalaryBarReport>
                        </a-col>
                        <a-col :xl="8" :lg="12" :md="12" :sm="24" :xs="24">
                            <ranking-list title="薪资部门排行" :list="reportData.salaryDepartmentRankList"/>
                        </a-col>
                    </a-tab-pane>
                    <a-tab-pane :forceRender="true" tab="短信" key="2"><a-row>
                        <a-col :xl="16" :lg="12" :md="12" :sm="24" :xs="24">
                                <SalaryLineReport ref='salaryLineReport'></SalaryLineReport>
                        </a-col>
                        <a-col :xl="8" :lg="12" :md="12" :sm="24" :xs="24">
                            <ranking-list title="短信部门排行" :list="reportData.noteTimesDepartmentRankList"/>
                        </a-col>
                    </a-row></a-tab-pane>
                </a-tabs>
            </a-row>
        </a-card>
    </div>
</template>
<script>
    import SalaryBarReport from '../../../components/salary/SalaryBarReport'
    import SalaryLineReport from '../../../components/salary/SalaryLineReport'
    import RankingList from "../../../components/chart/RankingList"
    import {queryReportHeader,queryReportBody} from '@/services/salaryQuery'
    import {mapGetters} from "vuex";

    const rankList = []

    for (let i = 0; i < 8; i++) {
        rankList.push({
            name: '桃源村' + i + '号店',
                total: 1234.56 - i * 100
        })
    }
    export default {
        data () {
            return {
                rankList,
                myChart:null,
                myBarChart: null,
                myLineChart:null,
                topCardHeadStyle:{
                    'color': 'rgba(0, 0, 0, 0.35)',
                    'font-size':'14px',
                    'font-weight':'normal'
                },
                topCardBodyStyle:{
                    'height':'150px',
                    'vertical':'middle'
                },
                rangePickerValue:[],
                rangePickerMode:['month', 'month'],
                rangePickerOpen:false,
                tabsPanelActivityVal:1,
                reportData:{
                    lastMonthNoteNumber:'',
                    lastMonthVisitTimes:'',
                    currentMonthNoteNumber:'',
                    currentMonthSalary:'',
                    currentMonthVisitTimes:'',
                    currentMonthImportNumber:'',
                    lastMonthImportNumber:'',
                    lastMonthSalary:'',
                    salaryDepartmentRankList:[],
                    noteTimesDepartmentRankList:[],
                }
            };
        },
        computed: {
            ...mapGetters('account', ['user']),
        },
        methods: {
            rangePickerHandleChange(value) {
                this.rangePickerValue = value;
            },
            rangePickerHandlePanelChange(value, mode) {
                this.rangePickerValue = value;
                this.rangePickerMode = [mode[0] === 'date' ? 'month' : mode[0], mode[1] === 'date' ? 'month' : mode[1]];
            },
            rangePickerOpenChange(status){
                this.rangePickerOpen = status;
            },
            rangePickerCommit(){
                this.loadBoayData(this.rangePickerValue[0].format("YYYY-MM"),this.rangePickerValue[1].format("YYYY-MM"));
                this.rangePickerOpen = false;
            },
            tabPanelChange(av){
                if(av==1){
                    this.myChart = this.$refs.salaryBarReport.salaryBarChart;
                }else{
                    this.myChart = this.$refs.salaryLineReport.salaryLineChart;
                }
                this.myChart.resize();
                window.onresize = () => {
                    return (() => {
                        this.myChart.resize();
                    })()
                }
            },
            loadHeaderData(){
                queryReportHeader(this.user.site).then(res => {
                    if (res.data.success) {
                        this.reportData.currentMonthSalary = res.data.data.currentMonthSalary;
                        this.reportData.lastMonthSalary = res.data.data.lastMonthSalary;
                        this.reportData.currentMonthImportNumber = res.data.data.currentMonthImportNumber;
                        this.reportData.lastMonthImportNumber = res.data.data.lastMonthImportNumber;
                        this.reportData.currentMonthNoteNumber = res.data.data.currentMonthNoteNumber;
                        this.reportData.lastMonthNoteNumber = res.data.data.lastMonthNoteNumber;
                        this.reportData.currentMonthVisitTimes = res.data.data.currentMonthVisitTimes;
                        this.reportData.lastMonthVisitTimes = res.data.data.lastMonthVisitTimes;
                        this.reportData.salaryDepartmentRankList = res.data.data.salaryDepartmentRankList;
                        this.reportData.noteTimesDepartmentRankList = res.data.data.noteTimesDepartmentRankList;
                    }
                }).catch((error) => {

                })
            },
            loadBoayData(staDate,endDate){
                const dateFormData = new FormData();
                dateFormData.append("staDate", staDate);
                dateFormData.append("endDate", endDate);
                dateFormData.append("site", this.user.site);
                queryReportBody(dateFormData).then(res => {
                    if (res.data.success) {
                        const resultData = res.data.data;
                        let salaryListDate = [];
                        let salaryListData = [];
                        for(let i=0;i<resultData.salaryList.length;i++){
                            salaryListDate.push(resultData.salaryList[i].SALARY_DATE);
                            salaryListData.push(resultData.salaryList[i].GROSS_PAY);
                        }
                        let noteListDate = [];
                        let noteListData = [];
                        for(let i=0;i<resultData.noteTimesList.length;i++){
                            noteListDate.push(resultData.noteTimesList[i].NOTE_DATE);
                            noteListData.push(resultData.noteTimesList[i].NOTE_TIMES);
                        }
                        this.$refs.salaryBarReport.resetChart(salaryListDate,salaryListData);
                        this.$refs.salaryLineReport.resetChart(noteListDate,noteListData);
                    }
                }).catch((error) => {

                })
            }

        },
        created() {
            this.loadHeaderData();
            this.loadBoayData("","");
        },
        mounted() {
            this.myChart = this.$refs.salaryBarReport.salaryBarChart;
            // this.$refs.salaryBarReport.testChild(123456);
            window.onresize = () => {
                return (() => {
                    this.myChart.resize();
                })()
            }
        },
        components: {
            SalaryBarReport,
            SalaryLineReport,
            RankingList
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

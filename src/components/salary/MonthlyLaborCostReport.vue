<template>
    <div>
        <a-spin :spinning="spinning" size="large">
            <div class="search" style="display: inline-block;">
                <a-input-number placeholder="比率" style="margin-right: 18px;" v-model="rate"/>
                <a-input-number placeholder="年份" style="margin-right: 10px;"  v-model="year" :min="yearMin" :max="yearMax"/>
                <a-button shape="circle" icon="search" @click="getMonthlyLaborCost" style="" size="small"/>
            </div>
            <div class="operator" style="display: inline-block;float:right;">
                <a-button type="primary" icon="export" @click="exportData">报表导出</a-button>
            </div>

            <a-table :columns="columns"
                     :pagination="false"
                     :data-source="dataSource">
            </a-table>
        </a-spin>
    </div>
</template>
<script>
    import {getMonthlyLaborCost} from '@/services/salaryReport'
    import notification from 'ant-design-vue/es/notification'
    import {BASE_URL} from '@/services/api'
    const columns = [
        {title: '月份', dataIndex: 'REMARK', key: 'REMARK'},
        {title: '人数',  dataIndex: 'HN', key: 'HN', align: 'center'},
        {title: '应发工资',  dataIndex: 'GP', key: 'GP', align: 'center'},
        {title: '保险公积金',  dataIndex: 'IAF', key: 'IAF', align: 'center'},
        {title: '年终奖',  dataIndex: 'WAB', key: 'WAB', align: 'center'},
        {title: '13、14月工资',  dataIndex: 'WAS', key: 'WAS', align: 'center'},
        {title: '福利',  dataIndex: 'WAW', key: 'WAW', align: 'center'},
        {title: '合计',  dataIndex: 'TOTAL', key: 'TOTAL', align: 'center'},
    ];

    const dataSource = [];

    export default {
        name: "MonthlyLaborCostReport",
        data() {
            return {
                dataSource:dataSource,
                columns:columns,
                year:2020,
                rate:null,
                yearMin:1949,
                yearMax:2020,
                spinning: false,
            };
        },
        methods: {
            getMonthlyLaborCost(){
                if(this.year==null || this.rate==null || this.year=='' || this.rate==''){
                    notification.error({
                        message: '请选择年份和比率后进行查询！'
                    })
                    return
                }
                this.spinning = true;
                const formData = new FormData();
                formData.set("year", this.year);
                formData.set("rate", this.rate);
                getMonthlyLaborCost(formData).then(res => {
                    if (res.data.success) {
                        this.dataSource = res.data.data;
                        this.spinning = false;
                    }
                }).catch((error) => {

                })
            },
            exportData(){
                if(this.year==null || this.rate==null || this.year=='' || this.rate==''){
                    notification.error({
                        message: '请选择年份和比率后进行导出！'
                    })
                    return
                }
                location.href=BASE_URL+'/salaryReport/directExportExcel?year='+this.year+'&rate='+this.rate
            },
        },
        created() {
            this.yearMax = new Date().getFullYear()+1;
            this.year = new Date().getFullYear();
        },
    };
</script>

<style lang="less" scoped>

</style>

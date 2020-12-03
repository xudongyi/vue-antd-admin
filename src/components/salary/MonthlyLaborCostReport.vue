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
    import {mapGetters} from "vuex";
    const columns = [
        {title: '月份', dataIndex: 'REMARK', key: 'REMARK'},
        {title: '人数',  dataIndex: 'RS', key: 'RS', align: 'center'},
        {title: '应发工资',  dataIndex: 'YFGZ', key: 'YFGZ', align: 'center'},
        {title: '保险公积金',  dataIndex: 'GJJ', key: 'GJJ', align: 'center'},
        {title: '奖金',  dataIndex: 'JJ', key: 'JJ', align: 'center'},
        {title: '13月工资',  dataIndex: 'SSX', key: 'SSX', align: 'center'},
        {title: '福利',  dataIndex: 'FL', key: 'FL', align: 'center'},
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
        computed: {
            ...mapGetters('account', ['user']),
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
                formData.append("year", this.year);
                formData.append("rate", this.rate);
                formData.append("site", this.user.site);

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
                location.href=BASE_URL+'/salaryReport/directExportExcel?year='+this.year+'&rate='+this.rate+'&site='+this.user.site
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

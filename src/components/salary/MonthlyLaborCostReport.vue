<template>
    <div>
        <div class="operator">
            <a-button type="primary" icon="export" @click="exportData">报表导出</a-button>
        </div>
        <a-table :columns="columns"
                 :pagination="false"
                 :data-source="dataSource">
        </a-table>
    </div>
</template>
<script>
    import {getMonthlyLaborCost} from '@/services/salaryReport'

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
            };
        },
        methods: {
            getMonthlyLaborCost(year,rate){
                const formData = new FormData();
                formData.set("year", year);
                formData.set("rate", rate);
                getMonthlyLaborCost(formData).then(res => {
                    if (res.data.success) {
                        this.dataSource = res.data.data;
                    }
                }).catch((error) => {
                })
            },
            exportData(){

            }
        },
        created() {
            //this.getMonthlyLaborCost();
        },
    };
</script>

<style lang="less" scoped>

</style>

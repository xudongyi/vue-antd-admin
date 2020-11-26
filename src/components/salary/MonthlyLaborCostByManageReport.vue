<template>
    <div>
        <a-spin :spinning="spinning" size="large">
            <div style="margin-bottom: 18px;">
                <div class="search" style="display: inline-block;">
                    <a-input-number placeholder="比率" style="margin-right: 18px;" v-model="rate"/>
                    <a-input-number placeholder="年份" style="margin-right: 10px;"  v-model="year" :min="yearMin" :max="yearMax"/>
                    <a-button shape="circle" icon="search" @click="getMonthlyLaborCostByDept" style="" size="small"/>
                </div>
                <div class="operator" style="display: inline-block;float:right;">
                    <a-button type="primary" icon="export" @click="exportData">报表导出</a-button>
                </div>
            </div>
            <a-table :columns="columns"
                     :pagination="false"
                     :scroll="{ x: 4000}"
                     bordered
                     :data-source="dataSource">
            </a-table>
        </a-spin>
    </div>
</template>
<script>
    import {getMonthlyLaborCostByManage} from '@/services/salaryReport'
    import notification from 'ant-design-vue/es/notification'
    import {BASE_URL} from '@/services/api'
    import {mapGetters} from "vuex";

    const columns = [
        {title: '部门', dataIndex: 'departName', key: 'departName',fixed: 'left',width:200},
        {title: '1月',
            children: [
                {title: '人数', dataIndex: 'janHrmNumber', key: 'janHrmNumber', width: 100},
                {title: '金额', dataIndex: 'janGrossPay', key: 'janGrossPay', width: 100},
                {title: '福利费', dataIndex: 'janWelfareAmountWeal', key: 'janWelfareAmountWeal', width: 100},
                {title: '保险公积金', dataIndex: 'janIaf', key: 'janIaf', width: 200},
                {title: '13、14月工资', dataIndex: 'janWelfareAmountSalaries', key: 'janWelfareAmountSalaries', width: 200},
                {title: '奖金', dataIndex: 'janWelfareAmountBonus', key: 'janWelfareAmountBonus', width: 100},
                {title: '小计', dataIndex: 'janSubtotal', key: 'janSubtotal', width: 100},
            ],
        },
        {title: '2月',
            children: [
                {title: '人数', dataIndex: 'febHrmNumber', key: 'febHrmNumber', width: 100},
                {title: '金额', dataIndex: 'febGrossPay', key: 'febGrossPay', width: 100},
                {title: '福利费', dataIndex: 'febWelfareAmountWeal', key: 'febWelfareAmountWeal', width: 100},
                {title: '保险公积金', dataIndex: 'febIaf', key: 'febIaf', width: 200},
                {title: '13、14月工资', dataIndex: 'febWelfareAmountSalaries', key: 'febWelfareAmountSalaries', width: 200},
                {title: '奖金', dataIndex: 'febWelfareAmountBonus', key: 'febWelfareAmountBonus', width: 100},
                {title: '小计', dataIndex: 'febSubtotal', key: 'febSubtotal', width: 100},
            ],
        },
        {title: '3月',
            children: [
                {title: '人数', dataIndex: 'marHrmNumber', key: 'marHrmNumber', width: 100},
                {title: '金额', dataIndex: 'marGrossPay', key: 'marGrossPay', width: 100},
                {title: '福利费', dataIndex: 'marWelfareAmountWeal', key: 'marWelfareAmountWeal', width: 100},
                {title: '保险公积金', dataIndex: 'marIaf', key: 'marIaf', width: 200},
                {title: '13、14月工资', dataIndex: 'marWelfareAmountSalaries', key: 'marWelfareAmountSalaries', width: 200},
                {title: '奖金', dataIndex: 'marWelfareAmountBonus', key: 'marWelfareAmountBonus', width: 100},
                {title: '小计', dataIndex: 'marSubtotal', key: 'marSubtotal', width: 100},
            ],
        },
        {title: '4月',
            children: [
                {title: '人数', dataIndex: 'aprHrmNumber', key: 'aprHrmNumber', width: 100},
                {title: '金额', dataIndex: 'aprGrossPay', key: 'aprGrossPay', width: 100},
                {title: '福利费', dataIndex: 'aprWelfareAmountWeal', key: 'aprWelfareAmountWeal', width: 100},
                {title: '保险公积金', dataIndex: 'aprIaf', key: 'aprIaf', width: 200},
                {title: '13、14月工资', dataIndex: 'aprWelfareAmountSalaries', key: 'aprWelfareAmountSalaries', width: 200},
                {title: '奖金', dataIndex: 'aprWelfareAmountBonus', key: 'aprWelfareAmountBonus', width: 100},
                {title: '小计', dataIndex: 'aprSubtotal', key: 'aprSubtotal', width: 100},
            ],
        },
        {title: '5月',
            children: [
                {title: '人数', dataIndex: 'mayHrmNumber', key: 'mayHrmNumber', width: 100},
                {title: '金额', dataIndex: 'mayGrossPay', key: 'mayGrossPay', width: 100},
                {title: '福利费', dataIndex: 'mayWelfareAmountWeal', key: 'mayWelfareAmountWeal', width: 100},
                {title: '保险公积金', dataIndex: 'mayIaf', key: 'mayIaf', width: 200},
                {title: '13、14月工资', dataIndex: 'mayWelfareAmountSalaries', key: 'mayWelfareAmountSalaries', width: 200},
                {title: '奖金', dataIndex: 'mayWelfareAmountBonus', key: 'mayWelfareAmountBonus', width: 100},
                {title: '小计', dataIndex: 'maySubtotal', key: 'maySubtotal', width: 100},
            ],
        },
        {title: '6月',
            children: [
                {title: '人数', dataIndex: 'junHrmNumber', key: 'junHrmNumber', width: 100},
                {title: '金额', dataIndex: 'junGrossPay', key: 'junGrossPay', width: 100},
                {title: '福利费', dataIndex: 'junWelfareAmountWeal', key: 'junWelfareAmountWeal', width: 100},
                {title: '保险公积金', dataIndex: 'junIaf', key: 'junIaf', width: 200},
                {title: '13、14月工资', dataIndex: 'junWelfareAmountSalaries', key: 'junWelfareAmountSalaries', width: 200},
                {title: '奖金', dataIndex: 'junWelfareAmountBonus', key: 'junWelfareAmountBonus', width: 100},
                {title: '小计', dataIndex: 'junSubtotal', key: 'junSubtotal', width: 100},
            ],
        },
        {title: '7月',
            children: [
                {title: '人数', dataIndex: 'julHrmNumber', key: 'julHrmNumber', width: 100},
                {title: '金额', dataIndex: 'julGrossPay', key: 'julGrossPay', width: 100},
                {title: '福利费', dataIndex: 'julWelfareAmountWeal', key: 'julWelfareAmountWeal', width: 100},
                {title: '保险公积金', dataIndex: 'julIaf', key: 'julIaf', width: 200},
                {title: '13、14月工资', dataIndex: 'julWelfareAmountSalaries', key: 'julWelfareAmountSalaries', width: 200},
                {title: '奖金', dataIndex: 'julWelfareAmountBonus', key: 'julWelfareAmountBonus', width: 100},
                {title: '小计', dataIndex: 'julSubtotal', key: 'julSubtotal', width: 100},
            ],
        },
        {title: '8月',
            children: [
                {title: '人数', dataIndex: 'augHrmNumber', key: 'augHrmNumber', width: 100},
                {title: '金额', dataIndex: 'augGrossPay', key: 'augGrossPay', width: 100},
                {title: '福利费', dataIndex: 'augWelfareAmountWeal', key: 'augWelfareAmountWeal', width: 100},
                {title: '保险公积金', dataIndex: 'augIaf', key: 'augIaf', width: 200},
                {title: '13、14月工资', dataIndex: 'augWelfareAmountSalaries', key: 'augWelfareAmountSalaries', width: 200},
                {title: '奖金', dataIndex: 'augWelfareAmountBonus', key: 'augWelfareAmountBonus', width: 100},
                {title: '小计', dataIndex: 'augSubtotal', key: 'augSubtotal', width: 100},
            ],
        },
        {title: '9月',
            children: [
                {title: '人数', dataIndex: 'sepHrmNumber', key: 'sepHrmNumber', width: 100},
                {title: '金额', dataIndex: 'sepGrossPay', key: 'sepGrossPay', width: 100},
                {title: '福利费', dataIndex: 'sepWelfareAmountWeal', key: 'sepWelfareAmountWeal', width: 100},
                {title: '保险公积金', dataIndex: 'sepIaf', key: 'sepIaf', width: 200},
                {title: '13、14月工资', dataIndex: 'sepWelfareAmountSalaries', key: 'sepWelfareAmountSalaries', width: 200},
                {title: '奖金', dataIndex: 'sepWelfareAmountBonus', key: 'sepWelfareAmountBonus', width: 100},
                {title: '小计', dataIndex: 'sepSubtotal', key: 'sepSubtotal', width: 100},
            ],
        },
        {title: '10月',
            children: [
                {title: '人数', dataIndex: 'octHrmNumber', key: 'octHrmNumber', width: 100},
                {title: '金额', dataIndex: 'octGrossPay', key: 'octGrossPay', width: 100},
                {title: '福利费', dataIndex: 'octWelfareAmountWeal', key: 'octWelfareAmountWeal', width: 100},
                {title: '保险公积金', dataIndex: 'octIaf', key: 'octIaf', width: 200},
                {title: '13、14月工资', dataIndex: 'octWelfareAmountSalaries', key: 'octWelfareAmountSalaries', width: 200},
                {title: '奖金', dataIndex: 'octWelfareAmountBonus', key: 'octWelfareAmountBonus', width: 100},
                {title: '小计', dataIndex: 'octSubtotal', key: 'octSubtotal', width: 100},
            ],
        },
        {title: '11月',
            children: [
                {title: '人数', dataIndex: 'novHrmNumber', key: 'novHrmNumber', width: 100},
                {title: '金额', dataIndex: 'novGrossPay', key: 'novGrossPay', width: 100},
                {title: '福利费', dataIndex: 'novWelfareAmountWeal', key: 'novWelfareAmountWeal', width: 100},
                {title: '保险公积金', dataIndex: 'novIaf', key: 'novIaf', width: 200},
                {title: '13、14月工资', dataIndex: 'novWelfareAmountSalaries', key: 'novWelfareAmountSalaries', width: 200},
                {title: '奖金', dataIndex: 'novWelfareAmountBonus', key: 'novWelfareAmountBonus', width: 100},
                {title: '小计', dataIndex: 'novSubtotal', key: 'novSubtotal', width: 100},
            ],
        },
        {title: '12月',
            children: [
                {title: '人数', dataIndex: 'decHrmNumber', key: 'decHrmNumber', width: 100},
                {title: '金额', dataIndex: 'decGrossPay', key: 'decGrossPay', width: 100},
                {title: '福利费', dataIndex: 'decWelfareAmountWeal', key: 'decWelfareAmountWeal', width: 100},
                {title: '保险公积金', dataIndex: 'decIaf', key: 'decIaf', width: 200},
                {title: '13、14月工资', dataIndex: 'decWelfareAmountSalaries', key: 'decWelfareAmountSalaries', width: 200},
                {title: '奖金', dataIndex: 'decWelfareAmountBonus', key: 'decWelfareAmountBonus', width: 100},
                {title: '小计', dataIndex: 'decSubtotal', key: 'decSubtotal', width: 100},
            ],
        },
        {title: '1-12月',
            children: [
                {title: '人数', dataIndex: 'wholeHrmNumber', key: 'wholeHrmNumber', width: 100},
                {title: '金额', dataIndex: 'wholeGrossPay', key: 'wholeGrossPay', width: 100},
                {title: '福利费', dataIndex: 'wholeWelfareAmountWeal', key: 'wholeWelfareAmountWeal', width: 100},
                {title: '保险公积金', dataIndex: 'wholeIaf', key: 'wholeIaf', width: 200},
                {title: '13、14月工资', dataIndex: 'wholeWelfareAmountSalaries', key: 'wholeWelfareAmountSalaries', width: 200},
                {title: '奖金', dataIndex: 'wholeWelfareAmountBonus', key: 'wholeWelfareAmountBonus', width: 100},
                {title: '小计', dataIndex: 'wholeSubtotal', key: 'wholeSubtotal', width: 100},
            ],
        },
    ];

    const dataSource = [];

    export default {
        name: "MonthlyLaborCostByManageReport",
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
            getMonthlyLaborCostByDept(){
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
                formData.set("tabId", '2');
                formData.set("site", this.user.site);
                formData.set("typeIds", '01,02');

                getMonthlyLaborCostByManage(formData).then(res => {
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
                location.href=BASE_URL+'/salaryReport/typeLaborCostByDateExportExcel?year='+this.year+'&rate='+this.rate+'&site='+this.user.site+'&tabId='+"2"+'&typeIds=01,02';
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

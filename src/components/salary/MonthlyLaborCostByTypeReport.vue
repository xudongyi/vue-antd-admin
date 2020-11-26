<template>
    <div>
        <a-spin :spinning="spinning" size="large">
            <div style="margin-bottom: 18px;">
                <div class="search" style="display: inline-block;">
                    <a-input-number placeholder="比率" style="margin-right: 18px;" v-model="rate"/>
                    <a-month-picker style="margin-right: 10px;" :value="month" placeholder="选择薪资月份" @change="onChangeMonth"/>
                    <a-button shape="circle" icon="search" @click="getMonthlyLaborCostByType" style="" size="small"/>
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
    import {getMonthlyLaborCostByType} from '@/services/salaryReport'
    import notification from 'ant-design-vue/es/notification'
    import {BASE_URL} from '@/services/api'
    import {mapGetters} from "vuex";

    const columns = [
        {title: '部门', dataIndex: 'departName', key: 'departName',fixed: 'left',width:200},
        {title: '管理技术人员',
            children: [
                {title: '人数', dataIndex: 'mtHrmNumber', key: 'mtHrmNumber', width: 100},
                {title: '金额', dataIndex: 'mtGrossPay', key: 'mtGrossPay', width: 100},
                {title: '福利费', dataIndex: 'mtWelfareAmountWeal', key: 'mtWelfareAmountWeal', width: 100},
                {title: '公积金', dataIndex: 'mtAcFund', key: 'mtAcFund', width: 100},
                {title: '失保', dataIndex: 'mtLoi', key: 'mtLoi', width: 100},
                {title: '保险公积金', dataIndex: 'mtIaf', key: 'mtIaf', width: 200},
                {title: '13、14月工资', dataIndex: 'mtWelfareAmountSalaries', key: 'mtWelfareAmountSalaries', width: 200},
                {title: '奖金', dataIndex: 'mtWelfareAmountBonus', key: 'mtWelfareAmountBonus', width: 100},
                {title: '小计', dataIndex: 'mtSubtotal', key: 'mtSubtotal', width: 100},
            ],
        },
        {title: '工程技术人员',
            children: [
                {title: '人数', dataIndex: 'etHrmNumber', key: 'etHrmNumber', width: 100},
                {title: '金额', dataIndex: 'etGrossPay', key: 'etGrossPay', width: 100},
                {title: '福利费', dataIndex: 'etWelfareAmountWeal', key: 'etWelfareAmountWeal', width: 100},
                {title: '公积金', dataIndex: 'etAcFund', key: 'etAcFund', width: 100},
                {title: '失保', dataIndex: 'etLoi', key: 'etLoi', width: 100},
                {title: '保险公积金', dataIndex: 'etIaf', key: 'etIaf', width: 200},
                {title: '13、14月工资', dataIndex: 'etWelfareAmountSalaries', key: 'etWelfareAmountSalaries', width: 200},
                {title: '奖金', dataIndex: 'etWelfareAmountBonus', key: 'etWelfareAmountBonus', width: 100},
                {title: '小计', dataIndex: 'etSubtotal', key: 'etSubtotal', width: 100},
            ],
        },
        {title: '管技人员合计',
            children: [
                {title: '人数', dataIndex: 'mtTotalHrmNumber', key: 'mtTotalHrmNumber', width: 100},
                {title: '金额', dataIndex: 'mtTotalGrossPay', key: 'mtTotalGrossPay', width: 100},
                {title: '福利费', dataIndex: 'mtTotalWelfareAmountWeal', key: 'mtTotalWelfareAmountWeal', width: 100},
                {title: '公积金', dataIndex: 'mtTotalAcFund', key: 'mtTotalAcFund', width: 100},
                {title: '失保', dataIndex: 'mtTotalLoi', key: 'mtTotalLoi', width: 100},
                {title: '保险公积金', dataIndex: 'mtTotalIaf', key: 'mtTotalIaf', width: 200},
                {title: '13、14月工资', dataIndex: 'mtTotalWelfareAmountSalaries', key: 'mtTotalWelfareAmountSalaries', width: 200},
                {title: '奖金', dataIndex: 'mtTotalWelfareAmountBonus', key: 'mtTotalWelfareAmountBonus', width: 100},
                {title: '小计', dataIndex: 'mtTotalSubtotal', key: 'mtTotalSubtotal', width: 100},
            ],
        },
        {title: '生产作业人员',
            children: [
                {title: '人数', dataIndex: 'prodHrmNumber', key: 'prodHrmNumber', width: 100},
                {title: '金额', dataIndex: 'prodGrossPay', key: 'prodGrossPay', width: 100},
                {title: '福利费', dataIndex: 'prodWelfareAmountWeal', key: 'prodWelfareAmountWeal', width: 100},
                {title: '公积金', dataIndex: 'prodAcFund', key: 'prodAcFund', width: 100},
                {title: '失保', dataIndex: 'prodLoi', key: 'prodLoi', width: 100},
                {title: '保险公积金', dataIndex: 'prodIaf', key: 'prodIaf', width: 200},
                {title: '13、14月工资', dataIndex: 'prodWelfareAmountSalaries', key: 'prodWelfareAmountSalaries', width: 200},
                {title: '奖金', dataIndex: 'prodWelfareAmountBonus', key: 'prodWelfareAmountBonus', width: 100},
                {title: '小计', dataIndex: 'prodSubtotal', key: 'prodSubtotal', width: 100},
            ],
        },
        {title: '后勤服务人员',
            children: [
                {title: '人数', dataIndex: 'logisHrmNumber', key: 'logisHrmNumber', width: 100},
                {title: '金额', dataIndex: 'logisGrossPay', key: 'logisGrossPay', width: 100},
                {title: '福利费', dataIndex: 'logisWelfareAmountWeal', key: 'logisWelfareAmountWeal', width: 100},
                {title: '公积金', dataIndex: 'logisAcFund', key: 'logisAcFund', width: 100},
                {title: '失保', dataIndex: 'logisLoi', key: 'logisLoi', width: 100},
                {title: '保险公积金', dataIndex: 'logisIaf', key: 'logisIaf', width: 200},
                {title: '13、14月工资', dataIndex: 'logisWelfareAmountSalaries', key: 'logisWelfareAmountSalaries', width: 200},
                {title: '奖金', dataIndex: 'logisWelfareAmountBonus', key: 'logisWelfareAmountBonus', width: 100},
                {title: '小计', dataIndex: 'logisSubtotal', key: 'logisSubtotal', width: 100},
            ],
        },
        {title: '质量检验人员',
            children: [
                {title: '人数', dataIndex: 'qiHrmNumber', key: 'qiHrmNumber', width: 100},
                {title: '金额', dataIndex: 'qiGrossPay', key: 'qiGrossPay', width: 100},
                {title: '福利费', dataIndex: 'qiWelfareAmountWeal', key: 'qiWelfareAmountWeal', width: 100},
                {title: '公积金', dataIndex: 'qiAcFund', key: 'qiAcFund', width: 100},
                {title: '失保', dataIndex: 'qiLoi', key: 'qiLoi', width: 100},
                {title: '保险公积金', dataIndex: 'qiIaf', key: 'qiIaf', width: 200},
                {title: '13、14月工资', dataIndex: 'qiWelfareAmountSalaries', key: 'qiWelfareAmountSalaries', width: 200},
                {title: '奖金', dataIndex: 'qiWelfareAmountBonus', key: 'qiWelfareAmountBonus', width: 100},
                {title: '小计', dataIndex: 'qiSubtotal', key: 'qiSubtotal', width: 100},
            ],
        },
        {title: '生产保障人员',
            children: [
                {title: '人数', dataIndex: 'psHrmNumber', key: 'psHrmNumber', width: 100},
                {title: '金额', dataIndex: 'psGrossPay', key: 'psGrossPay', width: 100},
                {title: '福利费', dataIndex: 'psWelfareAmountWeal', key: 'psWelfareAmountWeal', width: 100},
                {title: '公积金', dataIndex: 'psAcFund', key: 'psAcFund', width: 100},
                {title: '失保', dataIndex: 'psLoi', key: 'psLoi', width: 100},
                {title: '保险公积金', dataIndex: 'psIaf', key: 'psIaf', width: 200},
                {title: '13、14月工资', dataIndex: 'psWelfareAmountSalaries', key: 'psWelfareAmountSalaries', width: 200},
                {title: '奖金', dataIndex: 'psWelfareAmountBonus', key: 'psWelfareAmountBonus', width: 100},
                {title: '小计', dataIndex: 'psSubtotal', key: 'psSubtotal', width: 100},
            ],
        },
        {title: '合计',
            children: [
                {title: '人数', dataIndex: 'totalHrmNumber', key: 'totalHrmNumber', width: 100},
                {title: '金额', dataIndex: 'totalGrossPay', key: 'totalGrossPay', width: 100},
                {title: '福利费', dataIndex: 'totalWelfareAmountWeal', key: 'totalWelfareAmountWeal', width: 100},
                {title: '公积金', dataIndex: 'totalAcFund', key: 'totalAcFund', width: 100},
                {title: '失保', dataIndex: 'totalLoi', key: 'totalLoi', width: 100},
                {title: '保险公积金', dataIndex: 'totalIaf', key: 'totalIaf', width: 200},
                {title: '13、14月工资', dataIndex: 'totalWelfareAmountSalaries', key: 'totalWelfareAmountSalaries', width: 200},
                {title: '奖金', dataIndex: 'totalWelfareAmountBonus', key: 'totalWelfareAmountBonus', width: 100},
                {title: '小计', dataIndex: 'totalSubtotal', key: 'totalSubtotal', width: 100},
            ],
        }
    ];

    const dataSource = [];

    export default {
        name: "MonthlyLaborCostByTypeReport",
        data() {
            return {
                dataSource:dataSource,
                columns:columns,
                rate:null,
                spinning: false,
                month:null,
                ipagination:{
                    current: 1,
                    pageSize: 10,
                    pageSizeOptions: ['10', '20', '30','50','100'],
                    showTotal: (total, range) => {
                        return range[0] + "-" + range[1] + " 共" + total + "条"
                    },
                    showQuickJumper: true,
                    showSizeChanger: true,
                    total: 0
                },
            };
        },
        computed: {
            ...mapGetters('account', ['user']),
        },
        methods: {
            getMonthlyLaborCostByType(){
                if(this.month==null || this.rate==null || this.month=='' || this.rate==''){
                    notification.error({
                        message: '请选择月份和比率后进行查询！'
                    })
                    return
                }
                this.spinning = true;
                const formData = new FormData();
                formData.set("month", this.month);
                formData.set("rate", this.rate);
                formData.set("tabId", '1');
                formData.set("site", this.user.site);
                getMonthlyLaborCostByType(formData).then(res => {
                    if (res.data.success) {
                        this.dataSource = res.data.data;
                        this.spinning = false;
                    }
                }).catch((error) => {
                })
            },
            onChangeMonth(date, dateString) {
                this.month = dateString;
            },
            exportData(){
                if(this.month==null || this.rate==null || this.month=='' || this.rate==''){
                    notification.error({
                        message: '请选择月份和比率后进行导出！'
                    })
                    return
                }
                location.href=BASE_URL+'/salaryReport/monthlyLaborCostByTypeExportExcel?month='+this.month+'&rate='+this.rate+'&site='+this.user.site+'&tabId='+"1";
            },
        },
        created() {
            let currentDate = new Date();
            let currentYear = currentDate.getFullYear();
            let currentMonth = (currentDate.getMonth()+1).length==1?"0"+(currentDate.getMonth()+1):currentDate.getMonth()+1;
            this.month = currentYear+"-"+currentMonth;
        },
    };
</script>

<style lang="less" scoped>

</style>

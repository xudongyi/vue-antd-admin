<template>
    <div>
        <a-spin :spinning="spinning" size="large">
            <div style="margin-bottom: 18px;">
                <div class="search" style="display: inline-block;">
                    <a-input-number placeholder="比率" style="margin-right: 18px;" v-model="rate"/>
                    <a-input-number placeholder="年份" style="margin-right: 10px;"  v-model="year" :min="yearMin" :max="yearMax"/>
                    <a-button shape="circle" icon="search" @click="getMonthlyLaborCostByManufacturingDept" style="" size="small"/>
                </div>
                <div class="operator" style="display: inline-block;float:right;">
                    <a-button type="primary" icon="export" @click="exportData">报表导出</a-button>
                </div>
            </div>
            <table border="1px solid #ccc">
                <tr>
                    <th>月份</th><th>分期</th><th>部门</th><th>人数</th><th>金额</th><th>福利费</th><th>保险公积金</th><th>13、14月工资</th><th>年终奖</th><th>小计</th>
                </tr>
                <tr>
                    <td rowspan="11">2020-01</td><td rowspan="3">A1</td><td>组装一期</td><td>4</td><td>5</td><td>6</td><td>7</td><td>8</td><td>9</td><td>10</td>
                </tr>
                <tr>
                                                                        <td>测试一期</td><td>4</td><td>5</td><td>6</td><td>7</td><td>8</td><td>9</td><td>10</td>
                </tr>
                <tr>
                                                                        <td>合计</td><td>4</td><td>5</td><td>6</td><td>7</td><td>8</td><td>9</td><td>10</td>
                </tr>
                <tr>
                                                <td rowspan="3">D2</td><td>组装二期</td><td>4</td><td>5</td><td>6</td><td>7</td><td>8</td><td>9</td><td>10</td>
                </tr>
                <tr>
                                                                        <td>测试二期</td><td>4</td><td>5</td><td>6</td><td>7</td><td>8</td><td>9</td><td>10</td>
                </tr>
                <tr>
                                                                        <td>合计</td><td>4</td><td>5</td><td>6</td><td>7</td><td>8</td><td>9</td><td>10</td>
                </tr>
                <tr>
                                                <td rowspan="3">A3</td><td>组装三期</td><td>4</td><td>5</td><td>6</td><td>7</td><td>8</td><td>9</td><td>10</td>
                </tr>
                <tr>
                                                                        <td>测试三期</td><td>4</td><td>5</td><td>6</td><td>7</td><td>8</td><td>9</td><td>10</td>
                </tr>
                <tr>
                                                                        <td>合计</td><td>4</td><td>5</td><td>6</td><td>7</td><td>8</td><td>9</td><td>10</td>
                </tr>
                <tr>
                                                <td colspan="2">圆片级封装部</td><td>4</td><td>5</td><td>6</td><td>7</td><td>8</td><td>9</td><td>10</td>
                </tr>
                <tr>
                                                <td colspan="2">表面处理中心</td><td>4</td><td>5</td><td>6</td><td>7</td><td>8</td><td>9</td><td>10</td>
                </tr>
            </table>
        </a-spin>
    </div>
</template>
<script>
    import {getMonthlyLaborCostByManufacturingDept} from '@/services/salaryReport'
    import notification from 'ant-design-vue/es/notification'
    import {BASE_URL} from '@/services/api'

    const dataSource = [];
    export default {
        name: "MonthlyLaborCostByDeptReport",
        data() {
            return {
                spinning: false,
                year:2020,
                rate:null,
                yearMin:1949,
                yearMax:2020,
                dataSource:dataSource,
            };
        },
        methods: {
            getMonthlyLaborCostByManufacturingDept(){
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
                getMonthlyLaborCostByManufacturingDept(formData).then(res => {
                    if (res.data.success) {
                        this.dataSource = res.data.data;
                        // this.ipagination.total = res.data.data.total;
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
                location.href=BASE_URL+'/salaryReport/monthlyLaborCostByManufacturingDeptExportExcel?year='+this.year+'&rate='+this.rate
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

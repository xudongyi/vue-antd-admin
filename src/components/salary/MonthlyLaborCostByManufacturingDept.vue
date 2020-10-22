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
<!--            <table border="1px solid #ccc">-->
<!--                <tr>-->
<!--                    <th>月份</th><th>分期</th><th>部门</th><th>人数</th><th>金额</th><th>福利费</th><th>保险公积金</th><th>13、14月工资</th><th>年终奖</th><th>小计</th>-->
<!--                </tr>-->
<!--                <tr>-->
<!--                    <td rowspan="11">2020-01</td><td rowspan="3">A1</td><td>组装一期</td><td>4</td><td>5</td><td>6</td><td>7</td><td>8</td><td>9</td><td>10</td>-->
<!--                </tr>-->
<!--                <tr>-->
<!--                                                                        <td>测试一期</td><td>4</td><td>5</td><td>6</td><td>7</td><td>8</td><td>9</td><td>10</td>-->
<!--                </tr>-->
<!--                <tr>-->
<!--                                                                        <td>合计</td><td>4</td><td>5</td><td>6</td><td>7</td><td>8</td><td>9</td><td>10</td>-->
<!--                </tr>-->
<!--                <tr>-->
<!--                                                <td rowspan="3">D2</td><td>组装二期</td><td>4</td><td>5</td><td>6</td><td>7</td><td>8</td><td>9</td><td>10</td>-->
<!--                </tr>-->
<!--                <tr>-->
<!--                                                                        <td>测试二期</td><td>4</td><td>5</td><td>6</td><td>7</td><td>8</td><td>9</td><td>10</td>-->
<!--                </tr>-->
<!--                <tr>-->
<!--                                                                        <td>合计</td><td>4</td><td>5</td><td>6</td><td>7</td><td>8</td><td>9</td><td>10</td>-->
<!--                </tr>-->
<!--                <tr>-->
<!--                                                <td rowspan="3">A3</td><td>组装三期</td><td>4</td><td>5</td><td>6</td><td>7</td><td>8</td><td>9</td><td>10</td>-->
<!--                </tr>-->
<!--                <tr>-->
<!--                                                                        <td>测试三期</td><td>4</td><td>5</td><td>6</td><td>7</td><td>8</td><td>9</td><td>10</td>-->
<!--                </tr>-->
<!--                <tr>-->
<!--                                                                        <td>合计</td><td>4</td><td>5</td><td>6</td><td>7</td><td>8</td><td>9</td><td>10</td>-->
<!--                </tr>-->
<!--                <tr>-->
<!--                                                <td colspan="2">圆片级封装部</td><td>4</td><td>5</td><td>6</td><td>7</td><td>8</td><td>9</td><td>10</td>-->
<!--                </tr>-->
<!--                <tr>-->
<!--                                                <td colspan="2">表面处理中心</td><td>4</td><td>5</td><td>6</td><td>7</td><td>8</td><td>9</td><td>10</td>-->
<!--                </tr>-->
<!--            </table>-->
            <a-table :columns="columns"
                     :pagination="false"
                     :data-source="dataSource" bordered>
            </a-table>
        </a-spin>
    </div>
</template>
<script>
    import {getMonthlyLaborCostByManufacturingDept} from '@/services/salaryReport'
    import notification from 'ant-design-vue/es/notification'
    import {BASE_URL} from '@/services/api'

    const dataSource = [];
    const columns = [
        {title: '月份', dataIndex: 'salaryDate', key: 'salaryDate',
            customRender: (value, row, index) => {
                const obj = {
                    children: value,
                    attrs: {},
                };
                if (index%11 === 0) {
                    obj.attrs.rowSpan = 11;
                }else{
                    obj.attrs.rowSpan = 0;
                }
                return obj;
            },
        },
        {title: '分期',  dataIndex: 'parDepartName', key: 'parDepartName', align: 'center',
            customRender: (value, row, index) => {
                const obj = {
                    children: value,
                    attrs: {},
                };
                if (index%11 === 0||index%11 === 3||index%11 === 6) {
                    obj.attrs.rowSpan = 3;
                }else if(index%11 === 9||index%11 === 10){
                    obj.attrs.colSpan = 2;
                }else{
                    obj.attrs.rowSpan = 0;
                }
                return obj;
            },
        },
        {title: '部门',  dataIndex: 'departName', key: 'departName', align: 'center',
            customRender: (value, row, index) => {
                const obj = {
                    children: value,
                    attrs: {},
                };
                if(index%11 === 9||index%11 === 10){
                    obj.attrs.colSpan = 0;
                }
                return obj;
            },
        },
        {title: '人数',  dataIndex: 'userCount', key: 'userCount', align: 'center'},
        {title: '金额',  dataIndex: 'salary', key: 'salary', align: 'center'},
        {title: '福利费',  dataIndex: 'flf', key: 'flf', align: 'center'},
        {title: '保险公积金',  dataIndex: 'gjj', key: 'gjj', align: 'center'},
        {title: '13、14月工资',  dataIndex: 'otherSalary', key: 'otherSalary', align: 'center'},
        {title: '年终奖',  dataIndex: 'yearTotal', key: 'yearTotal', align: 'center'},
        {title: '小计',  dataIndex: 'total', key: 'total', align: 'center'},
    ];
    // <th>月份</th><th>分期</th><th>部门</th><th>人数</th><th>金额</th><th>福利费</th><th>保险公积金</th><th>13、14月工资</th><th>年终奖</th><th>小计</th>-->
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
                columns:columns,
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

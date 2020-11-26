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
<!--                    <th>月份</th><th>分期</th><th>部门</th><th>人数</th><th>金额</th><th>福利费</th><th>保险公积金</th><th>13、14月工资</th><th>奖金</th><th>小计</th>-->
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
    import {mapGetters} from "vuex";

    const dataSource = [];
    let parDepartNameTag=null
    let parDepartNameCount=1
    let parDepartNameCountCache = {}
    let columns = [];
    // <th>月份</th><th>分期</th><th>部门</th><th>人数</th><th>金额</th><th>福利费</th><th>保险公积金</th><th>13、14月工资</th><th>奖金</th><th>小计</th>-->
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
        computed: {
            ...mapGetters('account', ['user']),
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
                formData.set("tabId", '3');
                formData.set("site", this.user.site);
                getMonthlyLaborCostByManufacturingDept(formData).then(res => {
                    if (res.data.success) {
                        //清空缓存
                        parDepartNameTag=null
                        parDepartNameCount=1
                        parDepartNameCountCache = {}
                        columns = [];
                        parDepartNameTag =res.data.data[0].salaryDate+"_"+res.data.data[0].parDepartName
                        for(let i =1;i<res.data.data.length;i++){
                            let dataSourceSingle = res.data.data[i];
                            if((dataSourceSingle.salaryDate+"_"+dataSourceSingle.parDepartName)==parDepartNameTag){
                                parDepartNameCount++;
                            }else{
                                parDepartNameCountCache[parDepartNameTag] = {index:i-parDepartNameCount,count:parDepartNameCount}
                                parDepartNameTag = res.data.data[i].salaryDate+"_"+res.data.data[i].parDepartName;
                                parDepartNameCount = 1
                            }
                            if(i==res.data.data.length-1){
                                if(parDepartNameCount==1){
                                    parDepartNameCountCache[parDepartNameTag] = {index:i,count:parDepartNameCount}
                                    parDepartNameTag =res.data.data[i].salaryDate+"_"+res.data.data[i].parDepartName;
                                }else{
                                    parDepartNameCountCache[parDepartNameTag] = {index:i-parDepartNameCount+1,count:parDepartNameCount}
                                    parDepartNameTag =res.data.data[i].salaryDate+"_"+res.data.data[i].parDepartName;
                                }

                            }

                        }
                        console.log(parDepartNameCountCache)
                        //重新计算
                        this.columns = [
                            {title: '月份', dataIndex: 'salaryDate', key: 'salaryDate',
                                customRender: (value, row, index) => {
                                    const obj = {
                                        children: value,
                                        attrs: {},
                                    };
                                    let key0 = Object.keys(parDepartNameCountCache)[0].split('_')[0]
                                    let countAll = 0
                                    for(let key in parDepartNameCountCache){
                                        if(key.indexOf(key0)>-1){
                                            countAll+=parDepartNameCountCache[key].count
                                        }
                                    }
                                    if (index%countAll === 0) {
                                        obj.attrs.rowSpan = countAll;
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
                                    let i = 0;
                                    for(let key in parDepartNameCountCache){
                                        let indexCache =parDepartNameCountCache[key].index
                                        let count =parDepartNameCountCache[key].count
                                        if(index==indexCache){
                                            if(count>1){
                                                obj.attrs.rowSpan = count;
                                            }else{
                                                //obj.attrs.colSpan = 2;
                                            }
                                            break;
                                        }
                                        i++;
                                        if(Object.keys(parDepartNameCountCache).length==i){
                                            obj.attrs.rowSpan = 0;
                                        }
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
                                    for(let key in parDepartNameCountCache){
                                        let indexCache =parDepartNameCountCache[key].index
                                        let count =parDepartNameCountCache[key].count
                                        if(index==indexCache){
                                            if(count==1){
                                                //obj.attrs.colSpan = 0;
                                            }
                                            break;
                                        }
                                    }
                                    return obj;
                                },
                            },
                            {title: '人数',  dataIndex: 'userCount', key: 'userCount', align: 'center'},
                            {title: '金额',  dataIndex: 'salary', key: 'salary', align: 'center'},
                            {title: '福利费',  dataIndex: 'flf', key: 'flf', align: 'center'},
                            {title: '保险公积金',  dataIndex: 'gjj', key: 'gjj', align: 'center'},
                            {title: '13、14月工资',  dataIndex: 'otherSalary', key: 'otherSalary', align: 'center'},
                            {title: '奖金',  dataIndex: 'yearTotal', key: 'yearTotal', align: 'center'},
                            {title: '小计',  dataIndex: 'total', key: 'total', align: 'center'},
                        ];
                        this.dataSource = res.data.data;
                        this.spinning = false;
                    }
                }).catch((error) => {
                    console.log(error)
                })
            },
            exportData(){
                if(this.year==null || this.rate==null || this.year=='' || this.rate==''){
                    notification.error({
                        message: '请选择年份和比率后进行导出！'
                    })
                    return
                }
                location.href=BASE_URL+'/salaryReport/monthlyLaborCostByManufacturingDeptExportExcel?year='+this.year+'&rate='+this.rate+'&site='+"A"+'&tabId='+"3";
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

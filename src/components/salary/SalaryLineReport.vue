<template>
    <div id="SalaryLineId"  style="height:392px;width: 100%;"></div>
</template>
<script>
    export default {
        name: "SalaryLineReport",
        data () {
            return {
                salaryLineChart:null,
                option:{
                    title: {
                        text: "短信月份汇总",
                        x:'center',
                        textStyle:{
                            fontSize: 12,
                            fontWeight: 'normal',
                        }
                    },
                    color:'rgb(58,161,255)',
                    tooltip: {},
                    legend: {
                        data: ["元"]
                    },
                    xAxis: {
                        data: ["1月份", "2月份", "3月份", "4月份", "5月份", "6月份", "7月份", "8月份", "9月份", "10月份", "11月份", "12月份"]
                    },
                    yAxis: {},
                    series: [
                        {
                            name: "工资",
                            type: "line",
                            data: [2500, 2500, 2500, 2500, 3000, 2800,2500, 2500, 2800, 2700, 2500, 3000]
                        }
                    ]
                }

            };
        },
        methods: {
            drawChart() {
                // 基于准备好的dom，初始化echarts实例
                this.salaryLineChart = this.$echarts.init(document.getElementById("SalaryLineId"));
                // 使用刚指定的配置项和数据显示图表。
                this.salaryLineChart.setOption(this.option);
                setTimeout(() => {
                    this.salaryLineChart.resize();
                })
            },
            resetChart(date,data) {
                this.salaryLineChart.clear();
                this.option.xAxis.data = date;
                this.option.series[0].data = data;
                this.salaryLineChart.setOption(this.option);
                setTimeout(() => {
                    this.salaryLineChart.resize();
                })
            },
        },
        mounted() {
            const that = this;
            this.drawChart();
        },
    };
</script>

<style lang="less" scoped>

</style>

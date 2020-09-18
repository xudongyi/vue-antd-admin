<template>
    <div id="SalaryBarId" style="height:392px;width: 100%;"></div>
</template>
<script>
    export default {
        name: "SalaryBarReport",
        data() {
            return {
                salaryBarChart: null,
                option: {
                    title: {
                        text: "薪资月份汇总",
                        x: 'center',
                        textStyle: {
                            fontSize: 16,
                            fontWeight: 'bold',
                        }
                    },
                    color: 'rgb(58,161,255)',
                    tooltip: {},
                    legend: {
                        data: ["元"]
                    },
                    xAxis: {
                        data: []
                    },
                    yAxis: {},
                    series: [
                        {
                            name: "工资",
                            type: "bar",
                            data: []
                        }
                    ]
                }
            };
        },
        methods: {
            drawChart() {
                // 基于准备好的dom，初始化echarts实例
                this.salaryBarChart = this.$echarts.init(document.getElementById("SalaryBarId"));
                // 使用刚指定的配置项和数据显示图表。
                this.salaryBarChart.setOption(this.option);
                setTimeout(() => {
                    this.salaryBarChart.resize();
                })
            },
            resetChart(date,data) {
                this.salaryBarChart.clear();
                this.option.xAxis.data = date;
                this.option.series[0].data = data;
                this.salaryBarChart.setOption(this.option);
                setTimeout(() => {
                    this.salaryBarChart.resize();
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

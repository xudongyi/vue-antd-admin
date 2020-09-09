<template>
            <div id="SalaryLineId" style=""></div>
</template>
<script>
    export default {
        name: "SalaryLineReport",
        methods: {
            drawChart() {
                // 基于准备好的dom，初始化echarts实例
                let myChart = this.$echarts.init(document.getElementById("SalaryLineId"));
                // 指定图表的配置项和数据
                let option = {
                    title: {
                        text: "薪资查询"
                    },
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
                };
                // 使用刚指定的配置项和数据显示图表。
                myChart.setOption(option);
            }
        },
        mounted() {
            this.drawChart();
        }
    };
</script>

<style lang="less" scoped>

</style>

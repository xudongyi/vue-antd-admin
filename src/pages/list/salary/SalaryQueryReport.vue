<template>
    <a-card>
    <a-row>
        <a-col :xl="8" :lg="8" :md="8" :sm="8" :xs="8">
            <div>
                <SalaryBarReport style="width: 100%;height:400px;"></SalaryBarReport>
            </div>
        </a-col>
        <a-col :xl="8" :lg="8" :md="8" :sm="8" :xs="8">
            <div>
                <SalaryLineReport style="width: 100%;height:400px;"></SalaryLineReport>
            </div>
        </a-col>
    </a-row>
    </a-card>
</template>
<script>
    import SalaryBarReport from '../../../components/salary/SalaryBarReport'
    import SalaryLineReport from '../../../components/salary/SalaryLineReport'

    export default {
        data () {
            return {
                    chartPieData: {

                    }
            }
        },
        methods: {

        },
        components: {
            SalaryBarReport,
            SalaryLineReport
        }
    }
</script>

<style lang="less" scoped>

</style>

<template>
    <div style="">
        <a-row :gutter="[24, 24]">
            <a-col :sm="24" :md="12" :xl="6">
                <a-card title="当月导入人数" size="small" :headStyle="topCardHeadStyle" :bodyStyle="topCardBodyStyle">
                    <a-statistic :value="93" valueStyle="font-size:22px;height:100%;line-height:76px;" style="height:100%;">
                        <template #suffix>
                            <span> / 100</span>
                        </template>
                    </a-statistic>
                </a-card>
            </a-col>
            <a-col :sm="24" :md="12" :xl="6">
                <a-card title="Default size card" size="small" :headStyle="topCardHeadStyle" :bodyStyle="topCardBodyStyle">
                    <p>card content</p>
                    <p>card content</p>
                </a-card>
            </a-col>
            <a-col :sm="24" :md="12" :xl="6">
                <a-card title="Default size card" size="small" :headStyle="topCardHeadStyle" :bodyStyle="topCardBodyStyle">
                    <p>card content</p>
                    <p>card content</p>
                </a-card>
            </a-col>
            <a-col :sm="24" :md="12" :xl="6">
                <a-card title="Default size card" size="small" :headStyle="topCardHeadStyle" :bodyStyle="topCardBodyStyle">
                    <p>card content</p>
                    <p>card content</p>
                </a-card>
            </a-col>
        </a-row>
        <a-card style="margin-top: 24px" :bordered="false" :body-style="{padding: '24px'}">
            <a-row>
                <a-tabs default-active-key="1" size="large" :tab-bar-style="{marginBottom: '24px', paddingLeft: '16px'}">
                    <div class="extra-wrap" slot="tabBarExtraContent">
                        <div class="extra-item">
<!--                            <a>1</a>-->
<!--                            <a>2</a>-->
<!--                            <a>3</a>-->
<!--                            <a>4</a>-->
                        </div>
                        <a-range-picker :style="{width: '256px'}"></a-range-picker>
                    </div>
                    <a-tab-pane loading="true" tab="11111" key="1">
                        <a-col :xl="16" :lg="12" :md="12" :sm="24" :xs="24">
                                <SalaryBarReport style="width: 100%;height:400px;"></SalaryBarReport>
                        </a-col>
                    </a-tab-pane>
                    <a-tab-pane tab="22222" key="2"><a-row>
                        <a-col :xl="16" :lg="12" :md="12" :sm="24" :xs="24">
                                <SalaryLineReport style="width: 100%;height:400px;"></SalaryLineReport>
                        </a-col>
                    </a-row></a-tab-pane>
                </a-tabs>
            </a-row>
        </a-card>
    </div>
</template>
<script>
    import SalaryBarReport from '../../../components/salary/SalaryBarReport'
    import SalaryLineReport from '../../../components/salary/SalaryLineReport'

    export default {
        data () {
            return {
                mode1: 'time',
                mode2: ['month', 'month'],
                value: [],
                topCardHeadStyle:{
                    'color': 'rgba(0, 0, 0, 0.45)',
                    'font-size':'14px',
                    'font-weight':'normal'
                },
                topCardBodyStyle:{
                    'text-align':'center',
                    'height':'100px',
                    'vertical':'middle'
                }
            };
        },
        methods: {
            handlePanelChange2(value, mode) {
                this.value = value;
                this.mode2 = [mode[0] === 'date' ? 'month' : mode[0], mode[1] === 'date' ? 'month' : mode[1]];
            },
            handleChange(value) {
                this.value = value;
            },
        },
        components: {
            SalaryBarReport,
            SalaryLineReport
        }
    }
</script>

<style lang="less" scoped>
    .extra-wrap{
        .extra-item{
            display: inline-block;
            margin-right: 24px;
            a:not(:first-child){
                margin-left: 24px;
            }
        }
    }
    @media screen and (max-width: 992px){
        .extra-wrap .extra-item{
            display: none;
        }
    }
    @media screen and (max-width: 576px){
        .extra-wrap{
            display: none;
        }
    }

</style>

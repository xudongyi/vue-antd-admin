<template>
    <div name="salaryReport">
        <a-card style="margin-top: 24px" :bordered="false" :body-style="{padding: '24px'}">
            <a-row>
                <a-tabs  default-active-key="1"
                         @change="tabPanelChange"
                         tab-position="top"
                         :tab-bar-style="{marginBottom: '24px', paddingLeft: '16px'}">
                    <div class="extra-wrap" slot="tabBarExtraContent">
                        <div class="extra-item">
                        </div>
                        <a-range-picker :style="{width: '256px'}" format="YYYY-MM"
                                        :open="rangePickerOpen"
                                        :mode="rangePickerMode"
                                        :value="rangePickerValue"
                                        @panelChange="rangePickerHandlePanelChange"
                                        @change="rangePickerHandleChange"
                                        @openChange="rangePickerOpenChange">
                            <div slot="renderExtraFooter">
                                <a-button size="small" type="primary" @click="rangePickerCommit" ghost>
                                    确定
                                </a-button>
                            </div>
                        </a-range-picker>
                    </div>
<!--                    <a-tab-pane :forceRender="true" loading="true" tab="薪资" key="1">-->
<!--                        <a-col :xl="16" :lg="12" :md="12" :sm="24" :xs="24">-->
<!--                        </a-col>-->
<!--                        <a-col :xl="8" :lg="12" :md="12" :sm="24" :xs="24">-->
<!--                        </a-col>-->
<!--                    </a-tab-pane>-->
<!--                    <a-tab-pane :forceRender="true" tab="短信" key="2"><a-row>-->
<!--                        <a-col :xl="16" :lg="12" :md="12" :sm="24" :xs="24">-->
<!--                        </a-col>-->
<!--                        <a-col :xl="8" :lg="12" :md="12" :sm="24" :xs="24">-->
<!--                        </a-col>-->
<!--                    </a-row>-->
<!--                    </a-tab-pane>-->
                    <a-tab-pane v-for="i in 30" :key="i" :tab="`Tab-${i}`"> Content of tab {{ i }} </a-tab-pane>
                </a-tabs>
            </a-row>
        </a-card>
    </div>
</template>
<script>
    export default {
        data () {
            return {
                myChart:null,
                myBarChart: null,
                myLineChart:null,
                topCardHeadStyle:{
                    'color': 'rgba(0, 0, 0, 0.35)',
                    'font-size':'14px',
                    'font-weight':'normal'
                },
                topCardBodyStyle:{
                    'height':'150px',
                    'vertical':'middle'
                },
                rangePickerValue:[],
                rangePickerMode:['month', 'month'],
                rangePickerOpen:false,
                tabsPanelActivityVal:1,
            };
        },
        methods: {
            rangePickerHandleChange(value) {
                this.rangePickerValue = value;
            },
            rangePickerHandlePanelChange(value, mode) {
                this.rangePickerValue = value;
                this.rangePickerMode = [mode[0] === 'date' ? 'month' : mode[0], mode[1] === 'date' ? 'month' : mode[1]];
            },
            rangePickerOpenChange(status){
                this.rangePickerOpen = status;
            },
            rangePickerCommit(){
                this.rangePickerOpen = false;
            },
            tabPanelChange(av){

            }

        },
        created() {

        },
        mounted() {

        },
        components: {

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
    .card-header{
        font-size: 14px;
        line-height: 22px;
        color:rgba(0, 0, 0, 0.45);
        width: 100%;
    }
    .card-body{
        height:76px;
        font-size:28px;
        line-height:76px;
    }
    .card-footer{
        white-space: nowrap;
        border-top: 1px solid #d9d9d9;
        color:rgba(0, 0, 0, 0.65);
        padding:8px 0px;
        font-variant: tabular-nums;
    }

</style>
<style>
    .ant-calendar-range .ant-calendar-footer-extra{
        float: right !important;
    }
</style>

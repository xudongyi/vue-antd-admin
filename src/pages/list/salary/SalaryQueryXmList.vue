<template>
    <a-card>
        <div class="search">
            <a-form layout="horizontal">
                <div>
                    <a-row>
                        <a-col v-if="ismanager" :md="8" :sm="24">
                            <a-form-item
                                    label="部门"
                                    :labelCol="{span: 5}"
                                    :wrapperCol="{span: 18, offset: 1}"
                            >
                                <a-tree-select
                                        allow-clear
                                        show-search
                                        tree-node-filter-prop="title"
                                        v-model="queryParam.dept"
                                        tree-data-simple-mode
                                        style="width: 100%"
                                        :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
                                        :tree-data="treeDataSimple"
                                >
                                </a-tree-select>
                            </a-form-item>
                        </a-col>
                        <a-col v-if="ismanager" :md="8" :sm="24">
                            <a-form-item
                                    label="工号"
                                    :labelCol="{span: 5}"
                                    :wrapperCol="{span: 18, offset: 1}"
                            >
                                <a-input v-model="queryParam.workcode" placeholder="输入工号"/>
                            </a-form-item>
                        </a-col>
                        <a-col :md="8" :sm="24">
                            <a-form-item
                                    label="发放日期"
                                    :labelCol="{span: 5}"
                                    :wrapperCol="{span: 18, offset: 1}"
                            >
                                <a-month-picker :value="queryParam.salarystamonth" @change="onChangeQueryStaMonth"
                                                style="width: calc(50% - 20px)" placeholder="请选择日期"/>
                                <span style="width:40px;text-align: center;display: inline-block;">~</span>
                                <a-month-picker :value="queryParam.salaryendmonth" @change="onChangeQueryEndMonth"
                                                style="width: calc(50% - 20px)" placeholder="请选择日期"/>
                            </a-form-item>
                        </a-col>
                    </a-row>
                </div>
                <span style="float: right; margin-top: 3px;">
          <a-button type="primary" @click="doSearch">查询</a-button>
          <a-button style="margin-left: 8px" @click="resetParam">重置</a-button>
        </span>
            </a-form>
        </div>
        <div>
            <div class="operator">
                <a-button v-if="ismanager" type="primary" icon="import" @click="showUploadSalaryModal">批量导入</a-button>
                <a-button style="margin-left: 8px" type="primary" icon="export" @click="exportSalaryData">批量导出</a-button>
                <a-modal
                        title="薪资导入"
                        :maskClosable=false
                        :visible="salaryModalVisible"
                        :confirm-loading="salaryConfirmLoading"
                        @ok="commitUploadExcel"
                        @cancel="cancelUploadExcel"
                >
                    <div>
                        <a-form>
                            <a-form-item label="薪资日期"
                                         :label-col="{span: 4}"
                                         :wrapper-col="{span: 20}">
                                <a-month-picker style="width:100%" :value="salaryBelongDate" placeholder="选择薪资日期"
                                                @change="onChangeBelongDate"/>
                            </a-form-item>
                            <a-form-item label="发放日期"
                                         :label-col="{span: 4}"
                                         :wrapper-col="{span: 20}">
                                <a-month-picker style="width:100%" :value="salaryGrantDate" placeholder="选择发放日期"
                                                @change="onChangeGrantDate"/>
                            </a-form-item>

                            <a-form-item label="导入方式"
                                         :label-col="{span: 4}"
                                         :wrapper-col="{span: 20}">
                                <a-select v-model="importType" @change="handleImportTypeChange">
                                    <a-select-option :value="0">
                                        全量导入
                                    </a-select-option>
                                    <a-select-option :value="1">
                                        增量导入
                                    </a-select-option>
                                </a-select>
                            </a-form-item>
                            <a-form-item label="选择文件"
                                         :label-col="{span: 4}"
                                         :wrapper-col="{span: 20}">
                                <a-upload style="float:left;" :file-list="salaryUploadFileList"
                                          :remove="handleRemoveFile" :before-upload="beforeUploadFile">
                                    <a-button>
                                        <a-icon type="upload"/>
                                        选择文件
                                    </a-button>
                                </a-upload>
                                <span style="margin-left:8px;">
                  <a style="text-decoration:underline;" :href="excelTemp" target="_blank" download="薪资导入模板">下载模板</a>
                </span>
                            </a-form-item>
                        </a-form>
                    </div>
                </a-modal>
            </div>
            <a-table
                    style="margin-top: 18px;-ms-overflow-style: scrollbar !important;"
                    ref="table"
                    size="middle"
                    bordered
                    rowKey="id"
                    :columns="columns"
                    :dataSource="dataSource"
                    :pagination="ipagination"
                    :loading="loading"
                    @change="handleTableChange"
                    :scroll="{ x: 4000}">
                <!-- 字符串超长截取省略号显示-->
                <span slot="templateContent" slot-scope="text">
                    <j-ellipsis :value="text" :length="25"/>
                </span>
            </a-table>
        </div>


                <a-modal
                        title="输入密码"
                       :maskClosable=false
                        :visible="checkPasswordModalVisible"
                        :confirm-loading="checkPasswordConfirmLoading"
                        @ok="commitCheckPassword('checkForm')"
                        @cancel="cancelCheckPassword"
                >
                    <div>
                        <a-form-model ref="checkForm" :model="checkForm" :rules="rules" v-bind="layout">
                            <a-form-model-item has-feedback label="密码" prop="password">
                                <a-input-password v-model="checkForm.password" type="password" autocomplete="off" />
                            </a-form-model-item>
                            <slot v-if="user.roleId==1">
                                <a-form-model-item label="手机号" prop="mobile" >
                                    <a-input-search validateStatus="false" v-model.number="checkForm.mobile"  @search="sendMsg('checkForm')">
                                        <a-button :disabled="buttonStatus" slot="enterButton">
                                            {{button}}
                                        </a-button>
                                    </a-input-search>
                                </a-form-model-item>
                                <a-form-model-item has-feedback label="验证码" prop="captcha">
                                    <a-input v-model="checkForm.captcha" />
                                </a-form-model-item>
                            </slot>

                        </a-form-model>
                    </div>
                 </a-modal>

    </a-card>
</template>
<script>
    import {BASE_URL} from '@/services/api'
    import {importSalaryExcel,checkPassword} from '@/services/salaryQuery'
    import {QueryMixIn} from '@/mixins/query'
    import {departMentAll} from '@/services/oa'
    import {mapGetters} from 'vuex'
    import {sendMobile} from '@/services/user'
    import notification from 'ant-design-vue/es/notification'

    const columns = [
        {title: '工号', width: 100, dataIndex: 'workcode', key: 'workcode',fixed: 'left',align: 'center'},
        {title: '姓名', width: 100, dataIndex: 'hrName',fixed: 'left', key: 'hrName'},
        {title: '薪资日期', width: 100, dataIndex: 'belongDate', key: 'belongDate',fixed: 'left',align: 'center'},
        {title: '发放日期', width: 100, dataIndex: 'salaryDate', key: 'salaryDate',fixed: 'left',align: 'center'},
        {title: '基本工资', dataIndex: 'basePay', width: 100, align: 'center'},
        {title: '考核工资', dataIndex: 'assessmentPay', width: 100, align: 'center'},
        {title: '加班工资', dataIndex: 'overtimePay', width: 100, align: 'center'},
        // {title: '计件工资', dataIndex: 'pieceRatePay', width: 100, align: 'center'},
        // {title: '计加班工资', dataIndex: 'pieceOverPay', width: 100, align: 'center'},
        {title: '上岗工资', dataIndex: 'ondutyPay', width: 100, align: 'center'},
        {title: '技能工资', dataIndex: 'skillPay', width: 100, align: 'center'},
        // {title: '交通补贴', dataIndex: 'trafficSubsidy', width: 100, align: 'center'},
        {title: '增日工资', dataIndex: 'increasingDayPay', width: 100, align: 'center'},
        {title: '三班倒工龄工资', dataIndex: 'threeShiftsPay', width: 120, align: 'center'},
        {title: '带徒津贴', dataIndex: 'apprenticeSubsidy', width: 100, align: 'center'},
        // {title: '大学生补贴', dataIndex: 'collegeSubsidy', width: 100, align: 'center'},
        // {title: '组长补贴', dataIndex: 'groupLeaderSubsidy', width: 100, align: 'center'},
        {title: '中夜班费及补贴', dataIndex: 'nightShiftSubsidy', width: 120, align: 'center'},
        {title: '病假工资', dataIndex: 'sickPay', width: 100, align: 'center'},
        {title: '增补', dataIndex: 'supplementPay', width: 100, align: 'center'},
        {title: '净化费', dataIndex: 'purificationSubsidy', width: 100, align: 'center'},
        // {title: '综合津贴', dataIndex: 'comprehensiveAllowance', width: 100, align: 'center'},
        // {title: '工序津贴', dataIndex: 'processAllowance', width: 100, align: 'center'},
        {title: '质量奖', dataIndex: 'qualityAward', width: 100, align: 'center'},
        // {title: '塑封补贴', dataIndex: 'plasticSealSubsidy', width: 100, align: 'center'},
        // {title: '补贴', dataIndex: 'subsidy', width: 100, align: 'center'},
        {title: '其他补贴', dataIndex: 'otherSubsidy', width: 100, align: 'center'},
        {title: '职务津贴', dataIndex: 'jobAllowance', width: 100, align: 'center'},
        {title: '特殊岗位津贴', dataIndex: 'specialAllowance', width: 100, align: 'center'},
        {title: '应发工资', dataIndex: 'grossPay', width: 100, align: 'center'},
        // {title: '病假扣款', dataIndex: 'sickDeduction', width: 100, align: 'center'},
        {title: '个税', dataIndex: 'incomeTax', width: 100, align: 'center'},
        // {title: '补扣税', dataIndex: 'supplementaryTax', width: 100, align: 'center'},
        {title: '住宿费', dataIndex: 'accommondationFee', width: 100, align: 'center'},
        {title: '水电费', dataIndex: 'waterElectricFee', width: 100, align: 'center'},
        {title: '餐补', dataIndex: 'mealSubsidy', width: 100, align: 'center'},
        {title: '餐费', dataIndex: 'mealFee', width: 100, align: 'center'},

        {title: '社保手续费', dataIndex: 'socialServiceFee', width: 100, align: 'center'},
        {title: '会费', dataIndex: 'membershipFee', width: 100, align: 'center'},
        {title: '通讯费', dataIndex: 'communicationFee', width: 100, align: 'center'},
        // {title: '行政还款', dataIndex: 'adminRepay', width: 100, align: 'center'},
        {title: '其他工资扣款', dataIndex: 'otherDeduction', width: 120, align: 'center'},
        {title: '公积金', dataIndex: 'housepovidentFund', width: 100, align: 'center'},
        {title: '失保', dataIndex: 'unemployInsurance', width: 100, align: 'center'},
        {title: '养保', dataIndex: 'endowmentInsurance', width: 100, align: 'center'},
        {title: '医保', dataIndex: 'medicalInsurance', width: 100, align: 'center'},
        {title: '大病保', dataIndex: 'seriousIllnessInsurance', width: 100, align: 'center'},
        {title: '实发工资', dataIndex: 'netSalary', width: 100, align: 'center'},
        {title: '个税返回', dataIndex: 'taxReturn', width: 100, align: 'center'},
        {title: '应税工资', dataIndex: 'taxableSalary', width: 100, align: 'center'},
        {title: '核定工资 ', dataIndex: 'approvedSalary', width: 100, align: 'center'},

        {title: '十三薪', dataIndex: 'welfareAmountSalaries', width: 100, align: 'center'},
        {title: '奖金', dataIndex: 'welfareAmountBonus', width: 100, align: 'center'},
        {title: '福利', dataIndex: 'welfareAmountWeal', width: 100, align: 'center'}
    ];

    export default {
        name: 'SalaryQueryXmList',
        computed: {
            ...mapGetters('account', ['user']),
        },
        mixins: [QueryMixIn],
        data() {
            let checkMobile = (rule, value, callback) => {
                if (value === '') {
                    callback(new Error('请输入手机号'));
                }else if(!(/^1[3456789]\d{9}$/.test(this.checkForm.mobile))){
                    callback(new Error("手机号码格式错误"));
                }else{
                    callback();
                }
            };


            let validateCaptcha = (rule, value, callback) => {
                if (value === '') {
                    callback(new Error('请输入验证码'));
                } else {
                    callback();
                }
            };

            let validatePass = (rule, value, callback) => {
                if (value === '') {
                    callback(new Error('请输入密码'));
                } else {
                    if (this.checkForm.checkPass !== '') {
                        this.$refs.checkForm.validateField('checkPass');
                    }
                    callback();
                }
            };
            return {
                disableMixinCreated: true,
                columns: columns,
                url: {list: '/personnelSalary/querySalary'},
                isorter: {column: 'id', order: 'desc'},
                queryParam: {
                    dept: '',
                    workcode: '',
                    site:'',
                    salarystamonth: '',
                    salaryendmonth: ''
                },
                selectedRows: [],
                salaryModalVisible: false,
                checkPasswordModalVisible: true,
                salaryConfirmLoading: false,
                checkPasswordConfirmLoading: false,
                salaryGrantDate: null,
                salaryBelongDate: null,
                importType: 0,
                salaryUploadFileList: [],
                excelTemp: BASE_URL + "/downloadExcel/static/工资导入模板XM.xlsx",
                treeDataSimple: [],
                ismanager: false,
                button:'发送',
                buttonStatus:false,
                checkForm: {
                    password: '',
                    mobile: '',
                    captcha: '',
                },
                rules: {
                    password: [{ validator: validatePass, trigger: 'blur' }],
                    mobile: [{ validator: checkMobile, trigger: 'blur' }],
                    captcha: [{ validator: validateCaptcha, trigger: 'blur' }],
                },
                layout: {
                    labelCol: { span: 4 },
                    wrapperCol: { span: 14 },
                },
                hasCheckPassword:false
            }
        },
        created() {
            this.checkPasswordModalVisible = true;
            this.queryParam.site = this.user.site;
            if (this.user.roleId == 2) {
                this.ismanager = true;
                this.initTreeDataSimple();
            } else {
                this.queryParam.workcode = this.user.workcode;
            }
        },
        methods: {
            initTreeDataSimple() {
                departMentAll().then(res => {
                    console.log(res)
                    if (res.data.code == 200) {
                        this.treeDataSimple = res.data.data
                    }
                })
            },
            showUploadSalaryModal() {
                if(this.hasCheckPassword){
                    this.salaryModalVisible = true;
                    this.salaryUploadFileList = [];
                    this.salaryBelongDate = null;
                    this.salaryGrantDate = null;
                    this.salaryConfirmLoading = false;
                }else{
                    this.checkPasswordModalVisible = true;
                }
            },
            commitUploadExcel(e) {
                if (this.salaryBelongDate == null) {
                    return this.$message.warning("请选择薪资日期！", 2)
                }
                if (this.salaryGrantDate == null) {
                    return this.$message.warning("请选择发放日期！", 2)
                }
                if (this.salaryUploadFileList.length == 0) {
                    return this.$message.warning("请上传文件！", 2)
                }
                this.salaryConfirmLoading = true;
                this.handleUpload();
            },
            cancelUploadExcel(e) {
                this.salaryModalVisible = false;
            },
            onChangeBelongDate(date, dateString) {
                this.salaryBelongDate = date;
            },
            onChangeGrantDate(date, dateString) {
                this.salaryGrantDate = date;
            },
            onChangeQueryStaMonth(date, dateString) {
                this.queryParam.salarystamonth = dateString;
            },
            onChangeQueryEndMonth(date, dateString) {
                this.queryParam.salaryendmonth = dateString;
            },
            handleRemoveFile(file) {
                this.salaryUploadFileList = [];
            },
            beforeUploadFile(file) {
                this.salaryUploadFileList = [file];
                return false;
            },
            handleImportTypeChange(val){
                this.importType = val;
            },
            handleUpload() {
                const {salaryUploadFileList} = this;
                const fileFormData = new FormData();
                fileFormData.append("file", salaryUploadFileList[0]);
                fileFormData.append("belongDate", this.salaryBelongDate.format('YYYY-MM'));
                fileFormData.append("grantDate", this.salaryGrantDate.format('YYYY-MM'));
                fileFormData.append("importType", this.importType);
                fileFormData.append("site", this.user.site);

                importSalaryExcel(fileFormData).then(res => {
                    if (res.data.success) {
                        this.$message.success('上传成功.');
                        setTimeout(() => {
                            this.salaryModalVisible = false;
                            this.salaryConfirmLoading = false;
                            this.salaryUploadFileList = [];
                            this.loadData(1);
                        }, 1000);
                    }
                }).catch((error) => {
                    this.salaryConfirmLoading = false
                })
            },
            resetParam(){
                this.queryParam.dept='';
                if(this.ismanager){
                    this.queryParam.workcode='';
                }
                this.queryParam.salarystamonth='';
                this.queryParam.salaryendmonth='';
            },
            exportSalaryData(){
                if(this.hasCheckPassword){
                    if(this.queryParam.salarystamonth==""||this.queryParam.salaryendmonth==""){
                        return this.$message.warning("请选择薪资日期！", 2)
                    }
                    location.href=BASE_URL+'/salaryExport/export?site='+this.user.site+'&dept='+this.queryParam.dept+'&workcode='+this.queryParam.workcode+'&salarystamonth='+this.queryParam.salarystamonth+'&salaryendmonth='+this.queryParam.salaryendmonth
                }else{
                    this.checkPasswordModalVisible = true;
                }
            },
            commitCheckPassword(formName){
                this.$refs[formName].validate(valid => {
                    if (valid) {
                        const sha256 = require('js-sha256').sha256
                        const sha256_password = sha256(this.checkForm.password)
                        checkPassword(
                            this.user.workcode,
                            sha256_password,
                            this.checkForm.mobile,
                            this.checkForm.captcha
                        ).then(res=>{
                            if (res.data.success) {
                                this.loadData(1);
                                this.checkPasswordModalVisible = false;
                                this.hasCheckPassword = true;
                            }
                        }).catch(function (error) {
                            console.log(error)
                        })

                    } else {
                        console.log('error submit!!');
                        return false;
                    }
                })
            },
            cancelCheckPassword(){
                this.checkPasswordModalVisible = false;
            },
            sendMsg(formName){
                this.$refs[formName].validateField("password",valid1 => {
                    if (!valid1) {
                        this.$refs[formName].validateField("mobile",valid => {
                            if (!valid) {
                                const sha256 = require('js-sha256').sha256
                                const sha256_password = sha256(this.checkForm.password)
                                sendMobile(this.user.workcode,sha256_password, this.checkForm.mobile).then(res=>{
                                    notification.open({
                                        message: '提醒',
                                        description:res.data.message,
                                        duration: 3,
                                    });
                                    this.buttonStatus = true
                                    this.button = 60
                                    this.buttonInterval = setInterval(()=>{
                                        this.button = this.button-1
                                        if(this.button==1){
                                            this.button = '发送'
                                            this.buttonStatus = false
                                            clearInterval(this.buttonInterval)
                                        }
                                    }, 1000)
                                }).catch(function (error) {
                                    console.log(error)
                                })
                            } else {
                                return false;
                            }
                        });
                    } else {
                        return false;
                    }
                });

            },
            doSearch(){
                if(this.hasCheckPassword){
                    this.loadData(1);
                }else{
                    this.checkPasswordModalVisible = true;
                }
            }
        }
    }
</script>

<style lang="less" scoped>
    .search {
        margin-bottom: 36px;
    }

    .fold {
        width: calc(100% - 216px);
        display: inline-block
    }

    .operator {

    }

    @media screen and (max-width: 900px) {
        .fold {
            width: 100%;
        }
    }
</style>

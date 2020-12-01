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
                                    label="薪资日期"
                                    :labelCol="{span: 5}"
                                    :wrapperCol="{span: 18, offset: 1}"
                            >
                                <a-month-picker :value="queryParam.welfarestamonth" @change="onChangeQueryStaMonth"
                                                style="width: calc(50% - 20px)" placeholder="请选择日期"/>
                                <span style="width:40px;text-align: center;display: inline-block;">~</span>
                                <a-month-picker :value="queryParam.welfareendmonth" @change="onChangeQueryEndMonth"
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
                <a-button v-if="ismanager" type="primary" icon="import" @click="showUploadWelfareModal">批量导入</a-button>
                <a-modal
                        title="福利导入"
                        :maskClosable=false
                        :visible="welfareModalVisible"
                        :confirm-loading="welfareConfirmLoading"
                        @ok="commitUploadExcel"
                        @cancel="cancelUploadExcel"
                >
                    <div>
                        <a-form>
                            <a-form-item label="选择文件"
                                         :label-col="{span: 4}"
                                         :wrapper-col="{span: 20}">
                                <a-upload style="float:left;" :file-list="welfareUploadFileList"
                                          :remove="handleRemoveFile" :before-upload="beforeUploadFile">
                                    <a-button>
                                        <a-icon type="upload"/>
                                        选择文件
                                    </a-button>
                                </a-upload>
                                <span style="margin-left:8px;">
                                  <a style="text-decoration:underline;" :href="excelTemp" target="_blank" download="福利导入模板">下载模板</a>
                                </span>
                            </a-form-item>
                        </a-form>
                    </div>
                </a-modal>
            </div>
            <a-table
                    style="margin-top: 18px;"
                    ref="table"
                    size="middle"
                    bordered
                    rowKey="id"
                    :columns="columns"
                    :dataSource="dataSource"
                    :pagination="ipagination"
                    :loading="loading"
                    @change="handleTableChange"
                    :scroll="{ x: 1500}">
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
                            <a-input v-model.number="checkForm.captcha" />
                        </a-form-model-item>
                    </slot>
                </a-form-model>
            </div>
        </a-modal>

    </a-card>
</template>
<script>
    import {BASE_URL} from '@/services/api'
    import {importWelfareExcel, checkPassword} from '@/services/salaryQuery'
    import {QueryMixIn} from '@/mixins/query'
    import {departMentAll} from '@/services/oa'
    import {mapGetters} from 'vuex'
    import {sendMobile} from '@/services/user'


    const columns = [
        {title: '姓名', dataIndex: 'hrName', key: 'hrName'},
        {title: '工号',  dataIndex: 'workcode', key: 'workcode', align: 'center'},
        {title: '发放时间',  dataIndex: 'welfareDate', key: 'welfareDate', align: 'center'},
        {title: '名称',  dataIndex: 'welfareTypeName', key: 'welfareTypeName', align: 'center'},
        {title: '金额',  dataIndex: 'welfareAmount', key: 'welfareAmount', align: 'center'},
    ];

    export default {
        name: 'WelfareQueryList',
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
                url: {list: '/personnelSalary/queryWelfare'},
                isorter: {column: 'id', order: 'desc'},
                queryParam: {
                    dept: '',
                    workcode: '',
                    welfarestamonth: '',
                    welfareendmonth: '',
                    site:''
                },
                selectedRows: [],
                welfareModalVisible: false,
                checkPasswordModalVisible: true,
                welfareConfirmLoading: false,
                checkPasswordConfirmLoading: false,
                welfareUploadFileList: [],
                excelTemp: BASE_URL + "/downloadExcel/static/福利导入模板.xlsx",
                treeDataSimple: [],
                ismanager: false,
                button: '发送',
                buttonStatus: false,
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
                    labelCol: {span: 4},
                    wrapperCol: {span: 14},
                },
                hasCheckPassword: false
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
            showUploadWelfareModal() {
                if (this.hasCheckPassword) {
                    this.welfareModalVisible = true;
                    this.welfareUploadFileList = [];
                    this.welfareConfirmLoading = false;
                } else {
                    this.checkPasswordModalVisible = true;
                }
            },
            commitUploadExcel(e) {
                if (this.welfareUploadFileList.length == 0) {
                    return this.$message.warning("请上传文件！", 2)
                }
                this.welfareConfirmLoading = true;
                this.handleUpload();
            },
            cancelUploadExcel(e) {
                this.welfareModalVisible = false;
            },
            onChangeQueryStaMonth(date, dateString) {
                this.queryParam.welfarestamonth = dateString;
            },
            onChangeQueryEndMonth(date, dateString) {
                this.queryParam.welfareendmonth = dateString;
            },
            handleRemoveFile(file) {
                this.welfareUploadFileList = [];
            },
            beforeUploadFile(file) {
                this.welfareUploadFileList = [file];
                return false;
            },
            handleUpload() {
                const {welfareUploadFileList} = this;
                const fileFormData = new FormData();
                fileFormData.set("file", welfareUploadFileList[0]);
                importWelfareExcel(fileFormData).then(res => {
                    if (res.data.success) {
                        this.$message.success('上传成功.');
                        setTimeout(() => {
                            this.welfareModalVisible = false;
                            this.welfareConfirmLoading = false;
                            this.welfareUploadFileList = [];
                            this.loadData();
                        }, 1000);
                    }
                }).catch((error) => {
                    this.welfareConfirmLoading = false
                })
            },
            resetParam() {
                this.queryParam.dept = '';
                if (this.ismanager) {
                    this.queryParam.workcode = '';
                }
                this.queryParam.welfarestamonth = '';
                this.queryParam.welfareendmonth = '';
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
                                this.loadData();
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
            sendMsg(formName){
                this.$refs[formName].validateField("password",valid1 => {
                    if (!valid1) {
                        this.$refs[formName].validateField("mobile",valid => {
                            if (!valid) {
                                const sha256 = require('js-sha256').sha256
                                const sha256_password = sha256(this.checkForm.password)
                                sendMobile(this.user.workcode,sha256_password, this.checkForm.mobile).then(res=>{
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
            cancelCheckPassword() {
                this.checkPasswordModalVisible = false;
            },
            doSearch() {
                if (this.hasCheckPassword) {
                    this.loadData();
                } else {
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

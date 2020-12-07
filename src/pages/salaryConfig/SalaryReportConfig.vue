<template>
    <a-card>
        <div :class="toggleSearchStatus ? 'search' : null">
            <a-form layout="horizontal">
                <div :class="toggleSearchStatus ? null: 'fold'">
                    <a-row>
                        <a-col :md="8" :sm="24">
                            <a-form-item
                                    label="分部"
                                    :labelCol="{span: 5}"
                                    :wrapperCol="{span: 18, offset: 1}"
                            >
                                <a-tree-select
                                        allow-clear
                                        show-search
                                        tree-node-filter-prop="title"
                                        v-model="queryParam.site"
                                        tree-data-simple-mode
                                        style="width: 100%"
                                        :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
                                        :tree-data="treeDataSimple"
                                >
                                </a-tree-select>
                            </a-form-item>
                        </a-col>
                        <a-col :md="8" :sm="24">
                            <a-form-item
                                    label="报表类型"
                                    :labelCol="{span: 5}"
                                    :wrapperCol="{span: 18, offset: 1}"
                            >
                                <a-select defaultValue="-1" allowClear v-model="queryParam.tabId" placeholder="请选择" :options="tabIdConfig">
                                </a-select>
                            </a-form-item>
                        </a-col>
                    </a-row>
                </div>
                <span style="float: right; margin-top: 3px;">
          <a-button type="primary" @click="loadData">查询</a-button>
          <a-button style="margin-left: 8px" @click="resetData">重置</a-button>
          <a @click="handleToggleSearch" style="margin-left: 8px">
               {{ toggleSearchStatus ? '收起' : '展开' }}
                <a-icon :type="toggleSearchStatus ? 'up' : 'down'"/>
          </a>
        </span>
            </a-form>
        </div>
        <div>
            <div class="operator">
                <a-button style="margin-left: 8px;" @click="addData" type="primary">新建</a-button>
            </div>
            <a-table
                    ref="table"
                    size="middle"
                    bordered
                    rowKey="id"
                    :columns="columns"
                    :dataSource="dataSource"
                    :pagination="ipagination"
                    :loading="loading"
                    @change="handleTableChange">

                <!-- 字符串超长截取省略号显示-->
                  <span slot="templateContent" slot-scope="text">
                    <j-ellipsis :value="text" :length="25"/>
                 </span>

                <template slot="operation" slot-scope="text, record">
                    <a @click="() => editData(record.id,record)">编辑</a>
                    &nbsp;&nbsp;
                    <a-popconfirm
                            v-if="dataSource.length"
                            title="是否要删除?"
                            @confirm="()=> deleteData(record.id)"
                    >
                        <a href="javascript:;">删除</a>
                    </a-popconfirm>
                </template>

            </a-table>
        </div>
        <a-modal
                :title="config.configTitle"
                :visible="config.visible"
                :confirm-loading="config.confirmLoading"
                @ok="commitForm('checkForm')"
                @cancel="cancelForm"
        >
            <a-form-model ref="checkForm" :model="checkForm" :label-col="labelCol" :wrapper-col="wrapperCol"
                          :rules="rules"
            >
                <a-form-model-item has-feedback label="分部" prop="site">
                    <a-tree-select
                            allow-clear
                            show-search
                            tree-node-filter-prop="title"
                            v-model="checkForm.site"
                            tree-data-simple-mode
                            style="width: 100%"
                            :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
                            :tree-data="treeDataSimple"
                            @change="handleTreeDataChange">
                    >
                    </a-tree-select>
                </a-form-model-item>
                <a-form-model-item  label="统计类型" prop="tabId">
                    <a-select
                            defaultValue="-1" allowClear v-model="checkForm.tabId" @change="tabIdChange" placeholder="请选择" :options="tabIdConfig">
                    </a-select>
                </a-form-model-item>
                <a-form-model-item   label="期别" prop="stage">
                    <a-input v-model="checkForm.stage"
                    />
                </a-form-model-item>

                <a-form-model-item label="部门名称" prop="departName">
                    <a-input v-model="checkForm.departName" />
                </a-form-model-item>
                <a-form-model-item  label="统计部门范围" prop="detail">
                    <a-tree-select
                            allow-clear
                            tree-checkable
                            show-search
                            tree-node-filter-prop="title"
                            v-model="checkForm.detail"
                            tree-data-simple-mode
                            style="width: 100%"
                            :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
                            :tree-data="departmentDataSimple"
                            :tree-check-strictly="true"
                    >
                    </a-tree-select>
                </a-form-model-item>

                <a-form-model-item has-feedback label="排序" prop="sort">
                    <a-input-number  v-model="checkForm.sort"/>
                </a-form-model-item>
            </a-form-model>
        </a-modal>
    </a-card>
</template>

<script>
    import {QueryMixIn} from '@/mixins/query'
    import {saveConfig,removeConfig,getConfig} from '@/services/salaryConfig'
    import {queryList,departMentAllBySub} from '@/services/subDeptConfig'
    import {mapGetters} from 'vuex'
    import { TreeSelect } from 'ant-design-vue';

    export default {
        name: 'QueryList',
        mixins: [QueryMixIn],
        data() {
            return {
                description: '薪资统计配置',
                SHOW_ALL:TreeSelect.SHOW_ALL,
                labelCol: { span: 6 },
                wrapperCol: { span: 17 },
                tabIdConfig :[{
                    value:"1",
                    label:'按人员类别统计'
                },{
                    value:"2",
                    label:'管技人员按部门统计'
                },{
                    value:"3",
                    label:'制造部门'
                },{
                    value:"4",
                    label:'各部门每月人工成本'
                },{
                    value:"5",
                    label:'每月人工成本'
                }],
                columns: [
                    {
                        title: '分部',
                        dataIndex: 'site'
                    },
                    {
                        title: '期别',
                        dataIndex: 'stage'
                    },
                    {
                        title: '统计部门',
                        dataIndex: 'departName',
                    },
                    {
                        title: '排序号',
                        dataIndex: 'sort',
                    },
                    {
                        title: '统计类型',
                        dataIndex: 'tabId',
                        customRender: (id,record, index)=> {
                            for(let i = 0; i < this.tabIdConfig.length; i++){
                                if(id==this.tabIdConfig[i].value){
                                    return this.tabIdConfig[i].label
                                }
                            }
                        }
                    },
                    {
                        title: '操作',
                        dataIndex: 'operation',
                        scopedSlots: { customRender: 'operation' },
                    },
                ],
                queryParam: {
                    site: '',
                    tabId: ''
                },
                checkForm:{
                    site:null,
                    stage:null,
                    departName:null,
                    tabId:null,
                    detail:null,
                    sort:null
                },
                rules: {
                    site: [{ required: true, message: '请选择分部', trigger: ['change', 'blur'] },],
                    stage: [{ required: false, message: '请选择分部', trigger: ['change', 'blur'] },],
                    tabId: [{ required: true, message: '请选择统计类型', trigger: ['change', 'blur'] }],
                    departName: [{ required: true, message: '请填写统计部门名称', trigger: ['change', 'blur']}],
                    detail: [{ required: true, message: '请选择统计部门范围', trigger: ['change', 'blur'] }],
                    sort: [{ required: true, message: '请输入排序号', trigger: ['change', 'blur'] }]
                },
                config:{
                    configTitle:'新建配置项',
                    visible:false,
                    confirmLoading: false,
                },
                selectedRows: [],
                url: {
                    list: '/report/config/list'
                },
                treeDataSimple: [],
                departmentDataSimple: [],
                userDatasource: [],
                userDatasourceId: []
            }
        },

        computed: {
            ...mapGetters('account', ['user']),
        },
        created() {
            this.initTreeDataSimple()
            this.queryParam.site = this.user.site
        },

        methods: {
            initTreeDataSimple() {
                queryList().then(res => {
                    if (res.data.code == 200) {
                        this.treeDataSimple = res.data.data
                    }
                })
            },
            initDepartMentDataSimple(subid) {
                departMentAllBySub(subid).then(res => {
                    if (res.data.code == 200) {
                        this.departmentDataSimple = res.data.data
                    }
                })
            },
            resetData() {
                this.queryParam = {
                    site: '',
                    tabId: ''
                }
            },
            tabIdChange(value, option){
                if(value==="3"){
                    this.rules.stage[0].required = true;
                }else{
                    this.rules.stage[0].required = false;

                }
            },
            addData(){
                this.config.configTitle='新建配置项'
                this.checkForm = {}
                this.checkForm.site = this.user.site
                this.initDepartMentDataSimple(this.user.site)
                this.config.visible = true
            },
            editData(id,record){
                this.config.configTitle='修改配置项'
                this.config.visible = true
                getConfig(id).then(res=>{
                    if (res.data.code == 200) {
                        this.initDepartMentDataSimple(res.data.data.site)
                        this.checkForm = res.data.data;
                        console.log(this.checkForm)
                    }
                })
            },
            commitForm(formName){
                this.$refs[formName].validate(valid => {
                    if (valid) {
                        console.log(this.checkForm)
                        let detailsArray = []
                        for (let item of this.checkForm.detail) {
                          let details = {"subDepartLabel":item,"subDepart":item.value}
                          detailsArray.push(details)
                        }
                        this.checkForm.details = detailsArray
                        saveConfig(this.checkForm).then(res=>{
                            if (res.data.code == 200) {
                                this.config.visible = false
                                this.$refs.checkForm.resetFields();
                                this.$message.success('保存成功');
                                this.loadData(1);
                            }
                        }).catch(function (error) {
                            console.log(error)
                        })
                    } else {
                        return false;
                    }
                });
            },
            cancelForm(){
                this.config.visible = false;
                this.$refs.checkForm.resetFields();
            },
            deleteData(id){
                removeConfig(id).then(res=>{
                    if (res.data.code == 200) {
                        this.$message.success('删除成功');
                        this.loadData(1);
                    }
                }).catch(function (error) {
                    console.log(error)
                })
            },
            handleTreeDataChange(value, label, extra){
                if(value!=null){
                    this.initDepartMentDataSimple(value)
                }else{
                    this.departmentDataSimple = []
                }

            }
        }
    }
</script>

<style lang="less" scoped>
    .search {
        margin-bottom: 54px;
    }

    .fold {
        width: calc(100% - 216px);
        display: inline-block
    }

    .operator {
        margin-bottom: 18px;
    }

    @media screen and (max-width: 900px) {
        .fold {
            width: 100%;
        }
    }
</style>

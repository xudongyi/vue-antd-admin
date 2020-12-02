<template>
    <a-card>
        <div :class="toggleSearchStatus ? 'search' : null">
            <a-form layout="horizontal">
                <div :class="toggleSearchStatus ? null: 'fold'">

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
                <a-form-model-item label="分部名称" prop="subName">
                    <a-input v-model="checkForm.subName" />
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
                            :show-checked-strategy="SHOW_ALL"
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
    import {departMentAllBySubHR} from '@/services/oa'
    import {saveConfig,removeConfig,getConfig} from '@/services/subDeptConfig'
    import {mapGetters} from 'vuex'
    import { TreeSelect } from 'ant-design-vue';
    export default {
        name: 'QueryList',
        mixins: [QueryMixIn],
        data() {
            return {
                description: '薪资统计配置',
                labelCol: { span: 6 },
                wrapperCol: { span: 17 },
                SHOW_ALL:TreeSelect.SHOW_ALL,
                columns: [
                    {
                        title: '分部',
                        dataIndex: 'subName',
                    },
                    {
                        title: '排序号',
                        dataIndex: 'sort',
                    },
                    {
                        title: '操作',
                        dataIndex: 'operation',
                        scopedSlots: { customRender: 'operation' },
                    },
                ],
                queryParam: {
                    tabId: ''
                },
                checkForm:{
                    subName:null,
                    detail:null,
                    sort:null
                },
                rules: {
                    subName: [{ required: true, message: '请填写分部名称', trigger: ['change', 'blur']}],
                    detail: [{ required: true, message: '请选择分部部门范围', trigger: ['change', 'blur'] }],
                    sort: [{ required: true, message: '请输入排序号', trigger: ['change', 'blur'] }]
                },
                config:{
                    configTitle:'新建配置项',
                    visible:false,
                    confirmLoading: false,
                },
                selectedRows: [],
                url: {
                    list: '/subdept/config/list'
                },
                departmentDataSimple: [],
                userDatasource: [],
                userDatasourceId: []
            }
        },

        computed: {
            ...mapGetters('account', ['user']),
        },
        created() {

        },

        methods: {
            initDepartMentDataSimple() {
                departMentAllBySubHR().then(res => {
                    if (res.data.code == 200) {
                        this.departmentDataSimple = res.data.data
                    }
                })
            },
            resetData() {
                this.queryParam = {
                    tabId: ''
                }
            },
            addData(){
                this.config.configTitle='新建配置项'
                this.checkForm = {}
                this.checkForm.site = this.user.site
                this.initDepartMentDataSimple()
                this.config.visible = true
            },
            editData(id,record){
                this.config.configTitle='修改配置项'
                this.config.visible = true
                getConfig(id).then(res=>{
                    if (res.data.code == 200) {
                        this.initDepartMentDataSimple()
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
                          let details = {"subDepart":item}
                          detailsArray.push(details)
                        }
                        this.checkForm.details = detailsArray
                        saveConfig(this.checkForm).then(res=>{
                            if (res.data.code == 200) {
                                this.config.visible = false
                                this.$refs.checkForm.resetFields();
                                this.$message.success('保存成功');
                                this.loadData();
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
                        this.loadData();
                    }
                }).catch(function (error) {
                    console.log(error)
                })
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

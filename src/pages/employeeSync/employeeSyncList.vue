<template>
    <a-card>
        <div :class="toggleSearchStatus ? 'search' : null">
            <a-form layout="horizontal">
                <div :class="toggleSearchStatus ? null: 'fold'">
                    <a-row v-if="toggleSearchStatus">
                        <a-col :md="8" :sm="24">
                            <a-form-item
                                    label="同步月份"
                                    :labelCol="{span: 5}"
                                    :wrapperCol="{span: 18, offset: 1}"
                            >
                                <a-month-picker v-model="queryParam.syncDate" @change="onChangeDateQuery"/>
                            </a-form-item>
                        </a-col>
                        <a-col :md="8" :sm="24">
                            <a-form-item
                                    label="工号"
                                    :labelCol="{span: 5}"
                                    :wrapperCol="{span: 18, offset: 1}"
                            >
                                <a-input v-model="queryParam.hrNo" placeholder="请输入"/>
                            </a-form-item>
                        </a-col>
                    </a-row>
                </div>
                <span style="float: right; margin-top: 3px;">
          <a-button type="primary" @click="loadData">查询</a-button>
          <a-button style="margin-left: 8px">重置</a-button>
          <a @click="handleToggleSearch" style="margin-left: 8px">
               {{ toggleSearchStatus ? '收起' : '展开' }}
                <a-icon :type="toggleSearchStatus ? 'up' : 'down'"/>
          </a>
        </span>
            </a-form>
        </div>
        <div>
            <div class="operator">
                <a-button style="margin-left: 8px;" @click="syncData" type="primary">同步数据</a-button>
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

            </a-table>
        </div>
        <a-modal
                title="同步部门"
                :visible="config.visible"
                :mask="config.mask"
                :confirm-loading="config.confirmLoading"
                @ok="commitForm('checkForm')"
                @cancel="cancelForm"
        >
                <a-form-model ref="checkForm" :model="checkForm" :label-col="config.labelCol"
                              :wrapper-col="config.wrapperCol"
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
                                :tree-data="treeDataSimple">
                            >
                        </a-tree-select>
                    </a-form-model-item>
                    <a-form-model-item label="同步月份" prop="syncDate">
                        <a-month-picker v-model="checkForm.syncDate" @change="onChangeDate"/>
                    </a-form-model-item>
                </a-form-model>

        </a-modal>
    </a-card>

</template>

<script>
    import {QueryMixIn} from '@/mixins/query'
    import {mapGetters} from 'vuex'
    import {syncData} from '@/services/adEmployeeSync'
    import {queryList} from '@/services/subDeptConfig'

    export default {
        name: 'QueryList',
        mixins: [QueryMixIn],
        data() {
            return {
                description: '人员信息',
                columns: [
                    {
                        title: '工号',
                        dataIndex: 'hrNo'
                    },
                    {
                        title: '姓名',
                        dataIndex: 'hrName'
                    },
                    {
                        title: '用户状态',
                        dataIndex: 'userStatus'
                    },
                    {
                        title: '正式情况',
                        dataIndex: 'userStatus2'
                    },
                    {
                        title: '所属部门',
                        dataIndex: 'departName'
                    },
                    {
                        title: '人员类型',
                        dataIndex: 'typeNote',
                    },
                    {
                        title: '同步时间',
                        dataIndex: 'syncDate',
                    }
                ],
                queryParam: {
                    syncDate: '',
                    hrNo: ''
                },
                checkForm: {
                    site: null,
                    syncDate: null
                },
                selectedRows: [],
                url: {
                    list: '/sync/list'
                },
                config: {
                    visible: false,
                    spinning: false,
                    confirmLoading: false,
                    mask: false,
                    labelCol: {span: 6},
                    wrapperCol: {span: 17},
                },
                rules: {
                    site: [{required: true, message: '请选择分部名称', trigger: ['change', 'blur']}],
                    syncDate: [{required: true, message: '请选择同步月份', trigger: ['change', 'blur']}],
                },
                treeDataSimple: [],
            }
        },
        computed: {
            ...mapGetters('account', ['user']),
        },
        created() {
            this.initTreeDataSimple()
            this.checkForm.site = this.user.site
        },

        methods: {
            onChangeDate(date, dateString) {
                this.checkForm.syncDate = dateString
            },
            onChangeDateQuery(date, dateString) {
                this.queryParam.syncDate = dateString
            },
            initTreeDataSimple() {
                queryList().then(res => {
                    if (res.data.code == 200) {
                        this.treeDataSimple = res.data.data
                    }
                })
            },
            syncData() {
                this.config.visible = true
            },
            cancelForm() {
                if(!this.config.confirmLoading){
                    this.config.visible = false;
                    this.$refs.checkForm.resetFields();
                }else{
                    this.$message.warn("正在同步数据，请耐心等候！")
                }

            },
            commitForm(formName) {
                this.$refs[formName].validate(valid => {
                    if (valid) {
                        this.config.confirmLoading = true;
                        syncData(this.checkForm).then(res => {
                            if (res.data.code == 200) {
                                this.$message.info('本次同步了' + res.data.data + "条数据!")
                                this.config.visible = false
                                this.$refs.checkForm.resetFields();
                                this.config.confirmLoading = false
                                this.loadData(1)
                            }
                        }).catch(function (error) {
                            this.config.confirmLoading = false
                        })
                    } else {
                        return false;
                    }
                });
            },
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

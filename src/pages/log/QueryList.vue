<template>
    <a-card>
        <div :class="toggleSearchStatus ? 'search' : null">
            <a-form layout="horizontal">
                <div :class="toggleSearchStatus ? null: 'fold'">
                    <a-row>
                        <a-col :md="8" :sm="24">
                            <a-form-item
                                    label="日志类型"
                                    :labelCol="{span: 5}"
                                    :wrapperCol="{span: 18, offset: 1}"
                            >
                                <a-select v-model="queryParam.operate_type" placeholder="请选择">
                                    <a-select-option value="0">登录</a-select-option>
                                    <a-select-option value="1">发送短信</a-select-option>
                                    <a-select-option value="2">薪资查询</a-select-option>
                                </a-select>
                            </a-form-item>
                        </a-col>
                        <a-col :md="8" :sm="24">
                            <a-form-item
                                    label="操作部门"
                                    :labelCol="{span: 5}"
                                    :wrapperCol="{span: 18, offset: 1}"
                            >
                                <a-tree-select
                                        show-search
                                        tree-node-filter-prop="title"
                                        v-model="queryParam.dept"
                                        tree-data-simple-mode
                                        style="width: 100%"
                                        :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
                                        :tree-data="treeDataSimple"
                                        placeholder="Please select"

                                >
                                </a-tree-select>
                            </a-form-item>
                        </a-col>

                        <a-col :md="8" :sm="24">
                            <a-form-item
                                    label="操作人"
                                    :labelCol="{span: 5}"
                                    :wrapperCol="{span: 18, offset: 1}"
                            >
                                <a-input v-model="queryParam.user_id" style="width: 100%" placeholder="请输入"/>
                            </a-form-item>
                        </a-col>
                    </a-row>
                    <a-row v-if="toggleSearchStatus">
                        <a-col :md="8" :sm="24">
                            <a-form-item
                                    label="操作日期"
                                    :labelCol="{span: 5}"
                                    :wrapperCol="{span: 18, offset: 1}"
                            >
                                <a-date-picker v-model="queryParam.operate_time" style="width: 100%" placeholder="请输入更新日期"/>
                            </a-form-item>
                        </a-col>
                        <a-col :md="8" :sm="24">
                            <a-form-item
                                    label="内容"
                                    :labelCol="{span: 5}"
                                    :wrapperCol="{span: 18, offset: 1}"
                            >
                                <a-input v-model="queryParam.content" placeholder="请输入"/>
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
            <a-table
                    ref="table"
                    size="middle"
                    bordered
                    rowKey="id"
                    :columns="columns"
                    :dataSource="dataSource"
                    :pagination="ipagination"
                    :loading="loading"
                    :rowSelection="{selectedRowKeys: selectedRowKeys, onChange: onSelectChange}"
                    @change="handleTableChange">

                <!-- 字符串超长截取省略号显示-->
                <span slot="templateContent" slot-scope="text">
                    <j-ellipsis :value="text" :length="25"/>
                 </span>

            </a-table>
        </div>
    </a-card>
</template>

<script>
    import {QueryMixIn} from '@/mixins/query'
    import {departMentAll} from '@/services/oa'
    export default {
        name: 'QueryList',
        mixins: [QueryMixIn],
        data() {
            return {
                description: '日志查询',
                columns: [
                    {
                        title: '用户',
                        dataIndex: 'userId'
                    },
                    {
                        title: 'IP地址',
                        dataIndex: 'ip',
                    },
                    {
                        title: '描述',
                        dataIndex: 'content',
                    },
                    {
                        title: '操作类型',
                        dataIndex: 'operateName',
                        sorter: true,
                    },
                    {
                        title: '操作时间',
                        dataIndex: 'operateTime',
                        sorter: true
                    }
                ],
                queryParam:{
                    operate_type:'',
                    dept:'',
                    user_id:'',
                    operate_time:'',
                    content:''

                },
                selectedRows: [],
                url: {
                    list: '/log/list'
                },
                treeDataSimple:[
                    { id: 1, pId: 0, value: '1', title: 'Expand to load' },
                    { id: 4, pId: 1, value: '11', title: 'Expand to load11' },
                    { id: 5, pId: 1, value: '12', title: 'Expand to load12' },
                    { id: 2, pId: 0, value: '2', title: 'Expand to load' },
                    { id: 3, pId: 0, value: '3', title: 'Tree Node', isLeaf: true },
                ],
            }
        },
        created () {
            this.initTreeDataSimple()
        },
        methods: {
            initTreeDataSimple(){
                departMentAll().then(res=>{
                    console.log(res)
                    if(res.data.code==200){
                        this.treeDataSimple = res.data.data
                    }
                })
            },
            filterTreeNode(inputValue){

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

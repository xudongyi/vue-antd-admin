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
                                <a-select defaultValue="-1" allowClear  v-model="queryParam.operateType" placeholder="请选择">
                                    <a-select-option value="0">登录</a-select-option>
                                    <a-select-option value="3">单点登录</a-select-option>
                                    <a-select-option value="1">薪资查询</a-select-option>
                                    <a-select-option value="2">发送短信</a-select-option>
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

                        <a-col :md="8" :sm="24">
                            <a-form-item
                                    label="操作人"
                                    :labelCol="{span: 5}"
                                    :wrapperCol="{span: 18, offset: 1}"
                            >
                                <a-auto-complete
                                        allow-clear
                                        :data-source="userDatasource"
                                        style="width: 100%"
                                        placeholder="输入名称"
                                        @select="onSelect"
                                        @search="onSearch"
                                        @change="onChange"
                                >
                                </a-auto-complete>

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
                                <a-range-picker  @change="onChangeDate"  style="width: 100%"  format="YYYY-MM-DD"/>
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
    import {departMentAll,getHrmResource} from '@/services/oa'
    export default {
        name: 'QueryList',
        mixins: [QueryMixIn],
        data() {
            return {
                description: '日志查询',
                columns: [
                    {
                        title: '用户名',
                        dataIndex: 'lastname'
                    },
                    {
                        title: '登录名',
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
                    operateType:'',
                    dept:'',
                    userId:'',
                    operateTime:'',
                    operateTimeST:'',
                    operateTimeED:'',
                    content:''

                },
                selectedRows: [],
                url: {
                    list: '/log/list'
                },
                treeDataSimple:[],
                userDatasource:[],
                userDatasourceId:[]
            }
        },
        created () {
            this.initTreeDataSimple()
        },

        methods: {
            initTreeDataSimple(){
                departMentAll().then(res=>{
                    if(res.data.code==200){
                        this.treeDataSimple = res.data.data
                    }
                })
            },
            onSearch(searchText) {
                if(searchText){
                    getHrmResource(searchText).then(res=>{
                        if(res.data.code==200){
                            this.userDatasourceId = []
                            let dataSource = []
                            res.data.data.forEach((value,key,arr)=>{
                                dataSource.push(value.LABEL)
                                this.userDatasourceId.push(value.ID)
                            })
                            this.userDatasource = dataSource
                        }
                    })
                }else{
                    this.userDatasource = [];
                }
            },
            onSelect(value) {
                this.queryParam.userId =  this.userDatasource
                this.userDatasource.forEach((v1,key,arr)=>{
                    if(value===v1){
                        this.queryParam.userId = this.userDatasourceId[key]
                    }
                })
            },
            onChange(value) {
                if(!value){
                    this.queryParam.userId = ''
                    this.userDatasource = [];
                }
            },
            onChangeDate(date, dateString){
                this.queryParam.operateTimeST = dateString[0]
                this.queryParam.operateTimeED = dateString[1]
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

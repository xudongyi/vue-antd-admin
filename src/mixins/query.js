import {request, METHOD} from '@/utils/request'
import {BASE_URL} from '@/services/api'
import { filterObj } from '@/utils/util';

export const QueryMixIn ={
    data(){
        return {
            /* 查询条件-请不要在queryParam中声明非字符串值的属性 */
            queryParam: {},
            /* 数据源 */
            dataSource:[],
            /* 分页参数 */
            ipagination:{
                current: 1,
                pageSize: 10,
                pageSizeOptions: ['10', '20', '30','50','100'],
                showTotal: (total, range) => {
                    return range[0] + "-" + range[1] + " 共" + total + "条"
                },
                showQuickJumper: true,
                showSizeChanger: true,
                total: 0
            },
            /* 排序参数 */
            isorter:{
                column: 'createTime',
                order: 'desc',
            },
            /* table加载状态 */
            loading:false,
            /* table选中keys*/
            selectedRowKeys: [],
            /* table选中records*/
            selectionRows: [],
            /* 查询折叠 */
            toggleSearchStatus:false,
            /* 高级查询条件生效状态 */
            superQueryFlag:false,
            /* 高级查询条件 */
            superQueryParams: '',
            /** 高级查询拼接方式 */
            superQueryMatchType: 'and'
        }
    },
    created() {
        if(!this.disableMixinCreated){
            console.log(' -- mixin created -- ')
            this.loadData();
            //初始化字典配置 在自己页面定义
        }
    },
    methods:{
        loadData(arg) {
            if(!this.url.list){
                this.$message.error("请设置url.list属性!")
                return
            }
            //加载数据 若传入参数1则加载第一页的内容
            if (arg === 1) {
                this.ipagination.current = 1;
            }
            let params = this.getQueryParams();//查询条件
            this.loading = true;
            request(BASE_URL+this.url.list, METHOD.GET, params).then((res)=>{
                const response = res.data
                if (response.code == 200) {
                    this.dataSource = response.data.records;
                    this.ipagination.total = response.data.total;
                    this.loading = false;
                }
            }).catch(err=>{
                this.loading = true;
            })
        },
        handleTableChange(pagination, filters, sorter) {
            //分页、排序、筛选变化时触发
            if (Object.keys(sorter).length > 0) {
                this.isorter.column = sorter.field;
                this.isorter.order = "ascend" == sorter.order ? "asc" : "desc"
            }
            this.ipagination = pagination;
            this.loadData();
        },
        handleSuperQuery(params, matchType) {
            //高级查询方法
            if(!params){
                this.superQueryParams=''
                this.superQueryFlag = false
            }else{
                this.superQueryFlag = true
                this.superQueryParams=JSON.stringify(params)
                this.superQueryMatchType = matchType
            }
            this.loadData(1)
        },
        getQueryParams() {
            //获取查询条件
            let sqp = {}
            if(this.superQueryParams){
                sqp['superQueryParams']=encodeURI(this.superQueryParams)
                sqp['superQueryMatchType'] = this.superQueryMatchType
            }
            var param = Object.assign(sqp, this.queryParam, this.isorter ,this.filters);
            param.field = this.getQueryField();
            param.pageNo = this.ipagination.current;
            param.pageSize = this.ipagination.pageSize;
            return filterObj(param);
        },
        getQueryField() {
            var str = "id";
            this.columns.forEach(function (value) {
                str += "," + value.dataIndex;
            });
            return str;
        },
        onSelectChange(selectedRowKeys, selectionRows) {
            this.selectedRowKeys = selectedRowKeys;
            this.selectionRows = selectionRows;
        },
        onClearSelected() {
            this.selectedRowKeys = [];
            this.selectionRows = [];
        },
        handleToggleSearch(){
            this.toggleSearchStatus = !this.toggleSearchStatus;
        },
    }
}
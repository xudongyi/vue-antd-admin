<template>
  <a-card>
    <div class="search">
      <a-form layout="horizontal">
        <div>
          <a-row >
          <a-col :md="8" :sm="24" >
            <a-form-item
              label="人员"
              :labelCol="{span: 5}"
              :wrapperCol="{span: 18, offset: 1}"
            >
              <a-auto-complete
                      allow-clear
                      v-model="queryParam.user_id"
                      :data-source="userDatasource"
                      style="width: 100%"
                      placeholder="输入名称"
                      @select="onSelectUser"
                      @search="onSearchUser"
                      @change="onChangeUser"
              />
            </a-form-item>
          </a-col>
          <a-col :md="8" :sm="24" >
            <a-form-item
                    label="薪资日期"
                    :labelCol="{span: 5}"
                    :wrapperCol="{span: 18, offset: 1}"
            >
              <a-month-picker style="width: 100%" placeholder="请选择日期" />
            </a-form-item>
          </a-col>
          </a-row>
        </div>
        <span style="float: right; margin-top: 3px;">
          <a-button type="primary">查询</a-button>
          <a-button style="margin-left: 8px">重置</a-button>
        </span>
      </a-form>
    </div>
    <div>
      <div class="operator">
        <a-button type="primary" @click="showUploadSalaryModal">批量上传</a-button>
        <a-modal
                title="薪资导入"
                :maskClosable=false
                :visible="salaryModalVisible"
                :confirm-loading="confirmLoading"
                @ok="commitUpload"
                @cancel="cancelUpload"
        >
          <div>
            <a-form>
              <a-form-item label="薪资日期"
                           :label-col="{span: 4}"
                           :wrapper-col="{span: 20}">
                <a-month-picker style="width:100%" :value="salaryUploadDate" placeholder="选择薪资月份" @change="onChangeMonth" />
              </a-form-item>
              <a-form-item label="选择文件"
                           :label-col="{span: 4}"
                           :wrapper-col="{span: 20}">
                <a-upload style="float:left;" :file-list="salaryUploadFileList" :remove="handleRemoveFile" :before-upload="beforeUploadFile">
                  <a-button> <a-icon type="upload" /> 选择文件 </a-button>
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
              ref="table"
              size="middle"
              bordered
              rowKey="id"
              :columns="columns"
              :dataSource="dataSource"
              :pagination="ipagination"
              :loading="loading"
              :rowSelection="{selectedRowKeys: selectedRowKeys, onChange: onSelectChange}"
              @change="handleTableChange"
              :scroll="{ x: 1500}">
        <!-- 字符串超长截取省略号显示-->
        <span slot="templateContent" slot-scope="text">
                    <j-ellipsis :value="text" :length="25"/>
                 </span>
      </a-table>
    </div>
  </a-card>
</template>

<script>
import {BASE_URL} from '@/services/api'
import {importSalaryExcel} from '@/services/salaryQuery'
import {QueryMixIn} from '@/mixins/query'
import {departMentAll,getHrmResource} from '@/services/oa'

const columns = [
  { title: '姓名', width: 100, dataIndex: 'name', key: 'name', fixed: 'left' },
  { title: '工号', width: 100, dataIndex: 'workcode', key: 'workcode', fixed: 'left' },
  { title: '年份', width: 100, dataIndex: 'salaryYear',key: 'salaryYear', fixed: 'left' },
  { title: '月份', width: 100, dataIndex: 'salaryMonth',key: 'salaryMonth', fixed: 'left' },
  { title: '基本工资', dataIndex: 'basePay', width: 100,align:'center'},
  { title: '考核工资', dataIndex: 'assessmentPay', width: 100,align:'center'},
  { title: '加班工资', dataIndex: 'overtimePay', width: 100,align:'center'},
  { title: '计件工资', dataIndex: 'pieceRatePay', width: 100,align:'center'},
  { title: '计加班工资', dataIndex: 'pieceOverPay', width: 100,align:'center'},
  { title: '上岗工资', dataIndex: 'ondutyPay', width: 100,align:'center'},
  { title: '技能工资', dataIndex: 'skillPay', width: 100,align:'center'},
  { title: '交通补贴', dataIndex: 'trafficSubsidy', width: 100,align:'center'},
  { title: '增日工资', dataIndex: 'increasingDayPay', width: 100,align:'center'},
  { title: '三班倒工龄工资', dataIndex: 'threeShiftsPay', width: 120,align:'center'},
  { title: '带徒津贴', dataIndex: 'apprenticeSubsidy', width: 100,align:'center'},
  { title: '大学生补贴', dataIndex: 'collegeSubsidy', width: 100,align:'center'},
  { title: '组长补贴', dataIndex: 'groupLeaderSubsidy', width: 100,align:'center'},
  { title: '中夜班费及补贴', dataIndex: 'nightShiftSubsidy', width: 120,align:'center'},
  { title: '病假工资', dataIndex: 'sickPay', width: 100,align:'center'},
  { title: '增补', dataIndex: 'supplementPay', width: 100,align:'center'},
  { title: '净化费', dataIndex: 'purificationSubsidy', width: 100,align:'center'},
  { title: '质量奖', dataIndex: 'qualityAward', width: 100,align:'center'},
  { title: '塑封补贴', dataIndex: 'plasticSealSubsidy', width: 100,align:'center'},
  { title: '补贴', dataIndex: 'subsidy', width: 100,align:'center'},
  { title: '其他补贴', dataIndex: 'otherSubsidy', width: 100,align:'center'},
  { title: '应发工资', dataIndex: 'grossPay', width: 100,align:'center'},
  { title: '病假扣款', dataIndex: 'sickDeduction', width: 100,align:'center'},
  { title: '个税', dataIndex: 'incomeTax', width: 100,align:'center'},
  { title: '补扣税', dataIndex: 'supplementaryTax', width: 100,align:'center'},
  { title: '住宿费', dataIndex: 'accommondationFee', width: 100,align:'center'},
  { title: '水电费', dataIndex: 'waterElectricFee', width: 100,align:'center'},
  { title: '社保手续费', dataIndex: 'socialServiceFee', width: 100,align:'center'},
  { title: '会费', dataIndex: 'membershipFee', width: 100,align:'center'},
  { title: '通讯费', dataIndex: 'communicationFee', width: 100,align:'center'},
  { title: '行政还款', dataIndex: 'adminRepay', width: 100,align:'center'},
  { title: '其他工资扣款', dataIndex: 'otherDeduction', width: 120,align:'center'},
  { title: '公积金', dataIndex: 'housepovidentFund', width: 100,align:'center'},
  { title: '失保', dataIndex: 'unemployInsurance', width: 100,align:'center'},
  { title: '养保', dataIndex: 'endowmentInsurance', width: 100,align:'center'},
  { title: '医保', dataIndex: 'medicalInsurance', width: 100,align:'center'},
  { title: '实发工资', dataIndex: 'netSalary', width: 100,align:'center'}
  // { title: '查看次数', dataIndex: 'viewTimes',align:'center'},
];

export default {
  name: 'SalaryQueryList',
  mixins: [QueryMixIn],
  data () {
    return {
      columns: columns,
      url: {list: '/personnelSalary/query'},
      isorter:{column: 'id', order: 'desc'},
      queryParam:{
        user_id:'',
      },
      selectedRows: [],
      salaryModalVisible: false,
      confirmLoading: false,
      salaryUploadDate:null,
      salaryUploadFileList: [],
      excelTemp:BASE_URL+"/downloadExcel/static/SalaryExcelModel.xlsx",
      userDatasource:[]
    }
  },
  methods: {
    showUploadSalaryModal() {
      this.salaryModalVisible = true;
      this.salaryUploadFileList = [];
      this.salaryUploadDate=null;
      this.confirmLoading = false;
    },
    commitUpload(e) {
      if(this.salaryUploadDate==null){
        return this.$message.warning("请选择薪资日期！", 2)
      }
      if(this.salaryUploadFileList.length==0){
        return this.$message.warning("请上传薪资文件！", 2)
      }
      this.confirmLoading = true;
      this.handleUpload();
    },
    cancelUpload(e) {
      this.salaryModalVisible = false;
    },
    onChangeMonth(date, dateString) {
      this.salaryUploadDate = date;
    },
    handleRemoveFile(file) {
      this.salaryUploadFileList = [];
    },
    beforeUploadFile(file) {
      this.salaryUploadFileList = [file];
      return false;
    },
    handleUpload() {
      const { salaryUploadFileList } = this;
      const fileFormData = new FormData();
      fileFormData.set("file",salaryUploadFileList[0]);
      fileFormData.set("uploadDate",this.salaryUploadDate.format('YYYY-MM'));
      importSalaryExcel(fileFormData).then(res=>{
        if(res.data.success){
          this.$message.success('上传成功.');
          setTimeout(() => {
            this.salaryModalVisible = false;
            this.confirmLoading = false;
            this.salaryUploadFileList = [];
          }, 1000);
        }
      }).catch((error)=> {
        this.confirmLoading = false
      })
    },
    onSearchUser(searchText) {
      if(searchText&&searchText!=''){
        getHrmResource(searchText).then(res=>{
          if(res.data.code==200){
            this.userDatasource = res.data.data
          }
        })
      }else{
        this.userDatasource = [];
      }
    },
    onSelectUser(value) {
      console.log('onSelect', value);
    },
    onChangeUser(value) {
      console.log('onChange', value);
    },
  }
}
</script>

<style lang="less" scoped>
  .search{
    margin-bottom: 36px;
  }
  .fold{
    width: calc(100% - 216px);
    display: inline-block
  }
  .operator{
    margin-bottom: 18px;
  }
  @media screen and (max-width: 900px) {
    .fold {
      width: 100%;
    }
  }
</style>

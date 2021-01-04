<template>
   <div class="query-body">
       <div class="top-label">
           <div class="top-label-left">姓名：{{account.user.lastname}}（{{account.user.workcode}}）</div>
           <div class="top-label-right" @click="selectMonth()"> {{currentDateYear}}年{{currentDateMonth}}月份
               <svg t="1608865839041" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1184" width="20" height="20"><path d="M358.3 597c0 11-9 20-20 20h-63.8c-11 0-20-9-20-20v-63.8c0-11 9-20 20-20h63.8c11 0 20 9 20 20V597zM358.3 804.6c0 11-9 20-20 20h-63.8c-11 0-20-9-20-20v-63.8c0-11 9-20 20-20h63.8c11 0 20 9 20 20v63.8zM564.9 597c0 11-9 20-20 20h-63.8c-11 0-20-9-20-20v-63.8c0-11 9-20 20-20h63.8c11 0 20 9 20 20V597zM564.9 804.6c0 11-9 20-20 20h-63.8c-11 0-20-9-20-20v-63.8c0-11 9-20 20-20h63.8c11 0 20 9 20 20v63.8zM772.2 597c0 11-9 20-20 20h-63.8c-11 0-20-9-20-20v-63.8c0-11 9-20 20-20h63.8c11 0 20 9 20 20V597zM772.2 804.6c0 11-9 20-20 20h-63.8c-11 0-20-9-20-20v-63.8c0-11 9-20 20-20h63.8c11 0 20 9 20 20v63.8zM361 344.9c0 11-9 20-20 20h-15c-11 0-20-9-20-20V119.3c0-11 9-20 20-20h15c11 0 20 9 20 20v225.6zM720 344.9c0 11-9 20-20 20h-15c-11 0-20-9-20-20V119.3c0-11 9-20 20-20h15c11 0 20 9 20 20v225.6z" fill="#ffffff" p-id="1185"></path><path d="M118 202.4c-11 0-20 9-20 20v685.5c0 11 9 20 20 20h790c11 0 20-9 20-20V222.4c0-11-9-20-20-20H118z m755 650.5c0 11-9 20-20 20H173c-11 0-20-9-20-20V277.3c0-11 9-20 20-20h680c11 0 20 9 20 20v575.6z" fill="#ffffff" p-id="1186"></path><path d="M118.7 410.5h790.5v55H118.7z" fill="#ffffff" p-id="1187"></path></svg>
           </div>

       </div>
      <div class="query-content">
          <van-overlay :show="isFirstLogin" >
              <div class="wrapper" @click.stop>
                  <div class="form-content">
                      <van-form ref="ruleForm" @submit="submitForm">
                          <div class="first-title">首次登录</div>
                          <van-field
                                  v-model="mobile"
                                  name="mobile"
                                  label="手机号"
                                  :rules="[{  validator: validatorMobile,required: true, message: '请输入正确号码' }]"
                          />
                          <van-field
                                  v-model="captcha"
                                  center
                                  clearable
                                  label="验证码"
                                  :rules="[{ required: true, message: '请输入验证码' }]"
                          >

                              <template #button>
                                  <van-button native-type="button" size="small" type="primary" @click="sendMsg('mobile')" :disabled="buttonStatus">{{button}}</van-button>
                              </template>
                          </van-field>
                          <van-field
                                  v-model="password"
                                  type="password"
                                  label="密码"
                                  :rules="[{ required: true, message: '请填写密码' }]"
                          />
                          <van-field
                                  v-model="checkPass"
                                  type="password"
                                  name="checkPass"
                                  label="确认密码"
                                  :rules="[{ required: true, message: '请确认密码' }]"
                          />
                          <div style="margin: 16px;">
                              <van-button round block type="info" native-type="submit">
                                  提交
                              </van-button>
                          </div>
                      </van-form>
                  </div>
              </div>

          </van-overlay>


          <van-overlay :show="!isFirstLogin && !isInputPwd" >
              <div class="wrapper" @click.stop>
                  <div class="form-content">
                      <van-form ref="checkPwdForm" @submit="submitCheckForm">
                          <div class="first-title">请输入密码进行薪资查询</div>
                          <van-field
                                  v-model="fill.password"
                                  name="password"
                                  type="password"
                                  label="密码"
                                  :rules="[{ required: true, message: '请填写密码' }]"
                          />
                          <van-field
                                  v-model="fill.mobile"
                                  name="fillmobile"
                                  label="手机号"
                                  :rules="[{  validator: validatorMobile,required: true, message: '请输入正确号码' }]"
                          />
                          <van-field
                                  v-model="fill.captcha"
                                  center
                                  clearable
                                  label="验证码"
                                  :rules="[{ required: true, message: '请输入验证码' }]"
                          >

                              <template #button>
                                  <van-button native-type="button" size="small" type="primary" @click="sendMsg('fillmobile')" :disabled="buttonStatus">{{button}}</van-button>
                              </template>
                          </van-field>

                          <div style="margin: 16px;">
                              <van-button round block type="info" native-type="submit">
                                  提交
                              </van-button>
                          </div>
                      </van-form>
                  </div>
              </div>

          </van-overlay>

          <van-popup v-model="show" position="bottom" :style="{ height: '40%',width:'100%' }">
              <van-datetime-picker
                      v-model="currentDate"
                      type="year-month"
                      title="选择年月"
                      :min-date="minDate"
                      :max-date="maxDate"
                      :formatter="formatter"
                      @confirm="confirmDate"
                      @cancel="cancelDate"
              />
          </van-popup>
          <div class="query-detail">
              <div class="query-detail-title">工资明细(右上角可选择月份)</div>
              <div class="query-detail-item">
                  <ul>
                      <li>基本工资:{{salaryDetail.basePay}}</li>
                      <li>考核工资:{{salaryDetail.assessmentPay}}</li>
                      <li>加班工资:{{salaryDetail.overtimePay}}</li>
                      <li>计件工资:{{salaryDetail.pieceRatePay}}</li>
                      <li>计加班工资:{{salaryDetail.pieceOverPay}}</li>
                      <li>上岗工资:{{salaryDetail.ondutyPay}}</li>
                      <li>技能工资:{{salaryDetail.skillPay}}</li>
                      <li>交通补贴:{{salaryDetail.trafficSubsidy}}</li>
                      <li>增日工资:{{salaryDetail.increasingDayPay}}</li>
                      <li>三班倒工龄工资:{{salaryDetail.threeShiftsPay}}</li>
                      <li>带徒津贴:{{salaryDetail.apprenticeSubsidy}}</li>
                      <li>大学生补贴:{{salaryDetail.collegeSubsidy}}</li>
                      <li>组长补贴:{{salaryDetail.groupLeaderSubsidy}}</li>
                      <li>中夜班费及补贴:{{salaryDetail.nightShiftSubsidy}}</li>
                      <li>病假工资:{{salaryDetail.sickPay}}</li>
                      <li>增补:{{salaryDetail.supplementPay}}</li>
                      <li>净化费:{{salaryDetail.purificationSubsidy}}</li>
                      <li>质量奖:{{salaryDetail.qualityAward}}</li>
                      <li>塑封补贴:{{salaryDetail.plasticSealSubsidy}}</li>
                      <li>补贴:{{salaryDetail.subsidy}}</li>
                      <li>其他补贴:{{salaryDetail.otherSubsidy}}</li>
                      <li>应发工资:{{salaryDetail.grossPay}}</li>
                  </ul>
              </div>
          </div>
          <div class="query-detail">
              <div class="query-detail-title">税收及扣减项</div>
              <div class="query-detail-item">
                  <ul>
                      <li>病假扣款：{{salaryDetail.sickDeduction}}</li>
                      <li>个税：{{salaryDetail.incomeTax}}</li>
                      <li>补扣税：{{salaryDetail.supplementaryTax}}</li>
                      <li>住宿费：{{salaryDetail.accommondationFee}}</li>
                      <li>水电费：{{salaryDetail.waterElectricFee}}</li>
                      <li>社保手续费：{{salaryDetail.socialServiceFee}}</li>
                      <li>会费：{{salaryDetail.membershipFee}}</li>
                      <li>通讯费：{{salaryDetail.communicationFee}}</li>
                      <li>行政还款：{{salaryDetail.adminRepay}}</li>
                      <li>其他工资扣款：{{salaryDetail.otherDeduction}}</li>
                      <li>公积金：{{salaryDetail.housepovidentFund}}</li>
                      <li>失保：{{salaryDetail.unemployInsurance}}</li>
                      <li>养保：{{salaryDetail.endowmentInsurance}}</li>
                      <li>医保：{{salaryDetail.medicalInsurance}}</li>
                  </ul>
              </div>
          </div>
          <div class="query-detail">
              <div class="query-detail-title">其它</div>
              <div class="query-detail-item">
                  <ul>
                      <li>十三薪：{{otherDetail.welfareAmountSalaries}}</li>
                      <li>奖金：{{otherDetail.welfareAmountBonus}}</li>
                      <li>福利：{{otherDetail.welfareAmountWeal}}</li>
                  </ul>
              </div>
          </div>
      </div>
       <div class="bottom-label">
           实发工资（不含其它）：{{salaryDetail.netSalary}}
          </div>
   </div>
</template>
<script>
    import Vue from 'vue';
    import Vant from 'vant';
    import 'vant/lib/index.css';
    Vue.use(Vant);
    import { Dialog } from 'vant';
    import { Toast } from 'vant';
    import {mapState,mapMutations} from "vuex"
    import {querySalary,queryWelfareSingle} from '@/services/salaryQuery'
    import {sendMobile,modifyPassword} from '@/services/user'
    import {checkPassword,checMobileCaptcha} from '@/services/salaryQuery'

    export default {
        data() {
            return {
                minDate: new Date(2019, 0, 1),
                maxDate: new Date(2099, 10, 1),
                currentDate: new Date(),
                currentDateYear: new Date().getFullYear(),
                currentDateMonth:((new Date().getMonth()+1)<10 ? "0"+(new Date().getMonth()+1):new Date().getMonth()+1),
                show:false,
                isFirstLogin:false,
                isInputPwd:false,
                salaryDetail:{},
                otherDetail:{},
                password: '',
                checkPass: '',
                mobile: '',
                captcha: '',
                button:'发送',
                buttonStatus:false,
                buttonInterval:null,
                fill:{
                    mobile: '',
                    password: '',
                    captcha: '',
                }
            };
        },

        methods: {
            ...mapMutations('account', ['setUser']),
            validatorMobile(val) {
                return /^1[3456789]\d{9}$/.test(val);
            },
            selectMonth(){
                this.show  = true
            },
            formatter(type, val) {
                if (type === 'year') {
                    return `${val}年`;
                } else if (type === 'month') {
                    return `${val}月`;
                }
                return val;
            },
            confirmDate(val){
                let year=val.getFullYear();
                let month=val.getMonth()+1;
                month =(month<10 ? "0"+month:month);
                this.loadData(year+"-"+month)
                this.currentDateYear = year
                this.currentDateMonth = month
                this.show  = false
            },
            cancelDate(){
                this.show = false
            },
            loadData(salaryDate){
                querySalary(this.account.user.workcode,salaryDate).then(res=>{
                    if(res.data.code==200){
                        if(res.data.data==null){
                            this.salaryDetail = {}
                            Dialog({ message: salaryDate+'无数据！' });
                        }else{
                            this.salaryDetail = res.data.data
                        }
                    }
                }).catch(function (error) {
                    console.log(error)
                })
                queryWelfareSingle(this.account.user.workcode,salaryDate).then(res=>{
                    if(res.data.code==200){
                        if(res.data.data==null){
                            this.otherDetail = {}
                        }else{
                            this.otherDetail = res.data.data
                        }
                    }
                }).catch(function (error) {
                    console.log(error)
                })
            },
            sendMsg(field){
                let ruleForm = this.$refs.ruleForm
                let checkMobile = this.mobile
                if(field==='fillmobile'){
                    checkMobile = this.fill.mobile
                    ruleForm = this.$refs.checkPwdForm
                    ruleForm.validate("password").then(()=>{
                        ruleForm.validate(field).then(()=>{
                            const sha256 = require('js-sha256').sha256
                            const sha256_password = sha256(this.fill.password)
                            sendMobile(this.account.user.loginid, sha256_password,checkMobile).then(res=>{
                                Toast(res.data.message)
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
                        });
                    });
                }else{
                    ruleForm.validate(field).then(()=>{
                        sendMobile(this.account.user.loginid, '-1',checkMobile).then(res=>{
                            Toast(res.data.message)
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
                    });
                }
            },
            submitForm() {
                if(this.password!=this.checkPass) {
                    Dialog({message: '两次密码不一致'});
                }else if(!(/^\d{6}$/.test(this.password))){
                    Dialog({ message: '密码为6位数字' });
                }else{
                    const sha256 = require('js-sha256').sha256
                    const sha256_password = sha256(this.password)
                    const sha256_checkPass = sha256(this.checkPass)
                    modifyPassword(this.account.user.workcode,this.mobile, sha256_password, sha256_checkPass, this.captcha).then(res=>{
                        if(res.data.code==200){
                            const user = localStorage.getItem(process.env.VUE_APP_USER_KEY)
                            const userJson = JSON.parse(user)
                            userJson.first_login = 1
                            this.setUser(userJson)
                            location.reload()
                        }
                    }).catch(function (error) {
                        alert.log(error)
                    })
                }
            },
            submitCheckForm(){
                const sha256 = require('js-sha256').sha256
                const sha256_password = sha256(this.fill.password)
                checkPassword(
                    this.account.user.workcode,
                    sha256_password,
                    this.fill.mobile,
                    this.fill.captcha
                ).then(res=>{
                    if (res.data.success) {
                        this.loadData(this.currentDateYear+"-"+this.currentDateMonth);
                        this.isInputPwd = true;
                    }
                }).catch(function (error) {
                    console.log(error)
                })
            }
        },

        computed:{
            ...mapState(["account"])
        },
        mounted() {
            this.isFirstLogin = this.account.user.first_login<1
        }
    };
</script>
<style>
    body{
        background-color: #f2f2f2 !important;
    }
</style>
<style scoped>
    ul,li{
        list-style:none;
        margin: 0;
        padding: 0;
    }

    .query-body{
        background-color: #f2f2f2 !important;
        width: 100%;
    }
    .query-content{
        margin-top: 45px;
        margin-bottom: 45px;
        padding-bottom: 45px;
    }
    .top-label{
        position:fixed;
        top: 0;
        background-color: #00bf93;
        width: 100%;
        height: 45px;
        line-height: 45px;
        color:white;
    }
    .top-label-left{
        float: left;
        padding: 0 0 0 17px
    }
    .top-label-right{
        float: right;
        padding: 0 17px 0 0;
        color:#fff !important;
    }
    .top-label-right svg{
        vertical-align: middle;
        margin-top:-4px;
    }
    .query-detail{
        width: 95%;
        height: auto;
        background-color: #fff !important;
        margin-top:12px ;
        margin-left: 2.5%;
        margin-right: 2.5%;
    }
    .query-detail-title{
        width: 95%;
        text-align: center;
        font-weight: bold;
        font-size: 14px;
        padding:8px 0 8px 0;
        margin: auto;
        border-bottom: 1px solid #f2f2f2;
        color:#616161
    }
    .query-detail-item{
        width: 95%;
    }
    .query-detail-item li{
        width: 50%;
        padding:10px 0 10px 0;
        text-align: center;
        display: inline-block;
    }
    .bottom-label{
        position:fixed;
        bottom: 0;
        background-color: #00bf93;
        text-align: center;
        width: 100%;
        height: 45px;
        line-height: 45px;
        color:white;
    }
    .wrapper{
        display: flex;
        align-items: center;
        justify-content: center;
        position: absolute;
        left: 10%;
        top: 30%;
        width:80%;
        height:100px;
    }
    .first-title{
        text-align: center;
        padding:5px 0 5px 0;
        width: 100%;
        background-color: #fff !important;
        font-size: 16px;
        font-weight: bold;
    }
</style>
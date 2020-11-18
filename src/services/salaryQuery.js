import {BASE_URL,CHECK_PASSWORD_URL} from '@/services/api'
import {request, METHOD} from '@/utils/request'

/**
 * 上传薪资数据
 */
function importSalaryExcel(params){
  return request(BASE_URL+"/import/salaryImport",METHOD.POST, params)
}

/**
 * 上传薪资数据
 */
function importWelfareExcel(params){
    return request(BASE_URL+"/import/welfareImport",METHOD.POST, params)
   //return request(BASE_URL+"/import/testImport",METHOD.POST, params)
}

/**
 * 校验密码
 */
function checkPassword(workcode,password) {
  return request(CHECK_PASSWORD_URL, METHOD.POST, {
    workcode: workcode,
    // mobile: mobile,
    password: password,
    // captcha: captcha
  })
}

/**
 * 校验密码
 */
function checMobileCaptcha(workcode,mobile,captcha) {
  return request(BASE_URL+"/personnelSalary/checMobileCaptcha", METHOD.POST, {
    workcode: workcode,
    mobile: mobile,
    captcha: captcha
  })
}

/**
 * 薪资查询
 */
function querySalary(workcode,site,salaryDate) {
  return request(BASE_URL+"/personnelSalary/querySalary", METHOD.POST, {
    workcode: workcode,
    salaryDate: salaryDate
  })
}

/**
 * 薪资福利查询
 */
function queryWelfareSingle(workcode,salaryDate) {
  return request(BASE_URL+"/personnelSalary/queryWelfareSingle", METHOD.POST, {
    workcode: workcode,
    welfareDate: salaryDate
  })
}

/**
 * 薪资报表查询
 */
function queryReportHeader(){
  return request(BASE_URL+"/personnelSalary/queryReportHeader", METHOD.POST, {})
}

function queryReportBody(params){
  return request(BASE_URL+"/personnelSalary/queryReportBody", METHOD.POST, params)
}
export {importSalaryExcel,importWelfareExcel,checkPassword,checMobileCaptcha,querySalary,queryWelfareSingle,queryReportHeader,queryReportBody}

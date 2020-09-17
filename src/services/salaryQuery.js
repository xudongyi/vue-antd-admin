import {BASE_URL,IMPORT_SALARY_URL,CHECK_PASSWORD_URL} from '@/services/api'
import {request, METHOD} from '@/utils/request'

/**
 * 上传薪资数据
 */
function importSalaryExcel(params){
  return request(IMPORT_SALARY_URL,METHOD.POST, params)
}

/**
 * 校验密码
 */
function checkPassword(workcode,mobile,password,captcha) {
  return request(CHECK_PASSWORD_URL, METHOD.POST, {
    workcode: workcode,
    mobile: mobile,
    password: password,
    captcha: captcha
  })
}

/**
 * 薪资查询
 */
function querySalary(workcode,salaryDate) {
  return request(BASE_URL+"/personnelSalary/querySalary", METHOD.POST, {
    workcode: workcode,
    salaryDate: salaryDate
  })
}

/**
 * 薪资报表查询
 */
function salaryReportQuery(){
  return request(BASE_URL+"/personnelSalary/querySalary", METHOD.POST, {

  })
}
export {importSalaryExcel,checkPassword,querySalary}

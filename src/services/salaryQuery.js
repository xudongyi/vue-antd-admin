import {IMPORT_SALARY_URL,CHECK_PASSWORD_URL} from '@/services/api'
import {request, METHOD} from '@/utils/request'

/**
 * 上传薪资数据
 */
function importSalaryExcel(params){
  return request(IMPORT_SALARY_URL,METHOD.POST, params)
}

function checkPassword(workcode,mobile,password,captcha) {
  return request(CHECK_PASSWORD_URL, METHOD.POST, {
    workcode: workcode,
    mobile: mobile,
    password: password,
    captcha: captcha
  })
}

export {importSalaryExcel,checkPassword}

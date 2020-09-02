import {IMPORT_SALARY_URL} from '@/services/api'
import {request, METHOD} from '@/utils/request'

/**
 * 上传薪资数据
 */
function importSalaryExcel(params){
  return request(IMPORT_SALARY_URL,METHOD.POST, params)
}


export {importSalaryExcel}

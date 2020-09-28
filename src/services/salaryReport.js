import {BASE_URL} from '@/services/api'
import {request, METHOD} from '@/utils/request'

/**
 * 每月人力成本
 */
function getMonthlyLaborCost(params){
  return request(BASE_URL+"/salaryReport/getMonthlyLaborCost",METHOD.POST, params)
}

export {getMonthlyLaborCost}

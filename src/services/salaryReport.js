import {BASE_URL} from '@/services/api'
import {request, METHOD} from '@/utils/request'

/**
 * 每月人力成本
 */
function getMonthlyLaborCost(params){
  return request(BASE_URL+"/salaryReport/getMonthlyLaborCost",METHOD.POST, params)
}

function getMonthlyLaborCostByDept(params){
  return request(BASE_URL+"/salaryReport/getMonthlyLaborCostByDept",METHOD.POST, params)
}

function getMonthlyLaborCostByType(params){
  return request(BASE_URL+"/salaryReport/getMonthlyLaborCostByType",METHOD.POST, params)
}

function getMonthlyLaborCostByManufacturingDept(params){
  return request(BASE_URL+"/salaryReport/getMonthlyLaborCostByManufacturingDept",METHOD.POST, params)
}

export {getMonthlyLaborCost,getMonthlyLaborCostByDept,getMonthlyLaborCostByType,getMonthlyLaborCostByManufacturingDept}

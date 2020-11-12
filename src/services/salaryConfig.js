import {BASE_URL} from '@/services/api'
import {request, METHOD} from '@/utils/request'

/**
 * 保存配置
 */
function saveConfig(params){
  return request(BASE_URL+"/report/config/save",METHOD.POST, params)
}

/**
 * 保存配置
 */
function removeConfig(id){
  return request(BASE_URL+"/report/config/removeSalaryReportConfig",METHOD.GET, {id:id})
}
/**
 * 获取配置
 */
function getConfig(id){
  return request(BASE_URL+"/report/config/getSalaryReportConfig",METHOD.GET, {id:id})
}

export {saveConfig,removeConfig,getConfig}

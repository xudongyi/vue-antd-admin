import {BASE_URL} from '@/services/api'
import {request, METHOD} from '@/utils/request'

/**
 * 保存配置
 */
function saveConfig(params){
  return request(BASE_URL+"/subdept/config/save",METHOD.POST, params)
}

/**
 * 保存配置
 */
function removeConfig(id){
  return request(BASE_URL+"/subdept/config/removeSalarySubDeptConfig",METHOD.GET, {id:id})
}
/**
 * 获取配置
 */
function getConfig(id){
  return request(BASE_URL+"/subdept/config/getSalarySubDeptConfig",METHOD.GET, {id:id})
}


function queryList(){
  return request(BASE_URL+"/subdept/config/queryList",METHOD.GET)
}

function departMentAllBySub(id){
  return request(BASE_URL+"/subdept/config/departMentAllBySub",METHOD.GET, {id:id})
}

export {saveConfig,removeConfig,getConfig,queryList,departMentAllBySub}

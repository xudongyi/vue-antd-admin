import {BASE_URL} from '@/services/api'
import {request, METHOD} from '@/utils/request'

/**
 * 同步
 */
function syncData(params){
  return request(BASE_URL+"/sync/syncData",METHOD.GET, params)
}


export {syncData}

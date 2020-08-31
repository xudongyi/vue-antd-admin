import {BASE_URL} from '@/services/api'
import {request, METHOD} from '@/utils/request'

async function departMentAll(departMentName){
    return  request(BASE_URL+"/oa/departMentAll", METHOD.GET, {
        departMentName: departMentName
    })
}

async function getHrmResource(lastname){
    return  request(BASE_URL+"/oa/getHrmResource", METHOD.GET, {
        lastname: lastname
    })
}

export {departMentAll,getHrmResource}

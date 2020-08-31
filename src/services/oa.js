import {BASE_URL} from '@/services/api'
import {request, METHOD} from '@/utils/request'

async function departMentAll(departMentName){
    return  request(BASE_URL+"/oa/departMentAll", METHOD.POST, {
        departMentName: departMentName
    })
}

async function getHrmResource(lastname){
    return  request(BASE_URL+"/oa/getHrmResource", METHOD.POST, {
        lastname: lastname
    })
}

export {departMentAll,getHrmResource}

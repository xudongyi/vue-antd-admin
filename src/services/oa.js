import {BASE_URL} from '@/services/api'
import {request, METHOD} from '@/utils/request'

async function departMentAll(departMentName){
    return  request(BASE_URL+"/hr/departMentAll", METHOD.GET, {
        departMentName: departMentName
    })
}

async function subDepartMentAll(departMentName){
    return  request(BASE_URL+"/hr/subDepartMentAll", METHOD.GET, {
        departMentName: departMentName
    })
}

async function departMentAllBySubHR(subid){
    return  request(BASE_URL+"/hr/departMentAllBySub", METHOD.GET, {
        subid: subid
    })
}

async function getHrmResource(lastname){
    return  request(BASE_URL+"/hr/getHrmResource", METHOD.GET, {
        lastname: lastname
    })
}

export {departMentAll,subDepartMentAll,departMentAllBySubHR,getHrmResource}

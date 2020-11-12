import {BASE_URL,LOGIN, ROUTES,CHECKSSO} from '@/services/api'
import {request, METHOD, removeAuthorization} from '@/utils/request'
import Cookie from "js-cookie";

/**
 * 登录服务
 * @param loginid 账户名
 * @param password 账户密码
 * @returns {Promise<AxiosResponse<T>>}
 */
async function login(loginid, password) {
  return request(LOGIN, METHOD.POST, {
    loginid: loginid,
    password: password
  })
}

async function getRoutesConfig() {
  return request(ROUTES, METHOD.GET)
}

async function checkSso(loginid,token){
  return  request(CHECKSSO, METHOD.POST, {
    loginid: loginid,
    token: token
  })
}

async function checkSsoAsync(loginid,token){
  let responseData = await requestAsync(CHECKSSO, METHOD.POST, {
    loginid: loginid,
    token: token
  })
  return responseData
}
async function sendMobile(workcode,password,mobile){
  return  request(BASE_URL+"/auth/user/sendMobile", METHOD.POST, {
    workcode: workcode,
    password: password,
    mobile: mobile
  })
}

async function modifyPassword(workcode,mobile,password,checkPass,captcha){
  return  request(BASE_URL+"/auth/user/modifyPassword", METHOD.POST, {
    workcode: workcode,
    mobile: mobile,
    password: password,
    checkPass: checkPass,
    captcha: captcha
  })
}

async function loginInfo(workcode,type){
  return  request(BASE_URL+"/log/loginInfo", METHOD.GET, {
    userId: workcode,
    operateType: type
  })
}

/**
 * 退出登录
 */
function logout() {
  localStorage.removeItem(process.env.VUE_APP_ROUTES_KEY)
  localStorage.removeItem(process.env.VUE_APP_PERMISSIONS_KEY)
  localStorage.removeItem(process.env.VUE_APP_ROLES_KEY)
  localStorage.removeItem(process.env.VUE_APP_TABS)
  removeAuthorization()
  Cookie.remove('login-info')
}

export {login, logout,checkSso, checkSsoAsync,getRoutesConfig,loginInfo,sendMobile,modifyPassword}

import {BASE_URL,LOGIN, ROUTES,CHECKSSO} from '@/services/api'
import {request, METHOD, removeAuthorization} from '@/utils/request'

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
async function sendMobile(loginid,mobile){
  return  request(BASE_URL+"/auth/user/sendMobile", METHOD.POST, {
    loginid: loginid,
    mobile: mobile
  })
}

async function modifyPassword(loginid,mobile,password,checkPass,captcha){
  return  request(BASE_URL+"/auth/user/modifyPassword", METHOD.POST, {
    loginid: loginid,
    mobile: mobile,
    password: password,
    checkPass: checkPass,
    captcha: captcha
  })
}
/**
 * 退出登录
 */
function logout() {
  localStorage.removeItem(process.env.VUE_APP_ROUTES_KEY)
  localStorage.removeItem(process.env.VUE_APP_PERMISSIONS_KEY)
  localStorage.removeItem(process.env.VUE_APP_ROLES_KEY)
  removeAuthorization()
}



export {login, logout,checkSso, getRoutesConfig,sendMobile,modifyPassword}

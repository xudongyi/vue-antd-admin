//TODO 这边是需要进行调整的（API）
// const BASE_URL = 'http://172.16.7.53:8000/salary'
 const BASE_URL = 'https://salary.tfme.com:8000/salary'
// const BASE_URL = 'http://127.0.0.1:8000/salary'
//const BASE_URL = '' // mock base url
module.exports = {
  BASE_URL:BASE_URL,
  LOGIN: `${BASE_URL}/auth/admin/login`,
  CHECKSSO: `${BASE_URL}/auth/user/checkSso`,
  ROUTES: `${BASE_URL}/routes`,
  CHECK_PASSWORD_URL:`${BASE_URL}/personnelSalary/checkPassword`,
}

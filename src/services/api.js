//TODO 这边是需要进行调整的（API）
const BASE_URL = 'http://127.0.0.1:8888/salary'
//const BASE_URL = '' // mock base url
module.exports = {
  BASE_URL:BASE_URL,
  LOGIN: `${BASE_URL}/auth/admin/login`,
  CHECKSSO: `${BASE_URL}/auth/user/checkSso`,
  ROUTES: `${BASE_URL}/routes`,
  IMPORT_SALARY_URL:`${BASE_URL}/salaryImport/import`
}

//TODO 这边是需要进行调整的（API）
const BASE_URL = process.env.VUE_APP_URL
module.exports = {
  BASE_URL:BASE_URL,
  LOGIN: `${BASE_URL}/auth/admin/login`,
  CHECKSSO: `${BASE_URL}/auth/user/checkSso`,
  ROUTES: `${BASE_URL}/routes`,
  CHECK_PASSWORD_URL:`${BASE_URL}/personnelSalary/checkPassword`,
}

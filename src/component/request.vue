<script>
import axios from 'axios'
import qs from 'qs'

// 请求携带cookie
axios.defaults.withCredentials = true

axios.interceptors.request.use(function (config) {
  // 发送前逻辑
  return config
}, function (error) {
  // 异常
  return Promise.reject(error)
})

axios.interceptors.response.use(function (response) {
  // 发送后逻辑
  return response
}, function (error) {
  // 异常
  return Promise.reject(error)
})

async function successState (res) {
  // 响应成功后逻辑
  return res
}

async function errorState (response) {
  // 响应失败后逻辑
  return response
}

let ready = async (method, url, params) => {
  let httpDefault = {
    method: method,
    baseURL: 'http://47.94.231.91',
    url: url,
    params: method === 'GET' || method === 'DELETE' ? params : null,
    data: method === 'POST' || method === 'PUT' ? qs.stringify(params) : null,
    timeout: 60000
  }
  return new Promise(async (resolve, reject) => {
    await axios(httpDefault)
      .then(async (res) => {
        await successState(res)
        resolve(res)
      }).catch(async (response) => {
        await errorState(response)
        reject(response)
      })
  })
}

let get = async (url, params) => {
  return ready('GET', url, params)
}

let post = async (url, params) => {
  return ready('POST', url, params)
}

export default {
  ready,
  get,
  post,
  name: 'request'
}
</script>

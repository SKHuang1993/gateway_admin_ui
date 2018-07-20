import axios from 'axios'
import { Message } from 'element-ui'

const HTTP = axios.create({
  // 基础url前缀
  baseURL: 'Web/',
  // transformRequest: [function (data) { //json to form data
  //   return qs.stringify(data)
  // }],
  headers: {

  }
});

let message


HTTP.interceptors.request.use(config => {
  return config
}, (error) => {
  return Promise.reject(error)
})

// response拦截器
HTTP.interceptors.response.use(
  response => {
    return response;
  },
  error => {
    if (error && error.response) {
      switch (error.response.status) {
        case 400:
          break
        case 401:
          break
        case 403:
          return
        case 404:
          break
        case 408:
          break
        case 500:
          break
        case 504:
          break
        default:
          error.message = '未知错误'
      }
      message = Message.error(error.message)
    } else {
      message = Message.error(error.message)
    }
    return {error: -1, data: ''}
  }
)

export function Clusters(data) {
  return HTTP({
    url: 'v1/clusters',
    method: 'GET'
  })
}

export function ClustersCreate(data) {
    return HTTP({
        url: 'v1/clusters',
        method: 'PUT',
        data:data
    })
}

export function ClustersGet(id) {
  return HTTP({
    url: 'v1/clusters/' + id,
    method: 'GET'
  })
}

export function ClustersDelete(id) {
  return HTTP({
    url: 'v1/clusters/' + id,
    method: 'DELETE'
  })
}

export function ClustersBindServer(id) {
  return HTTP({
    url: 'v1/clusters/' + id + '/binds',
    method: 'GET'
  })
}

export function BindServerCreate(data) {
  return HTTP({
    url: 'v1/binds',
    method: 'PUT',
    data:data
  })
}

export function BindDelete(data) {
  return HTTP({
    url: 'v1/binds',
    method: 'DELETE',
    data:data
  })
}

export function Server(data) {
  return HTTP({
    url: 'v1/servers',
    method: 'GET'
  })
}

export function ServerCreate(data) {
  return HTTP({
    url: 'v1/servers',
    method: 'PUT',
    data:data
  })
}

export function ServerGet(id) {
  return HTTP({
    url: 'v1/servers/' + id,
    method: 'GET'
  })
}

export function ServerDelete(id) {
  return HTTP({
    url: 'v1/servers/' + id,
    method: 'DELETE'
  })
}

export function Apis() {
  return HTTP({
    url: 'v1/apis',
    method: 'GET'
  })
}

export function ApisCreate(data) {
  return HTTP({
    url: 'v1/apis',
    method: 'PUT',
    data:data
  })
}

export function ApisGet(id) {
  return HTTP({
    url: 'v1/apis/' + id,
    method: 'GET'
  })
}

export function ApisDelete(id) {
  return HTTP({
    url: 'v1/apis/' + id,
    method: 'DELETE'
  })
}

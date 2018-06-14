import axios from 'axios'


const HTTP = axios.create({
  // 基础url前缀
  baseURL: 'Web/',
  // transformRequest: [function (data) { //json to form data
  //   return qs.stringify(data)
  // }],
  headers: {

  }
});

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

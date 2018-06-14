import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/view/home'
import Index from '@/view/index'
import Cluster from '@/view/cluster'
import ClusterServer from '@/view/server'
import Apis from '@/view/apis'
import ApisAdd from '@/view/apisadd'
import ApisEdit from '@/view/apisedit'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',

      component: Home,
        children: [
            {
                path: '',
                name: 'index',
                component: Index
            },
            {
                path: '/cluster',
                name: 'Cluster',
                component: Cluster,
            },
            {
              path: '/cluster/server/:id',
              name: 'ClusterServer',
              component: ClusterServer,
            },
            {
                path: '/apis',
                name: 'Apis',
                component: Apis
            },
            {
              path: '/apis/add',
              name: 'ApisAdd',
              component: ApisAdd
            },
            {
              path: '/apis/edit/:id',
              name: 'ApisEdit',
              component: ApisEdit,
            },
        ]
    }
  ]
})

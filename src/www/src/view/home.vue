<template>
  <el-container>
    <el-header>
      <div class="logo">ChangDao Gateway</div>
    </el-header>
    <el-aside width="240px">
      <ul class="aside_ul">
        <li><router-link to="/" exact><span class="title-icon el-icon-location"></span>概述</router-link></li>
        <li><router-link to="/cluster"><span class="title-icon el-icon-menu"></span>集群</router-link></li>
        <li><router-link to="/apis"><span class="title-icon el-icon-share"></span>接口</router-link></li>
        <li><router-link to="/export"><span class="title-icon el-icon-download"></span>导出配置</router-link></li>
        <li><router-link to="/import"><span class="title-icon el-icon-upload2"></span>导入配置</router-link></li>
      </ul>
    </el-aside>
    <router-view></router-view>
  </el-container>
</template>

<script>
import{Login} from "@/api/index"
export default {
  name: 'App',
  data() {
    return {

    }
  }
}
</script>

<style lang="scss" scoped>
  .el-header{
    background-color: #ffffff;
    height: 60px;
    position: fixed;
    top:0;
    left: 0;
    width: 100%;
    border-bottom: 1px solid #e5e5e5;
    z-index: 10;
    padding: 0 10px;
    .logo{
      width: 240px;
      height: 60px;
      color: #333333;
      line-height: 60px;
      font-weight: 700;
      font-size: 14px;
    }
  }
  .el-aside {
    background-color: #ffffff;
    position: fixed;
    height: 100%;
    left: 0;
    z-index: 5;
    top: 60px;
    -webkit-box-shadow: 0 0 5px #e0e0e0;
    box-shadow: 0 0 5px #e0e0e0;
    .aside_ul{
      width: 240px;
      li{
        width: 240px;
        height: 50px;
        line-height:50px;
        text-indent: 15px;
        font-size: 14px;
        cursor: pointer;
        font-weight:500;
        .title-icon{
          margin-right: 12px;
          font-size: 14px;
          width: 35px;
          line-height:50px;
        }
        a{
          width: 240px;
          height: 50px;
          display: block;
        }
        a.router-link-active{
          background-color: #ecf8ee!important;
          color: #4caf50!important;
        }
        a.router-link-exact-active{
          background-color: #ecf8ee;
          color: #4caf50;
        }
        &:hover{
          background-color: #ecf8ee;

        }
      }
    }
  }
</style>

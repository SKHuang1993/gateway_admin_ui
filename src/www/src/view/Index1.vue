<template>
        <el-main>

            <div class="main_title"><i class="el-icon-menu"></i> 数据统计</div>

            <el-row  class="main_data" :gutter="20">
                <el-col :span="6">
                  <div class="grid-content bg-purple">

                  </div>
                </el-col>
                <el-col :span="6">
                  <div class="grid-content bg-purple">

                  </div>
                </el-col>
                <el-col :span="6">
                  <div class="grid-content bg-purple">

                  </div>
                </el-col>
                <el-col :span="6">
                  <div class="grid-content bg-purple">

                  </div>
                </el-col>
            </el-row>

            <div class="main_title"><i class="el-icon-menu"></i> 组件支持</div>

        </el-main>
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
    .el-main {
        margin: 60px 0 0 240px;
        padding: 10px;
        .main_title{
          height: 30px;
          line-height: 30px;
          margin: 10px 0;
          font-size: 16px;
          color: #666666;
        }
        .main_data{
            margin-top: 20px;
        }
        .bg-purple{
            border-radius: 4px;
            height: 100px;
            background-color: #F2F6FC;
        }
    }
</style>

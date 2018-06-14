<template>
  <el-main>
    <el-row>
      <el-col :span="24">
        <el-button class="add" type="primary" icon="el-icon-plus"><router-link to="/apis/add">新增接口</router-link></el-button>
      </el-col>
    </el-row>

    <el-table :data="tableData" style="width: 100%">
      <el-table-column label="ID" width="140">
        <template slot-scope="scope">
          {{ scope.row.id }}
        </template>
      </el-table-column>
      <el-table-column label="接口名称" >
        <template slot-scope="scope">
          <span style="margin-left: 10px">{{ scope.row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="URL匹配模式" >
        <template slot-scope="scope">
          <span>{{ scope.row.urlPattern }}</span>
        </template>
      </el-table-column>
      <el-table-column label="请求类型" >
        <template slot-scope="scope">
          <span>{{ scope.row.method }}</span>
        </template>
      </el-table-column>
      <el-table-column label="接口聚合" >
        <template slot-scope="scope">
          <span>{{ scope.row.nodes.length }}</span>
        </template>
      </el-table-column>
      <el-table-column label="开关状态" >
        <template slot-scope="scope">
          <span>{{ scope.row.status == 0 ? '关闭中' : '正常' }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="260">
        <template slot-scope="scope">
          <el-button size="mini"><router-link :to="{name:'ApisEdit',params: {id: scope.row.id}}" class="edit_color">编辑</router-link></el-button>
          <el-button size="mini" type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

  </el-main>
</template>

<script>
    import{Apis,ApisDelete} from "@/api/index"
    export default {
        name: 'App',
        data() {
          return {
            tableData: []
          }
        },
        created(){
          this.init();
        },
        methods: {
          init(){
            Apis().then(res=>{
              this.tableData = res.data.data;
            })
          },
          handleDelete(index, row) {
            this.$confirm('是否确定删除?', '删除操作', {
              confirmButtonText: '确定',
              confirmButtonClass: 'el-button--danger',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
              ApisDelete(row.id).then(res=>{
                if(res.data.code === 0){
                  this.init();
                  this.$message({
                    message: '接口删除成功',
                    type: 'success'
                  });
                }else{
                  this.$message.error('接口删除失败');
                }
              })
            }).catch(() => {});
          }
        }
    }
</script>

<style lang="scss" scoped>
  .el-main {
    margin: 60px 0 0 240px;
    padding: 10px;
    .el-col{
      text-align: right;
    }
    .el-button.add{
      background-color: #4caf50;
      border: 0;
      font-size: 12px;
      color: #ffffff;
    }
    .el-button a.edit_color{
      color: #666666;
    }
    a{
      color: #ffffff;
    }
  }
</style>

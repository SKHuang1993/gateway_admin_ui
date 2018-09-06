<template>
  <el-main>
    <el-row style="margin-bottom: 20px;margin-top: 30px">
      <el-col :span="24">
        <div style="float: left;width: 400px">
          <el-input placeholder="筛选条件" v-model="input_screen">
            <el-button slot="append" @click="Screen()" icon="el-icon-search"></el-button>
          </el-input>
        </div>
        <el-button class="add" type="primary" icon="el-icon-plus"><router-link to="/apis/add">新增接口</router-link></el-button>
      </el-col>
    </el-row>

    <el-table :data="tableData" style="width: 100%" v-if="Screen_tableData.length == 0">
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
          <el-tag :type="scope.row.nodes.length == 1 ? 'primary' : 'success'" disable-transitions>{{ scope.row.nodes.length }}</el-tag>
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

    <el-table :data="Screen_tableData" style="width: 100%" v-if="Screen_tableData.length > 0">
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
          <el-tag :type="scope.row.nodes.length == 1 ? 'primary' : 'success'" disable-transitions>{{ scope.row.nodes.length }}</el-tag>
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

    <el-dialog
      title="导出数据"
      :visible.sync="dialogVisible"
      width="60%">
      <span></span>
      <span slot="footer" class="dialog-footer">
    <el-button @click="dialogVisible = false">关闭</el-button>
  </span>
    </el-dialog>

  </el-main>
</template>

<script>
    import{Apis,ApisDelete} from "@/api/index"
    export default {
        name: 'App',
        data() {
          return {
            tableData: [],
            input_screen: "",
            Screen_tableData: [],
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
          },
          Screen(){
            var tableData = this.tableData;

            var Screen_tableData = [];

            if(this.input_screen.length > 0 && tableData.length > 0){

              for ( var i = 0; i < tableData.length; i++){

                var thidata = tableData[i];

                if(thidata.name.indexOf(this.input_screen) != -1 || thidata.urlPattern.indexOf(this.input_screen) != -1){

                  Screen_tableData.push(tableData[i]);

                }

              }

              this.Screen_tableData = Screen_tableData

            }else{

              this.Screen_tableData = [];

            }
          },
          handleExport(index, row){

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

<template>
    <el-main>

      <el-row>
        <el-col :span="24">
          <div class="demonstration h_title">集群服务管理：<font>{{ clustersData.name }}</font></div>
          <el-button class="add" type="primary" icon="el-icon-plus" @click="handleServer()">新增服务</el-button>
        </el-col>
      </el-row>

      <el-table :data="tableData" style="width: 100%">
        <el-table-column label="ID" width="140">
          <template slot-scope="scope">
            {{ scope.row.id }}
          </template>
        </el-table-column>
        <el-table-column label="服务地址" >
          <template slot-scope="scope">
            <span style="margin-left: 10px">{{ scope.row.info.addr }}</span>
          </template>
        </el-table-column>
        <el-table-column label="接口协议" >
          <template slot-scope="scope">
            <span>{{ scope.row.info.protocol == 0 ? 'HTTP' : 'Unknown' }}</span>
          </template>
        </el-table-column>
        <el-table-column label="最大QPS" >
          <template slot-scope="scope">
            <span>{{ scope.row.info.maxQPS}}</span>
          </template>
        </el-table-column>
        <el-table-column label="健康检查机制">
          <template slot-scope="scope">
            <el-popover placement="top-start" width="240" trigger="hover" :content="JSON.stringify(scope.row.info.heathCheck)" popper-class="popper_class">
              <i slot="reference" class="el-icon-search"></i>
            </el-popover>
          </template>
        </el-table-column>
        <el-table-column label="熔断规则">
          <template slot-scope="scope">
            <el-popover placement="top-start" width="240" trigger="hover" :content="JSON.stringify(scope.row.info.circuitBreaker)" popper-class="popper_class">
              <i slot="reference" class="el-icon-search"></i>
            </el-popover>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="160">
          <template slot-scope="scope">
            <el-button size="mini" @click="handleServer(scope.$index, scope.row.info)">编辑</el-button>
            <el-button size="mini" type="danger" @click="handleDelete(scope.$index, scope.row.info)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <el-dialog :title="form.id == 0 ? '新增服务' : '更新服务'" :visible.sync="dialogServer" width="30%" :show-close="false" :close-on-click-modal="false" :close-on-press-escape="false">
        <el-form :model="form" :rules="rules" ref="form" class="el-form--label-top">
          <el-form-item label="服务地址" prop="addr">
            <el-input  v-model="form.addr" auto-complete="off" placeholder="请输入服务地址,例如127.0.0.1:8081"></el-input>
          </el-form-item>
          <el-form-item label="服务接口协议(HTTP=0,Grpc=1,Dubbo=1,SpringCloud=2)" prop="protocol">
            <el-input  v-model.number="form.protocol" auto-complete="off" placeholder="请输入接口协议,目前仅支持HTTP"></el-input>
          </el-form-item>
          <el-form-item label="最大QPS" prop="maxQPS">
            <el-input  v-model.number="form.maxQPS" auto-complete="off" placeholder="请设置最大QPS（不能为0）"></el-input>
          </el-form-item>
          <el-form-item label="健康检测机制(不开启则不填写即可)" class="el-col-s">
            <el-col :span="7">
              <el-input  v-model="form.heathCheck.path" auto-complete="off" placeholder="检测路径，如/ping"></el-input>
            </el-col>
            <div class="line el-col el-col-05">&nbsp</div>
            <el-col :span="8">
              <el-input  v-model.number="form.heathCheck.checkInterval" auto-complete="off" placeholder="检查间隔时间（纳秒）"></el-input>
            </el-col>
            <div class="line el-col el-col-05">&nbsp</div>
            <el-col :span="8">
              <el-input  v-model.number="form.heathCheck.timeout" auto-complete="off" placeholder="检查超时时间（纳秒）"></el-input>
            </el-col>
          </el-form-item>
          <el-form-item label="熔断规则(不开启则不填写即可)"  class="el-col-s">
            <el-col :span="12">
              <el-input v-model.number="form.circuitBreaker.closeTimeout" auto-complete="off" placeholder="关闭检查间隔时间（纳秒）" style="margin-bottom: 10px"></el-input>
            </el-col>
            <div class="line el-col el-col-05">&nbsp</div>
            <el-col :span="11">
              <el-input v-model.number="form.circuitBreaker.rateCheckPeriod" auto-complete="off" placeholder="熔断器检查周期（纳秒）" style="margin-bottom: 10px;"></el-input>
            </el-col>
            <div class="line el-col el-col-05">&nbsp</div>
            <el-col :span="7">
              <el-input v-model.number="form.circuitBreaker.halfTrafficRate" auto-complete="off" placeholder="half限流，0-100"></el-input>
            </el-col>
            <div class="line el-col el-col-05">&nbsp</div>
            <el-col :span="8">
              <el-input v-model.number="form.circuitBreaker.failureRateToClose" auto-complete="off" placeholder="Close限流，0-100"></el-input>
            </el-col>
            <div class="line el-col el-col-05">&nbsp</div>
            <el-col :span="8">
              <el-input v-model.number="form.circuitBreaker.succeedRateToOpen" auto-complete="off" placeholder="Open限流，0-100"></el-input>
            </el-col>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
                <el-button @click="handleClose('form')">取消</el-button>
                <el-button type="primary" @click="submitForm('form')">确定</el-button>
            </span>
      </el-dialog>

    </el-main>
</template>

<script>
    import{Server,ServerCreate,ServerDelete,ClustersGet,ClustersBindServer,ServerGet,BindServerCreate,BindDelete} from "@/api/index"
    export default {
        name: 'App',
        data() {
            let checknumber = (rule, value, callback) => {
              if (value != 0) {
                callback(new Error('目前仅支持HTTP协议,默认填写 0'));
              }else{
                callback();
              }
            };
            let checknumber_a = (rule, value, callback) => {
              if (value == 0) {
                callback(new Error('不能为0'));
              }else{
                callback();
              }
            };
            return {
              dialogServer:false,
              dialogDelete: false,
              ClustersId:0,
              clustersData:[],
              tableData:[],
              form:{
                id:0,
                addr:'',
                protocol:'',
                maxQPS:'',
                heathCheck:{
                  path:'',
                  checkInterval:'',
                  timeout:''
                },
                circuitBreaker:{
                  closeTimeout:'',
                  halfTrafficRate:'',
                  rateCheckPeriod:'',
                  failureRateToClose:'',
                  succeedRateToOpen:''
                }
              },
              rules:{
                addr:[
                  { required: true, message: '请输入服务地址', trigger: 'change' },
                  { min: 5, max: 255, message: '长度请控制在 5 - 255', trigger: 'change' }
                ],
                protocol:[
                  { required: true, message: '请设置服务接口协议', trigger: 'change' },
                  { type: 'number', min: 1, max: 1, validator: checknumber, message: '目前仅支持HTTP，请填写0', trigger: 'change'},
                ],
                maxQPS:[
                  { required: true, message: '请设置服务最大允许QPS', trigger: 'change' },
                  { type: 'number', min: 0, max: 1, validator: checknumber_a, message: '数值必须大于0', trigger: 'change'},
                ]
              }
            }
        },
        created(){
          this.ClustersId = this.$route.params.id;
          this.init();
        },
        methods: {
          init(){
            ClustersGet(this.ClustersId).then(res=>{
              this.clustersData = res.data.data;
            })
            ClustersBindServer(this.ClustersId).then(res=>{
              var table = [];
              var table_test = {
                id:'',
                info:''
              }
              res = res.data.data;
              if(res != null) {
                res.forEach(function (ele, index) {
                  table_test.id = ele;
                  table[index] = table_test;
                  ServerGet(ele).then(ress => {
                    table[index].info = ress.data.data;
                  });
                  table_test = {
                    id: '',
                    info: ''
                  }
                });
              }
              this.tableData = table;
            })
          },
          handleServer(index, row){
            if(!index && !row){
              this.dialogServer = true;
            }else{
              if(!row.heathCheck){
                row.heathCheck = {path:'',checkInterval:'', timeout:''};
              }
              if(!row.circuitBreaker){
                row.circuitBreaker = {closeTimeout:'', halfTrafficRate:'', rateCheckPeriod:'', failureRateToClose:'', succeedRateToOpen:''};
              }
              this.form = row;
              this.dialogServer = true;
            }
          },
          handleClose(formName){
            this.dialogServer = false;
            this.form = {
              id:0,
                addr:'',
                protocol:'',
                maxQPS:'',
                heathCheck:{
                  path:'',
                  checkInterval:'',
                  timeout:''
              },
              circuitBreaker:{
                closeTimeout:'',
                  halfTrafficRate:'',
                  rateCheckPeriod:'',
                  failureRateToClose:'',
                  succeedRateToOpen:''
              }
            }
            this.$refs[formName].resetFields();
          },
          handleDelete(index, row) {
            this.$confirm('是否确定删除?', '删除', {
              confirmButtonText: '确定',
              confirmButtonClass: 'el-button--danger',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
              ServerDelete(row.id).then(res=>{
                if(res.data.code === 0){
                  this.dialogDelete = false;
                  BindDelete({clusterID:Number(this.ClustersId),serverID:row.id}).then(res=>{});
                  this.init();
                  this.$message({
                    message: '服务删除成功',
                    type: 'success'
                  });
                }else{
                  this.dialogDelete = false;
                  this.$message.error('服务删除失败');
                }
              })
            }).catch(() => {});
          },
          create(data){
            if(data.id == 0){
              delete data.id;
            }

            if(this.form.heathCheck.path == "" && this.form.heathCheck.path == "" && this.form.heathCheck.checkInterval == ""){
              delete this.form.heathCheck;
            }

            if(this.form.circuitBreaker.closeTimeout == "" && this.form.circuitBreaker.halfTrafficRate == "" && this.form.circuitBreaker.rateCheckPeriod == "" && this.form.circuitBreaker.failureRateToClose == "" && this.form.circuitBreaker.succeedRateToOpen == ""){
              delete this.form.circuitBreaker;
            }

            ServerCreate(data).then(res=>{
              if(res.data.code == 0){
                this.form = {
                  id:0,
                  addr:'',
                  protocol:'',
                  maxQPS:'',
                  heathCheck:{
                    path:'',
                    checkInterval:'',
                    timeout:''
                  },
                  circuitBreaker:{
                    closeTimeout:'',
                    halfTrafficRate:'',
                    rateCheckPeriod:'',
                    failureRateToClose:'',
                    succeedRateToOpen:''
                  }
                }
                this.dialogServer = false;
                BindServerCreate({clusterID:Number(this.ClustersId),serverID:res.data.data}).then(res=>{});
                this.init();
                this.$message({message: data.id === 0 ? '新增服务成功' : '更新服务成功',type: 'success'});
              }else{
                this.$message.error(data.id === 0 ? '新增服务失败' : '更新服务失败');
              }
            })
          },
          submitForm(formName) {
            this.$refs[formName].validate((valid) => {
              if (valid) {
                this.create(this.form);
              } else {
                return false;
              }
            });
          }
        }
    }
</script>

<style lang="scss" scoped>
  .el-main {
    margin: 60px 0 0 240px;
    padding: 10px;
    .el-col {
      text-align: right;
    }
    .el-form--label-top .el-form-item__label {
      padding: 0;
    }
    .el-button.add {
      background-color: #4caf50;
      border: 0;
      font-size: 12px;
    }
    .h_title{
      float: left;
      line-height: 40px;
      font{
        color: #4caf50;
      }
    }
  }
</style>

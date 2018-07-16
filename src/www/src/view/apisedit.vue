<template>
  <el-main>

    <el-form :model="form" :rules="rules" ref="form" label-width="140px" class="el-col el-col-9 min_top">
      <el-form-item label="接口名称" prop="name">
        <el-input  v-model="form.name" auto-complete="off" placeholder="请输入接口名称" style="width: 260px"></el-input>
      </el-form-item>

      <el-form-item label="接口URL匹配模式" prop="urlPattern">
        <el-input  v-model="form.urlPattern" auto-complete="off" placeholder="请输入接口URL匹配模式，正则表达式，如：^/api/users/(\\d+)$"></el-input>
      </el-form-item>

      <el-form-item label="接口请求类型">
        <el-radio-group v-model="form.method">
          <el-radio label="*"></el-radio>
          <el-radio label="GET"></el-radio>
          <el-radio label="POST"></el-radio>
          <el-radio label="PUT"></el-radio>
          <el-radio label="DELETE"></el-radio>
        </el-radio-group>
      </el-form-item>

      <el-form-item label="接口默认返回值" prop="defaultValue.body">
        <el-input  v-model="form.defaultValue.body" auto-complete="off" placeholder="当后端Cluster无可用Server的时候，返回默认值(json格式BASE64数据)"></el-input>
      </el-form-item>

      <!--<el-form-item label="接口默认跳转">
        <el-input  v-model="form.defaultValue.headers[0].value" auto-complete="off" placeholder="当后端Cluster无可用Server的时候，跳转到设定的网址"></el-input>
      </el-form-item>-->

      <el-form-item label="Auth插件名称" prop="authFilter">
        <el-input  v-model="form.authFilter" auto-complete="off" placeholder="指定该API所使用的Auth插件名称，例如：CUSTOM_JWT"></el-input>
      </el-form-item>

      <el-form-item label="接口IP的访问控制" style="width: 800px">
        <el-row>
          <el-col :span="11">
            <div class="grid-content">
              <el-card class="box-card">
                <div slot="header" class="clearfix">
                  <div style="line-height: 30px;color: #999999">IP白名单</div>
                  <el-input placeholder="请输入IP地址" v-model="ip.whitelist">
                    <el-button slot="append" @click="ADD_IP('whitelist')">添加</el-button>
                  </el-input>
                </div>
                <div class="text item" v-for="(item,index) in form.ipAccessControl.whitelist" :key="index">{{ item }} <span style="float: right;color: #999999;cursor: pointer" @click="DEL_IP('whitelist',index)">移除</span></div>
              </el-card>
            </div>
          </el-col>
          <el-col :span="11">
            <div class="grid-content">
              <el-card class="box-card">
                <div slot="header" class="clearfix">
                  <div style="line-height: 30px;color: #999999">IP黑名单</div>
                  <el-input placeholder="请输入IP地址" v-model="ip.blacklist">
                    <el-button slot="append" @click="ADD_IP('blacklist')">添加</el-button>
                  </el-input>
                </div>
                <div class="text item" v-for="(item,index) in form.ipAccessControl.blacklist" :key="index">{{ item }} <span style="float: right;color: #999999;cursor: pointer" @click="DEL_IP('blacklist',index)">移除</span></div>
              </el-card>
            </div>
          </el-col>
        </el-row>
      </el-form-item>

      <el-form-item label="接口聚合" style="width: 800px">
        <el-row style="width: 900px">
          <div class="grid-content" v-for="(item,index) in form.nodes" :key="index">
            <el-card class="box-card">

              <div class="title_t">接口 {{ index+1 }} <a style="float: right;font-size: 12px;color: #999999;cursor: pointer" @click="DEL_JIEDIAN(index)" v-if="index > 0">移除节点</a></div>

              <el-row>
                <el-col :span="7">
                  <div class="grid-content bg-purple" prop="item.clusterID">
                    <el-select v-model.number="item.clusterID" placeholder="请选择集群" class="el-col-24">
                      <el-option v-for="(items,indexs) in clustersData" :label="items.name" :value="items.id" :key="indexs"></el-option>
                    </el-select>
                  </div>
                </el-col>
                <el-col :span="8">
                  <el-form-item class="grid-content bg-purple-light">
                    <el-input  v-model="item.attrName" auto-complete="off" placeholder="请输入节点标示名,例如：user"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="9">
                  <div class="grid-content bg-purple">
                    <el-input  v-model="item.urlRewrite" auto-complete="off" placeholder="请输入URL重写规则，例如：/users?id=$1"></el-input>
                  </div>
                </el-col>
                <el-col >
                  <div class="grid-content bg-purple" style="padding: 0 5px">
                    <el-input  v-model="item.defaultValue.body" auto-complete="off" placeholder="当节点不可用的时候，返回默认值"></el-input>
                    <!--<el-col :span="12">
                      <div class="grid-content bg-purple" style="padding: 5px 0;padding-right: 5px">
                        <el-input  v-model="item.defaultValue.body" auto-complete="off" placeholder="当节点不可用的时候，返回默认值"></el-input>
                      </div>
                    </el-col>
                    <el-col :span="12">
                      <div class="grid-content bg-purple">
                        <el-input  v-model="item.defaultValue.headers[0].value" auto-complete="off" placeholder="当节点不可用的时候，跳转到设定的网址"></el-input>
                      </div>
                    </el-col>-->
                  </div>
                </el-col>
              </el-row>

              <el-row>
                <el-col :span="24">
                  <div class="grid-content bg-purple-dark">
                    <div class="dark_mina">
                      <div class="dark_mina_title">参数集 <el-row type="primary" class="add_parameter"><i class="el-icon-plus" @click="ADD_PRIMARY(index)">增加参数</i></el-row></div>
                      <el-row v-for="(validations,indexss) in item.validations" :key="indexss">
                        <el-col :span="6">
                          <div class="grid-content bg-purple">
                            <el-input  v-model="validations.parameter.name" auto-complete="off" placeholder="参数名，例如：name"></el-input>
                          </div>
                        </el-col>
                        <el-col :span="6">
                          <div class="grid-content bg-purple-light">
                            <el-select v-model.number="validations.parameter.source" placeholder="请选择参数数据源">
                              <el-option label="QueryString" value="0"></el-option>
                              <el-option label="FormData" value="1"></el-option>
                              <el-option label="JSONBody" value="2"></el-option>
                              <el-option label="Header" value="3"></el-option>
                              <el-option label="Cookie" value="4"></el-option>
                              <el-option label="PathValue" value="5"></el-option>
                            </el-select>
                          </div>
                        </el-col>
                        <el-col :span="6">
                          <div class="grid-content bg-purple">
                            <el-input  v-model.number="validations.parameter.index" auto-complete="off" placeholder="PathValue分割索引"></el-input>
                          </div>
                        </el-col>
                        <el-col :span="6">
                          <div class="grid-content bg-purple-light">
                            <el-form-item label="">
                              <el-checkbox-group v-model.Boolean="validations.required" style="color: #666666">
                                <el-checkbox label="是否必须" name="type"></el-checkbox>
                                <a style="float: right;font-size: 12px;color: #999999;cursor: pointer" @click="DEL_PRIMARY(index,indexss)">移除参数</a>
                              </el-checkbox-group>
                            </el-form-item>
                          </div>
                        </el-col>
                      </el-row>
                    </div>
                  </div>
                </el-col>
              </el-row>

            </el-card>
          </div>
        </el-row>
        <el-col >
          <div class="grid-content bg-purple" style="padding: 0 5px;text-align: right;width: 890px">
            <el-button class="add" type="primary" icon="el-icon-plus" @click="ADD_JIEDIAN()">新增节点</el-button>
          </div>
        </el-col>
      </el-form-item>

      <el-form-item label="聚合数据集" style="width: 800px" v-if="form.nodes.length > 1">
        <el-row style="width: 700px">
          <div class="grid-content">
            <el-card class="box-card bg-purple-dark" v-for="(item,index) in form.renderTemplate.objects" :key="index">
              <el-form-item>
                <a style="float: right;font-size: 12px;color: #999999;cursor: pointer" @click="ADD_ATTR(index)"><i class="el-icon-plus"></i>添加字段</a>
              </el-form-item>
              <el-row v-for="(items,indexs) in item.attrs" :key="indexs">
                <el-col :span="8">
                  <div class="grid-content bg-purple" style="padding:5px 0">
                    <el-input  v-model="items.name" auto-complete="off" placeholder="请输入字段名称"></el-input>
                  </div>
                </el-col>
                <el-col :span="16">
                  <div class="grid-content bg-purple-light">
                    <el-input  v-model="items.extractExp" auto-complete="off" placeholder="请输入字段对应数据路径" style="width: 350px"></el-input>
                    <a style="float: right;font-size: 12px;color: #999999;cursor: pointer" @click="DEL_ATTR(index,indexs)" v-if="indexs > 0">移除字段</a>
                  </div>
                </el-col>
              </el-row>
            </el-card>
          </div>
        </el-row>
      </el-form-item>

      <el-form-item label="状态开关" prop="status">
        <el-switch v-model="form.status" active-color="#13ce66" inactive-color="#f1f1f1"></el-switch>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="onSubmit('form')">确定</el-button>
        <el-button><router-link to="/apis">取消</router-link></el-button>
      </el-form-item>
    </el-form>

  </el-main>
</template>

<script>
  import{Clusters,ApisCreate,ApisGet} from "@/api/index"
  export default {
    name: 'App',
    data() {
      let checknumber = (rule, value, callback) => {
        if (value > 0) {
          callback();
        }else{
          callback(new Error('请选择节点集群'));
        }
      };
      return {
        ip:{
          whitelist:'',
          blacklist:''
        },
        clustersData:[],
        form:{
          id:0,
          name:'',
          urlPattern:'',
          method:'*',
          domain:'',
          status:false,
          ipAccessControl:{
            whitelist:[],
            blacklist:[]
          },
          defaultValue:{
            body:'eyJjb2RlIjoyMDAsImRhdGEiOiIiLCJtc2ciOiLmnI3liqHlvILluLjvvIzor7fph43mlrDlsJ3or5UifQ==',
            headers:[
              {name:'Location',value:''}
            ],
            cookies:[]
          },
          nodes:[
            {
              clusterID:'',
              urlRewrite:'',
              attrName:'',
              validations:[

              ],
              defaultValue:{
                code:200,
                body:'eyJjb2RlIjoyMDAsImRhdGEiOiIiLCJtc2ciOiLmnI3liqHlvILluLjvvIzor7fph43mlrDlsJ3or5UifQ==',
                headers:[
                  {name:'Location',value:''}
                ]
              }
            }
          ],
          authFilter:'CUSTOM_JWT',
          renderTemplate:{
            objects:[
              {
                name:'',
                attrs:[
                  {
                    name:'',
                    extractExp:''
                  }
                ],
                flatAttrs:true
              }
            ]
          },
          useDefault:false,
          matchRule:0,
          position:0
        },
        rules:{
          name:[
            { required: true, message: '请填写接口名称', trigger: 'change' }
          ],
          urlPattern:[
            { required: true, message: '请填写接口URL匹配模式', trigger: 'change' }
          ],
          'defaultValue.body':[
            { required: true, message: '请填写接口默认返回值', trigger: 'change' }
          ],
          authFilter:[
            { required: true, message: '请填写Auth插件名称,默认CUSTOM_JWT', trigger: 'change' }
          ]
        }
      }
    },
    created(){
      this.form.id = this.$route.params.id;
      this.init();
    },
    methods: {
      init(){
        Clusters().then(res=>{
          this.clustersData = res.data.data;
        });
        ApisGet(this.form.id).then(res=>{

          if(res.data.data.status == 1){
            res.data.data.status = true;
          }else{
            res.data.data.status = false;
          }

          if(!res.data.data.ipAccessControl.blacklist){
            res.data.data.ipAccessControl.blacklist = [];
          }

          if(!res.data.data.ipAccessControl.whitelist){
            res.data.data.ipAccessControl.whitelist = [];
          }

          if(!res.data.data.defaultValue.headers){
            res.data.data.defaultValue.headers = [];
            res.data.data.defaultValue.headers[0] = {name:'Location',value:''}
          }

          res.data.data.nodes.forEach(function (items,index) {
            if(!items.defaultValue.headers){
              items.defaultValue.headers = [];
              items.defaultValue.headers[0] = {name:'Location',value:''}
            }

            if(!items.validations){
              items.validations = [];
            }
          })

          if(!res.data.data.renderTemplate){
            res.data.data.renderTemplate = {objects:[{name:'', attrs:[{name:'', extractExp:''}], flatAttrs:true}]};
          }

          if(!res.data.data.renderTemplate.objects){
            res.data.data.renderTemplate.objects = [];
            res.data.data.renderTemplate.objects[0] = {name:'', attrs:[{name:'', extractExp:''}], flatAttrs:true}
          }

          if(!res.data.data.renderTemplate.objects[0].attrs){
            res.data.data.renderTemplate.objects[0].attrs = [];
          }

          this.form = res.data.data;


          console.log(this.form);

        });
      },
      ADD_IP(type){
        if(this.ip.blacklist != '' && type == 'blacklist'){
          this.form.ipAccessControl.blacklist.push(this.ip.blacklist);
          this.ip.blacklist = '';
        }
        if(this.ip.whitelist != '' && type == 'whitelist'){
          this.form.ipAccessControl.whitelist.push(this.ip.whitelist);
          this.ip.whitelist = '';
        }
        console.log(this.form);
      },
      DEL_IP(type,index){
        this.$confirm('是否确定移除?', '移除操作', {
          confirmButtonText: '确定',
          confirmButtonClass: 'el-button--danger',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          if(type == 'blacklist'){
            this.form.ipAccessControl.blacklist.splice(index,1);
          }
          if(type == 'whitelist'){
            this.form.ipAccessControl.whitelist.splice(index,1);
          }
        }).catch(() => {});
      },
      ADD_JIEDIAN(){
        this.form.nodes.push({clusterID:'', urlRewrite:'', attrName:'', validations:[{parameter:{name:'',source:'',index:0},required:false,rules:[]}], defaultValue:{code:200,body:'',headers:[{name:'Location',value:''}]}});
      },
      DEL_JIEDIAN(index){
        this.$confirm('是否确定移除?', '移除操作', {
          confirmButtonText: '确定',
          confirmButtonClass: 'el-button--danger',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.form.nodes.splice(index,1);
        }).catch(() => {});
      },
      ADD_PRIMARY(index){
        this.form.nodes[index].validations.push({parameter:{name:'',source:'',index:0},required:false,rules:[]})
      },
      DEL_PRIMARY(index,indexs){
        this.$confirm('是否确定移除?', '移除操作', {
          confirmButtonText: '确定',
          confirmButtonClass: 'el-button--danger',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.form.nodes[index].validations.splice(indexs,1);
        }).catch(() => {});
      },
      ADD_ATTR(index){
        this.form.renderTemplate.objects[index].attrs.push({name:'', extractExp:''})
      },
      DEL_ATTR(index,indexs){
        this.$confirm('是否确定移除?', '移除操作', {
          confirmButtonText: '确定',
          confirmButtonClass: 'el-button--danger',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.form.renderTemplate.objects[index].attrs.splice(indexs,1);
        }).catch(() => {});
      },
      create(data){

        if(data.status){
          data.status = 1;
        }else{
          data.status = 0;
        }

        if(this.form.nodes.length == 1){
          delete this.form.renderTemplate;
        }

        if(this.form.defaultValue.headers[0].value == ''){
          this.form.defaultValue.headers = [];
        }

        this.form.nodes.forEach(function (items,index) {
          if(items.defaultValue.headers[0].value == ''){
            items.defaultValue.headers = [];
          }
        })

        ApisCreate(data).then(res=>{
          if(res.data.code === 0){
            javascript:history.go(-1);
            this.$message({
              message: data.id === 0 ? '新增接口成功' : '更新接口成功',
              type: 'success'
            });
          }else{
            this.$message.error(data.id === 0 ? '新增接口失败' : '更新接口失败');
          }
        })
      },
      onSubmit(formName){
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
  .el-checkbox .el-checkbox__original{
    color: #666666;
  }
  .el-main {
    margin: 60px 0 0 240px;
    padding: 10px;
  .min_top{
    margin-top: 60px;
  }
  .grid-content{
    padding: 5px;
  }
  .title_t{
    width: 100%;
    height: 30px;
    line-height: 30px;
    color: #999999;
  }
  .bg-purple-dark{
  .dark_mina{
    background-color: #f9f9f9;
    border-radius: 4px;
    padding: 0 10px;
  .dark_mina_title{
    width: 100%;
    height: 50px;
    line-height: 50px;
    color: #999999;
  }
  }
  .add_parameter{
    height: 30px;
    float: right;
    cursor: pointer;
  i{
    font-size: 12px;
  }
  }
  }
  .el-button.add{
    background-color: #4caf50;
    border: 0;
    font-size: 12px;
    color: #ffffff;
  }
  .switch_color{
    font-size: 12px;
    color: #666666;
  }
  }
</style>

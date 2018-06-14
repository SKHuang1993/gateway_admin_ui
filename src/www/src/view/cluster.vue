<template>
    <el-main>
        <el-row>
            <el-col :span="24">
                <el-button class="add" type="primary" icon="el-icon-plus" @click="handleCluster()">新增集群</el-button>
            </el-col>
        </el-row>

        <el-table :data="tableData" style="width: 100%">
            <el-table-column label="ID" width="140">
              <template slot-scope="scope">
                {{ scope.row.id }}
              </template>
            </el-table-column>
            <el-table-column label="集群名称" >
                <template slot-scope="scope">
                    <span style="margin-left: 10px">{{ scope.row.name }}</span>
                </template>
            </el-table-column>
            <el-table-column label="负载均衡算法" >
                <template slot-scope="scope">
                    <span>{{ scope.row.loadBalance == 0 ? 'RoundRobin' : 'IPHash' }}</span>
                </template>
            </el-table-column>
            <el-table-column label="操作" width="260">
                <template slot-scope="scope">
                    <el-button size="mini"><router-link :to="{name:'ClusterServer',params: {id: scope.row.id}}">服务</router-link></el-button>
                    <el-button size="mini" @click="handleCluster(scope.$index, scope.row)">编辑</el-button>
                    <el-button size="mini" type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>

        <el-dialog :title="form.id == 0 ? '新增集群' : '更新集群'" :visible.sync="dialogCluster" width="30%" :show-close="false" :close-on-click-modal="false" :close-on-press-escape="false">
            <el-form :model="form" :rules="rules" ref="form">
                <el-form-item label="集群名称" prop="name">
                    <el-input  v-model="form.name" auto-complete="off" placeholder="请输入集群名称"></el-input>
                </el-form-item>
                <el-form-item label="负载均衡算法(RoundRobin=0,IPHash=1)" prop="loadBalance">
                    <el-input  v-model.number="form.loadBalance" auto-complete="off" placeholder="请输入负载均衡算法,默认 0"></el-input>
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
    import{Clusters,ClustersCreate,ClustersDelete} from "@/api/index"
    export default {
        name: 'App',
        data() {
            let checknumber = (rule, value, callback) => {
                if (value != 0) {
                    callback(new Error('目前仅支持RoundRobin算法,默认填写 0'));
                }else{
                    callback();
                }
            };
            return {
                dialogCluster: false,
                dialogDelete: false,
                form:{
                    id:0,
                    name: '',
                    loadBalance:''
                },
                rules: {
                    name:[
                        { required: true, message: '请填写集群名称', trigger: 'change' },
                        { min: 5, max: 20, message: '集群名称长度 5 - 20', trigger: 'change' }
                    ],
                    loadBalance:[
                        { required: true, message: '请设置负载均衡算法', trigger: 'change' },
                        { type: 'number', min: 1, max: 1, validator: checknumber, message: '请填写对应的算法数值', trigger: 'change'},
                    ]
                },
                tableData: []
            }
        },
        created(){
            this.init();
        },
        methods: {
            init(){
                Clusters().then(res=>{
                    this.tableData = res.data.data;
                })
            },
            handleCluster(index, row){
                if(!index && !row){
                    this.dialogCluster = true;
                }else{
                    this.form = row;
                    this.dialogCluster = true;
                }
            },
            handleClose(formName){
                this.dialogCluster = false;
                this.form = {
                    id:0,
                    name: '',
                    loadBalance:''
                }
                this.$refs[formName].resetFields();
            },
            create(data){
                if(data.id === 0){
                    delete data.id;
                }
                ClustersCreate(data).then(res=>{
                    if(res.data.code === 0){
                        this.form = {
                            id:0,
                            name: '',
                            loadBalance:''
                        }
                        this.dialogCluster = false;
                        this.init();
                        this.$message({
                            message: data.id === 0 ? '新增集群成功' : '更新集群成功',
                            type: 'success'
                        });
                    }else{
                        this.$message.error(data.id === 0 ? '新增集群成功' : '更新集群失败');
                    }
                })
            },
            handleDelete(index, row) {
                this.$confirm('是否确定删除?', '删除操作', {
                    confirmButtonText: '确定',
                    confirmButtonClass: 'el-button--danger',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    ClustersDelete(row.id).then(res=>{
                        if(res.data.code === 0){
                            this.dialogDelete = false;
                            this.init();
                            this.$message({
                                message: '集群删除成功',
                                type: 'success'
                            });
                        }else{
                            this.dialogDelete = false;
                            this.$message.error('集群删除失败');
                        }
                    })
                }).catch(() => {});
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
        .el-col{
            text-align: right;
        }
        .el-button.add{
            background-color: #4caf50;
            border: 0;
            font-size: 12px;
        }
        .el-dialog {
            .el-form-item__label{
                float: none;
            }
        }
    }
</style>

<template>
    <div class="AttackTest" >
      <div class="panel-heading">
        <span class="lead"></span>
      </div>
      <div>
        <el-form :inline="true" :model="input" class="demo-form-inline" ref="inputForm">
          <el-row>
  
            <el-col :span="4">
            </el-col>
            
            <el-col :span="4">
              <el-form-item prop="company">
                <el-select v-model="input.company" @change="getOneList()" placeholder="公司">
                    <el-option 
                        v-for="company in oneList" 
                        :label="company" 
                        :value="company" 
                        :key="company">
                    </el-option>
                </el-select>
              </el-form-item>
            </el-col>
  
            <el-col :span="4">
               <el-form-item prop="monitor">
                <el-select v-model="input.monitor" @change="updata(input)" placeholder="监测点">
                    <el-option 
                        v-for="monitor in twoList" 
                        :label="monitor" 
                        :value="monitor" 
                        :key="monitor">
                    </el-option>
                </el-select>
              </el-form-item>
            </el-col>

            <el-button size="medium" type="primary" @click="displayDraw()">呈现</el-button>
            <el-button size="medium" @click="resetForm('inputForm')">重置</el-button>
          </el-row>
        </el-form>
      </div>
    </div>
  </template>
  
  <script>
  import Vue from 'vue';
  import {Select, Input, Button, Col, Form, FormItem, Row, Option} from 'element-ui';
  //注意：样式文件需要单独引入
  import 'element-ui/lib/theme-chalk/index.css';
  import 'echarts/theme/shine.js';//引入主题
  import axios from 'axios'
  import qs from 'qs'

  Vue.use(Input);
  Vue.use(Button);
  Vue.use(Col);
  Vue.use(Select);
  Vue.use(Form);
  Vue.use(FormItem);
  Vue.use(Row);
  Vue.use(Option);
  
  export default {
    name: 'AttackTest',
    data(){
      return{
        oneList: [],
        twoList: [],
        input: {
            company: null,
            monitor: null,
        },
      }
    },
    // props:["msg"],
    created(){
        this.getOneList()
    },
    beforeDestroy() {
    },
    mounted() {
        
    },
    methods:{
        getOneList(){
            console.log("全局接口测试")
            console.log(window.api.apiURL)
            var req=qs.stringify({
                "company": this.input.company,
                "monitor": this.input.monitor,
            })
            axios({
                url: window.api.apiURL + '/display/getFileList',
                method: 'post',
                data: req,
                headers: {
                    'Content-Type': "application/x-www-form-urlencoded",
                    Accept: 'application/json',},
            }).then(res => {
                console.log(res.data)
                if(this.oneList.length==0){
                    this.oneList = res.data
                }else{
                    this.twoList = res.data
                }
            }).catch(err => {
                console.log(err)
            })
            this.$forceUpdate();
        },
        updata(input){
            this.input = input
            console.log(this.input)
            this.$forceUpdate();
        },
        displayDraw(){
            this.$emit('getData', this.input)
            
        },
    
        // 重置
        resetForm(formName) {
            this.$refs[formName].resetFields();
        },
      
    }
  }
  </script>
  
  <style lang="stylus" scoped>
  .el-button
    color black
  .el-input
    display inline
    width 20px
    color black

    margin-right 20px
  
  </style>
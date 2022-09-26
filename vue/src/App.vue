<template>
    <div class="main">
        <header class="main-header" :style="conheight">
            <el-row>
                <el-col :span="6">
                    <h3>数据分析展示</h3>
                </el-col>
            </el-row>
            
            <el-col :span="24">   
                <el-menu
                    :default-active="this.$route.path" 
                    router 
                    mode="horizontal"
                    class="el-menu-vertical-demo"
                    @open="handleOpen"
                    @close="handleClose"
                    background-color="#545c64"
                    text-color="#fff"
                    active-text-color="#ffd04b">
                    <el-menu-item v-for="(item,i) in navList" 
                        :key="i" 
                        :index="item.name">
                        <template slot="title">
                            <i class="el-icon-s-platform"></i>
                            <span> {{ item.navItem }}</span>
                        </template>
                    </el-menu-item>
                </el-menu>
            </el-col>
        </header>

        <router-view v-if="isRouterAlive"></router-view>

    </div>
</template>

<script>
import Vue from 'vue';
import {Col, Row, Menu, MenuItem} from 'element-ui';
Vue.use(MenuItem);
Vue.use(Menu);
Vue.use(Col);
Vue.use(Row);

export default {
    name: 'App',
    components: {
        
    },
    provide () {  //父组件中通过provide来提供变量，在子组件中通过inject来注入变量。                                             
        return {
            reload: this.reload                                              
        }
    },    
    data(){
        return{
  			navList:[ 
                {name:'/',navItem:'BGP展示'}, 
            ],
            isRouterAlive: true,       //控制视图是否显示的变量
            explainVisible: false,

            conheight: {
                height: ''
            },

        }
    },
    created(){
    },
    mounted(){
        window.addEventListener('resize', this.getHeight)
        this.getHeight()
    },
    methods:{
        handleOpen(key, keyPath) {
            console.log(key, keyPath);
        },
        handleClose(key, keyPath) {
            console.log(key, keyPath);
        },
        reload () {
            this.isRouterAlive = false;            //先关闭，
            this.$nextTick(function () {
                this.isRouterAlive = true;         //再打开
            }) 
        },
        getHeight(){
            this.conheight.height = (window.innerHeight * 0.08) + 'px'
        }
    }
}
</script>

<style lang="stylus" scoped>
#app
    height 100%
    margin 0
    padding 0
.main
    .main-header
        position relative
</style>
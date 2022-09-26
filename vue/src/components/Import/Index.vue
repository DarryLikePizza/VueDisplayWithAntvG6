<template>
<!-- 文件导入界面 -->

    <div class="main">
        <div class="body">
            <display-config class="displayConfig" @getData="getDataFun"></display-config>
        </div>

        <div class="then">
            <one-graph class="onegraph" :mapData="mapData" ref="onegraph"></one-graph>
            <re-graph class="regraph" :treeData="treeData" ref="regraph"></re-graph>
        </div>

    </div>
</template>

<script>
import '../../assets/styles/global.styl'

import OneGraph from './coms/OneGraph.vue'
import ReGraph from './coms/ReGraph.vue'
import DisplayConfig from './coms/DisplayConfig.vue'

export default {
    name: 'index',
    components: {
        OneGraph,
        ReGraph,
        DisplayConfig,
    },
    inject:[
        'reload'
    ],        
    data(){
        return{
            mapData: null,
            treeData: null,
        }
    },
    created(){
        window.addEventListener('resize', this.getHeight)
        this.getHeight()
    },
    methods:{
        getDataFun(msg){
            // 服务器调用
            this.mapData = msg
            this.treeData = msg
            this.$refs.onegraph.getMapData()
            this.$refs.regraph.getTreeData()
        },
        getHeight(){
            this.conheight.height = window.innerHeight + 'px'
            
        },
        
    }
}
</script>

<style lang="stylus" scoped>
.body
    
.then
    .onegraph
        margin-top 17px
        margin-bottom 17px
        float left
        margin-left 2%
        width 47%
        height 1600px
        background-color #a9987c
    .regraph
        margin-top 17px
        margin-bottom 17px
        float left
        margin-left 2%
        width 47%
        height 1600px
        background-color #a9987c
</style>
<template>
    <div class="regraph">
        <div class="upfile">
            <div id="reGraphPrint" :style="conheight"></div>
        </div>
    </div>
</template>

<script>
import G6 from '@antv/g6'
import 'element-ui/lib/theme-chalk/index.css';
import axios from 'axios'
import qs from 'qs'

export default {
    name: 'ReGraph',
    data(){
        return{
            conheight: {
                height: ''
            } 
        }
    },
    props:[
      "treeData",
    ],
    created(){
        window.addEventListener('resize', this.getHeight)
        this.getHeight()
    },
    mounted () {
    },    
    methods:{
        getHeight(){
            this.conheight.height = window.innerHeight * 0.8 + 'px'
        },
        getTreeData () {
            var obj = document.getElementById('reGraphPrint')
            obj.innerHTML='' 
            setTimeout(()=>{
                var req=qs.stringify({
                "company": this.treeData.company,
                "monitor": this.treeData.monitor,
                "flag": "1"
                })
                
                axios({
                    url: window.api.apiURL + '/display/getTree',
                    method: 'post',
                    data: req,
                    headers: {
                        'Content-Type': "application/x-www-form-urlencoded",
                        Accept: 'application/json',},
                }).then(res => {
                    this.initG6(res.data)
                }).catch(err => {
                    console.log(err)
                })
            }, 500)
            
        },
        initG6 (mapData) {    
            console.log("树图")
            // var obj = document.getElementById('reGraphPrint')
            // obj.innerHTML=''        


            const data = JSON.parse(JSON.stringify(mapData))
            console.log('data')
            console.log(data)

            // 初始化
            const width = document.getElementById('reGraphPrint').scrollWidth
            const height = document.getElementById('reGraphPrint').scrollHeight
            
            const colors = [
                '#BDD2FD',
                '#BDEFDB',
                '#C2C8D5',
                '#FBE5A2',
                '#F6C3B7',
                '#B6E3F5',
                '#D3C6EA',
                '#FFD8B8',
                '#AAD8D8',
                '#FFD6E7',
            ];
            const strokes = [
                '#5B8FF9',
                '#5AD8A6',
                '#5D7092',
                '#F6BD16',
                '#E8684A',
                '#6DC8EC',
                '#9270CA',
                '#FF9D4D',
                '#269A99',
                '#FF99C3',
            ];
            var nodes = data.nodes;
            
            nodes.forEach(function(node) {
                if (node.upOrDown == 0) {
                    node.cluster = 'a'
                    if(node.asnType == 'Inactive'){
                        node.style = {
                            stroke: strokes[2],
                            fill: colors[2]
                        };
                    } else if(node.asnType == 'Business'){
                        node.style = {
                            stroke: strokes[3],
                            fill: colors[3]
                        };
                    } else if(node.asnType == 'Hosting'){
                        node.style = {
                            stroke: strokes[5],
                            fill: colors[5]
                        };
                    } else if(node.asnType == 'ISP'){
                        node.style = {
                            stroke: strokes[6],
                            fill: colors[6]
                        };
                    } else{
                        node.style = {
                            stroke: strokes[4],
                            fill: colors[4]
                        };
                    }
                } else{
                    node.cluster = 'c'
                    node.style = {
                        stroke: strokes[0],
                        fill: colors[0]
                    };
                }
            });
            

            
            // 鼠标悬停事件
            const tooltip = new G6.Tooltip({
                offsetX: 70,
                offsetY: 20,
                getContent (e) {
                const outDiv = document.createElement('div')
                outDiv.style.width = '180px'
                outDiv.innerHTML = `
                    <ul id="nodeDetails">
                        <li>AS编号: ${e.item.getModel().label}</li>
                        <li>名称: ${e.item.getModel().asnName}</li>
                        <li>所属公司: ${e.item.getModel().company}</li>
                        <li>所属国家: ${e.item.getModel().country}</li>
                        <li>域名数量: ${e.item.getModel().numOfHostedDomains}</li>
                        <li>ips数量: ${e.item.getModel().numOfIps}</li>
                        <li>AS类型: ${e.item.getModel().asnType}</li>
                        <li>所在层级: ${e.item.getModel().upOrDown}</li>
                    </ul>`
                return outDiv
                },
                itemTypes: ['node']
            })
            const tooltip1 = new G6.Tooltip({
                offsetX: 70,
                offsetY: 20,
                getContent (e) {
                const outDiv = document.createElement('div')
                outDiv.style.width = '180px'
                outDiv.innerHTML = `
                    <ul id="edgeDetails">
                        <li>起点: ${e.item.getModel().source}</li>
                        <li>终点: ${e.item.getModel().target}</li>
                        <li>权重: ${e.item.getModel().weight}</li>
                    </ul>`
                return outDiv
                },
                itemTypes: ['edge']
            })
            this.graph = new G6.Graph({
                container: 'reGraphPrint',
                width,
                height,
                plugins: [tooltip, tooltip1],
                // 必须将 groupByTypes 设置为 false，带有 combo 的图中元素的视觉层级才能合理
                // groupByTypes: false,
                // 这里在后面用到，是提示框信息，以及鹰眼的时候用的组件
                // plugins: [tooltip, minimap]
                modes: {
                    // 拖动，缩放
                    default: ['drag-canvas', 'drag-node', 'zoom-canvas']
                },
                layout: {
                    // type: 'radial',
                    // unitRadius: 70,
                    // preventOverlap: true,
                    // strictRadial: false,
                    // sortBy: 'asnType',
                    type: 'dagre',
                    nodeSize: [40, 20],
                    nodesep: 5,
                    ranksep: 30,
                    rankdir: 'LR',
                    align: 'DL',
                },
                animate: true,
                defaultNode: {
                    // size: 20,
                    style: {
                        lineWidth: 4,
                    },
                    // 圈内字体大小
                    labelCfg: {
                        style: {
                        fontSize: 10,
                        }
                    }
                },
                defaultEdge: {
                    // type:'polyline',
                    size: 2,
                    color: '#e2e2e2',
                    style: {
                        endArrow: {
                          path: 'M 0,0 L 8,4 L 8,-4 Z',
                          fill: '#e2e2e2'
                        }
                    },
                    labelCfg: {
                        style: {
                        fill: '#ffffff',
                        }
                    }
                }
            })

            this.graph.data(data)
            this.graph.render()

            
        },
    }
}
</script>

<style lang="stylus" scoped>
#oneGraphPrint
    height 1600px
    width 100%
#nodeDetails
    list-style none
#nodeDetails>li 
    padding 5px 0
    text-align left
</style>
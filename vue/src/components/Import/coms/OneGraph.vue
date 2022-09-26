<template>
    <div class="onegraph">
        <div class="upfile">
            <div id="oneGraphPrint" :style="conheight"></div>
        </div>
    </div>
</template>

<script>
import G6 from '@antv/g6'
import 'element-ui/lib/theme-chalk/index.css';
import axios from 'axios'
import qs from 'qs'

export default {
    name: 'OneGraph',
    data(){
        return{
            conheight: {
                height: ''
            } 
        }
    },
    props:[
      "mapData",
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
        getMapData () {
            var obj = document.getElementById('oneGraphPrint')
            obj.innerHTML='' 
            setTimeout(()=>{
                var req=qs.stringify({
                    "company": this.mapData.company,
                    "monitor": this.mapData.monitor,
                    "flag": "2"
                })
                axios({
                    url: window.api.apiURL + '/display/getUpDown',
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
            console.log("引力图")
            // var obj = document.getElementById('oneGraphPrint')
            // obj.innerHTML=''        


            const data = JSON.parse(JSON.stringify(mapData))
            console.log('data')
            console.log(data)

            // 初始化
            const width = document.getElementById('oneGraphPrint').scrollWidth
            const height = document.getElementById('oneGraphPrint').scrollHeight
            
            const subjectColors = [
                '#5F95FF', // blue
                '#61DDAA',
                '#65789B',
                '#F6BD16',
                '#7262FD',
                '#78D3F8',
                '#9661BC',
                '#F6903D',
                '#008685',
                '#F08BB4',
            ];
            const backColor = '#fff';
            const theme = 'default';
            const disableColor = '#777';
            const colorSets = G6.Util.getColorSetsBySubjectColors(
                subjectColors,
                backColor,
                theme,
                disableColor,
            );
            var nodes = data.nodes;

            // 国家分类
            var combos = [];
            nodes.forEach(function(node) {
                var flag = 0;
                var target = node.country;
                for(var i of combos){
                    if(i.label == target){
                        flag = 1;
                        i.list.push(node.label)
                        break;
                    }
                }
                if(flag == 0){
                    var c = {
                        'id': target,
                        'label': target,
                        'style': {
                            'color': '#FFF',
                            'stroke': '#b2ae9b',
                            'fill': '#c5bfad',
                        },
                        'list': [node.label]
                    };
                    combos.push(c);
                }
                node.comboId = target;
                
                node.cluster = target;

                if (node.upOrDown == 0) {
                    node.style = {
                        fill: colorSets[0].mainFill,
                        stroke: colorSets[0].mainStroke,
                    };
                    node.type = 'background-animate';
                } else if(node.upOrDown == -1) {
                    node.style = {
                        fill: colorSets[9].mainFill,
                        stroke: colorSets[9].mainStroke,
                    };
                } else{
                    node.style = {
                        fill: colorSets[2].mainFill,
                        stroke: colorSets[2].mainStroke,
                    };
                }
            });
            data.combos = combos;
            
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
            const tooltip2 = new G6.Tooltip({
                offsetX: 70,
                offsetY: 20,
                getContent (e) {
                    const outDiv = document.createElement('div')
                    outDiv.style.width = '180px'
                    outDiv.innerHTML = `
                        <ul id="combeDetails">
                            <li>国家或地区: ${e.item.getModel().label}</li>
                            <li>包含的AS: 
                                <ul>`
                    e.item.getModel().list.forEach((item) => { // 遍历子列表中的子列表
                        outDiv.innerHTML  += `<li>${item}</li>`
                    })
                    outDiv.innerHTML  += `</ul></li></ul>`
                    return outDiv
                },
                itemTypes: ['combo']
            })

            // Background Animation
            G6.registerNode(
            'background-animate',
            {
                afterDraw(cfg, group) {
                const r = cfg.size / 2;
                const back1 = group.addShape('circle', {
                    zIndex: -3,
                    attrs: {
                    x: 0,
                    y: 0,
                    r,
                    fill: cfg.color,
                    opacity: 0.6,
                    },
                    name: 'back1-shape',
                });
                const back2 = group.addShape('circle', {
                    zIndex: -2,
                    attrs: {
                    x: 0,
                    y: 0,
                    r,
                    fill: cfg.color,
                    opacity: 0.6,
                    },
                    name: 'back2-shape',
                });
                const back3 = group.addShape('circle', {
                    zIndex: -1,
                    attrs: {
                    x: 0,
                    y: 0,
                    r,
                    fill: cfg.color,
                    opacity: 0.6,
                    },
                    name: 'back3-shape',
                });
                group.sort(); // Sort according to the zIndex
                back1.animate(
                    {
                    // Magnifying and disappearing
                    r: r + 10,
                    opacity: 0.1,
                    },
                    {
                    duration: 3000,
                    easing: 'easeCubic',
                    delay: 0,
                    repeat: true, // repeat
                    },
                ); // no delay
                back2.animate(
                    {
                    // Magnifying and disappearing
                    r: r + 10,
                    opacity: 0.1,
                    },
                    {
                    duration: 3000,
                    easing: 'easeCubic',
                    delay: 1000,
                    repeat: true, // repeat
                    },
                ); // 1s delay
                back3.animate(
                    {
                    // Magnifying and disappearing
                    r: r + 10,
                    opacity: 0.1,
                    },
                    {
                    duration: 3000,
                    easing: 'easeCubic',
                    delay: 2000,
                    repeat: true, // repeat
                    },
                ); // 3s delay
                },
            },
            'circle',
            );

            const toolbar = new G6.ToolBar({
            position: { x: 10, y: 70 },
            getContent: () => `
            <ul class='g6-component-toolbar'>
                <li  code='zoomOut'>
                <svg class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" width="24" height="24">
                    <path d="M658.432 428.736a33.216 33.216 0 0 1-33.152 33.152H525.824v99.456a33.216 33.216 0 0 1-66.304 0V461.888H360.064a33.152 33.152 0 0 1 0-66.304H459.52V296.128a33.152 33.152 0 0 1 66.304 0V395.52H625.28c18.24 0 33.152 14.848 33.152 33.152z m299.776 521.792a43.328 43.328 0 0 1-60.864-6.912l-189.248-220.992a362.368 362.368 0 0 1-215.36 70.848 364.8 364.8 0 1 1 364.8-364.736 363.072 363.072 0 0 1-86.912 235.968l192.384 224.64a43.392 43.392 0 0 1-4.8 61.184z m-465.536-223.36a298.816 298.816 0 0 0 298.432-298.432 298.816 298.816 0 0 0-298.432-298.432A298.816 298.816 0 0 0 194.24 428.8a298.816 298.816 0 0 0 298.432 298.432z"></path>
                </svg>
                </li>
                <li code='zoomIn'>
                <svg class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" width="24" height="24">
                    <path d="M639.936 416a32 32 0 0 1-32 32h-256a32 32 0 0 1 0-64h256a32 32 0 0 1 32 32z m289.28 503.552a41.792 41.792 0 0 1-58.752-6.656l-182.656-213.248A349.76 349.76 0 0 1 480 768 352 352 0 1 1 832 416a350.4 350.4 0 0 1-83.84 227.712l185.664 216.768a41.856 41.856 0 0 1-4.608 59.072zM479.936 704c158.784 0 288-129.216 288-288S638.72 128 479.936 128a288.32 288.32 0 0 0-288 288c0 158.784 129.216 288 288 288z" p-id="3853"></path>
                </svg>
                </li>
                <li code='realZoom'>
                <svg class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" width="20" height="24">
                    <path d="M384 320v384H320V320h64z m256 0v384H576V320h64zM512 576v64H448V576h64z m0-192v64H448V384h64z m355.968 576H92.032A28.16 28.16 0 0 1 64 931.968V28.032C64 12.608 76.608 0 95.168 0h610.368L896 192v739.968a28.16 28.16 0 0 1-28.032 28.032zM704 64v128h128l-128-128z m128 192h-190.464V64H128v832h704V256z"></path>
                </svg>
                </li>
                <li code='autoZoom'>
                <svg class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" width="20" height="24">
                    <path d="M684.288 305.28l0.128-0.64-0.128-0.64V99.712c0-19.84 15.552-35.904 34.496-35.712a35.072 35.072 0 0 1 34.56 35.776v171.008h170.944c19.648 0 35.84 15.488 35.712 34.432a35.072 35.072 0 0 1-35.84 34.496h-204.16l-0.64-0.128a32.768 32.768 0 0 1-20.864-7.552c-1.344-1.024-2.816-1.664-3.968-2.816-0.384-0.32-0.512-0.768-0.832-1.088a33.472 33.472 0 0 1-9.408-22.848zM305.28 64a35.072 35.072 0 0 0-34.56 35.776v171.008H99.776A35.072 35.072 0 0 0 64 305.216c0 18.944 15.872 34.496 35.84 34.496h204.16l0.64-0.128a32.896 32.896 0 0 0 20.864-7.552c1.344-1.024 2.816-1.664 3.904-2.816 0.384-0.32 0.512-0.768 0.768-1.088a33.024 33.024 0 0 0 9.536-22.848l-0.128-0.64 0.128-0.704V99.712A35.008 35.008 0 0 0 305.216 64z m618.944 620.288h-204.16l-0.64 0.128-0.512-0.128c-7.808 0-14.72 3.2-20.48 7.68-1.28 1.024-2.752 1.664-3.84 2.752-0.384 0.32-0.512 0.768-0.832 1.088a33.664 33.664 0 0 0-9.408 22.912l0.128 0.64-0.128 0.704v204.288c0 19.712 15.552 35.904 34.496 35.712a35.072 35.072 0 0 0 34.56-35.776V753.28h170.944c19.648 0 35.84-15.488 35.712-34.432a35.072 35.072 0 0 0-35.84-34.496z m-593.92 11.52c-0.256-0.32-0.384-0.768-0.768-1.088-1.088-1.088-2.56-1.728-3.84-2.688a33.088 33.088 0 0 0-20.48-7.68l-0.512 0.064-0.64-0.128H99.84a35.072 35.072 0 0 0-35.84 34.496 35.072 35.072 0 0 0 35.712 34.432H270.72v171.008c0 19.84 15.552 35.84 34.56 35.776a35.008 35.008 0 0 0 34.432-35.712V720l-0.128-0.64 0.128-0.704a33.344 33.344 0 0 0-9.472-22.848zM512 374.144a137.92 137.92 0 1 0 0.128 275.84A137.92 137.92 0 0 0 512 374.08z"></path>
                </svg>
                </li>
            </ul>`,
            handleClick: (code, graph) => {
                switch (code) {
                case 'zoomOut':
                    graph.zoom(1.2, undefined, true, animateCfg);
                    break;
                case 'zoomIn':
                    graph.zoom(0.8, undefined, true, animateCfg);
                    break;
                case 'realZoom':
                    graph.zoomTo(1, undefined, true, animateCfg);
                    break;
                case 'autoZoom':
                    graph.fitView(20, undefined, true, animateCfg);
                    break;
                }
            }
            })

            this.graph = new G6.Graph({
                container: 'oneGraphPrint',
                width,
                height,
                plugins: [tooltip, tooltip1, tooltip2],
                // 必须将 groupByTypes 设置为 false，带有 combo 的图中元素的视觉层级才能合理
                // groupByTypes: false,
                // 这里在后面用到，是提示框信息，以及鹰眼的时候用的组件
                // plugins: [tooltip, minimap]
                modes: {
                    // 拖动，缩放
                    default: ['toolbar', 'drag-canvas', 'drag-node', 'zoom-canvas', 'drag-combo', 'collapse-expand-combo']
                },
                layout: {
                    // 拓扑图的类型
                    type: 'comboForce',
                    nodeSpacing: (d) => 8,
                    gravity: 5,
                    speed: 5,
                    preventOverlap: true,
                    clustering: true,
                    nodeSize: 20
                },
                animate: true,
                defaultNode: {
                    size: 20,
                    style: {
                        lineWidth: 4,
                    },
                    // 圈内字体大小
                    labelCfg: {
                        style: {
                            fontSize: 10
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
<template>
    <div class="amap-wrap">
<!--         <el-amap
        ref="map"
        vid="amapDemo"//地图独特的id属性
        viewMode="3D"//启动3D地图
        :amap-manager="amapManager"//这个就是你前面新建画布要用到的地方
        :events="mapEvents"//你在高德地图开放者平台自己整的地图样式
        :center="markerCenter" //地图初始化中心点
        expandZoomRange="true"//允许缩放
        :zoom="zoom" //地图缩放倍数，[3,18]，18放大最高级
        :plugin="plugins"//地图些功在这里声明，如比例尺功能
        :pitch="66"//地图刚进去的俯视角度
        rotateEnable="true"//鼠标点击右键可以旋转地图
        >
        </el-amap> -->
        <el-amap vid="amapContainer" :events="events" class="amap-demo"></el-amap>
    </div>
</template>
<script>
import { AMapManager, lazyAMapApiLoaderInstance } from 'vue-amap';
// 方法
import { getLngLat } from "./common";
import { addressSetMapCenter } from "./location";
import { amapSetMarker, amapClearMarker } from "./marker";
export default {
    name: "Amap",
    data(){
        return {
            // 经纬度
            lnglat: {},
            map: null,
            zoom: 18,
            events: {}
        }
    },
    mounted(){
        // lazyAMapApiLoaderInstance 为了加载高德地图的API
        lazyAMapApiLoaderInstance.load().then(() => {
            this.mapCreate();
            // 地图点击事件
            this.map.on("click", (e) => {
                const lnglat = getLngLat(e);
                // 更新经纬度
                this.lnglat = lnglat;
                // 回调父组件方法
                this.$emit("callback", {
                    function: "getLnglat",
                    data: {
                        lnglat
                    }
                });  // 子组件调父组件的方法
                // 设置点覆盖物
                this.setMarker();
            })
        });
    },
    methods: {
        // 创建地图
        // 新建地图画布
        mapCreate(params){
            this.map = new AMap.Map('amapContainer', {
                center: [116.397045,39.917759],
                zoom: this.zoom, //初始化地图层级
            });
            this.map.on("complete", () => {
                this.mapLoad();
            });
        },
        /**
         * 地图加载完成
         */
        mapLoad(){
            if(this.options.mapLoad) {
                this.$emit('callback', {
                    function: "mapLoad"
                })
            }
        },
        // 销毁地图
        mapDestroy(){
            this.map && this.map.destroy();
        },
        // 设置地图中心
        setMapCenter(value){
            // 输入中文即可
            addressSetMapCenter(value, this.map);
        },
        // 设置点覆盖物
        setMarker(lnglat){
            amapSetMarker(lnglat || this.lnglat, this.map);
        },
        /** 清除点覆盖物 */
        clearMarker(){
            amapClearMarker(this.map);
        }
    },
    props: {
        options: {
            type: Object,
            default: () => {}
        }
    }
}
</script>
<style lang="scss">
.amap-wrap { height: 100%; }
</style>
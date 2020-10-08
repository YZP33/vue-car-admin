let marker = null;
export function amapSetMarker(lnglat ,map){
    if(marker) {
        map.remove(marker);
        marker = null;
    }
    marker = new AMap.Marker({
        position: [lnglat.lng, lnglat.lat]
    })
    map.add(marker);
    // 根据覆盖物定位
    map.setFitView();
}

export function amapClearMarker(map){
    if(marker) {
        map.remove(marker);
        marker = null;
    }
}
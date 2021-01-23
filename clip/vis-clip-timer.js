// предназначение - обновлять по таймеру размеры сцены и запиывать их в параметр root.cliprange

export default function setup( mv ) {

//console.log("VIS_CLIP_TIMER setup called!");
//debugger;

function getClipRangeFromThreeJs() {
    // console.log("getcliprangefrom3");
    var r = 10; // minimum
      
    for (var i=0; i<scene.children.length; i++) {
      var c = scene.children[i];
      if (c.qmlParent && c.qmlParent.iAxis) continue;
      //debugger;
      if (c.geometry && c.geometry.boundingSphere) {
        var s = c.geometry.boundingSphere;
        var q = s.radius + Math.max( Math.abs(s.center.x),Math.abs(s.center.y),Math.abs(s.center.z) );
        if (q > r) r = q;
      }
    }
    return r;
}


var r0;
function fn() {
  var r = getClipRangeFromThreeJs();
  //console.log("rrr=",r);
  if (r0 != r) {
    r0 = r;
    mv.root.setParam("cliprange",r);
  }
  // todo set default value too - чтобы не сохранять лишний раз
}

if (!mv.vis.clipTimer)
  mv.vis.clipTimer = setInterval( fn, 1000 );

// this is not need to be dumped, so we set `internal` flag
mv.root.setParamOption("cliprange","internal",true );
//console.log("setted internal flag for cliprange");

}
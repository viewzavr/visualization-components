// creates a nice 3d environment 1
// idea: put it around camera and not center?

export default function setup( mv ) {

function make( opts ) {
  var obj = mv.create_obj( {}, opts );
  
  var pts = mv.vis.addPoints( obj, "mypts" );
  pts.commonShadersProhibited = true;

  var pts_count = 10000;
  var mult = 15;
  
  var regen = function() {
    var arr = [];
    for (var i=0; i<pts_count*3; i++) {
      var a1 = Math.random() * Math.PI;
      var a2 = Math.random() * Math.PI * 2;
      var r = 1000*mult;
      var x = r * Math.sin(a1) * Math.cos( a2 );
      var y = r * Math.sin(a1) * Math.sin( a2 );
      var z = r * Math.cos(a1);
      arr.push( x,y,z );
    }
    pts.positions = arr;
  }
  
  pts.setParam("color",[0.13,0.19,0.23] );
  pts.setParam("shape",4 );
  pts.setParam("additive",1);
  pts.setParam("radius",15*mult);

  obj.addSlider("count",1000,100,5000,100,function(v) {
    pts_count = v;
    regen();
  });

  obj.addCmd( "refresh",function() {
    regen();
  });

  regen();
  
  

  return obj;
}

mv.addItemType( "env1","Background Env 1",make );

}
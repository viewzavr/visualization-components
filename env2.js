// creates a nice 3d environment 1
// idea: put it around camera and not center?

export default function setup( mv ) {

function make( opts ) {
  var obj = mv.create_obj( {}, opts );
  
  var pts = mv.vis.addMesh( obj, "mytris" );
  pts.commonShadersProhibited = true;

  var pts_count = 4000;
  var mult = 15;
  var r2coef = 100;
  
  var regen = function() {
    var arr = [];
    
    var r = 1000*mult;
    
    function addpt( a1,a2 ) {
      var x = r * Math.sin(a1) * Math.cos( a2 );
      var y = r * Math.sin(a1) * Math.sin( a2 );
      var z = r * Math.cos(a1);
      arr.push( x,y,z );
    }
    
    var r2 = Math.PI * r2coef / 5000.0;

    for (var i=0; i<pts_count*3; i++) {
      var a1 = Math.random() * Math.PI;
      var a2 = Math.random() * Math.PI * 2;
      
      addpt( a1,a2 );
      addpt( a1 + Math.random()*r2 ,a2 + Math.random() * r2 );
      addpt( a1 + Math.random() * r2 ,a2 + Math.random() * r2 );
    }
    pts.positions = arr;
  }
  
  //pts.setParam("color",0x333333 ); //[0.13,0.19,0.23] );
  pts.setParam("color",[0.13,0.19,0.23] );
  pts.setParam("shape",4 );
  pts.setParam("additive",1);
  pts.setParam("radius",15*mult);
  pts.setParam("opacity",4 );
  
  
  obj.addSlider( "r2",r2coef,1,100,1,function(v) {
    r2coef = v;
    regen();
  });

  obj.addSlider("count",pts_count,100,5000,100,function(v) {
    pts_count = v;
    regen();
  });

  obj.addCmd( "refresh",function() {
    regen();
  });

  regen();
  
  

  return obj;
}

mv.addItemType( "env2","Background Env 2",make );

}
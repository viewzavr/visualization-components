// creates a cube with random points

export default function setup( mv ) {

function make( opts ) {
  var obj = mv.create_obj( {}, opts );
  
  var pts = mv.vis.addPoints( obj, "mypts" );

  var pts_count = 1000;
  var regen = function() {
    var arr = [];
    for (var i=0; i<pts_count*3; i++) {
      arr.push( Math.random()*100 );
    }
    //console.log("setting positions",arr);
    pts.positions = arr;
  }
  
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

mv.addItemType( "pointes-cube","Points cube",make,{cat:"examples"}  );

}
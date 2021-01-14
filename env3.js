// creates a nice 3d environment 3 - inside a planet

// idea: another variant is just to put planet in some location (random f(radius) or manual...)
//       and to rotate it from timer or better as a parameter..
//       questions: who should control position,rotation,scale (user from gui on target object? or in current object?)
//       thus this env is an env "inside a planet" or just some asset with predefined values and parameters?
// bug:  saturn ring


var planets = [
"custom",
"Callisto_1_4821.glb",
"EarthClouds_1_12756.glb",
"Earth_1_12756.glb",
"Io_1_3643.glb",
"Mars_1_6792.glb",
"Neptune_1_49528.glb",
"Saturn_1_120536.glb",
"Venus(surface)_1_12103.glb"
];

function getplaneturl(i) {
  return "https://viewlang.ru/assets/planets/"+planets[i];
}

export default function setup( mv ) {

function make( opts ) {

  var obj = mv.create_obj( {}, opts );
  var gltf = vz.vis.addGltf( obj, "item" );
  
  // todo check assigned? or in gltf?
  function reflect() {
    var v = obj.getParam("preset");
    if (v > 0) {
      gltf.setParam("src",getplaneturl(v) );
    }
  }

  obj.addCombo( "preset",1,planets,reflect );
  obj.setParam( "preset",1 );
  
  gltf.track("loaded",function() {
    gltf.sceneObject.children[0].material.side=2;
  });
  
  obj.addSlider( "scale",50,0,100,0.1,function(v) {
    gltf.scale = v;
  });
  
  obj.addCmd( "Nasa 3d items",function() {
    window.open("https://solarsystem.nasa.gov/resources/all/?order=pub_date+desc&per_page=50&page=0&search=&condition_1=1%3Ais_in_resource_list&fs=&fc=324&ft=&dp=&category=324");
  });

  return obj;
}

mv.addItemType( "env3","Background Env 3 (planets)",make );

}
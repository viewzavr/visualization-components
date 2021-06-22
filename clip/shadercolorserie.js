// clip x, y, z

export default function setup( mv ) {

var qcounter = 0;

function make(opts) {
  qcounter=qcounter+1;
  
  var obj = mv.create_obj( {}, opts );
  var clipr_obj = mv.find_root(obj);

  /////////////////
  function setsliders() {
    var r = clipr_obj.getParam("cliprange") || 1000;
    obj.addSlider( "p1",r/20.0,0,r, 0.1, function() {});
    obj.addSlider( "p2",0.5,0,1,0.01, function() {} );
    obj.setParamOption("p1","sliding",true );
    obj.setParamOption("p2","sliding",true );
  }
  setsliders();
  
  var shader = mv.vis.addShader( obj );
  shader.followParams( obj, "p1","p2" );

  ////////////////
  
  var os = opts.type.split("_")[1];

  var gen = function() {
    shader.vertex = `
          // your things
          uniform float sceneTime;
          uniform float p1;
          uniform float p2;
          varying float  q2positionOZ_QQ;
          void main()
          {
            q2positionOZ_QQ = position.OZ;
          }
           `.replace(/OZ/g,os).replace(/QQ/g,qcounter);

    shader.fragmentOver = true;
    shader.fragment = `
      uniform float sceneTime;
      varying float q2positionOZ_QQ;
          uniform float p1;
          uniform float p2;
                  void main()
                        {
                          if (mod( q2positionOZ_QQ,p1) / p1 < p2) gl_FragColor.r=1.0;
            }
           `.replace(/OZ/g,os).replace(/QQ/g,qcounter);
  }
  
  gen();
  
  // вот так я странно делаю..

  import( "./vis-clip-timer.js").then(module => { 
    module.default(clipr_obj); 
  });

  var q = clipr_obj.trackParam("cliprange", function() {
    //console.log("see clip change", mv.root.getParam("cliprange") );
    setsliders();
  });
  
  var oremove = obj.remove;
  obj.remove = function() {
    clipr_obj.untrackParam( "cliprange",q );
    if (oremove) oremove();
  }

  return obj; // ну то есть я пока не понял, хочу я вообще что-то возвращать или нет
}

mv.addItemType( "color_x_serie","Colorize X serie",make, {label: "extra",title_ru: "Подсветка X (серия)", cat: "clip" } );
mv.addItemType( "color_y_serie","Colorize Y serie",make, {label: "extra",title_ru: "Подсветка Y (серия)", cat: "clip"} );
mv.addItemType( "color_z_serie","Colorize Z serie",make, {label: "extra",title_ru: "Подсветка Z (серия)", cat: "clip"} );

}

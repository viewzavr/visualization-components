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
          varying vec3  q2positionOZ_QQ;
          void main()
          {
            q2positionOZ_QQ = position.xyz;
          }
           `.replace(/OZ/g,os).replace(/QQ/g,qcounter);

    shader.fragmentOver = true;
    shader.fragment = `
      uniform float sceneTime;
      varying vec3  q2positionOZ_QQ;
          uniform float p1;
          uniform float p2;
                  void main()
                        {
                          if (mod( q2positionOZ_QQ.OZ,p1) / p1 > p2) discard;

                          // подсветка краев сечений
                          #ifdef CLIP_EPS_HI
                          if (mod( q2positionOZ_QQ.OZ + CLIP_EPS_HI,p1) / p1 > p2 || mod( q2positionOZ_QQ.OZ,p1) < CLIP_EPS_HI)
                            gl_FragColor = CLIP_EPS_COLOR;
                          #endif
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

mv.addItemType( "clip_x_serie","Clip X serie",make, {label: "extra",title_ru: "Отсечение X (серия)"} );
mv.addItemType( "clip_y_serie","Clip Y serie",make, {label: "extra",title_ru: "Отсечение Y (серия)"} );
mv.addItemType( "clip_z_serie","Clip Z serie",make, {label: "extra",title_ru: "Отсечение Z (серия)"} );

}

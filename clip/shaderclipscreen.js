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
    //r = r*2;
    
    obj.addSlider( "p1",-r,-r,r, 0.1, function() {});
    obj.addSlider( "p2",2*r,0,2*r, 0.1, function() {});
    obj.setParamOption("p1","sliding",true );
    obj.setParamOption("p2","sliding",true );
  }
  setsliders();
  
  var shader = mv.vis.addShader( obj );
  shader.followParams( obj, "p1","p2" );

  ////////////////
  
  //var os = opts.type.split("_")[1];
  var os = "z";

  var gen = function() {
    shader.vertex = `
          // your things
          uniform float sceneTime;
          uniform float p1;
          uniform float p2;
          varying vec4  sqpositionOZ_QQ;
          void main()
          {
            sqpositionOZ_QQ = modelViewMatrix * gl_Position;
          }
           `.replace(/OZ/g,os).replace(/QQ/g,qcounter);

    shader.fragmentOver = true;
    shader.fragment = `
      uniform float sceneTime;
      varying vec4  sqpositionOZ_QQ;
          uniform float p1;
          uniform float p2;
                  void main()
                        {
                          if (sqpositionOZ_QQ.OZ < p1) discard;
                          //if (qpositionOZ_QQ.OZ > p1+p2) discard;
                          if (sqpositionOZ_QQ.OZ > p1+p2)
                            discard;

                          // подсветка краев сечений
                          #ifdef CLIP_EPS_HI
                          if (sqpositionOZ_QQ.OZ-CLIP_EPS_HI < p1 || sqpositionOZ_QQ.OZ+CLIP_EPS_HI > p1+p2)
                            gl_FragColor = CLIP_EPS_COLOR;
                            //vec4(0.0,0.0,0.0,1.0);
                          #endif

                            //gl_FragColor = vec4(1.0,0.0,0.0,0.1);;
                            //gl_FragColor.a = 0.2;
                            //gl_FragColor = vec4(1.0,0.0,1.0,1.0);;
            }
           `.replace(/OZ/g,os).replace(/QQ/g,qcounter);
  }
  
  gen();
  
  // вот так я странно делаю..

  import( "./vis-clip-timer.js").then(module => { 
    module.default( clipr_obj ); 
  });

  var q = clipr_obj.trackParam("cliprange", function() {
    setsliders();
  });
  
  var oremove = obj.remove;
  obj.remove = function() {
    clipr_obj.untrackParam( "cliprange",q );
    if (oremove) oremove();
  }

  return obj; // ну то есть я пока не понял, хочу я вообще что-то возвращать или нет
}

mv.addItemType( "clip_to_screen","Clip to screen",make, {label: "extra",title_ru: "Отсечение к экрану", cat: "clip" } );

}

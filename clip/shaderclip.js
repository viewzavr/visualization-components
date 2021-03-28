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
    
    obj.addSlider( "p1",-r,-r,r, 0.1, function() {});
    obj.addSlider( "p2",2*r,0,2*r, 0.1, function() {});
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
          varying vec3  qpositionOZ_QQ;
          void main()
          {
            qpositionOZ_QQ = position.xyz;
          }
           `.replace(/OZ/g,os).replace(/QQ/g,qcounter);

    shader.fragmentOver = true;
    shader.fragment = `
      uniform float sceneTime;
      varying vec3  qpositionOZ_QQ;
          uniform float p1;
          uniform float p2;
                  void main()
                        {
                          if (qpositionOZ_QQ.OZ < p1) discard;
                          //if (qpositionOZ_QQ.OZ > p1+p2) discard;
                          if (qpositionOZ_QQ.OZ > p1+p2)
                            discard;

                          // подсветка краев сечений
                          #ifdef CLIP_EPS_HI
                          if (qpositionOZ_QQ.OZ-CLIP_EPS_HI < p1 || qpositionOZ_QQ.OZ+CLIP_EPS_HI > p1+p2)
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

mv.addItemType( "clip_x","Clip X",make, {label: "extra",title_ru: "Отсечение X", cat: "clip" } );
mv.addItemType( "clip_y","Clip Y",make, {label: "extra",title_ru: "Отсечение Y", cat: "clip" } );
mv.addItemType( "clip_z","Clip Z",make, {label: "extra",title_ru: "Отсечение Z", cat: "clip" } );

}

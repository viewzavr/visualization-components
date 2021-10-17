// autoscale: scale scene objects to a cube of size 50

// * move to clips? (and rename them to shaders)
// * configure 50 as a parameter (вписать..)

export default function setup( mv ) {

function make(opts) {

  var obj = mv.create_obj( {}, opts );
  var clipr_obj = mv.find_root(obj);

  /////////////////

  var shader = mv.vis.addShader( obj );

  obj.addSlider( "scale_coef",1,0.0001,5,0.01, function() {});
  shader.followParams( obj, "scale_coef" );

  obj.addCmd("Auto-scale",function() {
    var r = clipr_obj.getParam("cliprange") || 1000;
    obj.setParam( "scale_coef", 50 / r );
  });

  ////////////////

  shader.vertex = `
        uniform float sceneTime;
        uniform float scale_coef;
        void main()
        {
          gl_Position.x = gl_Position.x *scale_coef;
          gl_Position.y = gl_Position.y *scale_coef;
          gl_Position.z = gl_Position.z *scale_coef;
        }
       `

  
  import( "./clip/vis-clip-timer.js").then(module => { 
    module.default( clipr_obj );
  });

  return obj; // ну то есть я пока не понял, хочу я вообще что-то возвращать или нет
}

mv.addItemType( "auto_scale","Autoscale",make, {label: "extra",title_ru: "Автомасштаб", cat: "camera"} );

}

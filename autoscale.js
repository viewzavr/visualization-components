// autoscale: scale scene objects to a cube of size 50

// * move to clips? (and rename them to shaders)
// * configure 50 as a parameter (вписать..)

export default function setup( mv ) {

function make(opts) {

  var obj = mv.create_obj( {}, opts );

  /////////////////

  var shader = mv.vis.addShader( obj );

  shader.followParams( obj, "scale" );
  obj.addSlider( "scale",1,0.0001,5,0.01, function() {});
  obj.addCmd("Auto-scale",function() {
    var r = mv.root.getParam("cliprange") || 1000;
    obj.setParam( "scale", 50 / r );
  });

  ////////////////

  shader.vertex = `
        // your things
        uniform float sceneTime;
        uniform float scale;
        void main()
        {
          gl_Position.x = gl_Position.x *scale;
          gl_Position.y = gl_Position.y *scale;
          gl_Position.z = gl_Position.z *scale;
        }
       `

  import( "./clip/vis-clip-timer.js").then(module => { 
    module.default(mv); 
  });

  return obj; // ну то есть я пока не понял, хочу я вообще что-то возвращать или нет
}

mv.addItemType( "auto_scale","Autoscale",make, {label: "extra",title_ru: "Автомасштаб"} );

}

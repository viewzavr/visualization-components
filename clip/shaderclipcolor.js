// hilite clip colors

export default function setup( mv ) {

// надо чтобы на флоат было похоже
function addpt(v) {
  v = v.toString();
  if (v.indexOf(".") < 0) v = v + ".0";
  return v;
}

function make(opts) {
  var obj = mv.create_obj( {}, opts );
  
  var shader = mv.vis.addShader( obj );
  shader.fragmentOver = true;
  shader.followParams( obj, "p1" );
  
  function cliprangec() {
    var r = mv.root.getParam("cliprange") || 1000;
    obj.addSlider( "p1",r/500.0, 0, r/20.0, 1.0, regen );
  }
  cliprangec();
  
  obj.addColor( "color",0,regen );
  
  function regen() {
    var pv  = obj.getParam( "p1" );
    var col = obj.getParam("color");
    col = any2tri( col );
    shader.fragment = `#define CLIP_EPS_HI ${addpt(pv)}
                       #define CLIP_EPS_COLOR vec4(${col.map(addpt)},1.0)
void main()
{
}`;

  }
  
  
  regen();
  
  // obj.trackParam( "p1",regen ); - подписались выше
  // а на color мы подписались выше
  ////////////////
  
  
  // вот так я странно делаю..
  import( "./vis-clip-timer.js").then(module => { module.default(mv); });
  // todo mv.load( ...... ) + setup оно само вызовет? ну а что? удобно жеж.. 
  
  mv.root.trackParam("cliprange",cliprangec )

  var oremove = obj.remove;
  obj.remove = function() {
    mv.root.untrackParam( "cliprange",cliprangec );
    if (oremove) oremove();
  }

  return obj;
}

mv.addItemType( "clip_color","Clip edges hilite",make, {label: "extra", title_ru: "Края сечений"} );

}
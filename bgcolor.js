// background scene color
// temporary not used

export default function setup( mv ) {

function make( opts ) {
  var obj = mv.create_obj( {}, opts );
//  var s = qmlEngine.rootObject;

  //var c = s.backgroundColor || [0.09, 0.09, 0.17] || [0,0.2,0];
  //var c = [0.09, 0.09, 0.17] || [0,0.2,0];
  var cc =  new THREE.Color();
  threejs.renderer.getClearColor(cc);
  var c = [cc.r, cc.g, cc.b];
  var opacity = 1.0;

  obj.addColor("color",c,update);

  obj.addSlider("opacity",1.0,0,1,0.01,update );
 
  function update() {
    var color = obj.params.color;
    if (!threejs || !threejs.renderer || !threejs.renderer.getClearColor || !threejs.renderer.setClearColor) return;
    var cc = color ? somethingToColor( color ) : threejs.renderer.getClearColor();
    threejs.renderer.setClearColor( cc, obj.params.opacity );
  }

  return obj;
}

mv.addItemType( "bgcolor","Background color",make, {label: "visual", guionce: true, title_ru: "Цвет фона", cat: "background"} );

}

  

function somethingToColor( theColorData )
{
 return theColorData.length && theColorData.length >= 3 ? new THREE.Color( theColorData[0], theColorData[1], theColorData[2] ) : new THREE.Color(theColorData);
}

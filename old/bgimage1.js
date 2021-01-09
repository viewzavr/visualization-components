// background scene image

// simple, but minus: 1) dont work, 2) even configured manually, no image in the screenshots

export default function setup( mv ) {

function make( opts ) {
  var obj = mv.create_obj( {}, opts );

  var c = "https://images.unsplash.com/photo-1518066000714-58c45f1a2c0a?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80";

  // https://threejsfundamentals.org/threejs/lessons/threejs-backgrounds.html
  obj.addFile("image",c,function(v) {
    //debugger;
    var s="url('"+v+"') no-repeat center center;"
    var s2="url('"+v+"');"
    console.log("s=",s);
    //threejs.renderer.domElement.style.backgroundImage = s2;
    threejs.renderer.domElement.style.background = s;
    threejs.renderer.domElement.style.backgroundSize = "cover";
    threejs.renderer.setClearColor( threejs.renderer.getClearColor(), 0.2);
    //imga.src = v;
  });

  return obj;
}

mv.addItemType( "bgimage1","Background image 1",make, {label: "visual", guionce: true, title_ru: "Фоновая картинка"} );

}
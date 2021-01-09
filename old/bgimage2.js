// background scene image

// minus: no image on screenshot

export default function setup( mv ) {

function make( opts ) {
  var obj = mv.create_obj( {}, opts );

  var c = "https://images.unsplash.com/photo-1518066000714-58c45f1a2c0a?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80";

  var imga = document.createElement("img");
  imga.style.height = "100%";
  imga.style.width="100%";
  //imga.src=;
  imga.style.zIndex=-5;
  imga.style.position="absolute";
  imga.style.top=0;
  threejs.renderer.setClearColor( threejs.renderer.getClearColor(), 0.2);
  //threejs.renderer.domElement.appendChild( imga );
  document.body.appendChild(imga);
  
  obj.addFile("image",c,function(v) {
    imga.src = v;
  });

  return obj;
}

mv.addItemType( "bgimage2","Background image 2",make, {label: "visual", guionce: true, title_ru: "Фоновая картинка"} );

}
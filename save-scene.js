// provides functions:
// * export scene to json
// * import scene from json
// * import scene from json as a new object in current scene
// * reset scene

export default function setup( mv ) {

// сохраняет сцену в файл json, загружает из файла

// идея - уметь загружать multiple... тогда если несколько то грузим как объекты?
// идея - экспортировать только часть сцены (какие-то узлы по выбору....)
// идея - драг и дроп втаскивать в сцену json-ки

function load( plus ) {
var input = document.createElement('input');
input.type = 'file';
input.accept = ".json,.txt";

input.onchange = e => { 

   // getting a hold of the file reference
   var file = e.target.files[0];
   //console.log("inpuit change",file, "plus=",plus );   

   // setting up the reader
   var reader = new FileReader();
   reader.readAsText(file,'UTF-8');

   // here we tell the reader what to do when it's done reading...
   reader.onload = readerEvent => {
      var content = readerEvent.target.result; // this is the content!
      //console.log( content );
      var d = JSON.parse( content );
      
      if (!plus)
        mv.root.setup_from_dump( d );
      else {
        console.log("loading to new");
        var newobj = mv.create_obj( {}, {manual: true } );
        newobj.setup_from_dump( d );
      }
   }

}

input.click();
}

// https://stackoverflow.com/a/30832210
// Function to download data to a file
function download(data, filename, type) {
    var file = new Blob([data], {type: type});
        var a = document.createElement("a"),
                url = URL.createObjectURL(file);
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        setTimeout(function() {
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);  
        }, 0); 
}

function make(opts) {
  var obj = mv.create_obj( {}, opts );

  var sl1 = obj.addCmd("Export",function(value) {
    var s = mv.root.dump();
    var t  =JSON.stringify(s, null, '\t');
    download( t,"viewzavr-scene.json","text/plain" );
  });
  
  var sl2= obj.addCmd("Import",function(value) {
    load();
  });
  
  var sl3 = obj.addCmd("Import as object",function(value) {
    load( true );
  });
  
  
  var sl3 = obj.addCmd("Reset",function(value) {
    mv.root.setup_from_dump( {} );
  });  

  return obj; // ну то есть я пока не понял, хочу я вообще что-то возвращать или нет
}

mv.addItemType( "import-export","Import-export",make, {label:"special", guionce:true} );

}
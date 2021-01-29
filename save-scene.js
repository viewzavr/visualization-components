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

  obj.addCmd("Export",function(value) {
    var s = mv.root.dump();
    var t  =JSON.stringify(s, null, '\t');
    download( t,"viewzavr-scene.json","text/plain" );
  });
  
  // R-EXPORT-JS
  obj.addCmd("Generate JS",function(value) {
    var s = mv.root.dump();
    var t = "// creates a scene\n// obj - a parent obj; you may pass vz.root here.\n\nfunction create( obj ) {\n" + json2js( "obj",s,"  " ) + "\n}\n";
    // an idea to generate a function instead of just code is fine for making components
    // because they need create function ;-)
    download( t,"viewzavr-scene.js","text/plain" );
  });
  
  obj.addCmd("Import",function(value) {
    load();
  });
  
  obj.addCmd("Import as object",function(value) {
    load( true );
  });
  
  
  obj.addCmd("Reset",function(value) {
    mv.root.setup_from_dump( {} );
  });  

  return obj; // ну то есть я пока не понял, хочу я вообще что-то возвращать или нет
}

mv.addItemType( "import-export","Import-export",make, {label:"special", guionce:true} );

}


// converts json viewzavr dump into js language
// objname - a name of dump root object (probably vz.root by default)
export function json2js( objname, dump,padding ) {
    var result = "";

    var h = dump.params || {};
    var keys = Object.keys(h);

    keys.forEach( function(name) {
      result += `${objname}.setParam( '${name}', '${h[name]}' );\n`;
    });

    var c = dump.children || {};
    var ckeys = Object.keys( c );

    // todo отсортировать в порядке order..
    ckeys.forEach( function(name) {
      var cobjname = objname + "_" + name;
      
      result += `\n // object ${cobjname}\n`;
      cobjname = cobjname.replace(/[^\d\w]/,"_").replace("-","_");
      if (c[name].manual) 
      {
        result += `var ${cobjname} = ${objname}.vz.create_obj_by_type( { type: '${c[name].type}', parent: ${objname}, name: '${name}', manual: true } );\n`;
      }
      else
      {
        result += `var ${cobjname} = ${objname}.ns.getChildByName('${name}');\n`;
      }
      result += json2js( cobjname, c[name],padding );
    });
    

   return result.split("\n").map( s => padding+s ).join("\n");
}
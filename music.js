// plays a positional audio

// todo: add many files, play sequentally, shuffled, or one random (add mode for this).

export function create( vz, opts ) {
  var obj = vz.create_obj( {}, opts );
  
  var snd;
  var starting;
  obj.addCmd( "play/pause",function() {
    if (starting) return;
    if (snd) {
      snd.stop();
      snd=undefined;
    }
    else {
      starting = true;
      var pos = obj.getParam("coords").split(/[\s,;]+/).map(parseFloat);
      console.log("Starting music at coords ",pos );
      vz.vis.playSound3d( pos, obj.getParam("file"), function(snd1) {
        starting=false;
        snd = snd1;
        snd.setVolume( obj.getParam("volume")/100.0 );
        snd.setRefDistance( obj.getParam("refdistance") );
      }, 
      function(snd) {
        snd=undefined;
        starting=false;
      });
    }
  });

  obj.addCheckbox("autoplay",false,function() {
    if (obj.getParam("autoplay")) {
        setTimeout( function() {
          obj.signalTracked("play/pause")
        },100 ); // timeout to reflect file change
    }  
  });

  obj.addFile("file","//viewlang.ru/assets/sounds/Maxim_Fadeev__Tiho_neset_voda.mp3",function(v) {

  });
  
  obj.addSlider( "volume",50,0,100,1,function(v) {
    if (snd) snd.setVolume( v/100.0 );
  });
  
  // a distance where it starts to decrese sound
  obj.addSlider( "refdistance",20,0,110,1,function(v) {
    if (snd) snd.setRefDistance( v );
  });
  
  
  obj.addText("coords","0,0,0",function() {
    if (snd) {
      snd.setCoords( obj.getParam("coords").split(/[\s,;]+/).map(parseFloat) );
    }
  });
  
  obj.chain("remove", function() {
    if (snd) {
      snd.stop();
      snd=undefined;
    }    
  });
  
  return obj;
}

export function setup( vz ) {
  vz.addItemType( "music_coords","Music (coords) (reka)", function( opts ) {
    return create( vz, opts );
  } );
}
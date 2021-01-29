// plays a positional audio

// todo: add many files, play sequentally, shuffled, or one random (add mode for this).

export function create( vz, opts ) {
  var obj = vz.create_obj( {}, opts );

  obj.addCmd( "play/stop",function() {
    if (starting) return;

    if (obj.isplaying())
      obj.stop();
    else 
      obj.start();
  });

  obj.addCheckbox("autoplay",false,function() {
    if (obj.getParam("autoplay")) {
        setTimeout( function() {
          obj.play();
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

  obj.play = function() {
    if (obj.isplaying()) return;
    if (starting) return;

    starting = true;
    var pos = obj.getParam("coords").split(/[\s,;]+/).map(parseFloat);
//      console.log("Starting music at coords ",pos );

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

  var snd;
  var starting;
  /* не готово по состояниям
  obj.pause = function() {
    if (!obj.isplaying()) return;
    if (snd) snd.pause();
  }
  */

  obj.stop = function() {
    if (!obj.isplaying()) return;
    if (snd) snd.stop();
    snd = undefined;
    starting = false;
  }

  obj.isplaying = function() {
    if (starting) return true;
    if (snd) return true;
    return false;
  }
  
  obj.isstarting = function() {
    return starting;
  }
  
  return obj;
}

export function setup( vz ) {
  vz.addItemType( "music_with_coords","Music (coords) (reka)", function( opts ) {
    return create( vz, opts );
  } );
}
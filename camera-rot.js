// camera rotation around axis
// uses orbitControl@treejs tied with Viewlang
// todo: manipulate camera object from player.

export default function setup(mv) {

var intervalDur=15;
var timer_rm = ()=>{};

function make(opts) {
  var obj = mv.create_obj( {}, opts );
  obj.feature("enabled timers");
  obj.setParam("enabled",false);
  obj.trackParam("enabled",aval)
  
  // neet to get it by function every time - because control might be changed externally
  var getcontrol = () => qmlEngine.rootObject.scene3d.cameraControlC.sceneControl;
  
  var sl1 = obj.addSlider("teta-angle",0,-1,360,0.01,function(value) {
    var orbitControl = getcontrol();
    orbitControl.manualTheta = value < 0 || value == null || isNaN(value) ? undefined : 2*Math.PI * value / 360.0;
    orbitControl.theta = orbitControl.manualTheta;
    orbitControl.update();
    if (!obj.params.enabled) {
      orbitControl.manualTheta = undefined;
      orbitControl.update();
    }
  });
  
  // синхронизирует процесс таймера и потребность на него, что определяется ненулевым значением value
  function aval() {
    if (obj.params.enabled) {
      var orbitControl = getcontrol();
      orbitControl.update();
      timer_rm();
      timer_rm = obj.setInterval( function() {
          var dt = aps.value;
          if (isNaN(dt)) dt = 0;
          var newangle = ((sl1.value + dt)%360 + 360)%360;
          if (isNaN(newangle)) newangle = 0;
          sl1.setValue( newangle );
      }, intervalDur );
    }
    else
    {
      timer_rm(); timer_rm = () => {};
      var orbitControl = getcontrol();
      orbitControl.manualTheta = undefined;
      orbitControl.update();
    }
  }
  
  
  var aps = obj.addSlider("auto-rotate",0.01,-0.1,+0.1,0.01,function(value) {
    aval();
  });
  
  obj.addCmd( "start",function() {
    obj.setParam("enabled",true);
  });
  obj.addCmd( "stop",function() {
    obj.setParam("enabled",false);
  });  

  obj.on("remove",() => {
    var orbitControl = getcontrol();
    orbitControl.manualTheta = undefined;
    orbitControl.update();
  })

  return obj; // ну то есть я пока не понял, хочу я вообще что-то возвращать или нет
}

mv.addItemType( "cameraZ","Animation: Camera rotate",make, {
  label:"extra",
  guionce:true,
  title_ru: "Поворот камеры"
} );

}
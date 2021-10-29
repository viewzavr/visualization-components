// todo parameter animation - правильное название

export default function setup( vz, m ) {
  vz.register_feature( "animation-player", animation_player );
  vz.addType( "animation-player", (vz,opts)=>vz.createObj(opts), { title: "Animation player", cats: "animation"})
  vz.register_feature( "animation-player-priority", ()=>{} );
}

export function animation_player( obj, opts ) 
{
  var root = obj.findRoot();
  obj.feature("enabled");
  obj.setParam("enabled",false);

  //obj.addCombo( "parameter",0,["a","b","c"] );
  obj.addParamRef( "parameter","", crit, (param_path) => {
    // здесь param_path это строковая ссылка
    updateminmax();
  }, root )
  //obj.setParamOption("parameter","title","Choose parameter")
  obj.addCmd("update min-max",updateminmax);
  obj.addFloat( "start_value",0 );
  obj.addFloat( "min",0 );
  obj.addFloat( "max",1 );
  obj.addFloat( "step",1 );
  obj.addFloat( "delay",2 );

  
  //obj.addCmd("stop",() => obj.setParam("enabled",false));
  obj.addCmd("play | pause",() => obj.setParam("enabled", !obj.params.enabled, true ));
  obj.addCmd("restart",() => { obj.setParam("enabled",true, true); need_restart = true; });

/*
  obj.addCmd("start",() => { obj.setParam("enabled",true); need_restart = true; });
  obj.addCmd("stop",() => obj.setParam("enabled",false));
  obj.addCmd("pause",() => obj.setParam("enabled", !obj.params.enabled ));
*/  

  function crit( o ) {
    var acc = [];
    if (o.is_feature_applied("screen")) return;
    if (o.is_feature_applied("link")) return;

    for (var name of o.getGuiNames()) {
      var g = o.getGui(name);
      if (["float","slider","combo"].indexOf(g.type) >= 0) 
          acc.push( name );
    }

    if (o.is_feature_applied("animation-player-priority")) return { result: acc, priority: 1};

    return acc;
  }

  var updateminmax_pending = false;
  function updateminmax() {
    if (!obj.params.parameter) return;
    var [tobj,tparam] = obj.params.parameter.split("->");
    tobj = root.findByPath( tobj );
    if (!tobj) { updateminmax_pending = true; return; }

    var g = tobj.getGui( tparam );
    if (g) {
      obj.setParam( "min", g.min || 0,true );
      obj.setParam( "max", g.max || 1,true );
      obj.setParam( "step", g.step || 1,true );
      obj.setParam( "start_value", tobj.getParam(tparam),true );
    }

/*
    obj.setParam( "min", tobj.getParamOption( tparam,"min") || 0 );
    obj.setParam( "max", tobj.getParamOption( tparam,"max") || 1 );
    obj.setParam( "step", tobj.getParamOption( tparam,"step") || 1 );
*/    
 }

 obj.trackParam("enabled",(v) => {
    window.requestAnimationFrame( animframe );
 })

 var counter = 0;
 var need_restart = true;
 function animframe() {
    if (!obj.params.enabled) return;
    window.requestAnimationFrame( animframe );

    // если грузим файлы - надо подождать.
    if (qmlEngine.rootObject.propertyComputationPending > 0) return;

    counter++;
    if (obj.params.delay > 0 && counter % obj.params.delay !== 0) return;

    var [tobj,tparam] = obj.params.parameter.split("->");
    tobj = root.findByPath( tobj );
    if (!tobj) return;

    var value = tobj.getParam( tparam );
    if (!isFinite(value)) value = obj.params.start_value;

    var nv = value + obj.params.step;
    if (nv > obj.params.max) nv = obj.params.min;
    if (nv < obj.params.min) nv = obj.params.max;

    if (need_restart) { need_restart=false; nv = obj.params.start_value; }

    tobj.setParam( tparam, nv );
 }

  obj.on("remove",() => {
    obj.setParam("enabled",false);
  })
}

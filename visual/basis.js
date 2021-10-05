// points

export default function setup( vz ) {
  vz.addItemType( "points","Points",function(opts) { return make( vz, opts ) },{cat:"visual"}  );
  vz.addItemType( "lines","Lines",function(opts) { return make_lines( vz, opts ) },{cat:"visual"}  );
  vz.addItemType( "linestrip","Linestrip",function(opts) { return make_linestrip( vz, opts ) },{cat:"visual"}  );
  vz.addItemType( "arrows","Arrows",function(opts) { return make_arrows( vz, opts ) },{cat:"visual"}  );
}

function make( vz, opts ) {
  var obj = vz.vis.addPoints( opts.parent, opts.name, opts );
  
  add_std( obj );

  return obj;
}


function make_lines( vz, opts ) {
  var obj = vz.vis.addLines( opts.parent, opts.name, opts );
  
  add_std( obj );

  return obj;
}

function make_arrows( vz, opts ) {
  var obj = vz.vis.addViewlang( "Arrows",{name:"arrows", ...opts} );
  
  add_std( obj );

  return obj;
}

function make_linestrip( vz, opts ) {
  var obj = vz.vis.addLinestrip( opts.parent, opts.name, opts );
  
  add_std( obj );

  return obj;
}

function add_std( obj ) {
  obj.addArray("positions",[],3,function(v) {
    obj.positions = v;
  } );
  obj.setParamOption("positions","internal",true);
  
  obj.addArray("radiuses",[],1,function(v) {
    obj.radiuses = v;
  } );
  obj.setParamOption("radiuses","internal",true);  
  
  obj.addArray("colors",[],1,function(v) {
    obj.colors = v;
  } );
  obj.setParamOption("colors","internal",true);    
  
  obj.addCheckbox("visible",true,(v) => {
    obj.visible=v;
  });

}
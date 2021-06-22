// points

export default function setup( vz ) {
  mv.addItemType( "points","Points",function(opts) { make( vz, opts ) },{cat:"visual"}  );
}

function make( vz, opts ) {
  var obj = vz.vis.addPoints( opts.parent, opts.name );
  
  obj.addArray("positions",[],3,function(v) {
    obj.positions = v;
  } );
  obj.setParamOption("positions","internal",true);
  
  obj.addArray("radiuses",[],1,function(v) {
    obj.radiuses = v;
  } );
  obj.setParamOption("radiuses","internal",true);  

  return obj;
}
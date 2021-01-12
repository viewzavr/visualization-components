import pts from "./pointes-cube.js";
import lins from "./lineas-cube.js";
import sav from "./save-scene.js";
import camerar from "./camera-rot.js";
import bgcolor from "./bgcolor.js";
import bgimage from "./bgimage.js";
import clip from "./clip/init.js";
import autoscale from "./autoscale.js";
import env1 from "./env1.js";
import env2 from "./env2.js";

export default function setup(m) {
  pts( m );
  lins( m );
  sav( m );
  camerar( m );
  bgcolor( m );
  bgimage( m );
  clip( m );
  autoscale( m );
  env1( m );
  env2( m );  
}

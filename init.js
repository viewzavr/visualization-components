import pts from "./pointes-cube.js";
import lins from "./lineas-cube.js";
import camerar from "./camera-rot.js";
import bgcolor from "./bgcolor.js";
import bgimage from "./bgimage.js";
import clip from "./clip/init.js";
import autoscale from "./autoscale.js";
import env1 from "./env1.js";
import env2 from "./env2.js";
import env3 from "./env3.js";
import * as mus from "./music.js";

import pts2 from "./visual/points.js";

export function setup(m) {
  pts( m );
  lins( m );
  camerar( m );
  bgcolor( m );
  bgimage( m );
  clip( m );
  autoscale( m );
  env1( m );
  env2( m );
  env3( m );
  mus.setup( m );
  
  pts2( m );
}

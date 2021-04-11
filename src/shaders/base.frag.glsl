#version 300 es

out highp vec4 pc_fragColor;

precision highp float;
precision highp int;

uniform vec2 resolution;
uniform sampler2D tx;

const vec2[8]offsets = vec2[8](
  vec2(-1., -1.),
  vec2(-1.,  0.),
  vec2(-1.,  1.),
  vec2( 0., -1.),
  vec2( 0.,  1.),
  vec2( 1., -1.),
  vec2( 1.,  0.),
  vec2( 1.,  1.)
);
const vec4 LIVE = vec4(1.);
const vec4 DEAD = vec4(0., 0., 0., 1.);
const vec4 NEWDEAD = vec4(1., 0., 0., 1.);
const vec4 NEWLIVE = vec4(0., 1., 1., 1.);

float noise(vec2 co){
    return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453);
}

vec4 getColAt(vec2 pos) {
  ivec2 iSize = textureSize(tx, 0);
  vec2 size = vec2(float(iSize.x), float(iSize.y));

  return texture(tx, pos/size);
}

int getAdjSum(vec2 pos) {
  int s = 0;
  vec4 col = vec4(0.);
  vec2 cPos = pos;
  for(int i = 0; i < offsets.length(); i++) {
    cPos = mod(pos + offsets[i], resolution);

    col = getColAt(cPos);
    if (col.g > 0.5) {
      s++;
    }
  }
  return s;
}

void main() {
  vec4 col = getColAt(gl_FragCoord.xy);
  vec2 pos = gl_FragCoord.xy;

  // Initialization
  if(col.a < 0.5) {
    pc_fragColor = noise(pos/2.) < 0.7 ? LIVE : DEAD;
    return;
  }

  int s = getAdjSum(pos);
  // Live
  if(col.g > 0.5) {
    if(s < 2 || s > 3) {
      pc_fragColor = NEWDEAD;
    } else {
      pc_fragColor = LIVE;
    }
  // Dead
  } else if(s == 3) {
    pc_fragColor = NEWLIVE;
  } else {
    pc_fragColor = DEAD;
  }
}
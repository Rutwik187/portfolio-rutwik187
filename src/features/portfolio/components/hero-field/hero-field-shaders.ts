/** The camera's distance from the forms, shared with the scene. */
export const CAMERA_Z = 10

// 3D simplex noise by Ian McEwan and Stefan Gustavson (Ashima Arts, MIT).
const SIMPLEX_NOISE = /* glsl */ `
vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec4 permute(vec4 x) { return mod289(((x * 34.0) + 10.0) * x); }
vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }

float snoise(vec3 v) {
  const vec2 C = vec2(1.0 / 6.0, 1.0 / 3.0);
  const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
  vec3 i = floor(v + dot(v, C.yyy));
  vec3 x0 = v - i + dot(i, C.xxx);
  vec3 g = step(x0.yzx, x0.xyz);
  vec3 l = 1.0 - g;
  vec3 i1 = min(g.xyz, l.zxy);
  vec3 i2 = max(g.xyz, l.zxy);
  vec3 x1 = x0 - i1 + C.xxx;
  vec3 x2 = x0 - i2 + C.yyy;
  vec3 x3 = x0 - D.yyy;
  i = mod289(i);
  vec4 p = permute(permute(permute(
    i.z + vec4(0.0, i1.z, i2.z, 1.0)) +
    i.y + vec4(0.0, i1.y, i2.y, 1.0)) +
    i.x + vec4(0.0, i1.x, i2.x, 1.0));
  float n_ = 0.142857142857;
  vec3 ns = n_ * D.wyz - D.xzx;
  vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
  vec4 x_ = floor(j * ns.z);
  vec4 y_ = floor(j - 7.0 * x_);
  vec4 x = x_ * ns.x + ns.yyyy;
  vec4 y = y_ * ns.x + ns.yyyy;
  vec4 h = 1.0 - abs(x) - abs(y);
  vec4 b0 = vec4(x.xy, y.xy);
  vec4 b1 = vec4(x.zw, y.zw);
  vec4 s0 = floor(b0) * 2.0 + 1.0;
  vec4 s1 = floor(b1) * 2.0 + 1.0;
  vec4 sh = -step(h, vec4(0.0));
  vec4 a0 = b0.xzyw + s0.xzyw * sh.xxyy;
  vec4 a1 = b1.xzyw + s1.xzyw * sh.zzww;
  vec3 p0 = vec3(a0.xy, h.x);
  vec3 p1 = vec3(a0.zw, h.y);
  vec3 p2 = vec3(a1.xy, h.z);
  vec3 p3 = vec3(a1.zw, h.w);
  vec4 norm = taylorInvSqrt(vec4(dot(p0, p0), dot(p1, p1), dot(p2, p2), dot(p3, p3)));
  p0 *= norm.x;
  p1 *= norm.y;
  p2 *= norm.z;
  p3 *= norm.w;
  vec4 m = max(0.5 - vec4(dot(x0, x0), dot(x1, x1), dot(x2, x2), dot(x3, x3)), 0.0);
  m = m * m;
  return 105.0 * dot(m * m, vec4(dot(p0, x0), dot(p1, x1), dot(p2, x2), dot(p3, x3)));
}
`

export const VERTEX_SHADER = /* glsl */ `
uniform float uTime;
uniform float uAssemble;
uniform vec3 uWeights;
uniform vec3 uCenter;
uniform float uScale;
uniform mat3 uRotation;
uniform vec2 uHalf;
uniform vec2 uPointer;
uniform float uPointerStrength;
uniform float uAspect;
uniform float uPixelRatio;
uniform float uSize;
uniform float uScatter;
uniform float uOpacity;
uniform float uChaosAlpha;
uniform float uFormAlpha;
uniform vec3 uInk;
uniform vec3 uBrand;

attribute vec3 aChaos;
attribute vec4 aSeed;
attribute vec3 aFormA;
attribute vec3 aFormB;
attribute vec3 aFormC;
attribute vec3 aAccent;

varying vec3 vColor;
varying float vAlpha;

${SIMPLEX_NOISE}

const float PI = 3.141592653589793;

vec3 rotateY(vec3 p, float angle) {
  float c = cos(angle);
  float s = sin(angle);
  return vec3(c * p.x + s * p.z, p.y, -s * p.x + c * p.z);
}

void main() {
  bool roams = aSeed.z > 0.5;
  bool dust = aSeed.z > 1.5;
  float drift = uTime * 0.07;

  // Messy: a slow cloud round the form, plus strays across the whole field.
  vec3 chaos;
  if (roams) {
    chaos = aChaos * vec3(uHalf * 1.08, 2.4) + vec3(0.0, 0.0, -1.0);
  } else {
    vec3 orbit = rotateY(aChaos, uTime * (0.05 + aSeed.x * 0.06));
    chaos = uCenter + orbit * uScale * vec3(1.35, 0.95, 0.9);
  }
  vec3 noise = vec3(
    snoise(aChaos * 1.4 + vec3(0.0, 0.0, drift)),
    snoise(aChaos * 1.4 + vec3(17.0, 0.0, drift)),
    snoise(aChaos * 1.4 + vec3(0.0, 23.0, drift))
  );
  chaos += noise * uScale * (roams ? 0.45 : 0.3);

  // Ordered: the current form, turned and placed.
  vec3 local = aFormA * uWeights.x + aFormB * uWeights.y + aFormC * uWeights.z;
  vec3 target = uCenter + uRotation * (local * uScale);
  target += noise * uScale * 0.004;

  // Each particle sets off at its own moment and swoops in on a curve.
  float delay = aSeed.x * 0.45;
  float p = clamp((uAssemble - delay) / 0.55, 0.0, 1.0);
  p = p < 0.5 ? 4.0 * p * p * p : 1.0 - pow(-2.0 * p + 2.0, 3.0) / 2.0;
  p *= 1.0 - uScatter;
  if (dust) p = 0.0;

  vec3 position = mix(chaos, target, p);
  position += noise * sin(p * PI) * uScale * 0.4;

  float accent = mix(aSeed.w, dot(aAccent, uWeights), p);
  vColor = mix(uInk, uBrand, accent);

  float chaosAlpha = uChaosAlpha * (dust ? 0.4 : roams ? 0.55 : 1.0);
  vAlpha = mix(chaosAlpha, uFormAlpha, p) * mix(1.0, 1.35, accent * p) * uOpacity;

  // The pointer parts the particles near it.
  vec4 view = viewMatrix * vec4(position, 1.0);
  vec4 clip = projectionMatrix * view;
  vec2 offset = (clip.xy / clip.w - uPointer) * vec2(uAspect, 1.0);
  float dist = length(offset);
  float push = uPointerStrength * (1.0 - smoothstep(0.0, 0.17, dist));
  view.xy += (offset / max(dist, 0.0001)) * push * push * uScale * 0.16;

  gl_Position = projectionMatrix * view;

  float size = uSize * mix(0.75, 1.4, aSeed.y) * mix(1.1, 1.0, p);
  gl_PointSize = size * uPixelRatio * (${CAMERA_Z.toFixed(1)} / -view.z);
}
`

export const FRAGMENT_SHADER = /* glsl */ `
uniform float uSoftness;

varying vec3 vColor;
varying float vAlpha;

void main() {
  float d = length(gl_PointCoord - 0.5);
  if (d > 0.5) discard;
  float alpha = (1.0 - smoothstep(0.5 - uSoftness, 0.5, d)) * vAlpha;
  gl_FragColor = vec4(vColor, alpha);
}
`

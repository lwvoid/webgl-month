precision mediump float;

uniform sampler2D texture;
uniform vec2 resolution;

// 反相
vec4 inverse(vec4 color) {
  return abs(vec4(color.rgb - 1.0, color.a));
}

// 灰度图
vec4 blackAndWhite(vec4 color) {
  float gray = (color.r + color.g + color.b) / 3.0;
  return vec4(gray, gray, gray, color.a);
}

// Sepia
vec4 sepia(vec4 color) {
  vec3 sepiaColor = vec3(112, 66, 20) / 255.0;
  vec4 outColor = vec4(mix(color.rgb, sepiaColor, 0.4), color.a);
  return outColor;
}

void main() {
  vec2 texCoord = gl_FragCoord.xy / resolution;
  vec4 color = texture2D(texture, texCoord);
  gl_FragColor = sepia(color);
}
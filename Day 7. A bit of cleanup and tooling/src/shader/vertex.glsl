attribute vec2 position;
uniform vec2 resolution;

void main() {
  vec2 transformedPosition = position / resolution * 2.0 - 1.0;
  gl_Position = vec4(transformedPosition, 0, 1.0);
}
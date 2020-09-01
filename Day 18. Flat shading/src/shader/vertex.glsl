attribute vec3 position;
attribute vec3 normal;

uniform mat4 modelMatrix;
uniform mat4 viewMatrix;
uniform mat4 projectionMatrix;
uniform mat4 normalMatrix;

uniform vec3 directionalLightVector;

varying vec4 vColor;


void main() {
  gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(position, 1.0);

  vec3 transformedNormal = (normalMatrix * vec4(normal, 1.0)).xyz;
  float intensity = dot(transformedNormal, normalize(directionalLightVector));

  vec4 color = vec4(0.5, 0.5, 0.5, 1.0);
  vColor.rgb = vec3(1, 1, 1) + color.rgb * intensity;
  vColor.a = 1.0;
}
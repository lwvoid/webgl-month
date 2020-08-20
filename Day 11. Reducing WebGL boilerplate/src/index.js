import vertexShaderSource from './shader/vertex.glsl'
import fragmentShaderSource from './shader/fragment.glsl'
import textureUrl from './assets/texture.jpg'
import otherTextureUrl from './assets/otherTexture.jpg'
import GLUtils from './utils/index'
import { GLBuffer } from './utils/GLBuffer'


async function main() {

  const canvas = document.getElementById('canvas')
  const gl = canvas.getContext('webgl')

  const vertexShader = GLUtils.initShader(gl, gl.VERTEX_SHADER, vertexShaderSource)
  const fragmentShader = GLUtils.initShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource)
  const program = GLUtils.initProgram(gl, vertexShader, fragmentShader)
  gl.useProgram(program)

  const {
    attributeLocations,
    uniformLocations
  } = GLUtils.getLocation(gl, program, vertexShaderSource, fragmentShaderSource)


  const vertexIndexBuffer = new GLBuffer(gl, gl.ELEMENT_ARRAY_BUFFER, new Uint8Array([
    0, 1, 2, 2, 3, 0,
    4, 5, 6, 6, 7, 4,
  ]), gl.STATIC_DRAW)


  const texCoordsBuffer = new GLBuffer(gl, gl.ARRAY_BUFFER, new Float32Array([
    ...GLUtils.getRectangle(0, 0, 1, 1),
    ...GLUtils.getRectangle(0, 0, 1, 1),
  ]), gl.STATIC_DRAW)
  gl.vertexAttribPointer(attributeLocations.texCoord, 2, gl.FLOAT, false, 0, 0)


  const texIndexBuffer = new GLBuffer(gl, gl.ARRAY_BUFFER, new Float32Array([
    ...Array.from({ length: 4 }).fill(0),
    ...Array.from({ length: 4 }).fill(1)
  ]), gl.STATIC_DRAW)
  gl.vertexAttribPointer(attributeLocations.texIndex, 1, gl.FLOAT, false, 0, 0)


  const vertexBuffer = new GLBuffer(gl, gl.ARRAY_BUFFER, new Float32Array([
    ...GLUtils.getRectangle(-1, -1, 1, 1),
    ...GLUtils.getRectangle(0, 0, 1, 1),
  ]), gl.STATIC_DRAW)
  gl.vertexAttribPointer(attributeLocations.position, 2, gl.FLOAT, false, 0, 0)


  gl.activeTexture(gl.TEXTURE0)
  gl.uniform1i(uniformLocations.texture, 0)
  await GLUtils.initTexture(gl, textureUrl)

  gl.activeTexture(gl.TEXTURE1)
  gl.uniform1i(uniformLocations.otherTexture, 1)
  await GLUtils.initTexture(gl, otherTextureUrl)


  gl.uniform2fv(uniformLocations.resolution, [canvas.width, canvas.height])
  gl.drawElements(gl.TRIANGLES, vertexIndexBuffer.data.length, gl.UNSIGNED_BYTE, 0)
}

main()

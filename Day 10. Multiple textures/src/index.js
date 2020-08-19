import vertexShaderSource from './shader/vertex.glsl'
import fragmentShaderSource from './shader/fragment.glsl'
import textureUrl from './assets/texture.jpg'
import otherTextureUrl from './assets/otherTexture.jpg'
import GLUtils from './utils/index'


async function main() {

  const canvas = document.getElementById('canvas')
  const gl = canvas.getContext('webgl')

  const vertexShader = GLUtils.initShader(gl, gl.VERTEX_SHADER, vertexShaderSource)
  const fragmentShader = GLUtils.initShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource)
  const program = GLUtils.initProgram(gl, vertexShader, fragmentShader)
  gl.useProgram(program)

  
  const attribLocation = {
    position: gl.getAttribLocation(program, 'position'),
    texCoord: gl.getAttribLocation(program, 'texCoord'),
    texIndex: gl.getAttribLocation(program, 'texIndex'),
  }

  const uniformLocation = {
    texture: gl.getUniformLocation(program, 'texture'),
    otherTexture: gl.getUniformLocation(program, 'otherTexture'),
    resolution: gl.getUniformLocation(program, 'resolution'),
  }

  const indexData = new Uint8Array([
    0, 1, 2, 2, 3, 0,
    4, 5, 6, 6, 7, 4,
  ])
  const indexBuffer = gl.createBuffer(gl.ELEMENT_ARRAY_BUFFER)
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer)
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indexData, gl.STATIC_DRAW)


  const texCoords = new Float32Array([
    ...GLUtils.getRectangle(0, 0, 1, 1),
    ...GLUtils.getRectangle(0, 0, 1, 1),
  ])
  const texCoordsBuffer = gl.createBuffer(gl.ARRAY_BUFFER)
  gl.bindBuffer(gl.ARRAY_BUFFER, texCoordsBuffer)
  gl.bufferData(gl.ARRAY_BUFFER, texCoords, gl.STATIC_DRAW)
  gl.enableVertexAttribArray(attribLocation.texCoord)
  gl.vertexAttribPointer(attribLocation.texCoord, 2, gl.FLOAT, false, 0, 0)


  const texIndicies = new Float32Array([
    ...Array.from({ length: 4 }).fill(0),
    ...Array.from({ length: 4 }).fill(1)
  ])
  const indiciesBuffer = gl.createBuffer(gl.ARRAY_BUFFER)
  gl.bindBuffer(gl.ARRAY_BUFFER, indiciesBuffer)
  gl.bufferData(gl.ARRAY_BUFFER, texIndicies, gl.STATIC_DRAW)
  gl.enableVertexAttribArray(attribLocation.texIndex)
  gl.vertexAttribPointer(attribLocation.texIndex, 1, gl.FLOAT, false, 0, 0)


  const vertices = new Float32Array([
    ...GLUtils.getRectangle(-1, -1, 1, 1),
    ...GLUtils.getRectangle(0, 0, 1, 1),
  ])
  const buffer = gl.createBuffer(gl.ARRAY_BUFFER)
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
  gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW)
  gl.enableVertexAttribArray(attribLocation.position)
  gl.vertexAttribPointer(attribLocation.position, 2, gl.FLOAT, false, 0, 0)


  gl.activeTexture(gl.TEXTURE0)
  gl.uniform1i(uniformLocation.texture, 0)
  await GLUtils.initTexture(gl, textureUrl)

  gl.activeTexture(gl.TEXTURE1)
  gl.uniform1i(uniformLocation.otherTexture, 1)
  await GLUtils.initTexture(gl, otherTextureUrl)
  

  gl.uniform2fv(uniformLocation.resolution, [canvas.width, canvas.height])
  gl.drawElements(gl.TRIANGLES, indexData.length, gl.UNSIGNED_BYTE, 0)
}

main()

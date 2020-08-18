import vertexShaderSource from './shader/vertex.glsl'
import fragmentShaderSource from './shader/fragment.glsl'
import textureUrl from './assets/texture.jpg'
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
  }

  const uniformLocation = {
    texture: gl.getUniformLocation(program, 'texture'),
    resolution: gl.getUniformLocation(program, 'resolution'),
  }


  const { vertices, indexData } = GLUtils.getRectangleElement(-1, -1, 2, 2)
  const indexBuffer = gl.createBuffer(gl.ELEMENT_ARRAY_BUFFER)
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer)
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indexData, gl.STATIC_DRAW)

  const buffer = gl.createBuffer(gl.ARRAY_BUFFER)
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
  gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW)

  gl.enableVertexAttribArray(attribLocation.position)
  gl.vertexAttribPointer(attribLocation.position, 2, gl.FLOAT, false, 0, 0)


  const textureImage = await GLUtils.loadImage(textureUrl)
  const texture = gl.createTexture()
  gl.bindTexture(gl.TEXTURE_2D, texture)
  
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR)
  
  gl.activeTexture(gl.TEXTURE0)
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, textureImage)

  gl.uniform1i(uniformLocation.texture, 0)
  gl.uniform2fv(uniformLocation.resolution, [canvas.width, canvas.height])


  gl.drawElements(gl.TRIANGLES, indexData.length, gl.UNSIGNED_BYTE, 0)
}

main()

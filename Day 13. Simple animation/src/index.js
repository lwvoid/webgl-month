import vertexShaderSource from './shader/vertex.glsl'
import fragmentShaderSource from './shader/fragment.glsl'
import GLUtils from './utils/index'
import { GLBuffer } from './utils/GLBuffer'
import { mat2 } from 'gl-matrix'


async function main() {

  const { gl, canvas } = GLUtils.initContext()

  const vertexShader = GLUtils.initShader(gl, gl.VERTEX_SHADER, vertexShaderSource)
  const fragmentShader = GLUtils.initShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource)
  const program = GLUtils.initProgram(gl, vertexShader, fragmentShader)
  gl.useProgram(program)

  const {
    attributeLocations,
    uniformLocations
  } = GLUtils.getLocation(gl, program, vertexShaderSource, fragmentShaderSource)

  
  const vertexIndexBuffer = new GLBuffer(gl, gl.ELEMENT_ARRAY_BUFFER, new Uint8Array([
    0, 1, 2,
    2, 3, 0
  ]), gl.STATIC_DRAW)
  
  const { width, height } = canvas
  gl.uniform2fv(uniformLocations.resolution, [width, height])

  new GLBuffer(gl, gl.ARRAY_BUFFER, new Float32Array([
    ...GLUtils.getRectangle(width / 2, height / 2, 200, 0)
  ]), gl.STATIC_DRAW)
  gl.vertexAttribPointer(attributeLocations.position, 2, gl.FLOAT, false, 0, 0)


  const rotationMatrix = mat2.create()
  function frame() {
    gl.uniformMatrix2fv(uniformLocations.rotationMatrix, false, rotationMatrix)
    mat2.rotate(rotationMatrix, rotationMatrix, -Math.PI / 180)

    gl.drawElements(gl.TRIANGLES, vertexIndexBuffer.data.length, gl.UNSIGNED_BYTE, 0)
    requestAnimationFrame(frame)
  }

  frame()
}

main()

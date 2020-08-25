import vertexShaderSource from './shader/vertex.glsl'
import fragmentShaderSource from './shader/fragment.glsl'
import GLUtils from './utils/index'
import { GLBuffer } from './utils/GLBuffer'
import { mat4 } from 'gl-matrix'


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

  const vertexData = new Float32Array([
    // front
    -1.0, 1.0, 1,
    1.0, 1.0, 1,
    1.0, -1.0, 1,
    -1.0, -1.0, 1,

    // back
    -1.0, 1.0, -1,
    1.0, 1.0, -1,
    1.0, -1.0, -1,
    -1.0, -1.0, -1
  ])

  const indexData = new Uint8Array([
    // front face
    0, 1, 2,
    2, 3, 0,

    // back face
    4, 5, 6,
    6, 7, 4,

    // left face
    4, 0, 3,
    3, 7, 4,

    // right face
    1, 5, 6,
    6, 2, 1,

    // top face
    0, 4, 5,
    5, 1, 0,

    // bottom face
    7, 6, 2,
    2, 3, 7,
  ])

  const indexBuffer = new GLBuffer(gl, gl.ELEMENT_ARRAY_BUFFER, indexData)
  const vertexBuffer = new GLBuffer(gl, gl.ARRAY_BUFFER, vertexData)
  gl.vertexAttribPointer(attributeLocations.position, 3, gl.FLOAT, false, 0, 0)

  const modelMatrix = mat4.create()
  const viewMatrix = mat4.create()
  const projectionMatrix = mat4.create()

  mat4.lookAt(
    viewMatrix,
    [0, 7, -7],
    [0, 0, 0],
    [0, 1, 0],
  )

  mat4.perspective(
    projectionMatrix,
    Math.PI / 360 * 90,
    canvas.width / canvas.height,
    0.01,
    100,
  )

  gl.uniformMatrix4fv(uniformLocations.modelMatrix, false, modelMatrix)
  gl.uniformMatrix4fv(uniformLocations.viewMatrix, false, viewMatrix)
  gl.uniformMatrix4fv(uniformLocations.projectionMatrix, false, projectionMatrix)

  function frame() {
    mat4.rotateY(modelMatrix, modelMatrix, Math.PI / 180)
    gl.uniformMatrix4fv(uniformLocations.modelMatrix, false, modelMatrix)
    gl.drawElements(gl.TRIANGLES, indexBuffer.data.length, gl.UNSIGNED_BYTE, 0)

    requestAnimationFrame(frame)
  }

  frame()
}

main()

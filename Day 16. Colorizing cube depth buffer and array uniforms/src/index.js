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
  gl.enable(gl.DEPTH_TEST)

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
    -1.0, -1.0, -1,

    // left
    -1, 1, -1,
    -1, 1, 1,
    -1, -1, 1,
    -1, -1, -1,

    // right
    1, 1, -1,
    1, 1, 1,
    1, -1, 1,
    1, -1, -1,

    // top
    -1, 1, -1,
    1, 1, -1,
    1, 1, 1,
    -1, 1, 1,

    // bottom
    -1, -1, -1,
    1, -1, -1,
    1, -1, 1,
    -1, -1, 1,
  ])

  const indexData = new Uint8Array([
    // front face
    0, 1, 2,
    2, 3, 0,

    // back face
    4, 5, 6,
    6, 7, 4,

    // left face
    8, 9, 10,
    10, 11, 8,

    // right face
    12, 13, 14,
    14, 15, 12,

    // top face
    16, 17, 18,
    18, 19, 16,

    // bottom face
    20, 21, 22,
    22, 23, 20,
  ])

  const colorData = [
    [0.0, 0.0, 0.0, 1.0], // Front face: white
    [1.0, 0.0, 0.0, 1.0], // Back face: red
    [0.0, 1.0, 0.0, 1.0], // Top face: green
    [0.0, 0.0, 1.0, 1.0], // Bottom face: blue
    [1.0, 1.0, 0.0, 1.0], // Right face: yellow
    [1.0, 0.0, 1.0, 1.0], // Left face: purple
  ]
  const colorIndexData = []
  for (let i = 0; i < colorData.length; i++) {
    colorIndexData.push(i, i, i, i)
  }

  const indexBuffer = new GLBuffer(gl, gl.ELEMENT_ARRAY_BUFFER, indexData)
  const colorIndexBuffer = new GLBuffer(gl, gl.ARRAY_BUFFER, new Float32Array(colorIndexData))
  gl.vertexAttribPointer(attributeLocations.colorIndex, 1, gl.FLOAT, false, 0, 0)

  const vertexBuffer = new GLBuffer(gl, gl.ARRAY_BUFFER, vertexData)
  gl.vertexAttribPointer(attributeLocations.position, 3, gl.FLOAT, false, 0, 0)

  const modelMatrix = mat4.create()
  const viewMatrix = mat4.create()
  const projectionMatrix = mat4.create()

  mat4.lookAt(
    viewMatrix,
    [0, 10, 10],
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

  colorData.forEach((color, index) => {
    gl.uniform4fv(uniformLocations[`colors[${index}]`], color)
  })

  function frame() {
    mat4.rotateY(modelMatrix, modelMatrix, Math.PI / 180)
    gl.uniformMatrix4fv(uniformLocations.modelMatrix, false, modelMatrix)
    gl.drawElements(gl.TRIANGLES, indexBuffer.data.length, gl.UNSIGNED_BYTE, 0)

    requestAnimationFrame(frame)
  }

  frame()
}

main()

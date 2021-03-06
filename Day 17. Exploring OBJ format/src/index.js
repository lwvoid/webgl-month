import vertexShaderSource from './shader/vertex.glsl'
import fragmentShaderSource from './shader/fragment.glsl'
import GLUtils from './utils/index'
import { GLBuffer } from './utils/GLBuffer'
import { mat4 } from 'gl-matrix'
import CubeObj from './assets/objects/monkey.obj'


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

  const { vertices, indices } = GLUtils.parseObj(CubeObj)

  const colorData = [
    [0.0, 0.0, 0.0, 1.0],
    [1.0, 0.0, 0.0, 1.0],
    [0.0, 1.0, 0.0, 1.0],
    [0.0, 0.0, 1.0, 1.0],
    [1.0, 1.0, 0.0, 1.0],
    [1.0, 0.0, 1.0, 1.0],
  ]
  const colorIndexData = []
  for (let i = 0; i < indices.length / 3; i++) {
    const colorIndex = ~~(Math.random() * colorData.length)
    colorIndexData.push(colorIndex, colorIndex, colorIndex)
  }


  const indexBuffer = new GLBuffer(gl, gl.ELEMENT_ARRAY_BUFFER, indices)
  const colorBuffer = new GLBuffer(gl, gl.ARRAY_BUFFER, new Float32Array(colorIndexData))
  gl.vertexAttribPointer(attributeLocations.colorIndex, 1, gl.FLOAT, false, 0, 0)
  

  const vertexBuffer = new GLBuffer(gl, gl.ARRAY_BUFFER, vertices)
  gl.vertexAttribPointer(attributeLocations.position, 3, gl.FLOAT, false, 0, 0)

  const modelMatrix = mat4.create()
  const viewMatrix = mat4.create()
  const projectionMatrix = mat4.create()

  mat4.lookAt(
    viewMatrix,
    [0, 0, 10],
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
    gl.drawElements(gl.TRIANGLES, indexBuffer.data.length, gl.UNSIGNED_SHORT, 0)

    requestAnimationFrame(frame)
  }

  frame()
}

main()

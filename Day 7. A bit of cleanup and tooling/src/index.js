import vertexShaderSource from './shader/vertex.glsl'
import fragmentShaderSource from './shader/fragment.glsl'
import GLUtils from './utils/index'


const canvas = document.getElementById('canvas')
const gl = canvas.getContext('webgl')

const vertexShader = GLUtils.initShader(gl, gl.VERTEX_SHADER, vertexShaderSource)
const fragmentShader = GLUtils.initShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource)
const program = GLUtils.initProgram(gl, vertexShader, fragmentShader)
gl.useProgram(program)


const resolutionLocation = gl.getUniformLocation(program, 'resolution')
gl.uniform2fv(resolutionLocation, [canvas.width, canvas.height])


const centerX = canvas.width / 2
const centerY = canvas.height / 2
const radius = 100
const segment = 100
const { vertices, indexData } = GLUtils.getPolygenElements(centerX, centerY, radius, segment)


const indexBuffer = gl.createBuffer(gl.ELEMENT_ARRAY_BUFFER)
gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer)
gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indexData, gl.STATIC_DRAW)

const buffer = gl.createBuffer(gl.ARRAY_BUFFER)
gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW)

const positionLocation = gl.getAttribLocation(program, 'position')
gl.enableVertexAttribArray(positionLocation)
gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0)


gl.drawElements(gl.TRIANGLES, indexData.length, gl.UNSIGNED_BYTE, 0)
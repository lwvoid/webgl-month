
export default {
  initShader (gl, shaderType, source) {
    const shader = gl.createShader(shaderType)
    gl.shaderSource(shader, source)
    gl.compileShader(shader)

    const log = gl.getShaderInfoLog(shader)
    if (log) {
      throw new Error(log)
    }
    return shader
  },


  initProgram (gl, vertexShader, fragmentShader) {
    const program = gl.createProgram()
    gl.attachShader(program, vertexShader)
    gl.attachShader(program, fragmentShader)
    gl.linkProgram(program)

    const log = gl.getProgramInfoLog(program)
    if (log) {
      throw new Error(log)
    }

    return program
  },


  getPolygenElements (x, y, radius, segment) {
    const vertices = []
    const indexData = []

    vertices.push(x, y)

    for (let i = 1; i <= segment; i++) {
      const angle = i / segment * Math.PI * 2
      const currX = x + Math.sin(angle) * radius
      const currY = y + Math.cos(angle) * radius

      vertices.push(currX, currY)

      if (i == 1) {
        indexData.push(0, 1, segment)
      } else {
        indexData.push(0, i - 1, i)
      }
    }

    return {
      vertices: new Float32Array(vertices),
      indexData: new Uint8Array(indexData),
    }
  }
}
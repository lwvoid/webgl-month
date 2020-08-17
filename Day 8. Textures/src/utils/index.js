
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


  getRectangleElement (x, y, width, height) {
    const vertices = [
      x, y,
      x + width, y,
      x + width, y + height,
      x, y + height,
    ]
    const indexData = [
      0, 1, 2,
      2, 3, 0,
    ]
    return {
      vertices: new Float32Array(vertices),
      indexData: new Uint8Array(indexData),
    }
  },


  loadImage (src) {
    return new Promise((resolve, reject) => {
      const image = new Image()

      image.onload = () => {
        resolve(image)
      }

      image.onerror = (err) => {
        reject(err, image)
      }

      image.src = src
    })
  }
}
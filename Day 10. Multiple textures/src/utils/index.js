
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


  async initTexture(gl, src) {
    const image = await this.loadImage(src)

    const texture = gl.createTexture()
    gl.bindTexture(gl.TEXTURE_2D, texture)

    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR)

    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image)

    return texture
  },



  getRectangle (x, y, width, height) {
    const vertices = [
      x, y,
      x + width, y,
      x + width, y + height,
      x, y + height,
    ]
    return vertices
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
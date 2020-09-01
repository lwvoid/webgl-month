
export default {
  initContext(id = 'canvas') {
    const canvas = document.getElementById(id)
    const gl = canvas.getContext('webgl')

    const onResize = () => {
      const width = window.innerWidth * window.devicePixelRatio
      const height = window.innerHeight * window.devicePixelRatio
      canvas.width = width
      canvas.height = height
      canvas.style.width = `${window.innerWidth}px`
      canvas.style.height = `${window.innerHeight}px`
  
      gl.viewport(0, 0, canvas.width, canvas.height)
    }

    onResize()
    window.addEventListener('resize', onResize)

    return { gl, canvas }
  },


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



  getRectangle (x, y, R, angle) {
    const PI_4 = Math.PI / 4
    const x1 = x + R * Math.sin(angle + PI_4)
    const y1 = y + R * Math.cos(angle + PI_4)

    const x2 = x + R * Math.sin(angle + PI_4 * 3)
    const y2 = y + R * Math.cos(angle + PI_4 * 3)

    const x3 = x + R * Math.sin(angle + PI_4 * 5)
    const y3 = y + R * Math.cos(angle + PI_4 * 5)

    const x4 = x + R * Math.sin(angle + PI_4 * 7)
    const y4 = y + R * Math.cos(angle + PI_4 * 7)

    const vertices = [
      x1, y1,
      x2, y2,
      x3, y3,
      x4, y4,
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
  },


  extract(source) {
    const attributeRegexp = /attribute\s+.*?\s+([0-9a-zA-Z_]*)?(\[\d+\])?;/g
    const uniformRegexp = /uniform\s+.*?\s+([0-9a-zA-Z_]*)?(\[\d+\])?;/g
  
    let attributeResult = null
    const attributes = []
    while ((attributeResult = attributeRegexp.exec(source)) != null) {
      const [_, name, arr] = attributeResult
      if (arr) {
        const number = arr.replace(/[\[\]]/g, arr)
        for (let i = 0; i < number; i++) {
          attributes.push(`${name}[${i}]`)
        }
      } else {
        attributes.push(name)
      }
    }
  
    let uniformResult = null
    const uniforms = []
    while ((uniformResult = uniformRegexp.exec(source)) != null) {
      const [_, name, arr] = uniformResult
      if (arr) {
        const number = arr.replace(/[\[\]]/g, '')
        for (let i = 0; i < number; i++) {
          uniforms.push(`${name}[${i}]`)
        }
      } else {
        uniforms.push(name)
      }
    }
  
    return {
      attributes,
      uniforms
    }
  },


  getLocation(gl, program, vertexShaderSource, fragmentShaderSource) {
    const vertexShaderInfo = this.extract(vertexShaderSource)
    const fragmentShaderInfo = this.extract(fragmentShaderSource)

    const attributes = vertexShaderInfo.attributes
    const uniforms = [
      ...vertexShaderInfo.uniforms,
      ...fragmentShaderInfo.uniforms,
    ]

    const attributeLocations = attributes.reduce((attrMap, attrName) => {
      attrMap[attrName] = gl.getAttribLocation(program, attrName)
      gl.enableVertexAttribArray(attrMap[attrName])
      return attrMap
    }, {})

    const uniformLocations = uniforms.reduce((uniformMap, uniformName) => {
      uniformMap[uniformName] = gl.getUniformLocation(program, uniformName)
      return uniformMap
    }, {})

    return {
      attributeLocations,
      uniformLocations,
    }
  },


  parseObj(objSource) {
    const parseVertex = (line) => {
      return line.replace('v ', '').split(' ').map(Number)
    }

    const parseFace = (line) => {
     return line.replace('f ', '').split(' ').map(chunk => {
        return chunk.split('/').map(Number)
      })
    }

    const parseNormal = (line) => {
      return line.replace('vn ', '').split(' ').map(Number)
    }

    const objVertices = []
    const objNormals = []
    const objVertexIndices = []
    const objNormalIndices = []

    objSource.split('\n').forEach(line => {
      if (line.startsWith('v ')) {
        objVertices.push(parseVertex(line))
      }

      if (line.startsWith('vn ')) {
        objNormals.push(parseNormal(line))
      }

      if (line.startsWith('f ')) {
        const objFace = parseFace(line)
        objVertexIndices.push(...objFace.map(face => face[0] - 1))
        objNormalIndices.push(...objFace.map(face => face[2] - 1))
      }
    })

    const vertices = []
    const normals = []
    for (let i = 0; i < objVertexIndices.length; i++) {
      const vertexIndex = objVertexIndices[i]
      const normalIndex = objNormalIndices[i]

      const vertex = objVertices[vertexIndex]
      const normal = objNormals[normalIndex]

      vertices.push(...vertex)
      normals.push(...normal)
    }


    return {
      vertices: new Float32Array(vertices),
      normals: new Float32Array(normals), 
    }
  }
}
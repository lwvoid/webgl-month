export class GLBuffer {
  constructor(gl, target, data, usage) {
    this.target = target
    this.data = data
    this.glBuffer = gl.createBuffer(target)

    if (data) {
      this.setData(gl, data, usage)
    }
  }

  bind(gl) {
    gl.bindBuffer(this.target, this.glBuffer)
  }

  setData(gl, data, usage) {
    this.data = data
    this.bind(gl)
    gl.bufferData(this.target, this.data, usage || gl.STATIC_DRAW)
  }
}
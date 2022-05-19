/**
 * Initializes the frame buffer object
 * @param {WebGLRenderingContext} gl
 * @param {Array<{attachmentPoint: number, texture: WebGLTexture2D}>} attachments
 * @param {Array<{attachmentPoint: number, format: number}>} renderBuffers
 * @private
 */
const initFBO = (gl, attachments, renderBuffers) => {
  const fbo = gl.createFramebuffer();
  gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);
  attachments.forEach((object) => {
    gl.framebufferTexture2D(
      gl.FRAMEBUFFER,
      object.attachmentPoint,
      gl.TEXTURE_2D,
      object.texture.texture,
      0,
    );
  });
  const renderBufferObjects = renderBuffers.map((object) => {
    const renderbuffer = gl.createRenderbuffer();
    gl.bindRenderbuffer(gl.RENDERBUFFER, renderbuffer);
    gl.renderbufferStorage(gl.RENDERBUFFER, object.format, 1, 1);
    gl.framebufferRenderbuffer(
      gl.FRAMEBUFFER,
      object.attachmentPoint,
      gl.RENDERBUFFER,
      renderbuffer,
    );
    return { buffer: renderbuffer, ...object };
  });
  return { fbo, renderBufferObjects };
};

/**
 * Abstraction over frame buffer object.
 */
export default class WebGLFbo {
  /**
   * Initializes a webgl frame buffer object.
   * @param {WebGLRenderingContext} gl The gl context to create the framebuffer for.
   * @param {number} width The dimension used for the texture.
   * @param {number} height The dimension used for the texture.
   * @param {Array<{attachmentPoint: number, texture: WebGLTexture2D}>} attachmentsThe
   *  list of attachments with points.
   * @param {Array<{attachmentPoint: number, format: number}>} renderBuffers
   *  Indicates which attachmentpoints should use a renderbuffer.
   */
  constructor(gl, width, height, attachments, renderBuffers = []) {
    this.gl = gl;
    this.attachments = attachments;
    const { fbo, renderBufferObjects } = initFBO(
      this.gl,
      attachments,
      renderBuffers,
    );
    this.fbo = fbo;
    this.renderbufferObjects = renderBufferObjects;
    this.gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    this.setSize(width, height);
  }

  /**
   * Sets the size of the frame buffer.
   * @param {number} width The dimension used for the texture.
   * @param {number} height The dimension used for the texture.
   */
  setSize(width, height) {
    this.width = width;
    this.height = height;
    this.attachments.forEach((object) => {
      object.texture.uploadData(width, height, undefined);
    });
    this.renderbufferObjects.forEach((renderbuffer) => {
      this.gl.bindRenderbuffer(this.gl.RENDERBUFFER, renderbuffer.buffer);
      this.gl.renderbufferStorage(this.gl.RENDERBUFFER, renderbuffer.format, width, height);
    });
  }

  /**
   * Starts the render pass to this frame buffer.
   */
  renderTo() {
    this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, this.fbo);
    this.gl.viewport(0, 0, this.width, this.height);
  }

  /**
   * Disposes of any held WebGL resources.
   * Is not responsible for the attachment array since they were not created by this object.
   */
  dispose() {
    this.gl.deleteFramebuffer(this.fbo);
    this.renderbufferObjects.forEach((object) => {
      this.gl.deleteRenderbuffer(object.buffer);
    });
  }
}

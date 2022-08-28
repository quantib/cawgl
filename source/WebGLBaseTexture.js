/**
 * Provides an abstraction over the base WebGL texture calls.
 */
export default class WebGLBaseTexture {
  /**
   * Prepares a base texture to be used in child classes.
   * @param {WebGL2RenderingContext} gl Context to create the texture on.
   * @param {GLenum} target The target of the texture, has to be one of TEXTURE_2D, etc.
   * @param {GLenum} internalFormat The internal format of the texture, has to be one of RGBA8, etc
   * @param {GLenum} format The format of the texture, has to be one of RGB, etc
   * @param {GLenum} type The type of data stored in the texture has to be one of UNSIGNED_BYTE, etc
   */
  constructor(gl, target, internalFormat, format, type) {
    this.gl = gl;
    this.internalFormat = internalFormat;
    this.format = format;
    this.type = type;
    this.target = target;
    this.texture = gl.createTexture();
  }

  /**
   * Binds this texture to a sampling unit
   * @param {number} unit the number of the unit to bind to
   */
  bind(unit = 0) {
    this.gl.activeTexture(this.gl.TEXTURE0 + unit);
    this.gl.bindTexture(this.target, this.texture);
  }

  /**
   * Sets the minification and the maximization filter parameter of this texture
   * @param {GLenum} minFilter the minification filter
   * @param {GLenum} magFilter the magnification filter
   */
  setFilter(minFilter, magFilter = minFilter) {
    this.bind();
    this.gl.texParameteri(this.target, this.gl.TEXTURE_MIN_FILTER, minFilter);
    this.gl.texParameteri(this.target, this.gl.TEXTURE_MAG_FILTER, magFilter);
  }

  /**
   * Sets the wrap mode of this texture to repeat
   */
  setWrapModeToRepeat() {
    this.setWrap(this.gl.REPEAT);
  }

  /**
   * Sets the wrap mode of this texture to clamped to edge
   */
  setWrapModeToClamp() {
    this.setWrap(this.gl.CLAMP_TO_EDGE);
  }

  /**
   * Sets the wrap mode of this texture to mirrored repeat
   */
  setWrapModeToMirror() {
    this.setWrap(this.gl.MIRRORED_REPEAT);
  }

  /**
   * Sets the wrap mode of this texture to the given wrap parameter
   * @param {GLenum} wrap The type of wrapping to use
   */
  setWrap(wrap) {
    this.gl.texParameteri(this.target, this.gl.TEXTURE_WRAP_S, wrap);
    this.gl.texParameteri(this.target, this.gl.TEXTURE_WRAP_T, wrap);
    if (this.gl.TEXTURE_WRAP_R) this.gl.texParameteri(this.target, this.gl.TEXTURE_WRAP_R, wrap);
  }

  /**
   * Deletes the texture from the WebGL context
   */
  dispose() {
    this.gl.deleteTexture(this.texture);
  }
}

/**
 * Polyfills WebGL 2 functionality using extensions.
 *  - DrawElementsInstanced
 *  - VertexArrays
 *  - Uint index support
 * These extensions have a higher then 95% adoption rate.
 * If you have a platform/device which does not support these extensions
 * CAWGL's VertexLayout classes cannot be used.
 * You should at the time of writing prefer to target WebGL2 but if you want
 * the convenience of some functionality or your platform does not support WebGL2
 * it can be polyfilled using extensions.
 * @param {WebGLRenderingContext} gl The context to polyfill.
 * @returns {WebGLRenderingContext} WebGLRenderingContext with some WebGL2 functionality
 */
var polyFillWebGL = (gl) => {
  const polyFilledGL = gl;
  // Poly fill vertex array object VAO
  const vertexArrayObjectExtension = polyFilledGL.getExtension('OES_vertex_array_object');
  polyFilledGL.createVertexArray = () => vertexArrayObjectExtension.createVertexArrayOES();
  polyFilledGL.deleteVertexArray = (id) => vertexArrayObjectExtension.deleteVertexArrayOES(id);
  polyFilledGL.bindVertexArray = (id) => vertexArrayObjectExtension.bindVertexArrayOES(id);
  polyFilledGL.isVertexArray = (id) => vertexArrayObjectExtension.isVertexArrayOES(id);
  polyFilledGL.VERTEX_ARRAY_BINDING = vertexArrayObjectExtension.VERTEX_ARRAY_BINDING_OES;

  // Enable instanced drawing
  const instancedDrawing = polyFilledGL.getExtension('ANGLE_instanced_arrays');
  polyFilledGL.vertexAttribDivisor = (
    index,
    divisor,
  ) => instancedDrawing.vertexAttribDivisorANGLE(index, divisor);
  polyFilledGL.drawElementsInstanced = (
    mode,
    count,
    type,
    offset,
    primcount,
  ) => instancedDrawing.drawElementsInstancedANGLE(mode, count, type, offset, primcount);
  polyFilledGL.drawArraysInstanced = (
    mode,
    first,
    count,
    primcount,
  ) => instancedDrawing.drawArraysInstancedANGLE(mode, first, count, primcount);

  // Enable unsigned integer support as index
  polyFilledGL.getExtension('OES_element_index_uint');

  return gl;
};

/**
 * generates a compiled shader.
 * @throws Error on failed compilation
 * @param {WebGL2RenderingContext} gl The context to create the shader on.
 * @param {string} code The shader code.
 * @param {GLenum} type The type to compile for gl.VERTEX_SHADER or gl.FRAGMENT_SHADER.
 * @returns {program} GL shader object.
 * @private
 */
const createAndCompileShader = (gl, code, type) => {
  const shader = gl.createShader(type);
  gl.shaderSource(shader, code);
  gl.compileShader(shader);

  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    throw new Error(`Could not compile program because: ${gl.getShaderInfoLog(shader)}`);
  }
  return shader;
};

/**
 * maps an uniform type to the correct setter
 * @param {WebGL2RenderingContext} gl The context to set the uniform value for.
 * @param {GLenum} type The uniform type.
 * @param {GLint} location The uniform location.
 * @returns {*} Callback function to set the data.
 * @private
 */
const getSetterForType = (gl, type, location) => {
  switch (type) {
    case gl.FLOAT_VEC4:
      return (value) => { gl.uniform4fv(location, value); };
    case gl.FLOAT_VEC3:
      return (value) => { gl.uniform3fv(location, value); };
    case gl.FLOAT_VEC2:
      return (value) => { gl.uniform2fv(location, value); };
    case gl.FLOAT:
      return (value) => { gl.uniform1f(location, value); };
    case gl.BOOL:
    case gl.INT:
      return (value) => { gl.uniform1i(location, value); };
    case gl.BOOL_VEC2:
    case gl.INT_VEC2:
      return (value) => { gl.uniform2iv(location, value); };
    case gl.BOOL_VEC3:
    case gl.INT_VEC3:
      return (value) => { gl.uniform3iv(location, value); };
    case gl.BOOL_VEC4:
    case gl.INT_VEC4:
      return (value) => { gl.uniform4iv(location, value); };
    case gl.FLOAT_MAT2:
      return (value) => { gl.uniformMatrix2fv(location, false, value); };
    case gl.FLOAT_MAT2x3:
      return (value) => { gl.uniformMatrix2x3fv(location, false, value); };
    case gl.FLOAT_MAT2x4:
      return (value) => { gl.uniformMatrix2x4fv(location, false, value); };
    case gl.FLOAT_MAT3:
      return (value) => { gl.uniformMatrix3fv(location, false, value); };
    case gl.FLOAT_MAT3x2:
      return (value) => { gl.uniformMatrix3x2fv(location, false, value); };
    case gl.FLOAT_MAT3x4:
      return (value) => { gl.uniformMatrix3x4fv(location, false, value); };
    case gl.FLOAT_MAT4:
      return (value) => { gl.uniformMatrix4fv(location, false, value); };
    case gl.FLOAT_MAT4x2:
      return (value) => { gl.uniformMatrix4x2fv(location, false, value); };
    case gl.FLOAT_MAT4x3:
      return (value) => { gl.uniformMatrix4x3fv(location, false, value); };
    case gl.INT_SAMPLER_2D_ARRAY:
    case gl.INT_SAMPLER_2D:
    case gl.INT_SAMPLER_3D:
    case gl.UNSIGNED_INT_SAMPLER_2D:
    case gl.UNSIGNED_INT_SAMPLER_3D:
    case gl.UNSIGNED_INT_SAMPLER_2D_ARRAY:
    case gl.UNSIGNED_INT_SAMPLER_CUBE:
    case gl.SAMPLER_2D:
    case gl.SAMPLER_3D:
    case gl.SAMPLER_CUBE:
    case gl.SAMPLER_2D_ARRAY:
      return (value, unit = 0) => {
        gl.uniform1i(location, unit);
        if (value.bind) value.bind(unit);
      };
    default:
      throw new Error(`Unknown uniform type.${type}`);
  }
};

/**
 * generates uniform setters for a shader
 * @param {WebGL2RenderingContext} gl Context to use.
 * @param {*} program The program to get the active uniforms from.
 * @returns {*} Dictionary object with setters for all active uniforms.
 * @private
 */
const generateUniformSetters = (gl, program) => {
  const uniforms = {};

  const numberOfUniforms = gl.getProgramParameter(program, gl.ACTIVE_UNIFORMS);
  for (let i = 0; i < numberOfUniforms; i += 1) {
    const information = gl.getActiveUniform(program, i);
    uniforms[information.name] = getSetterForType(
      gl,
      information.type,
      gl.getUniformLocation(program, information.name),
    );
  }
  return uniforms;
};

/**
 * Private function which finds the location of all active attributes.
 * @param {WebGL2RenderingContext} gl The context to get the attributes from.
 * @param {*} program The WebGL shader to get the attributes from.
 * @returns {*} Dictionary object with the locations.
 * @private
 */
const getActiveAttributeBindings = (gl, program) => {
  const attributes = {};

  const numberOfAttributes = gl.getProgramParameter(program, gl.ACTIVE_ATTRIBUTES);
  for (let i = 0; i < numberOfAttributes; i += 1) {
    const information = gl.getActiveAttrib(program, i);
    attributes[information.name] = gl.getAttribLocation(program, information.name);
  }

  return attributes;
};

/**
 * Provides an abstraction over the gl program calls.
 */
class WebGLShader {
  /**
   * Lazy initializes a WebGLShader.
   * @param {WebGL2RenderingContext} gl The context on which to create the shader.
   * @param {string} vertexShaderCode The vertex shader code.
   * @param {string} fragmentShaderCode The fragment shader code.
   * @param {Array<{location: number, name: string}>} attributeBindingHints
   *  Optional hint for requesting attribute location.
   */
  constructor(gl, vertexShaderCode, fragmentShaderCode, attributeBindingHints = []) {
    this.gl = gl;
    this.vertexShaderCode = vertexShaderCode;
    this.fragmentShaderCode = fragmentShaderCode;
    this.attributeBindings = {};
    this.attributeBindingHints = attributeBindingHints;
    this.uniforms = {};
    this.program = gl.createProgram();
  }

  /**
   * Compiles the shader source specified earlier.
   * Gathers uniforms and attributes and saves them in their respective attributes.
   * @throws Error if compilation was unsuccessful.
   */
  compile() {
    const vertexShader = createAndCompileShader(
      this.gl,
      this.vertexShaderCode,
      this.gl.VERTEX_SHADER,
    );
    const fragmentShader = createAndCompileShader(
      this.gl,
      this.fragmentShaderCode,
      this.gl.FRAGMENT_SHADER,
    );

    this.gl.attachShader(this.program, vertexShader);
    this.gl.attachShader(this.program, fragmentShader);

    this.attributeBindingHints.forEach((info) => {
      this.gl.bindAttribLocation(this.program, info.location, info.name);
    });

    this.gl.linkProgram(this.program);

    // After linking, the shader object is not needed anymore so we delete it to save GPU memory.
    this.gl.detachShader(this.program, vertexShader);
    this.gl.detachShader(this.program, fragmentShader);
    this.gl.deleteShader(vertexShader);
    this.gl.deleteShader(fragmentShader);
    if (!this.gl.getProgramParameter(this.program, this.gl.LINK_STATUS)) {
      throw new Error(`Error linking program: ${this.gl.getProgramInfoLog(this.program)}`);
    }

    this.uniforms = generateUniformSetters(this.gl, this.program);
    this.attributeBindings = getActiveAttributeBindings(this.gl, this.program);
  }

  /**
   * Binds this shader for use on the WebGL context.
   */
  bind() {
    this.gl.useProgram(this.program);
  }

  /**
   * Deletes the shader from the WebGL context.
   */
  dispose() {
    this.gl.deleteProgram(this.program);
  }
}

/**
 * Provides an abstraction over the base WebGL texture calls.
 */
class WebGLBaseTexture {
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
    this.gl.texParameteri(this.target, this.gl.TEXTURE_WRAP_R, wrap);
  }

  /**
   * Deletes the texture from the WebGL context
   */
  dispose() {
    this.gl.deleteTexture(this.texture);
  }
}

/**
 * Extension of the base texture; provides abstraction over the 2D based texture calls.
 */
class WebGLTexture2D extends WebGLBaseTexture {
  /**
   * Prepares a base texture with 2D support.
   * @param {WebGL2RenderingContext} gl
   *  The context to create the texture on.
   * @param {GLenum} internalFormat
   *  The internal format of the texture used has to be one of RGBA8 ...
   * @param {GLenum} format
   *  The format of the texture, has to be one of RGB, RGBA...
   * @param {GLenum} type
   *  The type of data stored, has to be one of UNSIGNED_BYTE...
   */
  constructor(gl, internalFormat, format, type) {
    super(gl, gl.TEXTURE_2D, internalFormat, format, type);
    this.width = 0;
    this.height = 0;
  }

  /**
   * Uploads the texture to the WebGL context.
   * @param {CanvasImageSource} image the source of the image.
   */
  uploadImage(image) {
    this.bind();
    this.width = image.width;
    this.height = image.height;
    this.gl.texImage2D(
      this.target,
      0,
      this.internalFormat,
      this.format,
      this.type,
      image,
    );
  }

  /**
   * Uploads data array as 2D texture to the WebGL context.
   * @param {number} width The width for the texture.
   * @param {number} height The height for the texture.
   * @param {TypedArray} data The data array to be uploaded.
   */
  uploadData(width, height, data) {
    this.width = width;
    this.height = height;
    this.bind();
    this.gl.texImage2D(
      this.target,
      0,
      this.internalFormat,
      width,
      height,
      0,
      this.format,
      this.type,
      data,
    );
  }

  /**
   * Uploads to a part of the texture with another image.
   * @param {number} x Offset on the x-axis
   * @param {number} y Offset on the y-axis
   * @param {CanvasImageSource} image the image to place in the other one
   */
  subUploadImage(x, y, image) {
    const subRegionWidth = image.width;
    const subRegionHeight = image.height;
    if (subRegionWidth + x > this.width || subRegionHeight + y > this.height) {
      throw new Error('Given offset and image dimensions are not within texture bounds.');
    }
    this.gl.texSubImage2D(
      this.target,
      0,
      x,
      y,
      image.width,
      image.height,
      this.format,
      this.type,
      image,
    );
  }

  /**
   * Uploads to a part of the texture with typed array.
   * @param {number} x Offset on the x-axis
   * @param {number} y Offset on the y-axis
   * @param {TypedArray} data The data to upload
   * @param {number} width The width of the data.
   * @param {number} height The height of the data
   */
  subUploadData(x, y, data, width, height) {
    if (width + x > this.width || height + y > this.height) {
      throw new Error('Given offset and image dimensions are not within texture bounds.');
    }
    this.gl.texSubImage2D(this.target, 0, x, y, width, height, this.format, this.type, data);
  }
}

/**
 * Provides a wrapper over the WebGL buffer calls
 */
class WebGLBuffer {
  /**
   * Initializes the buffer but does not buffer any data to the handle yet.
   * @param {WebGL2RenderingContext} gl The context on which to create the buffer.
   * @param {GLenum} usage The usage parameter of this webgl buffer.
   */
  constructor(gl, usage) {
    this.gl = gl;
    this.buffer = gl.createBuffer();
    this.usage = usage;
    this.size = 0;
  }

  /**
   * Binds this buffer as the active one in the stored WebGLContext.
   */
  bind() {
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.buffer);
  }

  /**
   * Allocates space in the WebGL driver for a buffer with the size of
   * the typed array and copies the data to the WebGL buffer.
   * @param {ArrayBuffer} data the data used to fill the buffer
   */
  bufferData(data) {
    this.bind();
    this.gl.bufferData(this.gl.ARRAY_BUFFER, data, this.usage);
    this.size = data.byteLength;
  }

  /**
   * Buffers sub data in the previously allocated buffer.
   * @param {number} destinationOffset The offset in the destination buffer; in bytes.
   * @param {ArrayBuffer} data The data to buffer.
   * @param {number} sourceOffset The offset in the source where the copy starts; in array elements.
   * @param {number} length The length of the data we want to buffer; in array elements.
   */
  bufferSubData(destinationOffset, data, sourceOffset = 0, length = data.length - sourceOffset) {
    if (destinationOffset + length * data.BYTES_PER_ELEMENT > this.size) {
      throw new Error('cant copy data to beyond buffer boundary');
    }

    this.bind();
    this.gl.bufferSubData(
      this.gl.ARRAY_BUFFER,
      destinationOffset,
      data,
      sourceOffset,
      length,
    );
  }

  /**
   * Deletes the buffer from the WebGL context.
   */
  dispose() {
    this.gl.deleteBuffer(this.buffer);
  }
}

/**
 * Private function to find the size in bytes for the given supported type.
 * @param {GLenum} type The type to find the amount of bytes for.
 * @returns {number} Size in bytes.
 * @private
 */
const getSizeForGLType = (type) => {
  switch (type) {
    // BYTE
    // UNSIGNED_BYTE
    case WebGL2RenderingContext.BYTE:
    case WebGL2RenderingContext.UNSIGNED_BYTE:
      return 1;
    // SHORT
    // UNSIGNED_SHORT
    case WebGL2RenderingContext.SHORT:
    case WebGL2RenderingContext.UNSIGNED_SHORT:
      return 2;
    // FLOAT
    case WebGL2RenderingContext.FLOAT:
      return 4;
    default:
      return 0.1;
  }
};

/**
 * Data class for VAO buffer descriptions
 */
class WebGLBufferDescriptor {
  /**
   * Creates an object which represents a vertex attrib pointer.
   * @param {number} location The shader location this buffer needs to be bound to.
   * @param {WebGLBuffer} buffer Buffer where the descriptor gets its values from
   * @param {number} size The amount of components, can be 1 - 4.
   * @param {GLenum} type A GLEnum describing the type used.
   * @param {number} offset The offset in the buffer; in bytes.
   * @param {number} stride Stride used for indexing the buffer; in bytes.
   * @param {boolean} normalize Defines if the values have to be normalized.
   * @param {number} divisor The divisor used for instanced drawing.
   */
  constructor(
    location,
    buffer,
    size,
    type,
    offset = 0,
    stride = 0,
    normalize = false,
    divisor = 0,
  ) {
    if (stride < 0 || stride > 255) throw new Error('Stride has to be between 0 - 255');
    if (offset % getSizeForGLType(type) > 0) throw new Error('Offset has to be a multiple of the type size or 0');

    this.location = location;
    this.buffer = buffer.buffer;
    this.size = size;
    this.type = type;
    this.normalize = normalize;
    this.stride = stride;
    this.offset = offset;
    this.divisor = divisor;
  }
}

/**
 * Private function to specify and allocate the storage needed for the texture array.
 * This allows us to get storage without using a gl.texture3D call
 * @param {WebGL2RenderingContext} gl The context to allocate the storage on
 * @param {*} texture The texture to allocate space for
 * @param {GLenum} format The format of the texture, has to be one of RGB, RGBA...
 * @param {number} width The width of the texture
 * @param {number} height The height of the texture
 * @param {number} depth The number of images in the texture
 * @private
 */
const allocateTexStorage3D$1 = (gl, texture, format, width, height, depth) => {
  gl.bindTexture(gl.TEXTURE_2D_ARRAY, texture);
  gl.texStorage3D(gl.TEXTURE_2D_ARRAY, 1, format, width, height, depth);
  if (gl.getError()) throw new Error('Could not allocate texture space');
};

/**
 * Provides an abstraction over the base WebGL 2D texture array calls.
 */
class WebGLTexture2DArray extends WebGLBaseTexture {
  /**
   * Prepares a base texture with 2D texture array support.
   * Allocates space for the texture immediately and is immutable afterwards,
   * so all layers have to be the same width and height.
   * @param {WebGL2RenderingContext} gl
   *  The context to create the texture on.
   * @param {GLenum} internalFormat
   *  The internal format of the texture used has to be one of RGBA8 ...
   * @param {GLenum} format
   *  The format of the texture, has to be one of RGB, RGBA...
   * @param {GLenum} type
   *  The type of data stored, has to be one of UNSIGNED_BYTE...
   * @param {number} width
   *  Width of the images which are gonna be stored.
   * @param {number} height
   *  Height of the images which are gonna be stored.
   * @param {number} images
   *  Number of images to be stored.
   */
  constructor(gl, internalFormat, format, type, width, height, images) {
    super(gl, gl.TEXTURE_2D_ARRAY, internalFormat, format, type);
    this.width = width;
    this.height = height;
    this.images = images;
    allocateTexStorage3D$1(
      this.gl,
      this.texture,
      this.internalFormat,
      this.width,
      this.height,
      this.images,
    );
  }

  /**
   * Uploads a layer to the 2D texture array.
   * @param {CanvasImageSource} image The image to upload.
   * @param {number} layer The Layer on which to upload the image.
   * @param {number} x The x-offset into the target texture
   * @param {number} y The y-offset into the target texture
   */
  uploadImage(image, layer, x = 0, y = 0) {
    const { width, height } = image;
    const startsOutOfBounds = x < 0 || y < 0;
    const goesOutOfBounds = x + width > this.width || y + height > this.height;

    if (startsOutOfBounds || goesOutOfBounds) {
      throw new Error('Given offset and image dimensions are not within texture bounds.');
    }
    this.bind();
    this.gl.texSubImage3D(
      this.target,
      0,
      x,
      y,
      layer,
      image.width,
      image.height,
      1,
      this.format,
      this.type,
      image,
    );
  }

  /**
   * Uploads a typed array as an image to the 2D texture array.
   * @param {TypedArray} data The typed array to upload to the texture.
   * @param {number} width The width of the data array.
   * @param {number} height The height of the data array.
   * @param {number} layer The layer on which to upload to the 2D texture array.
   * @param {number} x The x-offset into the target texture
   * @param {number} y The y-offset into the target texture
   */
  uploadData(data, width, height, layer, x = 0, y = 0) {
    const startsOutOfBounds = x < 0 || y < 0;
    const goesOutOfBounds = x + width > this.width || y + height > this.height;

    if (startsOutOfBounds || goesOutOfBounds) {
      throw new Error('Given offset and image dimensions are not within texture bounds.');
    }
    this.bind();
    this.gl.texSubImage3D(
      this.target,
      0,
      x,
      y,
      layer,
      width,
      height,
      1,
      this.format,
      this.type,
      data,
      0,
    );
  }
}

/**
 * Private function to declare the storage for the needed texture array.
 * This allows us to get storage without using a gl.texture3D call
 * @param {WebGL2RenderingContext} gl The context to allocate the storage on.
 * @param {*} texture The texture to allocate space for.
 * @param {GLenum} format The format of the texture, has to be one of RGB, RGBA...
 * @param {number} width The width of the texture.
 * @param {number} height The height of the texture.
 * @param {number} depth The depth of the texture.
 * @private
 */
const allocateTexStorage3D = (gl, texture, format, width, height, depth) => {
  gl.bindTexture(gl.TEXTURE_3D, texture);
  gl.texStorage3D(gl.TEXTURE_3D, 1, format, width, height, depth);
  if (gl.getError()) throw new Error('Could not allocate texture space');
};

/**
 * Provides an abstraction over the base WebGL 3D texture.
 */
class WebGLTexture3D extends WebGLBaseTexture {
  /**
   * Prepares a base texture with 3D texture support.
   * @param {WebGL2RenderingContext} gl
   *  The context to create the texture on.
   * @param {GLenum} internalFormat
   *  The internal format of the texture used has to be one of RGBA8 ...
   * @param {GLenum} format
   *  The format of the texture, has to be one of RGB, RGBA...
   * @param {GLenum} type
   *  The type of data stored, has to be one of UNSIGNED_BYTE...
   * @param {number} width
   *  The width of the 3D texture.
   * @param {number} height
   *  The height of the 3D texture.
   * @param {number} depth
   *  The depth of the 3D texture.
   */
  constructor(gl, internalFormat, format, type, width, height, depth) {
    super(gl, gl.TEXTURE_3D, internalFormat, format, type);
    this.width = width;
    this.height = height;
    this.depth = depth;
    allocateTexStorage3D(
      this.gl,
      this.texture,
      this.internalFormat,
      this.width,
      this.height,
      this.depth,
    );
  }

  /**
   * Uploads a typed array as part of 3D texture.
   * Has to stay within the bounds of the parameters.
   * @param {TypedArray} data The data to upload.
   * @param {number} width The width of the data array.
   * @param {number} height The height of the data array.
   * @param {number} depth The depth of the data array.
   * @param {number} x The x-offset into the texture.
   * @param {number} y The y-offset into the texture.
   * @param {number} z The z-offset into the texture.
   * @param {number} offset The offset into the data array.
   */
  uploadData(data, width, height, depth, x = 0, y = 0, z = 0, offset = 0) {
    const startsOutOfBounds = x < 0 || y < 0 || z < 0;
    const goesOutOfBounds = x + width > this.width
      || y + height > this.height
      || z + depth > this.depth;

    if (startsOutOfBounds || goesOutOfBounds) {
      throw new Error('Given offset and image dimensions are not within texture bounds.');
    }
    this.bind();
    this.gl.texSubImage3D(
      this.target,
      0,
      x,
      y,
      z,
      width,
      height,
      depth,
      this.format,
      this.type,
      data,
      offset,
    );
  }

  /**
   * Uploads a image as part of the 3D texture.
   * Has to stay within the bounds of the parameters.
   * @param {CanvasImageSource} image The image to upload to the 3D texture
   * @param {number} height The height of the image
   * @param {number} depth The number of layers in the image, layed out in the height
   * @param {number} x The x-offset into the texture.
   * @param {number} y The y-offset into the texture.
   * @param {number} z The z-offset into the texture.
   */
  uploadImage(image, height, depth, x = 0, y = 0, z = 0) {
    const { width } = image;
    const startsOutOfBounds = x < 0 || y < 0 || z < 0;
    const goesOutOfBounds = x + width > this.width
      || y + height > this.height
      || z + depth > this.depth;

    if (startsOutOfBounds || goesOutOfBounds) {
      throw new Error('Given offset and image dimensions are not within texture bounds.');
    }
    this.bind();
    this.gl.texSubImage3D(
      this.target,
      0,
      x,
      y,
      z,
      width,
      height,
      depth,
      this.format,
      this.type,
      image,
    );
  }
}

/**
 * Provides an abstraction over the WebGL calls for setting up a viewport.
 */
class WebGLViewport {
  /**
   * Constructs a viewport for the full screen by default.
   * @param {WebGLRenderingContext} gl The context to use the viewport on.
   * @param {number} x The x-offset in pixels into the drawing buffer.
   * @param {number} y The y-offset in pixels into the drawing buffer.
   * @param {number} width  The width of the viewport; uses <= x + width.
   * @param {number} height The height of the viewport; uses <= x + width.
   */
  constructor(gl, x = 0, y = 0, width = gl.drawingBufferWidth, height = gl.drawingBufferHeight) {
    this.gl = gl;
    this.setBounds(x, y, width, height);
  }

  /**
   * Sets the WebGL state to render to this viewport.
   */
  renderToViewport() {
    const height = this.gl.drawingBufferHeight;
    this.gl.enable(this.gl.SCISSOR_TEST);
    this.gl.viewport(this.left, height - this.top - this.height, this.width, this.height);
    this.gl.scissor(this.left, height - this.top - this.height, this.width, this.height);
  }

  /**
   * Sets the internal parameters used when setting the viewport.
   * @param {number} x The x-offset in pixels into the drawing buffer.
   * @param {number} y The y-offset in pixels into the drawing buffer.
   * @param {number} width The width of the viewport means until pixel.
   * @param {number} height The height of the viewport means until pixel.
   */
  setBounds(x, y, width, height) {
    if (width <= 0 || height <= 0) throw new Error('Width and height have to be larger than 0');
    this.left = x;
    this.top = y;
    this.width = width;
    this.height = height;
  }
}

/**
 * Provides an abstraction over the VAO calls.
 */
class WebGLVertexLayout {
  /**
     * Prepares a VAO object.
     * @param {WebGL2RenderingContext} gl The context on which to create the layout.
     */
  constructor(gl) {
    this.gl = gl;
    this.vao = this.gl.createVertexArray();
  }

  /**
   * Binds the vertex array stored in this class to the webgl context.
   */
  bind() {
    this.gl.bindVertexArray(this.vao);
  }

  /**
   * Binds the stored buffer info to the webgl VAO.
   * This only has to be called once or when the layout changes.
   * @param {Array<WebGLBufferDescriptor>} descriptors Descriptors used to bind buffers in a VAO.
   */
  configureBuffers(descriptors) {
    this.bind();
    descriptors.forEach((buffer) => {
      this.gl.bindBuffer(this.gl.ARRAY_BUFFER, buffer.buffer);
      this.gl.enableVertexAttribArray(buffer.location);
      this.gl.vertexAttribPointer(
        buffer.location,
        buffer.size,
        buffer.type,
        buffer.normalize,
        buffer.stride,
        buffer.offset,
      );
      this.gl.vertexAttribDivisor(buffer.location, buffer.divisor);
    });
  }

  /**
   * Draws the current bound VAO with previously bound buffers.
   * @param {GLenum} mode Must be any of gl.TRIANGLES, gl.LINES, etc.
   * @param {number} offset The offset into the draw list.
   * @param {number} count The amount of buffer items to draw.
   */
  draw(mode, offset, count) {
    this.bind();
    this.gl.drawArrays(mode, offset, count);
  }

  /**
   * Deletes the vertex attrib array, does not delete the used buffers.
   */
  dispose() {
    this.gl.deleteVertexArray(this.vao);
  }
}

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
class WebGLFbo {
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

/**
 * Abstraction over an index buffer in WebGL
 */
class WebGLIndexBuffer {
  /**
     * Creates a Index buffer
     * @param {WebGL2RenderingContext} gl The context to create an index buffer for.
     */
  constructor(gl) {
    this.gl = gl;
    this.buffer = gl.createBuffer();
    this.array = [];
  }

  /**
     * Binds the element array buffer to the context
     */
  bind() {
    this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, this.buffer);
  }

  /**
     * Sets the buffer
     * @param {Uint16Array} buffer The data for the buffer
     */
  setBuffer(buffer) {
    this.bind();
    this.gl.bufferData(this.gl.ELEMENT_ARRAY_BUFFER, buffer, this.gl.STATIC_DRAW);
    this.array = buffer;
  }

  /**
     * Draws with the content of the element buffer
     * @param {GLEnum} mode The mode to render
     * @param {number} offset The offset in the index buffer to draw
     * @param {number} count The amount to draw from the index buffer
     */
  draw(mode, offset, count) {
    this.bind();
    this.gl.drawElements(
      mode,
      count,
      this.gl.UNSIGNED_SHORT,
      offset * this.array.BYTES_PER_ELEMENT,
    );
  }

  /**
     * Draws the contents of the element buffer using instancing.
     * @param {GLEnum} mode The mode to render
     * @param {number} offset The offset into the index buffer
     * @param {number} count The amount of vertices to draw
     * @param {number} instances The amount of instanced to draw
     */
  drawInstanced(mode, offset, count, instances) {
    this.bind();
    this.gl.drawElementsInstanced(
      mode,
      count,
      this.gl.UNSIGNED_SHORT,
      offset * this.array.BYTES_PER_ELEMENT,
      instances,
    );
  }

  /**
     * Deletes the buffer from the WebGL context.
     */
  dispose() {
    this.gl.deleteBuffer(this.buffer);
  }
}

export { WebGLBaseTexture, WebGLBuffer, WebGLBufferDescriptor, WebGLFbo as WebGLFBO, WebGLIndexBuffer, WebGLShader, WebGLTexture2D, WebGLTexture2DArray, WebGLTexture3D, WebGLVertexLayout, WebGLViewport, polyFillWebGL };

'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var _classCallCheck = require('@babel/runtime/helpers/classCallCheck');
var _createClass = require('@babel/runtime/helpers/createClass');
var _inherits = require('@babel/runtime/helpers/inherits');
var _possibleConstructorReturn = require('@babel/runtime/helpers/possibleConstructorReturn');
var _getPrototypeOf = require('@babel/runtime/helpers/getPrototypeOf');
var _defineProperty = require('@babel/runtime/helpers/defineProperty');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var _classCallCheck__default = /*#__PURE__*/_interopDefaultLegacy(_classCallCheck);
var _createClass__default = /*#__PURE__*/_interopDefaultLegacy(_createClass);
var _inherits__default = /*#__PURE__*/_interopDefaultLegacy(_inherits);
var _possibleConstructorReturn__default = /*#__PURE__*/_interopDefaultLegacy(_possibleConstructorReturn);
var _getPrototypeOf__default = /*#__PURE__*/_interopDefaultLegacy(_getPrototypeOf);
var _defineProperty__default = /*#__PURE__*/_interopDefaultLegacy(_defineProperty);

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
var polyFillWebGL = (function (gl) {
  var polyFilledGL = gl; // Poly fill vertex array object VAO

  var vertexArrayObjectExtension = polyFilledGL.getExtension('OES_vertex_array_object');

  polyFilledGL.createVertexArray = function () {
    return vertexArrayObjectExtension.createVertexArrayOES();
  };

  polyFilledGL.deleteVertexArray = function (id) {
    return vertexArrayObjectExtension.deleteVertexArrayOES(id);
  };

  polyFilledGL.bindVertexArray = function (id) {
    return vertexArrayObjectExtension.bindVertexArrayOES(id);
  };

  polyFilledGL.isVertexArray = function (id) {
    return vertexArrayObjectExtension.isVertexArrayOES(id);
  };

  polyFilledGL.VERTEX_ARRAY_BINDING = vertexArrayObjectExtension.VERTEX_ARRAY_BINDING_OES; // Enable instanced drawing

  var instancedDrawing = polyFilledGL.getExtension('ANGLE_instanced_arrays');

  polyFilledGL.vertexAttribDivisor = function (index, divisor) {
    return instancedDrawing.vertexAttribDivisorANGLE(index, divisor);
  };

  polyFilledGL.drawElementsInstanced = function (mode, count, type, offset, primcount) {
    return instancedDrawing.drawElementsInstancedANGLE(mode, count, type, offset, primcount);
  };

  polyFilledGL.drawArraysInstanced = function (mode, first, count, primcount) {
    return instancedDrawing.drawArraysInstancedANGLE(mode, first, count, primcount);
  }; // Enable unsigned integer support as index


  polyFilledGL.getExtension('OES_element_index_uint');
  return gl;
});

/**
 * generates a compiled shader.
 * @throws Error on failed compilation
 * @param {WebGL2RenderingContext} gl The context to create the shader on.
 * @param {string} code The shader code.
 * @param {GLenum} type The type to compile for gl.VERTEX_SHADER or gl.FRAGMENT_SHADER.
 * @returns {program} GL shader object.
 * @private
 */
var createAndCompileShader = function createAndCompileShader(gl, code, type) {
  var shader = gl.createShader(type);
  gl.shaderSource(shader, code);
  gl.compileShader(shader);

  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    throw new Error("Could not compile program because: ".concat(gl.getShaderInfoLog(shader)));
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


var getSetterForType = function getSetterForType(gl, type, location) {
  switch (type) {
    case gl.FLOAT_VEC4:
      return function (value) {
        gl.uniform4fv(location, value);
      };

    case gl.FLOAT_VEC3:
      return function (value) {
        gl.uniform3fv(location, value);
      };

    case gl.FLOAT_VEC2:
      return function (value) {
        gl.uniform2fv(location, value);
      };

    case gl.FLOAT:
      return function (value) {
        gl.uniform1f(location, value);
      };

    case gl.BOOL:
    case gl.INT:
      return function (value) {
        gl.uniform1i(location, value);
      };

    case gl.BOOL_VEC2:
    case gl.INT_VEC2:
      return function (value) {
        gl.uniform2iv(location, value);
      };

    case gl.BOOL_VEC3:
    case gl.INT_VEC3:
      return function (value) {
        gl.uniform3iv(location, value);
      };

    case gl.BOOL_VEC4:
    case gl.INT_VEC4:
      return function (value) {
        gl.uniform4iv(location, value);
      };

    case gl.FLOAT_MAT2:
      return function (value) {
        gl.uniformMatrix2fv(location, false, value);
      };

    case gl.FLOAT_MAT2x3:
      return function (value) {
        gl.uniformMatrix2x3fv(location, false, value);
      };

    case gl.FLOAT_MAT2x4:
      return function (value) {
        gl.uniformMatrix2x4fv(location, false, value);
      };

    case gl.FLOAT_MAT3:
      return function (value) {
        gl.uniformMatrix3fv(location, false, value);
      };

    case gl.FLOAT_MAT3x2:
      return function (value) {
        gl.uniformMatrix3x2fv(location, false, value);
      };

    case gl.FLOAT_MAT3x4:
      return function (value) {
        gl.uniformMatrix3x4fv(location, false, value);
      };

    case gl.FLOAT_MAT4:
      return function (value) {
        gl.uniformMatrix4fv(location, false, value);
      };

    case gl.FLOAT_MAT4x2:
      return function (value) {
        gl.uniformMatrix4x2fv(location, false, value);
      };

    case gl.FLOAT_MAT4x3:
      return function (value) {
        gl.uniformMatrix4x3fv(location, false, value);
      };

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
      return function (value) {
        var unit = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
        gl.uniform1i(location, unit);
        if (value.bind) value.bind(unit);
      };

    default:
      throw new Error("Unknown uniform type.".concat(type));
  }
};
/**
 * generates uniform setters for a shader
 * @param {WebGL2RenderingContext} gl Context to use.
 * @param {*} program The program to get the active uniforms from.
 * @returns {*} Dictionary object with setters for all active uniforms.
 * @private
 */


var generateUniformSetters = function generateUniformSetters(gl, program) {
  var uniforms = {};
  var numberOfUniforms = gl.getProgramParameter(program, gl.ACTIVE_UNIFORMS);

  for (var i = 0; i < numberOfUniforms; i += 1) {
    var information = gl.getActiveUniform(program, i);
    uniforms[information.name] = getSetterForType(gl, information.type, gl.getUniformLocation(program, information.name));
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


var getActiveAttributeBindings = function getActiveAttributeBindings(gl, program) {
  var attributes = {};
  var numberOfAttributes = gl.getProgramParameter(program, gl.ACTIVE_ATTRIBUTES);

  for (var i = 0; i < numberOfAttributes; i += 1) {
    var information = gl.getActiveAttrib(program, i);
    attributes[information.name] = gl.getAttribLocation(program, information.name);
  }

  return attributes;
};
/**
 * Provides an abstraction over the gl program calls.
 */


var WebGLShader = /*#__PURE__*/function () {
  /**
   * Lazy initializes a WebGLShader.
   * @param {WebGL2RenderingContext} gl The context on which to create the shader.
   * @param {string} vertexShaderCode The vertex shader code.
   * @param {string} fragmentShaderCode The fragment shader code.
   * @param {Array<{location: number, name: string}>} attributeBindingHints
   *  Optional hint for requesting attribute location.
   */
  function WebGLShader(gl, vertexShaderCode, fragmentShaderCode) {
    var attributeBindingHints = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : [];

    _classCallCheck__default["default"](this, WebGLShader);

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


  _createClass__default["default"](WebGLShader, [{
    key: "compile",
    value: function compile() {
      var _this = this;

      var vertexShader = createAndCompileShader(this.gl, this.vertexShaderCode, this.gl.VERTEX_SHADER);
      var fragmentShader = createAndCompileShader(this.gl, this.fragmentShaderCode, this.gl.FRAGMENT_SHADER);
      this.gl.attachShader(this.program, vertexShader);
      this.gl.attachShader(this.program, fragmentShader);
      this.attributeBindingHints.forEach(function (info) {
        _this.gl.bindAttribLocation(_this.program, info.location, info.name);
      });
      this.gl.linkProgram(this.program); // After linking, the shader object is not needed anymore so we delete it to save GPU memory.

      this.gl.detachShader(this.program, vertexShader);
      this.gl.detachShader(this.program, fragmentShader);
      this.gl.deleteShader(vertexShader);
      this.gl.deleteShader(fragmentShader);

      if (!this.gl.getProgramParameter(this.program, this.gl.LINK_STATUS)) {
        throw new Error("Error linking program: ".concat(this.gl.getProgramInfoLog(this.program)));
      }

      this.uniforms = generateUniformSetters(this.gl, this.program);
      this.attributeBindings = getActiveAttributeBindings(this.gl, this.program);
    }
    /**
     * Binds this shader for use on the WebGL context.
     */

  }, {
    key: "bind",
    value: function bind() {
      this.gl.useProgram(this.program);
    }
    /**
     * Deletes the shader from the WebGL context.
     */

  }, {
    key: "dispose",
    value: function dispose() {
      this.gl.deleteProgram(this.program);
    }
  }]);

  return WebGLShader;
}();

/**
 * Provides an abstraction over the base WebGL texture calls.
 */
var WebGLBaseTexture = /*#__PURE__*/function () {
  /**
   * Prepares a base texture to be used in child classes.
   * @param {WebGL2RenderingContext} gl Context to create the texture on.
   * @param {GLenum} target The target of the texture, has to be one of TEXTURE_2D, etc.
   * @param {GLenum} internalFormat The internal format of the texture, has to be one of RGBA8, etc
   * @param {GLenum} format The format of the texture, has to be one of RGB, etc
   * @param {GLenum} type The type of data stored in the texture has to be one of UNSIGNED_BYTE, etc
   */
  function WebGLBaseTexture(gl, target, internalFormat, format, type) {
    _classCallCheck__default["default"](this, WebGLBaseTexture);

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


  _createClass__default["default"](WebGLBaseTexture, [{
    key: "bind",
    value: function bind() {
      var unit = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
      this.gl.activeTexture(this.gl.TEXTURE0 + unit);
      this.gl.bindTexture(this.target, this.texture);
    }
    /**
     * Sets the minification and the maximization filter parameter of this texture
     * @param {GLenum} minFilter the minification filter
     * @param {GLenum} magFilter the magnification filter
     */

  }, {
    key: "setFilter",
    value: function setFilter(minFilter) {
      var magFilter = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : minFilter;
      this.bind();
      this.gl.texParameteri(this.target, this.gl.TEXTURE_MIN_FILTER, minFilter);
      this.gl.texParameteri(this.target, this.gl.TEXTURE_MAG_FILTER, magFilter);
    }
    /**
     * Sets the wrap mode of this texture to repeat
     */

  }, {
    key: "setWrapModeToRepeat",
    value: function setWrapModeToRepeat() {
      this.setWrap(this.gl.REPEAT);
    }
    /**
     * Sets the wrap mode of this texture to clamped to edge
     */

  }, {
    key: "setWrapModeToClamp",
    value: function setWrapModeToClamp() {
      this.setWrap(this.gl.CLAMP_TO_EDGE);
    }
    /**
     * Sets the wrap mode of this texture to mirrored repeat
     */

  }, {
    key: "setWrapModeToMirror",
    value: function setWrapModeToMirror() {
      this.setWrap(this.gl.MIRRORED_REPEAT);
    }
    /**
     * Sets the wrap mode of this texture to the given wrap parameter
     * @param {GLenum} wrap The type of wrapping to use
     */

  }, {
    key: "setWrap",
    value: function setWrap(wrap) {
      this.gl.texParameteri(this.target, this.gl.TEXTURE_WRAP_S, wrap);
      this.gl.texParameteri(this.target, this.gl.TEXTURE_WRAP_T, wrap);
      this.gl.texParameteri(this.target, this.gl.TEXTURE_WRAP_R, wrap);
    }
    /**
     * Deletes the texture from the WebGL context
     */

  }, {
    key: "dispose",
    value: function dispose() {
      this.gl.deleteTexture(this.texture);
    }
  }]);

  return WebGLBaseTexture;
}();

function _createSuper$2(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct$2(); return function _createSuperInternal() { var Super = _getPrototypeOf__default["default"](Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf__default["default"](this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn__default["default"](this, result); }; }

function _isNativeReflectConstruct$2() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }
/**
 * Extension of the base texture; provides abstraction over the 2D based texture calls.
 */

var WebGLTexture2D = /*#__PURE__*/function (_WebGLBaseTexture) {
  _inherits__default["default"](WebGLTexture2D, _WebGLBaseTexture);

  var _super = _createSuper$2(WebGLTexture2D);

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
  function WebGLTexture2D(gl, internalFormat, format, type) {
    var _this;

    _classCallCheck__default["default"](this, WebGLTexture2D);

    _this = _super.call(this, gl, gl.TEXTURE_2D, internalFormat, format, type);
    _this.width = 0;
    _this.height = 0;
    return _this;
  }
  /**
   * Uploads the texture to the WebGL context.
   * @param {CanvasImageSource} image the source of the image.
   */


  _createClass__default["default"](WebGLTexture2D, [{
    key: "uploadImage",
    value: function uploadImage(image) {
      this.bind();
      this.width = image.width;
      this.height = image.height;
      this.gl.texImage2D(this.target, 0, this.internalFormat, this.format, this.type, image);
    }
    /**
     * Uploads data array as 2D texture to the WebGL context.
     * @param {number} width The width for the texture.
     * @param {number} height The height for the texture.
     * @param {TypedArray} data The data array to be uploaded.
     */

  }, {
    key: "uploadData",
    value: function uploadData(width, height, data) {
      this.width = width;
      this.height = height;
      this.bind();
      this.gl.texImage2D(this.target, 0, this.internalFormat, width, height, 0, this.format, this.type, data);
    }
    /**
     * Uploads to a part of the texture with another image.
     * @param {number} x Offset on the x-axis
     * @param {number} y Offset on the y-axis
     * @param {CanvasImageSource} image the image to place in the other one
     */

  }, {
    key: "subUploadImage",
    value: function subUploadImage(x, y, image) {
      var subRegionWidth = image.width;
      var subRegionHeight = image.height;

      if (subRegionWidth + x > this.width || subRegionHeight + y > this.height) {
        throw new Error('Given offset and image dimensions are not within texture bounds.');
      }

      this.gl.texSubImage2D(this.target, 0, x, y, image.width, image.height, this.format, this.type, image);
    }
    /**
     * Uploads to a part of the texture with typed array.
     * @param {number} x Offset on the x-axis
     * @param {number} y Offset on the y-axis
     * @param {TypedArray} data The data to upload
     * @param {number} width The width of the data.
     * @param {number} height The height of the data
     */

  }, {
    key: "subUploadData",
    value: function subUploadData(x, y, data, width, height) {
      if (width + x > this.width || height + y > this.height) {
        throw new Error('Given offset and image dimensions are not within texture bounds.');
      }

      this.gl.texSubImage2D(this.target, 0, x, y, width, height, this.format, this.type, data);
    }
  }]);

  return WebGLTexture2D;
}(WebGLBaseTexture);

/**
 * Provides a wrapper over the WebGL buffer calls
 */
var WebGLBuffer = /*#__PURE__*/function () {
  /**
   * Initializes the buffer but does not buffer any data to the handle yet.
   * @param {WebGL2RenderingContext} gl The context on which to create the buffer.
   * @param {GLenum} usage The usage parameter of this webgl buffer.
   */
  function WebGLBuffer(gl, usage) {
    _classCallCheck__default["default"](this, WebGLBuffer);

    this.gl = gl;
    this.buffer = gl.createBuffer();
    this.usage = usage;
    this.size = 0;
  }
  /**
   * Binds this buffer as the active one in the stored WebGLContext.
   */


  _createClass__default["default"](WebGLBuffer, [{
    key: "bind",
    value: function bind() {
      this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.buffer);
    }
    /**
     * Allocates space in the WebGL driver for a buffer with the size of
     * the typed array and copies the data to the WebGL buffer.
     * @param {ArrayBuffer} data the data used to fill the buffer
     */

  }, {
    key: "bufferData",
    value: function bufferData(data) {
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

  }, {
    key: "bufferSubData",
    value: function bufferSubData(destinationOffset, data) {
      var sourceOffset = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
      var length = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : data.length - sourceOffset;

      if (destinationOffset + length * data.BYTES_PER_ELEMENT > this.size) {
        throw new Error('cant copy data to beyond buffer boundary');
      }

      this.bind();
      this.gl.bufferSubData(this.gl.ARRAY_BUFFER, destinationOffset, data, sourceOffset, length);
    }
    /**
     * Deletes the buffer from the WebGL context.
     */

  }, {
    key: "dispose",
    value: function dispose() {
      this.gl.deleteBuffer(this.buffer);
    }
  }]);

  return WebGLBuffer;
}();

/**
 * Private function to find the size in bytes for the given supported type.
 * @param {GLenum} type The type to find the amount of bytes for.
 * @returns {number} Size in bytes.
 * @private
 */
var getSizeForGLType = function getSizeForGLType(type) {
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


var WebGLBufferDescriptor = /*#__PURE__*/_createClass__default["default"](
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
function WebGLBufferDescriptor(location, buffer, size, type) {
  var offset = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : 0;
  var stride = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : 0;
  var normalize = arguments.length > 6 && arguments[6] !== undefined ? arguments[6] : false;
  var divisor = arguments.length > 7 && arguments[7] !== undefined ? arguments[7] : 0;

  _classCallCheck__default["default"](this, WebGLBufferDescriptor);

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
});

function _createSuper$1(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct$1(); return function _createSuperInternal() { var Super = _getPrototypeOf__default["default"](Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf__default["default"](this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn__default["default"](this, result); }; }

function _isNativeReflectConstruct$1() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }
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

var allocateTexStorage3D$1 = function allocateTexStorage3D(gl, texture, format, width, height, depth) {
  gl.bindTexture(gl.TEXTURE_2D_ARRAY, texture);
  gl.texStorage3D(gl.TEXTURE_2D_ARRAY, 1, format, width, height, depth);
  if (gl.getError()) throw new Error('Could not allocate texture space');
};
/**
 * Provides an abstraction over the base WebGL 2D texture array calls.
 */


var WebGLTexture2DArray = /*#__PURE__*/function (_WebGLBaseTexture) {
  _inherits__default["default"](WebGLTexture2DArray, _WebGLBaseTexture);

  var _super = _createSuper$1(WebGLTexture2DArray);

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
  function WebGLTexture2DArray(gl, internalFormat, format, type, width, height, images) {
    var _this;

    _classCallCheck__default["default"](this, WebGLTexture2DArray);

    _this = _super.call(this, gl, gl.TEXTURE_2D_ARRAY, internalFormat, format, type);
    _this.width = width;
    _this.height = height;
    _this.images = images;
    allocateTexStorage3D$1(_this.gl, _this.texture, _this.internalFormat, _this.width, _this.height, _this.images);
    return _this;
  }
  /**
   * Uploads a layer to the 2D texture array.
   * @param {CanvasImageSource} image The image to upload.
   * @param {number} layer The Layer on which to upload the image.
   * @param {number} x The x-offset into the target texture
   * @param {number} y The y-offset into the target texture
   */


  _createClass__default["default"](WebGLTexture2DArray, [{
    key: "uploadImage",
    value: function uploadImage(image, layer) {
      var x = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
      var y = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 0;
      var width = image.width,
          height = image.height;
      var startsOutOfBounds = x < 0 || y < 0;
      var goesOutOfBounds = x + width > this.width || y + height > this.height;

      if (startsOutOfBounds || goesOutOfBounds) {
        throw new Error('Given offset and image dimensions are not within texture bounds.');
      }

      this.bind();
      this.gl.texSubImage3D(this.target, 0, x, y, layer, image.width, image.height, 1, this.format, this.type, image);
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

  }, {
    key: "uploadData",
    value: function uploadData(data, width, height, layer) {
      var x = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : 0;
      var y = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : 0;
      var startsOutOfBounds = x < 0 || y < 0;
      var goesOutOfBounds = x + width > this.width || y + height > this.height;

      if (startsOutOfBounds || goesOutOfBounds) {
        throw new Error('Given offset and image dimensions are not within texture bounds.');
      }

      this.bind();
      this.gl.texSubImage3D(this.target, 0, x, y, layer, width, height, 1, this.format, this.type, data, 0);
    }
  }]);

  return WebGLTexture2DArray;
}(WebGLBaseTexture);

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf__default["default"](Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf__default["default"](this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn__default["default"](this, result); }; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }
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

var allocateTexStorage3D = function allocateTexStorage3D(gl, texture, format, width, height, depth) {
  gl.bindTexture(gl.TEXTURE_3D, texture);
  gl.texStorage3D(gl.TEXTURE_3D, 1, format, width, height, depth);
  if (gl.getError()) throw new Error('Could not allocate texture space');
};
/**
 * Provides an abstraction over the base WebGL 3D texture.
 */


var WebGLTexture3D = /*#__PURE__*/function (_WebGLBaseTexture) {
  _inherits__default["default"](WebGLTexture3D, _WebGLBaseTexture);

  var _super = _createSuper(WebGLTexture3D);

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
  function WebGLTexture3D(gl, internalFormat, format, type, width, height, depth) {
    var _this;

    _classCallCheck__default["default"](this, WebGLTexture3D);

    _this = _super.call(this, gl, gl.TEXTURE_3D, internalFormat, format, type);
    _this.width = width;
    _this.height = height;
    _this.depth = depth;
    allocateTexStorage3D(_this.gl, _this.texture, _this.internalFormat, _this.width, _this.height, _this.depth);
    return _this;
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


  _createClass__default["default"](WebGLTexture3D, [{
    key: "uploadData",
    value: function uploadData(data, width, height, depth) {
      var x = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : 0;
      var y = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : 0;
      var z = arguments.length > 6 && arguments[6] !== undefined ? arguments[6] : 0;
      var offset = arguments.length > 7 && arguments[7] !== undefined ? arguments[7] : 0;
      var startsOutOfBounds = x < 0 || y < 0 || z < 0;
      var goesOutOfBounds = x + width > this.width || y + height > this.height || z + depth > this.depth;

      if (startsOutOfBounds || goesOutOfBounds) {
        throw new Error('Given offset and image dimensions are not within texture bounds.');
      }

      this.bind();
      this.gl.texSubImage3D(this.target, 0, x, y, z, width, height, depth, this.format, this.type, data, offset);
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

  }, {
    key: "uploadImage",
    value: function uploadImage(image, height, depth) {
      var x = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 0;
      var y = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : 0;
      var z = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : 0;
      var width = image.width;
      var startsOutOfBounds = x < 0 || y < 0 || z < 0;
      var goesOutOfBounds = x + width > this.width || y + height > this.height || z + depth > this.depth;

      if (startsOutOfBounds || goesOutOfBounds) {
        throw new Error('Given offset and image dimensions are not within texture bounds.');
      }

      this.bind();
      this.gl.texSubImage3D(this.target, 0, x, y, z, width, height, depth, this.format, this.type, image);
    }
  }]);

  return WebGLTexture3D;
}(WebGLBaseTexture);

/**
 * Provides an abstraction over the WebGL calls for setting up a viewport.
 */
var WebGLViewport = /*#__PURE__*/function () {
  /**
   * Constructs a viewport for the full screen by default.
   * @param {WebGLRenderingContext} gl The context to use the viewport on.
   * @param {number} x The x-offset in pixels into the drawing buffer.
   * @param {number} y The y-offset in pixels into the drawing buffer.
   * @param {number} width  The width of the viewport; uses <= x + width.
   * @param {number} height The height of the viewport; uses <= x + width.
   */
  function WebGLViewport(gl) {
    var x = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
    var y = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
    var width = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : gl.drawingBufferWidth;
    var height = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : gl.drawingBufferHeight;

    _classCallCheck__default["default"](this, WebGLViewport);

    this.gl = gl;
    this.setBounds(x, y, width, height);
  }
  /**
   * Sets the WebGL state to render to this viewport.
   */


  _createClass__default["default"](WebGLViewport, [{
    key: "renderToViewport",
    value: function renderToViewport() {
      var height = this.gl.drawingBufferHeight;
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

  }, {
    key: "setBounds",
    value: function setBounds(x, y, width, height) {
      if (width <= 0 || height <= 0) throw new Error('Width and height have to be larger than 0');
      this.left = x;
      this.top = y;
      this.width = width;
      this.height = height;
    }
  }]);

  return WebGLViewport;
}();

/**
 * Provides an abstraction over the VAO calls.
 */
var WebGLVertexLayout = /*#__PURE__*/function () {
  /**
     * Prepares a VAO object.
     * @param {WebGL2RenderingContext} gl The context on which to create the layout.
     */
  function WebGLVertexLayout(gl) {
    _classCallCheck__default["default"](this, WebGLVertexLayout);

    this.gl = gl;
    this.vao = this.gl.createVertexArray();
  }
  /**
   * Binds the vertex array stored in this class to the webgl context.
   */


  _createClass__default["default"](WebGLVertexLayout, [{
    key: "bind",
    value: function bind() {
      this.gl.bindVertexArray(this.vao);
    }
    /**
     * Binds the stored buffer info to the webgl VAO.
     * This only has to be called once or when the layout changes.
     * @param {Array<WebGLBufferDescriptor>} descriptors Descriptors used to bind buffers in a VAO.
     */

  }, {
    key: "configureBuffers",
    value: function configureBuffers(descriptors) {
      var _this = this;

      this.bind();
      descriptors.forEach(function (buffer) {
        _this.gl.bindBuffer(_this.gl.ARRAY_BUFFER, buffer.buffer);

        _this.gl.enableVertexAttribArray(buffer.location);

        _this.gl.vertexAttribPointer(buffer.location, buffer.size, buffer.type, buffer.normalize, buffer.stride, buffer.offset);

        _this.gl.vertexAttribDivisor(buffer.location, buffer.divisor);
      });
    }
    /**
     * Draws the current bound VAO with previously bound buffers.
     * @param {GLenum} mode Must be any of gl.TRIANGLES, gl.LINES, etc.
     * @param {number} offset The offset into the draw list.
     * @param {number} count The amount of buffer items to draw.
     */

  }, {
    key: "draw",
    value: function draw(mode, offset, count) {
      this.bind();
      this.gl.drawArrays(mode, offset, count);
    }
    /**
     * Deletes the vertex attrib array, does not delete the used buffers.
     */

  }, {
    key: "dispose",
    value: function dispose() {
      this.gl.deleteVertexArray(this.vao);
    }
  }]);

  return WebGLVertexLayout;
}();

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty__default["default"](target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }

/**
 * Initializes the frame buffer object
 * @param {WebGLRenderingContext} gl
 * @param {Array<{attachmentPoint: number, texture: WebGLTexture2D}>} attachments
 * @param {Array<{attachmentPoint: number, format: number}>} renderBuffers
 * @private
 */
var initFBO = function initFBO(gl, attachments, renderBuffers) {
  var fbo = gl.createFramebuffer();
  gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);
  attachments.forEach(function (object) {
    gl.framebufferTexture2D(gl.FRAMEBUFFER, object.attachmentPoint, gl.TEXTURE_2D, object.texture.texture, 0);
  });
  var renderBufferObjects = renderBuffers.map(function (object) {
    var renderbuffer = gl.createRenderbuffer();
    gl.bindRenderbuffer(gl.RENDERBUFFER, renderbuffer);
    gl.renderbufferStorage(gl.RENDERBUFFER, object.format, 1, 1);
    gl.framebufferRenderbuffer(gl.FRAMEBUFFER, object.attachmentPoint, gl.RENDERBUFFER, renderbuffer);
    return _objectSpread({
      buffer: renderbuffer
    }, object);
  });
  return {
    fbo: fbo,
    renderBufferObjects: renderBufferObjects
  };
};
/**
 * Abstraction over frame buffer object.
 */


var WebGLFbo = /*#__PURE__*/function () {
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
  function WebGLFbo(gl, width, height, attachments) {
    var renderBuffers = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : [];

    _classCallCheck__default["default"](this, WebGLFbo);

    this.gl = gl;
    this.attachments = attachments;

    var _initFBO = initFBO(this.gl, attachments, renderBuffers),
        fbo = _initFBO.fbo,
        renderBufferObjects = _initFBO.renderBufferObjects;

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


  _createClass__default["default"](WebGLFbo, [{
    key: "setSize",
    value: function setSize(width, height) {
      var _this = this;

      this.width = width;
      this.height = height;
      this.attachments.forEach(function (object) {
        object.texture.uploadData(width, height, undefined);
      });
      this.renderbufferObjects.forEach(function (renderbuffer) {
        _this.gl.bindRenderbuffer(_this.gl.RENDERBUFFER, renderbuffer.buffer);

        _this.gl.renderbufferStorage(_this.gl.RENDERBUFFER, renderbuffer.format, width, height);
      });
    }
    /**
     * Starts the render pass to this frame buffer.
     */

  }, {
    key: "renderTo",
    value: function renderTo() {
      this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, this.fbo);
      this.gl.viewport(0, 0, this.width, this.height);
    }
    /**
     * Disposes of any held WebGL resources.
     * Is not responsible for the attachment array since they were not created by this object.
     */

  }, {
    key: "dispose",
    value: function dispose() {
      var _this2 = this;

      this.gl.deleteFramebuffer(this.fbo);
      this.renderbufferObjects.forEach(function (object) {
        _this2.gl.deleteRenderbuffer(object.buffer);
      });
    }
  }]);

  return WebGLFbo;
}();

/**
 * Abstraction over an index buffer in WebGL
 */
var WebGLIndexBuffer = /*#__PURE__*/function () {
  /**
     * Creates a Index buffer
     * @param {WebGL2RenderingContext} gl The context to create an index buffer for.
     */
  function WebGLIndexBuffer(gl) {
    _classCallCheck__default["default"](this, WebGLIndexBuffer);

    this.gl = gl;
    this.buffer = gl.createBuffer();
    this.array = [];
  }
  /**
     * Binds the element array buffer to the context
     */


  _createClass__default["default"](WebGLIndexBuffer, [{
    key: "bind",
    value: function bind() {
      this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, this.buffer);
    }
    /**
       * Sets the buffer
       * @param {Uint16Array} buffer The data for the buffer
       */

  }, {
    key: "setBuffer",
    value: function setBuffer(buffer) {
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

  }, {
    key: "draw",
    value: function draw(mode, offset, count) {
      this.bind();
      this.gl.drawElements(mode, count, this.gl.UNSIGNED_SHORT, offset * this.array.BYTES_PER_ELEMENT);
    }
    /**
       * Draws the contents of the element buffer using instancing.
       * @param {GLEnum} mode The mode to render
       * @param {number} offset The offset into the index buffer
       * @param {number} count The amount of vertices to draw
       * @param {number} instances The amount of instanced to draw
       */

  }, {
    key: "drawInstanced",
    value: function drawInstanced(mode, offset, count, instances) {
      this.bind();
      this.gl.drawElementsInstanced(mode, count, this.gl.UNSIGNED_SHORT, offset * this.array.BYTES_PER_ELEMENT, instances);
    }
    /**
       * Deletes the buffer from the WebGL context.
       */

  }, {
    key: "dispose",
    value: function dispose() {
      this.gl.deleteBuffer(this.buffer);
    }
  }]);

  return WebGLIndexBuffer;
}();

exports.WebGLBaseTexture = WebGLBaseTexture;
exports.WebGLBuffer = WebGLBuffer;
exports.WebGLBufferDescriptor = WebGLBufferDescriptor;
exports.WebGLFBO = WebGLFbo;
exports.WebGLIndexBuffer = WebGLIndexBuffer;
exports.WebGLShader = WebGLShader;
exports.WebGLTexture2D = WebGLTexture2D;
exports.WebGLTexture2DArray = WebGLTexture2DArray;
exports.WebGLTexture3D = WebGLTexture3D;
exports.WebGLVertexLayout = WebGLVertexLayout;
exports.WebGLViewport = WebGLViewport;
exports.polyFillWebGL = polyFillWebGL;

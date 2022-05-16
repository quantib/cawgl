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
                if (value.bind)
                    value.bind(unit);
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
export default class WebGLShader {
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
        const vertexShader = createAndCompileShader(this.gl, this.vertexShaderCode, this.gl.VERTEX_SHADER);
        const fragmentShader = createAndCompileShader(this.gl, this.fragmentShaderCode, this.gl.FRAGMENT_SHADER);
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

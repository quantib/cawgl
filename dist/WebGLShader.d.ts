/**
 * Provides an abstraction over the gl program calls.
 */
export default class WebGLShader {
    /**
     * Lazy initializes a WebGLShader.
     * @param {WebGL2RenderingContext} gl The context on which to create the shader.
     * @param {string} vertexShaderCode The vertex shader code.
     * @param {string} fragmentShaderCode The fragment shader code.
     * @param {Array<{location: number, name: string}>} attributeBindingHints Optional hint for requesting attribute location.
     */
    constructor(gl: WebGL2RenderingContext, vertexShaderCode: string, fragmentShaderCode: string, attributeBindingHints?: Array<{
        location: number;
        name: string;
    }>);
    gl: WebGL2RenderingContext;
    vertexShaderCode: string;
    fragmentShaderCode: string;
    attributeBindings: {};
    attributeBindingHints: {
        location: number;
        name: string;
    }[];
    uniforms: {};
    program: WebGLProgram | null;
    /**
     * Compiles the shader source specified earlier.
     * Gathers uniforms and attributes and saves them in their respective attributes.
     * @throws Error if compilation was unsuccessful.
     */
    compile(): void;
    /**
     * Binds this shader for use on the WebGL context.
     */
    bind(): void;
    /**
     * Deletes the shader from the WebGL context.
     */
    dispose(): void;
}

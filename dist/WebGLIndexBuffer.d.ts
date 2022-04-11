/**
 * Abstraction over an index buffer in WebGL
 */
export default class WebGLIndexBuffer {
    /**
     * Creates a Index buffer
     * @param {WebGL2RenderingContext} gl The context to create an index buffer for.
     */
    constructor(gl: WebGL2RenderingContext);
    gl: WebGL2RenderingContext;
    buffer: WebGLBuffer | null;
    array: any[];
    /**
     * Binds the element array buffer to the context
     */
    bind(): void;
    /**
     * Sets the buffer
     * @param {Uint16Array} buffer The data for the buffer
     */
    setBuffer(buffer: Uint16Array): void;
    /**
     * Draws with the content of the element buffer
     * @param {GLEnum} mode The mode to render
     * @param {number} offset The offset in the index buffer to draw
     * @param {number} count The amount to draw from the index buffer
     */
    draw(mode: GLEnum, offset: number, count: number): void;
    /**
     * Draws the contents of the element buffer using instancing.
     * @param {GLEnum} mode The mode to render
     * @param {number} offset The offset into the index buffer
     * @param {number} count The amount of vertices to draw
     * @param {number} instances The amount of instanced to draw
     */
    drawInstanced(mode: GLEnum, offset: number, count: number, instances: number): void;
    /**
     * Deletes the buffer from the WebGL context.
     */
    dispose(): void;
}

/**
 * Provides a wrapper over the WebGL buffer calls
 */
export default class WebGLBuffer {
    /**
     * Initializes the buffer but does not buffer any data to the handle yet.
     * @param {WebGL2RenderingContext} gl The context on which to create the buffer.
     * @param {GLenum} usage The usage parameter of this webgl buffer.
     */
    constructor(gl: WebGL2RenderingContext, usage: GLenum);
    gl: WebGL2RenderingContext;
    buffer: WebGLBuffer | null;
    usage: number;
    size: number;
    /**
     * Binds this buffer as the active one in the stored WebGLContext.
     */
    bind(): void;
    /**
     * Allocates space in the WebGL driver for a buffer with the size of
     * the typed array and copies the data to the WebGL buffer.
     * @param {TypedArray} data the data used to fill the buffer
     */
    bufferData(data: TypedArray): void;
    /**
     * Buffers sub data in the previously allocated buffer.
     * @param {number} destinationOffset The offset in the destination buffer; in bytes.
     * @param {TypedArray} data The data to buffer.
     * @param {number} sourceOffset The offset in the source where the copy starts; in array elements.
     * @param {number} length The length of the data we want to buffer; in array elements.
     */
    bufferSubData(destinationOffset: number, data: TypedArray, sourceOffset?: number, length?: number): void;
    /**
     * Deletes the buffer from the WebGL context.
     */
    dispose(): void;
}

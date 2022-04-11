/**
 * Provides a wrapper over the WebGL buffer calls
 */
export default class WebGLBuffer {
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
     * @param {TypedArray} data the data used to fill the buffer
     */
    bufferData(data) {
        this.bind();
        this.gl.bufferData(this.gl.ARRAY_BUFFER, data, this.usage);
        this.size = data.byteLength;
    }
    /**
     * Buffers sub data in the previously allocated buffer.
     * @param {number} destinationOffset The offset in the destination buffer; in bytes.
     * @param {TypedArray} data The data to buffer.
     * @param {number} sourceOffset The offset in the source where the copy starts; in array elements.
     * @param {number} length The length of the data we want to buffer; in array elements.
     */
    bufferSubData(destinationOffset, data, sourceOffset = 0, length = data.length - sourceOffset) {
        if (destinationOffset + length * data.BYTES_PER_ELEMENT > this.size) {
            throw new Error('cant copy data to beyond buffer boundary');
        }
        this.bind();
        this.gl.bufferSubData(this.gl.ARRAY_BUFFER, destinationOffset, data, sourceOffset, length);
    }
    /**
     * Deletes the buffer from the WebGL context.
     */
    dispose() {
        this.gl.deleteBuffer(this.buffer);
    }
}

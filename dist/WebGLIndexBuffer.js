/**
 * Abstraction over an index buffer in WebGL
 */
export default class WebGLIndexBuffer {
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
        this.gl.drawElements(mode, count, this.gl.UNSIGNED_SHORT, offset * this.array.BYTES_PER_ELEMENT);
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
        this.gl.drawElementsInstanced(mode, count, this.gl.UNSIGNED_SHORT, offset * this.array.BYTES_PER_ELEMENT, instances);
    }
    /**
     * Deletes the buffer from the WebGL context.
     */
    dispose() {
        this.gl.deleteBuffer(this.buffer);
    }
}

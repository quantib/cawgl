/**
 * Provides an abstraction over the WebGL calls for setting up a viewport.
 */
export default class WebGLViewport {
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
        if (width <= 0 || height <= 0)
            throw new Error('Width and height have to be larger than 0');
        this.left = x;
        this.top = y;
        this.width = width;
        this.height = height;
    }
}

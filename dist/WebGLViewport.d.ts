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
    constructor(gl: WebGLRenderingContext, x?: number, y?: number, width?: number, height?: number);
    gl: WebGLRenderingContext;
    /**
     * Sets the WebGL state to render to this viewport.
     */
    renderToViewport(): void;
    /**
     * Sets the internal parameters used when setting the viewport.
     * @param {number} x The x-offset in pixels into the drawing buffer.
     * @param {number} y The y-offset in pixels into the drawing buffer.
     * @param {number} width The width of the viewport means until pixel.
     * @param {number} height The height of the viewport means until pixel.
     */
    setBounds(x: number, y: number, width: number, height: number): void;
    left: number | undefined;
    top: number | undefined;
    width: number | undefined;
    height: number | undefined;
}

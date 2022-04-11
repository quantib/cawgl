/**
 * Provides an abstraction over the VAO calls.
 */
export default class WebGLVertexLayout {
    /**
       * Prepares a VAO object.
       * @param {WebGL2RenderingContext} gl The context on which to create the layout.
       */
    constructor(gl: WebGL2RenderingContext);
    gl: WebGL2RenderingContext;
    vao: WebGLVertexArrayObject | null;
    /**
     * Binds the vertex array stored in this class to the webgl context.
     */
    bind(): void;
    /**
     * Binds the stored buffer info to the webgl VAO.
     * This only has to be called once or when the layout changes.
     * @param {Array<WebGLBufferDescriptor>} descriptors Descriptors used to bind buffers in a VAO.
     */
    configureBuffers(descriptors: Array<WebGLBufferDescriptor>): void;
    /**
     * Draws the current bound VAO with previously bound buffers.
     * @param {GLenum} mode Must be any of gl.TRIANGLES, gl.LINES, etc.
     * @param {number} offset The offset into the draw list.
     * @param {number} count The amount of buffer items to draw.
     */
    draw(mode: GLenum, offset: number, count: number): void;
    /**
     * Deletes the vertex attrib array, does not delete the used buffers.
     */
    dispose(): void;
}

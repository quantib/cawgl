/**
 * Abstraction over frame buffer object.
 */
export default class WebGLFbo {
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
    constructor(gl: WebGLRenderingContext, width: number, height: number, attachments: any, renderBuffers?: Array<{
        attachmentPoint: number;
        format: number;
    }>);
    gl: WebGLRenderingContext;
    attachments: any;
    fbo: WebGLFramebuffer | null;
    renderbufferObjects: {
        attachmentPoint: number;
        format: number;
        buffer: WebGLRenderbuffer | null;
    }[];
    /**
     * Sets the size of the frame buffer.
     * @param {number} width The dimension used for the texture.
     * @param {number} height The dimension used for the texture.
     */
    setSize(width: number, height: number): void;
    width: number | undefined;
    height: number | undefined;
    /**
     * Starts the render pass to this frame buffer.
     */
    renderTo(): void;
    /**
     * Disposes of any held WebGL resources.
     * Is not responsible for the attachment array since they were not created by this object.
     */
    dispose(): void;
}

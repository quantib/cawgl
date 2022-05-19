/**
 * Provides an abstraction over the base WebGL texture calls.
 */
export class WebGLBaseTexture {
    /**
     * Prepares a base texture to be used in child classes.
     * @param {WebGL2RenderingContext} gl Context to create the texture on.
     * @param {GLenum} target The target of the texture, has to be one of TEXTURE_2D, etc.
     * @param {GLenum} internalFormat The internal format of the texture, has to be one of RGBA8, etc
     * @param {GLenum} format The format of the texture, has to be one of RGB, etc
     * @param {GLenum} type The type of data stored in the texture has to be one of UNSIGNED_BYTE, etc
     */
    constructor(gl: WebGL2RenderingContext, target: GLenum, internalFormat: GLenum, format: GLenum, type: GLenum);
    gl: WebGL2RenderingContext;
    internalFormat: number;
    format: number;
    type: number;
    target: number;
    texture: WebGLTexture;
    /**
     * Binds this texture to a sampling unit
     * @param {number} unit the number of the unit to bind to
     */
    bind(unit?: number): void;
    /**
     * Sets the minification and the maximization filter parameter of this texture
     * @param {GLenum} minFilter the minification filter
     * @param {GLenum} magFilter the magnification filter
     */
    setFilter(minFilter: GLenum, magFilter?: GLenum): void;
    /**
     * Sets the wrap mode of this texture to repeat
     */
    setWrapModeToRepeat(): void;
    /**
     * Sets the wrap mode of this texture to clamped to edge
     */
    setWrapModeToClamp(): void;
    /**
     * Sets the wrap mode of this texture to mirrored repeat
     */
    setWrapModeToMirror(): void;
    /**
     * Sets the wrap mode of this texture to the given wrap parameter
     * @param {GLenum} wrap The type of wrapping to use
     */
    setWrap(wrap: GLenum): void;
    /**
     * Deletes the texture from the WebGL context
     */
    dispose(): void;
}
/**
 * Provides a wrapper over the WebGL buffer calls
 */
export class WebGLBuffer {
    /**
     * Initializes the buffer but does not buffer any data to the handle yet.
     * @param {WebGL2RenderingContext} gl The context on which to create the buffer.
     * @param {GLenum} usage The usage parameter of this webgl buffer.
     */
    constructor(gl: WebGL2RenderingContext, usage: GLenum);
    gl: WebGL2RenderingContext;
    buffer: globalThis.WebGLBuffer;
    usage: number;
    size: number;
    /**
     * Binds this buffer as the active one in the stored WebGLContext.
     */
    bind(): void;
    /**
     * Allocates space in the WebGL driver for a buffer with the size of
     * the typed array and copies the data to the WebGL buffer.
     * @param {ArrayBuffer} data the data used to fill the buffer
     */
    bufferData(data: ArrayBuffer): void;
    /**
     * Buffers sub data in the previously allocated buffer.
     * @param {number} destinationOffset The offset in the destination buffer; in bytes.
     * @param {ArrayBuffer} data The data to buffer.
     * @param {number} sourceOffset The offset in the source where the copy starts; in array elements.
     * @param {number} length The length of the data we want to buffer; in array elements.
     */
    bufferSubData(destinationOffset: number, data: ArrayBuffer, sourceOffset?: number, length?: number): void;
    /**
     * Deletes the buffer from the WebGL context.
     */
    dispose(): void;
}
/**
 * Data class for VAO buffer descriptions
 */
export class WebGLBufferDescriptor {
    /**
     * Creates an object which represents a vertex attrib pointer.
     * @param {number} location The shader location this buffer needs to be bound to.
     * @param {WebGLBuffer} buffer Buffer where the descriptor gets its values from
     * @param {number} size The amount of components, can be 1 - 4.
     * @param {GLenum} type A GLEnum describing the type used.
     * @param {number} offset The offset in the buffer; in bytes.
     * @param {number} stride Stride used for indexing the buffer; in bytes.
     * @param {boolean} normalize Defines if the values have to be normalized.
     * @param {number} divisor The divisor used for instanced drawing.
     */
    constructor(location: number, buffer: WebGLBuffer, size: number, type: GLenum, offset?: number, stride?: number, normalize?: boolean, divisor?: number);
    location: number;
    buffer: globalThis.WebGLBuffer;
    size: number;
    type: number;
    normalize: boolean;
    stride: number;
    offset: number;
    divisor: number;
}
/**
 * Abstraction over frame buffer object.
 */
declare class WebGLFbo {
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
    fbo: WebGLFramebuffer;
    renderbufferObjects: {
        attachmentPoint: number;
        format: number;
        buffer: WebGLRenderbuffer;
    }[];
    /**
     * Sets the size of the frame buffer.
     * @param {number} width The dimension used for the texture.
     * @param {number} height The dimension used for the texture.
     */
    setSize(width: number, height: number): void;
    width: number;
    height: number;
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
/**
 * Provides an abstraction over the gl program calls.
 */
export class WebGLShader {
    /**
     * Lazy initializes a WebGLShader.
     * @param {WebGL2RenderingContext} gl The context on which to create the shader.
     * @param {string} vertexShaderCode The vertex shader code.
     * @param {string} fragmentShaderCode The fragment shader code.
     * @param {Array<{location: number, name: string}>} attributeBindingHints
     *  Optional hint for requesting attribute location.
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
    program: WebGLProgram;
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
/**
 * Extension of the base texture; provides abstraction over the 2D based texture calls.
 */
export class WebGLTexture2D extends WebGLBaseTexture {
    /**
     * Prepares a base texture with 2D support.
     * @param {WebGL2RenderingContext} gl
     *  The context to create the texture on.
     * @param {GLenum} internalFormat
     *  The internal format of the texture used has to be one of RGBA8 ...
     * @param {GLenum} format
     *  The format of the texture, has to be one of RGB, RGBA...
     * @param {GLenum} type
     *  The type of data stored, has to be one of UNSIGNED_BYTE...
     */
    constructor(gl: WebGL2RenderingContext, internalFormat: GLenum, format: GLenum, type: GLenum);
    width: number;
    height: number;
    /**
     * Uploads the texture to the WebGL context.
     * @param {CanvasImageSource} image the source of the image.
     */
    uploadImage(image: CanvasImageSource): void;
    /**
     * Uploads data array as 2D texture to the WebGL context.
     * @param {number} width The width for the texture.
     * @param {number} height The height for the texture.
     * @param {TypedArray} data The data array to be uploaded.
     */
    uploadData(width: number, height: number, data: TypedArray): void;
    /**
     * Uploads to a part of the texture with another image.
     * @param {number} x Offset on the x-axis
     * @param {number} y Offset on the y-axis
     * @param {CanvasImageSource} image the image to place in the other one
     */
    subUploadImage(x: number, y: number, image: CanvasImageSource): void;
    /**
     * Uploads to a part of the texture with typed array.
     * @param {number} x Offset on the x-axis
     * @param {number} y Offset on the y-axis
     * @param {TypedArray} data The data to upload
     * @param {number} width The width of the data.
     * @param {number} height The height of the data
     */
    subUploadData(x: number, y: number, data: TypedArray, width: number, height: number): void;
}
/**
 * Provides an abstraction over the base WebGL 2D texture array calls.
 */
export class WebGLTexture2DArray extends WebGLBaseTexture {
    /**
     * Prepares a base texture with 2D texture array support.
     * Allocates space for the texture immediately and is immutable afterwards,
     * so all layers have to be the same width and height.
     * @param {WebGL2RenderingContext} gl
     *  The context to create the texture on.
     * @param {GLenum} internalFormat
     *  The internal format of the texture used has to be one of RGBA8 ...
     * @param {GLenum} format
     *  The format of the texture, has to be one of RGB, RGBA...
     * @param {GLenum} type
     *  The type of data stored, has to be one of UNSIGNED_BYTE...
     * @param {number} width
     *  Width of the images which are gonna be stored.
     * @param {number} height
     *  Height of the images which are gonna be stored.
     * @param {number} images
     *  Number of images to be stored.
     */
    constructor(gl: WebGL2RenderingContext, internalFormat: GLenum, format: GLenum, type: GLenum, width: number, height: number, images: number);
    width: number;
    height: number;
    images: number;
    /**
     * Uploads a layer to the 2D texture array.
     * @param {CanvasImageSource} image The image to upload.
     * @param {number} layer The Layer on which to upload the image.
     * @param {number} x The x-offset into the target texture
     * @param {number} y The y-offset into the target texture
     */
    uploadImage(image: CanvasImageSource, layer: number, x?: number, y?: number): void;
    /**
     * Uploads a typed array as an image to the 2D texture array.
     * @param {TypedArray} data The typed array to upload to the texture.
     * @param {number} width The width of the data array.
     * @param {number} height The height of the data array.
     * @param {number} layer The layer on which to upload to the 2D texture array.
     * @param {number} x The x-offset into the target texture
     * @param {number} y The y-offset into the target texture
     */
    uploadData(data: TypedArray, width: number, height: number, layer: number, x?: number, y?: number): void;
}
/**
 * Provides an abstraction over the base WebGL 3D texture.
 */
export class WebGLTexture3D extends WebGLBaseTexture {
    /**
     * Prepares a base texture with 3D texture support.
     * @param {WebGL2RenderingContext} gl
     *  The context to create the texture on.
     * @param {GLenum} internalFormat
     *  The internal format of the texture used has to be one of RGBA8 ...
     * @param {GLenum} format
     *  The format of the texture, has to be one of RGB, RGBA...
     * @param {GLenum} type
     *  The type of data stored, has to be one of UNSIGNED_BYTE...
     * @param {number} width
     *  The width of the 3D texture.
     * @param {number} height
     *  The height of the 3D texture.
     * @param {number} depth
     *  The depth of the 3D texture.
     */
    constructor(gl: WebGL2RenderingContext, internalFormat: GLenum, format: GLenum, type: GLenum, width: number, height: number, depth: number);
    width: number;
    height: number;
    depth: number;
    /**
     * Uploads a typed array as part of 3D texture.
     * Has to stay within the bounds of the parameters.
     * @param {TypedArray} data The data to upload.
     * @param {number} width The width of the data array.
     * @param {number} height The height of the data array.
     * @param {number} depth The depth of the data array.
     * @param {number} x The x-offset into the texture.
     * @param {number} y The y-offset into the texture.
     * @param {number} z The z-offset into the texture.
     * @param {number} offset The offset into the data array.
     */
    uploadData(data: TypedArray, width: number, height: number, depth: number, x?: number, y?: number, z?: number, offset?: number): void;
    /**
     * Uploads a image as part of the 3D texture.
     * Has to stay within the bounds of the parameters.
     * @param {CanvasImageSource} image The image to upload to the 3D texture
     * @param {number} height The height of the image
     * @param {number} depth The number of layers in the image, layed out in the height
     * @param {number} x The x-offset into the texture.
     * @param {number} y The y-offset into the texture.
     * @param {number} z The z-offset into the texture.
     */
    uploadImage(image: CanvasImageSource, height: number, depth: number, x?: number, y?: number, z?: number): void;
}
/**
 * Provides an abstraction over the VAO calls.
 */
export class WebGLVertexLayout {
    /**
       * Prepares a VAO object.
       * @param {WebGL2RenderingContext} gl The context on which to create the layout.
       */
    constructor(gl: WebGL2RenderingContext);
    gl: WebGL2RenderingContext;
    vao: WebGLVertexArrayObject;
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
/**
 * Provides an abstraction over the WebGL calls for setting up a viewport.
 */
export class WebGLViewport {
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
    left: number;
    top: number;
    width: number;
    height: number;
}
/**
 * Polyfills WebGL 2 functionality using extensions.
 *  - DrawElementsInstanced
 *  - VertexArrays
 *  - Uint index support
 * These extensions have a higher then 95% adoption rate.
 * If you have a platform/device which does not support these extensions
 * CAWGL's VertexLayout classes cannot be used.
 * You should at the time of writing prefer to target WebGL2 but if you want
 * the convenience of some functionality or your platform does not support WebGL2
 * it can be polyfilled using extensions.
 * @param {WebGLRenderingContext} gl The context to polyfill.
 * @returns {WebGLRenderingContext} WebGLRenderingContext with some WebGL2 functionality
 */
export function polyFillWebGL(gl: WebGLRenderingContext): WebGLRenderingContext;
export { WebGLFbo as WebGLFBO };

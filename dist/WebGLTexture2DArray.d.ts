/**
 * Provides an abstraction over the base WebGL 2D texture array calls.
 */
export default class WebGLTexture2DArray extends WebGLBaseTexture {
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
import WebGLBaseTexture from "./WebGLBaseTexture.js";

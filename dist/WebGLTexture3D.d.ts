/**
 * Provides an abstraction over the base WebGL 3D texture.
 */
export default class WebGLTexture3D extends WebGLBaseTexture {
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
import WebGLBaseTexture from "./WebGLBaseTexture.js";

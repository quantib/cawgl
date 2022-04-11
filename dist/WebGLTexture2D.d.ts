/**
 * Extension of the base texture; provides abstraction over the 2D based texture calls.
 */
export default class WebGLTexture2D extends WebGLBaseTexture {
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
import WebGLBaseTexture from "./WebGLBaseTexture.js";

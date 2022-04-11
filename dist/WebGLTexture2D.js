import WebGLBaseTexture from './WebGLBaseTexture.js';
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
    constructor(gl, internalFormat, format, type) {
        super(gl, gl.TEXTURE_2D, internalFormat, format, type);
        this.width = 0;
        this.height = 0;
    }
    /**
     * Uploads the texture to the WebGL context.
     * @param {CanvasImageSource} image the source of the image.
     */
    uploadImage(image) {
        this.bind();
        this.width = image.width;
        this.height = image.height;
        this.gl.texImage2D(this.target, 0, this.internalFormat, this.format, this.type, image);
    }
    /**
     * Uploads data array as 2D texture to the WebGL context.
     * @param {number} width The width for the texture.
     * @param {number} height The height for the texture.
     * @param {TypedArray} data The data array to be uploaded.
     */
    uploadData(width, height, data) {
        this.width = width;
        this.height = height;
        this.bind();
        this.gl.texImage2D(this.target, 0, this.internalFormat, width, height, 0, this.format, this.type, data);
    }
    /**
     * Uploads to a part of the texture with another image.
     * @param {number} x Offset on the x-axis
     * @param {number} y Offset on the y-axis
     * @param {CanvasImageSource} image the image to place in the other one
     */
    subUploadImage(x, y, image) {
        const subRegionWidth = image.width;
        const subRegionHeight = image.height;
        if (subRegionWidth + x > this.width || subRegionHeight + y > this.height) {
            throw new Error('Given offset and image dimensions are not within texture bounds.');
        }
        this.gl.texSubImage2D(this.target, 0, x, y, image.width, image.height, this.format, this.type, image);
    }
    /**
     * Uploads to a part of the texture with typed array.
     * @param {number} x Offset on the x-axis
     * @param {number} y Offset on the y-axis
     * @param {TypedArray} data The data to upload
     * @param {number} width The width of the data.
     * @param {number} height The height of the data
     */
    subUploadData(x, y, data, width, height) {
        if (width + x > this.width || height + y > this.height) {
            throw new Error('Given offset and image dimensions are not within texture bounds.');
        }
        this.gl.texSubImage2D(this.target, 0, x, y, width, height, this.format, this.type, data);
    }
}

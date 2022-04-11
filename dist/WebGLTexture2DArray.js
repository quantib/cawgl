import WebGLBaseTexture from './WebGLBaseTexture.js';
/**
 * Private function to specify and allocate the storage needed for the texture array.
 * This allows us to get storage without using a gl.texture3D call
 * @param {WebGL2RenderingContext} gl The context to allocate the storage on
 * @param {*} texture The texture to allocate space for
 * @param {GLenum} format The format of the texture, has to be one of RGB, RGBA...
 * @param {number} width The width of the texture
 * @param {number} height The height of the texture
 * @param {number} depth The number of images in the texture
 * @private
 */
const allocateTexStorage3D = (gl, texture, format, width, height, depth) => {
    gl.bindTexture(gl.TEXTURE_2D_ARRAY, texture);
    gl.texStorage3D(gl.TEXTURE_2D_ARRAY, 1, format, width, height, depth);
    if (gl.getError())
        throw new Error('Could not allocate texture space');
};
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
    constructor(gl, internalFormat, format, type, width, height, images) {
        super(gl, gl.TEXTURE_2D_ARRAY, internalFormat, format, type);
        this.width = width;
        this.height = height;
        this.images = images;
        allocateTexStorage3D(this.gl, this.texture, this.internalFormat, this.width, this.height, this.images);
    }
    /**
     * Uploads a layer to the 2D texture array.
     * @param {CanvasImageSource} image The image to upload.
     * @param {number} layer The Layer on which to upload the image.
     * @param {number} x The x-offset into the target texture
     * @param {number} y The y-offset into the target texture
     */
    uploadImage(image, layer, x = 0, y = 0) {
        const { width, height } = image;
        const startsOutOfBounds = x < 0 || y < 0;
        const goesOutOfBounds = x + width > this.width || y + height > this.height;
        if (startsOutOfBounds || goesOutOfBounds) {
            throw new Error('Given offset and image dimensions are not within texture bounds.');
        }
        this.bind();
        this.gl.texSubImage3D(this.target, 0, x, y, layer, image.width, image.height, 1, this.format, this.type, image);
    }
    /**
     * Uploads a typed array as an image to the 2D texture array.
     * @param {TypedArray} data The typed array to upload to the texture.
     * @param {number} width The width of the data array.
     * @param {number} height The height of the data array.
     * @param {number} layer The layer on which to upload to the 2D texture array.
     * @param {number} x The x-offset into the target texture
     * @param {number} y The y-offset into the target texture
     */
    uploadData(data, width, height, layer, x = 0, y = 0) {
        const startsOutOfBounds = x < 0 || y < 0;
        const goesOutOfBounds = x + width > this.width || y + height > this.height;
        if (startsOutOfBounds || goesOutOfBounds) {
            throw new Error('Given offset and image dimensions are not within texture bounds.');
        }
        this.bind();
        this.gl.texSubImage3D(this.target, 0, x, y, layer, width, height, 1, this.format, this.type, data, 0);
    }
}

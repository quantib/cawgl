import WebGLBaseTexture from './WebGLBaseTexture';
/**
 * Private function to declare the storage for the needed texture array.
 * This allows us to get storage without using a gl.texture3D call
 * @param {WebGL2RenderingContext} gl The context to allocate the storage on.
 * @param {*} texture The texture to allocate space for.
 * @param {GLenum} format The format of the texture, has to be one of RGB, RGBA...
 * @param {number} width The width of the texture.
 * @param {number} height The height of the texture.
 * @param {number} depth The depth of the texture.
 * @private
 */
const allocateTexStorage3D = (gl, texture, format, width, height, depth) => {
    gl.bindTexture(gl.TEXTURE_3D, texture);
    gl.texStorage3D(gl.TEXTURE_3D, 1, format, width, height, depth);
    if (gl.getError())
        throw new Error('Could not allocate texture space');
};
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
    constructor(gl, internalFormat, format, type, width, height, depth) {
        super(gl, gl.TEXTURE_3D, internalFormat, format, type);
        this.width = width;
        this.height = height;
        this.depth = depth;
        allocateTexStorage3D(this.gl, this.texture, this.internalFormat, this.width, this.height, this.depth);
    }
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
    uploadData(data, width, height, depth, x = 0, y = 0, z = 0, offset = 0) {
        const startsOutOfBounds = x < 0 || y < 0 || z < 0;
        const goesOutOfBounds = x + width > this.width
            || y + height > this.height
            || z + depth > this.depth;
        if (startsOutOfBounds || goesOutOfBounds) {
            throw new Error('Given offset and image dimensions are not within texture bounds.');
        }
        this.bind();
        this.gl.texSubImage3D(this.target, 0, x, y, z, width, height, depth, this.format, this.type, data, offset);
    }
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
    uploadImage(image, height, depth, x = 0, y = 0, z = 0) {
        const { width } = image;
        const startsOutOfBounds = x < 0 || y < 0 || z < 0;
        const goesOutOfBounds = x + width > this.width
            || y + height > this.height
            || z + depth > this.depth;
        if (startsOutOfBounds || goesOutOfBounds) {
            throw new Error('Given offset and image dimensions are not within texture bounds.');
        }
        this.bind();
        this.gl.texSubImage3D(this.target, 0, x, y, z, width, height, depth, this.format, this.type, image);
    }
}

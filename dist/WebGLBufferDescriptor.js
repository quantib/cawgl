const BYTE = 5120;
const UNSIGNED_BYTE = 5121;
const SHORT = 5122;
const UNSIGNED_SHORT = 5123;
const FLOAT = 5126;
/**
 * Private function to find the size in bytes for the given supported type.
 * @param {GLenum} type The type to find the amount of bytes for.
 * @returns {number} Size in bytes.
 * @private
 */
const getSizeForGLType = (type) => {
    switch (type) {
        case BYTE:
        case UNSIGNED_BYTE:
            return 1;
        case SHORT:
        case UNSIGNED_SHORT:
            return 2;
        case FLOAT:
            return 4;
        default:
            return 0.1;
    }
};
/**
 * Data class for VAO buffer descriptions
 */
export default class WebGLBufferDescriptor {
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
    constructor(location, buffer, size, type, offset = 0, stride = 0, normalize = false, divisor = 0) {
        if (stride < 0 || stride > 255)
            throw new Error('Stride has to be between 0 - 255');
        if (offset % getSizeForGLType(type) > 0)
            throw new Error('Offset has to be a multiple of the type size or 0');
        this.location = location;
        this.buffer = buffer.buffer;
        this.size = size;
        this.type = type;
        this.normalize = normalize;
        this.stride = stride;
        this.offset = offset;
        this.divisor = divisor;
    }
}

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
    constructor(location: number, buffer: WebGLBuffer, size: number, type: GLenum, offset?: number, stride?: number, normalize?: boolean, divisor?: number);
    location: number;
    buffer: any;
    size: number;
    type: number;
    normalize: boolean;
    stride: number;
    offset: number;
    divisor: number;
}

/**
 * Provides an abstraction over the base WebGL texture calls.
 */
export default class WebGLBaseTexture {
    /**
     * Prepares a base texture to be used in child classes.
     * @param {WebGL2RenderingContext} gl
     *  Context to create the texture on.
     * @param {GLenum} target
     *  The target of the texture, has to be one of TEXTURE_2D, TEXTURE_3D, ...
     * @param {GLenum} internalFormat
     *  The internal format of the texture used has to be one of RGBA8, ...
     * @param {GLenum} format
     *  The format of the texture, has to be one of RGB, RGBA, ...
     * @param {GLenum} type
     *  The type of data stored in the texture has to be one of UNSIGNED_BYTE, ...
     */
    constructor(gl: WebGL2RenderingContext, target: GLenum, internalFormat: GLenum, format: GLenum, type: GLenum);
    gl: WebGL2RenderingContext;
    internalFormat: number;
    format: number;
    type: number;
    target: number;
    texture: WebGLTexture | null;
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

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
 * @returns {*} WebGLRenderingContext with some WebGL2 functionality
 */
export default (gl) => {
  const polyFilledGL = gl;
  // Poly fill vertex array object VAO
  const vertexArrayObjectExtension = polyFilledGL.getExtension('OES_vertex_array_object');
  polyFilledGL.createVertexArray = () => vertexArrayObjectExtension.createVertexArrayOES();
  polyFilledGL.deleteVertexArray = (id) => vertexArrayObjectExtension.deleteVertexArrayOES(id);
  polyFilledGL.bindVertexArray = (id) => vertexArrayObjectExtension.bindVertexArrayOES(id);
  polyFilledGL.isVertexArray = (id) => vertexArrayObjectExtension.isVertexArrayOES(id);
  polyFilledGL.VERTEX_ARRAY_BINDING = vertexArrayObjectExtension.VERTEX_ARRAY_BINDING_OES;

  // Enable instanced drawing
  const instancedDrawing = polyFilledGL.getExtension('ANGLE_instanced_arrays');
  polyFilledGL.vertexAttribDivisor = (
    index,
    divisor,
  ) => instancedDrawing.vertexAttribDivisorANGLE(index, divisor);
  polyFilledGL.drawElementsInstanced = (
    mode,
    count,
    type,
    offset,
    primcount,
  ) => instancedDrawing.drawElementsInstancedANGLE(mode, count, type, offset, primcount);
  polyFilledGL.drawArraysInstanced = (
    mode,
    first,
    count,
    primcount,
  ) => instancedDrawing.drawArraysInstancedANGLE(mode, first, count, primcount);

  // Enable unsigned integer support as index
  polyFilledGL.getExtension('OES_element_index_uint');

  return gl;
};

import {
  beforeEach, describe, expect, it, jest,
} from '@jest/globals';
import polyFillWebGL from 'cawgl/polyFillWebGL';

describe('poly fill WebGL function', () => {
  let gl;
  let getExtensionMock;

  beforeEach(() => {
    const canvas = document.createElement('canvas');
    gl = canvas.getContext('webgl');
    getExtensionMock = jest.fn();
    gl.getExtension = getExtensionMock;
  });

  describe('when poly filling WebGL functionality', () => {
    it.each([
      ['createVertexArrayOES', 'createVertexArray', []],
      ['deleteVertexArrayOES', 'deleteVertexArray', [{}]],
      ['bindVertexArrayOES', 'bindVertexArray', [{}]],
      ['isVertexArrayOES', 'isVertexArray', [{}]],
      ['vertexAttribDivisorANGLE', 'vertexAttribDivisor', [{}, {}]],
      ['drawElementsInstancedANGLE', 'drawElementsInstanced', [{}, {}, {}, {}, {}]],
      ['drawArraysInstancedANGLE', 'drawArraysInstanced', [{}, {}, {}, {}]],
    ])('should poly fill %s', (extension, toCall, calledWith) => {
      const extensionMock = { [extension]: jest.fn() };
      getExtensionMock.mockReturnValue(extensionMock);
      gl = polyFillWebGL(gl);
      gl[toCall](...calledWith);
      expect(extensionMock[extension]).toBeCalledWith(...calledWith);
    });

    describe('when poly filling OES_element_index_uint', () => {
      it('should get OES_element_index_uint', () => {
        getExtensionMock.mockReturnValue({});
        gl = polyFillWebGL(gl);
        expect(getExtensionMock).toBeCalledWith('OES_element_index_uint');
      });
    });
  });
});

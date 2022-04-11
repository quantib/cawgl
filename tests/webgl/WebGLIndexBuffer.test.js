import WebGLIndexBuffer from 'cawgl/WebGLIndexBuffer';
import getWebGL from '@jest-utils/getWebGL';
import {
  describe,
  expect,
  beforeAll,
  afterAll,
  it,
  jest,
} from '@jest/globals';

describe('Buffer class', () => {
  let gl;
  let buffer;

  beforeAll(async () => {
    gl = await (getWebGL()).gl;
    buffer = new WebGLIndexBuffer(gl);
  });

  afterAll(() => {
    buffer.dispose();
  });

  describe('when creating a new instance', () => {
    it('should create valid buffer', () => {
      // Commit the buffer to WebGL memory otherwise buffer is still invalid
      buffer.bind();

      expect(gl.isBuffer(buffer.buffer)).toBe(true);
    });

    it('should be bound to array binding after bind', () => {
      buffer.bind();

      expect(gl.getParameter(gl.ELEMENT_ARRAY_BUFFER_BINDING)).toEqual(buffer.buffer);
    });
  });

  describe('when uploading data', () => {
    it('should have the correct usage parameter', () => {
      const data = new Uint16Array([0.5, 1.0]);

      buffer.setBuffer(data);

      expect(gl.getBufferParameter(
        gl.ELEMENT_ARRAY_BUFFER,
        gl.BUFFER_USAGE,
      )).toEqual(gl.STATIC_DRAW);
    });

    it('should upload correct data to buffer', () => {
      const data = new Uint16Array([0.5, 1.0]);

      buffer.setBuffer(data);

      const readBackData = new Uint16Array(data.length);
      gl.getBufferSubData(gl.ELEMENT_ARRAY_BUFFER, 0, readBackData);

      readBackData.forEach((value, index) => {
        expect(data[index]).toBe(value);
      });
    });
  });

  describe('when drawing buffer', () => {
    it('should draw elements', () => {
      buffer.array = new Uint16Array();
      gl.drawElements = jest.fn();

      buffer.draw(gl.TRIANGLES, 12, 12);
      expect(gl.drawElements).toBeCalledWith(
        gl.TRIANGLES,
        12,
        gl.UNSIGNED_SHORT,
        12 * 2,
      );
    });

    it('should draw elements instanced', () => {
      buffer.array = new Uint16Array();
      gl.drawElementsInstanced = jest.fn();
      buffer.drawInstanced(gl.TRIANGLES, 12, 12, 36);
      expect(gl.drawElementsInstanced).toBeCalledWith(
        gl.TRIANGLES,
        12,
        gl.UNSIGNED_SHORT,
        12 * 2,
        36,
      );
    });
  });

  describe('when disposing buffer', () => {
    it('should not be valid after a dispose call', () => {
      buffer.dispose();

      expect(gl.isBuffer(buffer.buffer)).toBe(false);
    });
  });
});

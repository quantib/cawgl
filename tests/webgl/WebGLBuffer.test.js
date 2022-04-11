import WebGLBuffer from 'cawgl/WebGLBuffer';
import getWebGL from '@jest-utils/getWebGL';
import {
  describe,
  expect,
  beforeAll,
  afterAll,
  it,
} from '@jest/globals';

describe('Buffer class', () => {
  let gl;
  let buffer;

  beforeAll(async () => {
    gl = await (getWebGL()).gl;
    buffer = new WebGLBuffer(gl, gl.STATIC_DRAW);
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

      expect(gl.getParameter(gl.ARRAY_BUFFER_BINDING)).toEqual(buffer.buffer);
    });
  });

  describe('when uploading data', () => {
    it('should have the correct usage parameter', () => {
      const data = new Float32Array([0.5, 1.0]);

      buffer.bufferData(data);

      expect(gl.getBufferParameter(gl.ARRAY_BUFFER, gl.BUFFER_USAGE)).toEqual(gl.STATIC_DRAW);
    });

    it('should upload correct data to buffer', () => {
      const data = new Float32Array([0.5, 1.0]);

      buffer.bufferData(data);

      const readBackData = new Float32Array(data.length);
      gl.getBufferSubData(gl.ARRAY_BUFFER, 0, readBackData);

      readBackData.forEach((value, index) => {
        expect(data[index]).toBe(value);
      });
    });

    it('should replace correct part of WebGL buffer', () => {
      const data = new Float32Array([1.0, 0.2, 0.5]);
      const readBackData = new Float32Array(data.length);
      const subData = new Float32Array([64.5, 20.0]);

      buffer.bufferData(data);
      buffer.bufferSubData(data.BYTES_PER_ELEMENT * 1, subData, 0, 1);
      gl.getBufferSubData(gl.ARRAY_BUFFER, 0, readBackData);

      expect(readBackData[0]).toBe(data[0]);
      expect(readBackData[1]).toBe(subData[0]);
      expect(readBackData[2]).toBe(data[2]);
    });

    it('should replace part of destination buffer with the full source buffer', () => {
      const data = new Float32Array([1.0, 0.2, 0.5]);
      const readBackData = new Float32Array(data.length);
      const subData = new Float32Array([64.5, 20.0]);

      buffer.bufferData(data);
      buffer.bufferSubData(data.BYTES_PER_ELEMENT * 1, subData);
      gl.getBufferSubData(gl.ARRAY_BUFFER, 0, readBackData);

      expect(readBackData[0]).toBe(data[0]);
      expect(readBackData[1]).toBe(subData[0]);
      expect(readBackData[2]).toBe(subData[1]);
    });

    it('should replace buffer by part of the source buffer', () => {
      const data = new Float32Array([1.0, 0.2, 0.5]);
      const readBackData = new Float32Array(data.length);
      const subData = new Float32Array([64.5, 20.0, 30.0]);

      buffer.bufferData(data);
      buffer.bufferSubData(data.BYTES_PER_ELEMENT * 1, subData, 1);
      gl.getBufferSubData(gl.ARRAY_BUFFER, 0, readBackData);
      expect(readBackData[0]).toBe(data[0]);
      expect(readBackData[1]).toBe(subData[1]);
      expect(readBackData[2]).toBe(subData[2]);
    });

    it('should throw error when buffering beyond limit', () => {
      const data = new Float32Array([0]);
      const subData = new Float32Array([0, 0, 0]);

      buffer.bufferData(data);
      expect(() => buffer.bufferSubData(0, subData)).toThrow();
    });
  });

  describe('when disposing buffer', () => {
    it('should not be valid after a dispose call', () => {
      buffer.dispose();

      expect(gl.isBuffer(buffer.buffer)).toBe(false);
    });
  });
});

import WebGLBufferDescriptor from 'cawgl/WebGLBufferDescriptor';
import {
  describe,
  expect,
  it,
} from '@jest/globals';

const GL_FLOAT = 0x1406;
const GL_HALF_FLOAT = 0x140b;
const GL_BYTE = 0x1400;
const GL_UNSIGNED_BYTE = 0x1401;
const GL_SHORT = 0x1402;
const GL_UNSIGNED_SHORT = 0x1402;

describe('WebGLBuffer descriptor class', () => {
  describe('when creating new instance', () => {
    it('should create valid WebGLBufferDescriptor with only mandatory parameters', () => {
      const descriptor = new WebGLBufferDescriptor(0, { buffer: 0 }, 1, GL_FLOAT);

      expect(descriptor).toEqual({
        buffer: 0,
        divisor: 0,
        location: 0,
        size: 1,
        type: GL_FLOAT,
        normalize: false,
        stride: 0,
        offset: 0,
      });
    });

    it.each([
      GL_FLOAT,
      GL_BYTE,
      GL_UNSIGNED_BYTE,
      GL_SHORT,
      GL_UNSIGNED_SHORT,
    ])('should create valid WebGLBufferDescriptor with type: %s', (value) => {
      const descriptor = new WebGLBufferDescriptor(0, { buffer: 0 }, 1, value, 4);

      expect(descriptor).toEqual({
        buffer: 0,
        divisor: 0,
        location: 0,
        size: 1,
        type: value,
        normalize: false,
        stride: 0,
        offset: 4,
      });
    });

    it('should create valid WebGLBufferDescriptor with offset', () => {
      const descriptor = new WebGLBufferDescriptor(0, { buffer: 0 }, 1, GL_FLOAT, 4);

      expect(descriptor).toEqual({
        buffer: 0,
        divisor: 0,
        location: 0,
        size: 1,
        type: GL_FLOAT,
        normalize: false,
        stride: 0,
        offset: 4,
      });
    });

    it('should create valid WebGLBufferDescriptor with stride and offset', () => {
      const descriptor = new WebGLBufferDescriptor(0, { buffer: 0 }, 1, GL_FLOAT, 4, 4);

      expect(descriptor).toEqual({
        buffer: 0,
        divisor: 0,
        location: 0,
        size: 1,
        type: GL_FLOAT,
        normalize: false,
        stride: 4,
        offset: 4,
      });
    });

    it('should create valid WebGLBufferDescriptor with divisor', () => {
      const descriptor = new WebGLBufferDescriptor(0, { buffer: 0 }, 1, GL_FLOAT, 0, 4, false, 1);

      expect(descriptor).toEqual({
        buffer: 0,
        divisor: 1,
        location: 0,
        size: 1,
        type: GL_FLOAT,
        normalize: false,
        stride: 4,
        offset: 0,
      });
    });

    it('should create valid WebGLBufferDescriptor with stride, offset and normalization', () => {
      const descriptor = new WebGLBufferDescriptor(0, { buffer: 0 }, 1, GL_FLOAT, 4, 4, true);

      expect(descriptor).toEqual({
        buffer: 0,
        divisor: 0,
        location: 0,
        size: 1,
        type: GL_FLOAT,
        normalize: true,
        stride: 4,
        offset: 4,
      });
    });
  });

  describe('when creating buffer with incorrect parameters', () => {
    it('should throw on too large stride', () => {
      expect(() => new WebGLBufferDescriptor(0, { buffer: 0 }, 1, GL_FLOAT, 4, 256)).toThrow();
    });

    it('should throw on negative stride', () => {
      expect(() => new WebGLBufferDescriptor(0, { buffer: 0 }, 1, GL_FLOAT, 4, -1)).toThrow();
    });

    it('should throw when offset is not multiple of type size', () => {
      expect(() => new WebGLBufferDescriptor(0, { buffer: 0 }, 1, GL_FLOAT, 2)).toThrow();
    });

    it('should throw when type is not supported', () => {
      expect(() => new WebGLBufferDescriptor(0, { buffer: 0 }, 1, GL_HALF_FLOAT, 4, 0)).toThrow();
    });
  });
});

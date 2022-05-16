import WebGLVertexLayout from 'cawgl/WebGLVertexLayout';
import WebGLBufferDescriptor from 'cawgl/WebGLBufferDescriptor';
import {
  describe,
  expect,
  beforeAll,
  afterAll,
  it,
  jest,
} from '@jest/globals';

describe('Layout class', () => {
  let constants;

  beforeAll(() => {
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl2');

    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(0, 1, 1, 0), gl.STATIC_DRAW);

    const bufferDescriptors = [
      new WebGLBufferDescriptor(0, { buffer }, 2, gl.FLOAT),
      new WebGLBufferDescriptor(1, { buffer }, 2, gl.FLOAT),
      new WebGLBufferDescriptor(2, { buffer }, 2, gl.FLOAT, 0, 8, false, 1),
    ];

    constants = { gl, bufferDescriptors };
  });

  afterAll(() => {
    const { gl, bufferDescriptors } = constants;

    gl.deleteBuffer(bufferDescriptors.buffer);
  });

  describe('when creating new instance', () => {
    it('should create valid WebGL vertex array', () => {
      const { gl } = constants;
      const webglLayout = new WebGLVertexLayout(gl);

      // Layout gets committed to WebGL memory after a bind.
      webglLayout.bind();

      expect(gl.isVertexArray(webglLayout.vao)).toBe(true);
    });
  });

  describe('when binding to context', () => {
    it('should bind correct buffer to location', () => {
      const { gl, bufferDescriptors } = constants;
      const buffer = bufferDescriptors[0];
      const webglLayout = new WebGLVertexLayout(gl);

      webglLayout.configureBuffers([buffer]);

      expect(gl.getVertexAttrib(buffer.location, gl.VERTEX_ATTRIB_ARRAY_BUFFER_BINDING))
        .toStrictEqual(buffer.buffer);
      expect(gl.getVertexAttrib(buffer.location, gl.VERTEX_ATTRIB_ARRAY_STRIDE))
        .toBe(buffer.stride);
      expect(gl.getVertexAttrib(buffer.location, gl.VERTEX_ATTRIB_ARRAY_TYPE))
        .toBe(gl.FLOAT);
      expect(gl.getVertexAttrib(buffer.location, gl.VERTEX_ATTRIB_ARRAY_NORMALIZED))
        .toBe(buffer.normalize);
      expect(gl.getVertexAttrib(buffer.location, gl.VERTEX_ATTRIB_ARRAY_SIZE))
        .toBe(buffer.size);
      expect(gl.getVertexAttrib(buffer.location, gl.VERTEX_ATTRIB_ARRAY_ENABLED))
        .toBe(true);
      expect(gl.getVertexAttrib(buffer.location, gl.VERTEX_ATTRIB_ARRAY_DIVISOR))
        .toBe(0);
    });

    it('should bind correct buffers to location', () => {
      const { gl, bufferDescriptors } = constants;
      const webglLayout = new WebGLVertexLayout(gl);

      webglLayout.configureBuffers(bufferDescriptors);
      bufferDescriptors.forEach((buffer) => {
        expect(gl.getVertexAttrib(buffer.location, gl.VERTEX_ATTRIB_ARRAY_BUFFER_BINDING))
          .toStrictEqual(buffer.buffer);
        expect(gl.getVertexAttrib(buffer.location, gl.VERTEX_ATTRIB_ARRAY_STRIDE))
          .toBe(buffer.stride);
        expect(gl.getVertexAttrib(buffer.location, gl.VERTEX_ATTRIB_ARRAY_TYPE))
          .toBe(buffer.type);
        expect(gl.getVertexAttrib(buffer.location, gl.VERTEX_ATTRIB_ARRAY_NORMALIZED))
          .toBe(buffer.normalize);
        expect(gl.getVertexAttrib(buffer.location, gl.VERTEX_ATTRIB_ARRAY_SIZE))
          .toBe(buffer.size);
        expect(gl.getVertexAttrib(buffer.location, gl.VERTEX_ATTRIB_ARRAY_ENABLED))
          .toBe(true);
        expect(gl.getVertexAttrib(buffer.location, gl.VERTEX_ATTRIB_ARRAY_DIVISOR))
          .toBe(buffer.divisor);
      });
    });

    it('should call drawArrays with correct parameters', () => {
      const { gl } = constants;
      gl.drawArrays = jest.fn();
      const webglLayout = new WebGLVertexLayout(gl);

      webglLayout.draw(gl.TRIANGLES, 0, 2);

      expect(gl.drawArrays).toBeCalledWith(gl.TRIANGLES, 0, 2);
    });
  });

  describe('when disposing layout', () => {
    it('should correctly delete vertex attrib array', () => {
      const { gl } = constants;
      const webglLayout = new WebGLVertexLayout(gl);

      webglLayout.bind();
      webglLayout.dispose();

      expect(gl.isVertexArray(webglLayout.vao)).toBe(false);
    });

    it('should not delete used buffers in the vertex attrib', () => {
      const { gl, bufferDescriptors } = constants;
      const webglLayout = new WebGLVertexLayout(gl);

      webglLayout.configureBuffers(bufferDescriptors);
      webglLayout.dispose();

      expect(gl.isBuffer(bufferDescriptors[0].buffer)).toBe(true);
    });
  });
});

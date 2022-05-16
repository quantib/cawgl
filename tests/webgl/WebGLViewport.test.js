import WebGLViewport from 'cawgl/WebGLViewport';
import {
  describe,
  expect,
  beforeAll,
  beforeEach,
  it,
} from '@jest/globals';

const CANVAS_WIDTH = 4;
const CANVAS_HEIGHT = 4;

describe('WebGLViewport class', () => {
  let gl;

  beforeAll(() => {
    const canvas = document.createElement('canvas');
    canvas.width = CANVAS_WIDTH;
    canvas.height = CANVAS_HEIGHT;
    gl = canvas.getContext('webgl2');
  });

  describe('when creating new instance', () => {
    it('should create valid instance', () => {
      const viewport = new WebGLViewport(gl, 0, 2, 15, 10);
      expect(viewport.gl).toBe(gl);
      expect(viewport.width).toBe(15);
      expect(viewport.height).toBe(10);
      expect(viewport.left).toBe(0);
      expect(viewport.top).toBe(2);
    });

    it('default constructed should fill whole canvas', () => {
      const viewport = new WebGLViewport(gl);
      expect(viewport.width).toBe(4);
      expect(viewport.height).toBe(4);
      expect(viewport.left).toBe(0);
      expect(viewport.top).toBe(0);
    });

    it('should throw on invalid parameters', () => {
      expect(() => new WebGLViewport(gl, 0, 0, -1, -1))
        .toThrowError('Width and height have to be larger than 0');
    });
  });

  describe('when rendering to viewport', () => {
    beforeEach(() => {
      const viewport = new WebGLViewport(gl, 0, 0, 1, 1);
      viewport.renderToViewport();
    });

    it('should set gl scissor state', () => {
      expect(gl.getParameter(gl.SCISSOR_TEST)).toBe(true);
      expect(gl.getParameter(gl.SCISSOR_BOX)).toEqual(new Int32Array([0, 3, 1, 1]));
    });

    it('should set gl viewport state', () => {
      expect(gl.getParameter(gl.VIEWPORT)).toEqual(new Int32Array([0, 3, 1, 1]));
    });

    it('should not clear outside of pixels', () => {
      gl.clearColor(1.0, 0.0, 0.0, 1.0);
      gl.clear(gl.COLOR_BUFFER_BIT);
      const buffer = new Uint8Array(2 * 2 * 4);
      gl.readPixels(0, 2, 2, 2, gl.RGBA, gl.UNSIGNED_BYTE, buffer);
      expect(buffer).toEqual(new Uint8Array([
        0, 0, 0, 0,
        0, 0, 0, 0,
        255, 0, 0, 255,
        0, 0, 0, 0,
      ]));
    });
  });

  describe('when adjusting the viewport', () => {
    let viewport;
    beforeEach(() => {
      viewport = new WebGLViewport(gl, 0, 0, 1, 1);
    });

    it('should change bounds when setBounds is called', () => {
      viewport.setBounds(1, 1, 2, 2);
      expect(viewport.left).toBe(1);
      expect(viewport.top).toBe(1);
      expect(viewport.width).toBe(2);
      expect(viewport.height).toBe(2);
    });

    it('should throw on invalid bounds', () => {
      expect(() => viewport.setBounds(0, 0, -20, -10))
        .toThrowError('Width and height have to be larger than 0');
    });
  });
});

import WebGLTexture2D from 'cawgl/WebGLTexture2D';
import WebGLShader from 'cawgl/WebGLShader';
import getWebGL from '@jest-utils/getWebGL';
import {
  describe,
  expect,
  beforeAll,
  it,
  beforeEach,
} from '@jest/globals';

// opted for a complexer strategy because of discrepancy between ANGLE/OpenGL implementation
// which would mean some tests will fail because of faulty reads
const getPixels = (gl, texture) => {
  // Read back buffer from the canvas we created our context on.
  const pixels = new Uint8Array(4 * 2 * 2);
  // We create a shader that draws a 2x2 point on the canvas
  const shader = new WebGLShader(
    gl,
    `#version 300 es
    void main() {
      gl_Position = vec4(0, 0, 0, 1.0); 
      gl_PointSize = 2.0;
    }`,
    `#version 300 es
      precision highp float;
      uniform sampler2D image;
      out vec4 color;
      void main() { 
        color = texelFetch(image, ivec2(gl_FragCoord.x, gl_FragCoord.y), 0);
      }`,
  );
  // compile and bind the shader so it is ready to draw
  shader.compile();
  shader.bind();
  // upload needed data to render the correct slice
  shader.uniforms.image(texture);
  // draw one point
  gl.drawArrays(gl.POINTS, 0, 1);
  // read back data from canvas
  gl.readPixels(0, 0, 2, 2, gl.RGBA, gl.UNSIGNED_BYTE, pixels);
  // dispose our shader since its not needed anymore
  shader.dispose();
  return pixels;
};

describe('2D texture class', () => {
  let gl;
  let texture;

  beforeAll(() => {
    const context = getWebGL();
    gl = context.gl;
    context.canvas.width = 2;
    context.canvas.height = 2;
    gl.viewport(0, 0, 2, 2);
  });

  describe('when using byte data', () => {
    let redSquareCanvas;
    let redSquare;
    let blackSquare;
    let blackSquareCanvas;
    beforeAll(() => {
      redSquare = new Uint8Array([
        255, 0, 0, 255,
        255, 0, 0, 255,
        255, 0, 0, 255,
        255, 0, 0, 255,
      ]);

      blackSquare = new Uint8Array([
        0, 0, 0, 255,
      ]);

      redSquareCanvas = document.createElement('canvas');
      redSquareCanvas.width = 2;
      redSquareCanvas.height = 2;
      let ctx = redSquareCanvas.getContext('2d');
      ctx.fillStyle = 'red';
      ctx.fillRect(0, 0, 2, 2);

      blackSquareCanvas = document.createElement('canvas');
      blackSquareCanvas.width = 1;
      blackSquareCanvas.height = 1;
      ctx = blackSquareCanvas.getContext('2d');
      ctx.fillStyle = 'black';
      ctx.fillRect(0, 0, 1, 1);
    });

    beforeEach(() => {
      texture = new WebGLTexture2D(gl, gl.RGBA8, gl.RGBA, gl.UNSIGNED_BYTE);
      texture.setFilter(gl.NEAREST, gl.NEAREST);
    });

    describe('when creating a new instance', () => {
      it('should bind to correct target', () => {
        texture.bind();
        expect(gl.getParameter(gl.TEXTURE_BINDING_2D)).toBe(texture.texture);
      });
    });

    describe('when creating new texture', () => {
      it('should upload typed array data', () => {
        texture.uploadData(2, 2, redSquare);
        expect(getPixels(gl, texture)).toEqual(redSquare);
      });

      it('should upload image based data', () => {
        texture.uploadImage(redSquareCanvas);
        expect(getPixels(gl, texture)).toEqual(redSquare);
      });
    });

    describe('when updating texture', () => {
      it('should update texture with image', () => {
        texture.uploadImage(redSquareCanvas);
        texture.subUploadImage(0, 0, blackSquareCanvas);
        expect(getPixels(gl, texture)).toEqual(new Uint8Array([
          0, 0, 0, 255,
          255, 0, 0, 255,
          255, 0, 0, 255,
          255, 0, 0, 255,
        ]));

        texture.uploadImage(redSquareCanvas);
        texture.subUploadImage(1, 0, blackSquareCanvas);
        expect(getPixels(gl, texture)).toEqual(new Uint8Array([
          255, 0, 0, 255,
          0, 0, 0, 255,
          255, 0, 0, 255,
          255, 0, 0, 255,
        ]));
      });

      it('should update texture with data', () => {
        texture.uploadImage(redSquareCanvas);
        texture.subUploadData(1, 1, blackSquare, 1, 1);
        expect(getPixels(gl, texture)).toEqual(new Uint8Array([
          255, 0, 0, 255,
          255, 0, 0, 255,
          255, 0, 0, 255,
          0, 0, 0, 255,
        ]));
        texture.uploadImage(redSquareCanvas);
        texture.subUploadData(0, 1, blackSquare, 1, 1);
        expect(getPixels(gl, texture)).toEqual(new Uint8Array([
          255, 0, 0, 255,
          255, 0, 0, 255,
          0, 0, 0, 255,
          255, 0, 0, 255,
        ]));
      });

      it('should throw error on x out of bounds with image', () => {
        expect(() => texture.subUploadImage(1, 0, redSquareCanvas))
          .toThrowError('Given offset and image dimensions are not within texture bounds.');
      });

      it('should throw error on y out of bounds with image', () => {
        expect(() => texture.subUploadImage(0, 1, redSquareCanvas))
          .toThrowError('Given offset and image dimensions are not within texture bounds.');
      });

      it('should throw error on x out of bounds with image', () => {
        expect(() => texture.subUploadData(1, 0, redSquare, 2, 2))
          .toThrowError('Given offset and image dimensions are not within texture bounds.');
      });

      it('should throw error on y out of bounds with image', () => {
        expect(() => texture.subUploadData(0, 1, redSquare, 2, 2))
          .toThrowError('Given offset and image dimensions are not within texture bounds.');
      });
    });
  });

  describe('when using float Data', () => {
    let floatData;
    let redPixelFloat;

    beforeAll(() => {
      floatData = new Float32Array([
        0.5, 0.5, 0.5, 0.5,
      ]);

      redPixelFloat = new Float32Array([1.0]);
    });

    beforeEach(() => {
      texture = new WebGLTexture2D(gl, gl.R32F, gl.RED, gl.FLOAT);
      texture.setFilter(gl.NEAREST, gl.NEAREST);
    });
    describe('when creating new texture', () => {
      it('should upload float data', () => {
        texture.setFilter(gl.NEAREST, gl.NEAREST);
        texture.uploadData(2, 2, floatData);

        expect(getPixels(gl, texture)).toEqual(new Uint8Array([
          127, 0, 0, 255,
          127, 0, 0, 255,
          127, 0, 0, 255,
          127, 0, 0, 255,
        ]));
      });
    });

    describe('when updating texture', () => {
      it('should update texture with float data', () => {
        texture = new WebGLTexture2D(gl, gl.R32F, gl.RED, gl.FLOAT);
        texture.setFilter(gl.NEAREST, gl.NEAREST);
        texture.uploadData(2, 2, floatData);
        texture.subUploadData(1, 1, redPixelFloat, 1, 1);
        expect(getPixels(gl, texture)).toEqual(new Uint8Array([
          127, 0, 0, 255,
          127, 0, 0, 255,
          127, 0, 0, 255,
          255, 0, 0, 255,
        ]));

        texture.uploadData(2, 2, floatData);
        texture.subUploadData(0, 1, redPixelFloat, 1, 1);
        expect(getPixels(gl, texture)).toEqual(new Uint8Array([
          127, 0, 0, 255,
          127, 0, 0, 255,
          255, 0, 0, 255,
          127, 0, 0, 255,
        ]));
      });
    });
  });
});

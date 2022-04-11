import WebGLShader from 'cawgl/WebGLShader';
import WebGLTexture3D from 'cawgl/WebGLTexture3D';
import getWebGL from '@jest-utils/getWebGL';
import {
  describe,
  expect,
  beforeAll,
  it,
} from '@jest/globals';

// Opted for a complexer strategy because of discrepancy between ANGLE/OpenGL implementation
// which would mean some tests will fail because of faulty reads.
const getPixels = (gl, texture, layer) => {
  // Read back buffer from the canvas we created our context on.
  const pixels = new Uint8Array(4 * 2 * 2);
  // We create a shader that draws a 2x2 point on the canvas
  const shader = new WebGLShader(gl,
    `#version 300 es
    void main() {
      gl_Position = vec4(0, 0, 0, 1.0); 
      gl_PointSize = 2.0;
    }`,
    `#version 300 es
      precision highp float;
      precision highp int;
      precision highp sampler3D;
      uniform sampler3D image;
      uniform int layer;
      out vec4 color;
      void main() { 
        color = texelFetch(image, ivec3(gl_FragCoord.x, gl_FragCoord.y, layer), 0);
      }`);
  // Compile and bind the shader so it is ready to draw
  shader.compile();
  shader.bind();
  // Upload needed data to render the correct slice.
  shader.uniforms.image(texture);
  shader.uniforms.layer(layer);
  // Draw one point.
  gl.drawArrays(gl.POINTS, 0, 1);
  // Read back data from canvas.
  gl.readPixels(0, 0, 2, 2, gl.RGBA, gl.UNSIGNED_BYTE, pixels);
  // Dispose our shader since its not needed anymore.
  shader.dispose();
  return pixels;
};

describe('3D texture class', () => {
  let gl;
  let texture;

  describe('when using byte data', () => {
    let redDataCanvas;
    let redDataArray;
    let blackPixelData;
    let blackPixelCanvas;

    beforeAll(async () => {
      const context = await getWebGL();
      gl = context.gl;
      context.canvas.width = 2;
      context.canvas.height = 2;
      gl.viewport(0, 0, 2, 2);
      redDataArray = new Uint8Array([
        255, 0, 0, 255, // 0, 0, 0
        255, 0, 0, 255, // 1, 0, 0
        255, 0, 0, 255, // 0, 1, 0
        255, 0, 0, 255, // 1, 1, 0,
        255, 0, 0, 255, // 0, 0, 1,
        255, 0, 0, 255, // 1, 0, 1,
        255, 0, 0, 255, // 0, 1, 1
        255, 0, 0, 255, // 1, 1, 1
      ]);

      blackPixelData = new Uint8Array([
        0, 0, 0, 255,
      ]);

      let ctx;
      redDataCanvas = document.createElement('canvas');
      redDataCanvas.width = 2;
      redDataCanvas.height = 2 * 2;
      ctx = redDataCanvas.getContext('2d');
      ctx.fillStyle = 'red';
      ctx.fillRect(0, 0, 2, 4);

      blackPixelCanvas = document.createElement('canvas');
      blackPixelCanvas.width = 1;
      blackPixelCanvas.height = 1;
      ctx = blackPixelCanvas.getContext('2d');
      ctx.fillStyle = 'black';
      ctx.fillRect(0, 0, 1, 1);
    });

    beforeEach(() => {
      texture = new WebGLTexture3D(gl, gl.RGBA8, gl.RGBA, gl.UNSIGNED_BYTE, 2, 2, 2);
    });

    afterEach(() => {
      texture.dispose();
    });

    describe('when creating new instance', () => {
      it('should bind to correct target', () => {
        expect(gl.getParameter(gl.TEXTURE_BINDING_3D)).toBe(texture.texture);
      });

      it('should throw on generic storage attributes', () => {
        /**
           * we expect this to throw because of an ambiguous internal format since WebGL cannot
           * infer a type from the data we pass. It does not know what to allocate.
           * The constructor will also throw the same error on an out of memory issue
           */
        expect(() => new WebGLTexture3D(
          gl,
          gl.RGB,
          gl.RGB,
          gl.UNSIGNED_BYTE,
          128,
          128,
          128,
        )).toThrow();
      });
    });

    describe('when uploading correct data', () => {
      it('when uploading texture with data', () => {
        texture.uploadData(redDataArray, 2, 2, 2);
        expect(getPixels(gl, texture, 0)).toEqual(redDataArray.slice(0, 2 * 2 * 4));
        expect(getPixels(gl, texture, 1)).toEqual(redDataArray.slice(2 * 2 * 4));
      });

      it('when uploading the texture with an image', () => {
        texture.uploadImage(redDataCanvas, 2, 2);
        expect(getPixels(gl, texture, 0)).toEqual(redDataArray.slice(0, 2 * 2 * 4));
        expect(getPixels(gl, texture, 1)).toEqual(redDataArray.slice(2 * 2 * 4));
      });

      it('updating part of the texture with data, without offsets', () => {
        texture.uploadData(blackPixelData, 1, 1, 1);
        expect(getPixels(gl, texture, 0)).toEqual(new Uint8Array([
          0, 0, 0, 255,
          0, 0, 0, 0,
          0, 0, 0, 0,
          0, 0, 0, 0,
        ]));
      });

      it('updating part of the texture with data, with offset', () => {
        texture.uploadData(blackPixelData, 1, 1, 1, 0, 1);
        expect(getPixels(gl, texture, 0)).toEqual(new Uint8Array([
          0, 0, 0, 0,
          0, 0, 0, 0,
          0, 0, 0, 255,
          0, 0, 0, 0,
        ]));

        texture.uploadData(blackPixelData, 1, 1, 1, 1, 1, 1);
        expect(getPixels(gl, texture, 1)).toEqual(new Uint8Array([
          0, 0, 0, 0,
          0, 0, 0, 0,
          0, 0, 0, 0,
          0, 0, 0, 255,
        ]));
      });

      it('updating part of the texture with an image, without offset', () => {
        texture.uploadImage(blackPixelCanvas, 1, 1);
        expect(getPixels(gl, texture, 0)).toEqual(new Uint8Array([
          0, 0, 0, 255,
          0, 0, 0, 0,
          0, 0, 0, 0,
          0, 0, 0, 0,
        ]));
      });

      it('updating part of the texture with an image, with offset', () => {
        texture.uploadImage(blackPixelCanvas, 1, 1, 1, 1, 0);
        expect(getPixels(gl, texture, 0)).toEqual(new Uint8Array([
          0, 0, 0, 0,
          0, 0, 0, 0,
          0, 0, 0, 0,
          0, 0, 0, 255,
        ]));

        texture.uploadImage(blackPixelCanvas, 1, 1, 0, 1, 1);
        expect(getPixels(gl, texture, 1)).toEqual(new Uint8Array([
          0, 0, 0, 0,
          0, 0, 0, 0,
          0, 0, 0, 255,
          0, 0, 0, 0,
        ]));
      });
    });

    describe('when uploading incorrect data', () => {
      it('should throw with image outside of volume', () => {
        expect(() => texture.uploadImage(blackPixelCanvas, 1, 1, 2))
          .toThrowError('Given offset and image dimensions are not within texture bounds.');
      });

      it('should throw with data outside of volume', () => {
        expect(() => texture.uploadData(blackPixelData, 1, 1, 1, 2))
          .toThrowError('Given offset and image dimensions are not within texture bounds.');
      });
    });
  });

  describe('when using float data', () => {
    beforeEach(() => {
      texture = new WebGLTexture3D(gl, gl.R32F, gl.RED, gl.FLOAT, 2, 2, 2);
    });

    afterEach(() => {
      texture.dispose();
    });

    it('should upload float data', () => {
      texture.setFilter(gl.NEAREST, gl.NEAREST);
      texture.uploadData(new Float32Array([
        0.5, 1.0, 0.0, 0.5,
        1.0, 0.0, 1.0, 0.5,
      ]), 2, 2, 2);

      expect(getPixels(gl, texture, 0)).toEqual(new Uint8Array([
        128, 0, 0, 255,
        255, 0, 0, 255,
        0, 0, 0, 255,
        128, 0, 0, 255,
      ]));

      expect(getPixels(gl, texture, 1)).toEqual(new Uint8Array([
        255, 0, 0, 255,
        0, 0, 0, 255,
        255, 0, 0, 255,
        128, 0, 0, 255,
      ]));
    });
  });
});

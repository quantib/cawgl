import WebGLShader from 'cawgl/WebGLShader';
import WebGLTexture2DArray from 'cawgl/WebGLTexture2DArray';
import getWebGL from '@jest-utils/getWebGL';
import {
  describe,
  expect,
  beforeAll,
  beforeEach,
  afterEach,
  it,
} from '@jest/globals';

// opted for a complexer strategy because of discrepancy between ANGLE/OpenGL implementation
// which would mean some tests will fail because of faulty reads
const getPixels = (gl, texture, layer) => {
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
      precision highp int;
      precision highp sampler2DArray;
      uniform sampler2DArray image;
      uniform int layer;
      out vec4 color;
      void main() { 
        color = texelFetch(image, ivec3(gl_FragCoord.x, gl_FragCoord.y, layer), 0);
      }`,
  );
  // compile and bind the shader so it is ready to draw
  shader.compile();
  shader.bind();
  // upload needed data to render the correct slice
  shader.uniforms.image(texture);
  shader.uniforms.layer(layer);
  // draw one point
  gl.drawArrays(gl.POINTS, 0, 1);
  // read back data from canvas
  gl.readPixels(0, 0, 2, 2, gl.RGBA, gl.UNSIGNED_BYTE, pixels);
  // dispose our shader since its not needed anymore
  shader.dispose();
  return pixels;
};

describe('2D array texture class', () => {
  let gl;
  let texture;

  afterEach(() => {
    texture.dispose();
  });

  beforeAll(async () => {
    const context = await getWebGL();
    gl = context.gl;
    context.canvas.width = 2;
    context.canvas.height = 2;
    gl.viewport(0, 0, 2, 2);
  });

  describe('when using byte data', () => {
    let redLayerData;
    let redLayerCanvas;
    let blueLayerData;
    let blueLayerCanvas;
    let blackPixelCanvas;
    let blackPixelData;
    beforeEach(() => {
      texture = new WebGLTexture2DArray(gl, gl.RGBA8, gl.RGBA, gl.UNSIGNED_BYTE, 2, 2, 2);
    });

    afterEach(() => {
      texture.dispose();
    });

    beforeAll(() => {
      redLayerData = new Uint8Array([
        255, 0, 0, 255,
        255, 0, 0, 255,
        255, 0, 0, 255,
        255, 0, 0, 255,
      ]);

      blueLayerData = new Uint8Array([
        0, 255, 0, 255,
        0, 255, 0, 255,
        0, 255, 0, 255,
        0, 255, 0, 255,
      ]);

      blackPixelData = new Uint8Array([
        0, 0, 0, 255,
      ]);

      let ctx;
      blackPixelCanvas = document.createElement('canvas');
      blackPixelCanvas.width = 1;
      blackPixelCanvas.height = 1;
      ctx = blackPixelCanvas.getContext('2d');
      ctx.fillStyle = 'black';
      ctx.fillRect(0, 0, 1, 1);

      redLayerCanvas = document.createElement('canvas');
      redLayerCanvas.width = 2;
      redLayerCanvas.height = 2;
      ctx = redLayerCanvas.getContext('2d');
      ctx.fillStyle = 'red';
      ctx.fillRect(0, 0, 2, 2);

      blueLayerCanvas = document.createElement('canvas');
      blueLayerCanvas.width = 2;
      blueLayerCanvas.height = 2;
      ctx = blueLayerCanvas.getContext('2d');
      ctx.fillStyle = 'blue';
      ctx.fillRect(0, 0, 2, 2);
    });

    describe('when creating a new instance', () => {
      it('should bind to correct target', () => {
        expect(gl.getParameter(gl.TEXTURE_BINDING_2D_ARRAY)).toBe(texture.texture);
      });

      it('should throw on generic storage attributes', () => {
        /**
         *  we expect this to throw because of an ambiguous internal format since WebGL cannot infer
         *  a type from the data we pass. It does not know what to allocate.
         *  The constructor will also throw the same error on an out of memory issue
         */
        expect(() => new WebGLTexture2DArray(
          gl,
          gl.RGB,
          gl.RGB,
          gl.UNSIGNED_BYTE,
          127,
          127,
          127,
        )).toThrow();
      });
    });

    describe('when uploading texture with correct data', () => {
      it('should upload texture, to layer with image', () => {
        texture.uploadImage(redLayerCanvas, 0);
        expect(getPixels(gl, texture, 0)).toEqual(redLayerData);
      });

      it('should upload texture, to layer with image, with offset', () => {
        texture.uploadImage(redLayerCanvas, 1);
        expect(getPixels(gl, texture, 1)).toEqual(redLayerData);
      });

      it('should upload texture, to layer with data', () => {
        texture.uploadData(blueLayerData, 2, 2, 0);
        expect(getPixels(gl, texture, 0)).toEqual(blueLayerData);

        texture.uploadData(blueLayerData, 2, 2, 1);
        expect(getPixels(gl, texture, 1)).toEqual(blueLayerData);
      });

      it('should upload texture, to layer with data, with offset', () => {
        texture.uploadData(blueLayerData, 2, 2, 0);
        expect(getPixels(gl, texture, 0)).toEqual(blueLayerData);

        texture.uploadData(blueLayerData, 2, 2, 1);
        expect(getPixels(gl, texture, 1)).toEqual(blueLayerData);
      });

      it('should upload pixel to texture on x/y/z offset with image', () => {
        texture.uploadImage(blackPixelCanvas, 0, 1, 1);
        expect(getPixels(gl, texture, 0)).toEqual(new Uint8Array([
          0, 0, 0, 0,
          0, 0, 0, 0,
          0, 0, 0, 0,
          0, 0, 0, 255,
        ]));

        texture.uploadImage(blackPixelCanvas, 1, 0, 1);
        expect(getPixels(gl, texture, 1)).toEqual(new Uint8Array([
          0, 0, 0, 0,
          0, 0, 0, 0,
          0, 0, 0, 255,
          0, 0, 0, 0,
        ]));
      });

      it('should upload pixel to texture on x/y/z offset with data', () => {
        texture.uploadData(blackPixelData, 1, 1, 0, 1, 1);
        expect(getPixels(gl, texture, 0)).toEqual(new Uint8Array([
          0, 0, 0, 0,
          0, 0, 0, 0,
          0, 0, 0, 0,
          0, 0, 0, 255,
        ]));

        texture.uploadData(blackPixelData, 1, 1, 1, 1, 0);
        expect(getPixels(gl, texture, 1)).toEqual(new Uint8Array([
          0, 0, 0, 0,
          0, 0, 0, 255,
          0, 0, 0, 0,
          0, 0, 0, 0,
        ]));
      });
    });

    describe('when uploading texture with incorrect data', () => {
      it('should throw when trying to allocate a layer larger than the given width', () => {
        expect(() => texture.uploadData(undefined, 3, 2, 0))
          .toThrowError('Given offset and image dimensions are not within texture bounds.');
      });

      it('should throw when trying to allocate a layer larger than the given height', () => {
        expect(() => texture.uploadData(undefined, 2, 3, 0))
          .toThrowError('Given offset and image dimensions are not within texture bounds.');
      });

      it('should throw when trying to allocate an image larger than the given width', () => {
        expect(() => texture.uploadImage({ width: 3, height: 2 }, 0))
          .toThrowError('Given offset and image dimensions are not within texture bounds.');
      });

      it('should throw when trying to allocate an image larger than the given height', () => {
        expect(() => texture.uploadImage({ width: 2, height: 3 }, 0))
          .toThrowError('Given offset and image dimensions are not within texture bounds.');
      });
    });
  });

  describe('when using float data', () => {
    let floatTexture;
    beforeEach(() => {
      texture = new WebGLTexture2DArray(gl, gl.R32F, gl.RED, gl.FLOAT, 2, 2, 2);
      texture.setFilter(gl.NEAREST, gl.NEAREST);
    });

    beforeAll(() => {
      floatTexture = new Float32Array([0.5, 1.0, 0.5, 0.0]);
    });

    describe('when creating uploading texture with float data', () => {
      it('should support float textures', () => {
        texture.uploadData(floatTexture, 2, 2, 0);
        texture.uploadData(floatTexture.reverse(), 2, 2, 1);
        expect(gl.getError()).toBe(0);
        expect(getPixels(gl, texture, 0)).toEqual(new Uint8Array([
          127, 0, 0, 255,
          255, 0, 0, 255,
          127, 0, 0, 255,
          0, 0, 0, 255,
        ]));
        expect(getPixels(gl, texture, 1)).toEqual(new Uint8Array([
          0, 0, 0, 255,
          127, 0, 0, 255,
          255, 0, 0, 255,
          127, 0, 0, 255,
        ]));
      });
    });
  });
});

import WebGLBaseTexture from 'cawgl/WebGLBaseTexture';
import {
  describe,
  it,
  expect,
  beforeAll,
} from '@jest/globals';
import getWebGL from '@jest-utils/getWebGL';

describe('Base texture class', () => {
  let gl;
  let texture;
  beforeAll(async () => {
    gl = (await getWebGL()).gl;
    texture = new WebGLBaseTexture(gl, gl.TEXTURE_2D, gl.RGBA, gl.UNSIGNED_BYTE);
  });

  describe('when creating a new instance', () => {
    it(' should create a valid texture?', () => {
      texture.bind();
      expect(gl.isTexture(texture.texture)).toBe(true);
    });
  });

  describe('when binding texture', () => {
    it('should bind to default binding slot', () => {
      texture.bind();
      expect(gl.getParameter(gl.ACTIVE_TEXTURE)).toBe(gl.TEXTURE0);
      expect(gl.getParameter(gl.TEXTURE_BINDING_2D)).toBe(texture.texture);
    });

    it('should bind to custom binding slot', () => {
      texture.bind(2);
      expect(gl.getParameter(gl.ACTIVE_TEXTURE)).toBe(gl.TEXTURE2);
      expect(gl.getParameter(gl.TEXTURE_BINDING_2D)).toBe(texture.texture);
    });
  });

  describe('when setting parameters', () => {
    it('should set filters to wrap', () => {
      texture.setWrapModeToRepeat();
      expect(gl.getTexParameter(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S)).toBe(gl.REPEAT);
      expect(gl.getTexParameter(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T)).toBe(gl.REPEAT);
      expect(gl.getTexParameter(gl.TEXTURE_2D, gl.TEXTURE_WRAP_R)).toBe(gl.REPEAT);
    });

    it('should set filters to clamp', () => {
      texture.setWrapModeToClamp();
      expect(gl.getTexParameter(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S)).toBe(gl.CLAMP_TO_EDGE);
      expect(gl.getTexParameter(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T)).toBe(gl.CLAMP_TO_EDGE);
      expect(gl.getTexParameter(gl.TEXTURE_2D, gl.TEXTURE_WRAP_R)).toBe(gl.CLAMP_TO_EDGE);
    });

    it('should set filters to mirror', () => {
      texture.setWrapModeToMirror();
      expect(gl.getTexParameter(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S)).toBe(gl.MIRRORED_REPEAT);
      expect(gl.getTexParameter(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T)).toBe(gl.MIRRORED_REPEAT);
      expect(gl.getTexParameter(gl.TEXTURE_2D, gl.TEXTURE_WRAP_R)).toBe(gl.MIRRORED_REPEAT);
    });

    it('should set filter for both min and mag when providing one parameter', () => {
      texture.setFilter(gl.NEAREST);
      expect(gl.getTexParameter(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER)).toBe(gl.NEAREST);
      expect(gl.getTexParameter(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER)).toBe(gl.NEAREST);
    });

    it('should set filters for min and mag separately, when providing two parameters', () => {
      texture.setFilter(gl.NEAREST, gl.LINEAR);
      expect(gl.getTexParameter(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER)).toBe(gl.NEAREST);
      expect(gl.getTexParameter(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER)).toBe(gl.LINEAR);
    });
  });

  describe('when deleting instance', () => {
    it('should dispose texture', () => {
      texture.dispose();
      expect(gl.isTexture(texture.texture)).toBe(false);
    });
  });
});

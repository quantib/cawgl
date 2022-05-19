import {
  beforeAll, describe, it, expect, jest,
} from '@jest/globals';
import getWebGL from '@jest-utils/getWebGL';
import WebGLFBO from 'cawgl/WebGLFBO';
import WebGLTexture2D from 'cawgl/WebGLTexture2D';

const getFbo = (gl) => new WebGLFBO(gl, 512, 512, [{
  attachmentPoint: gl.COLOR_ATTACHMENT0,
  texture: new WebGLTexture2D(gl, gl.RGBA8, gl.RGBA, gl.UNSIGNED_BYTE),
}]);

const getFBOWithRenderBuffer = (gl) => new WebGLFBO(gl, 512, 512, [{
  attachmentPoint: gl.COLOR_ATTACHMENT0,
  texture: new WebGLTexture2D(gl, gl.RGBA8, gl.RGBA, gl.UNSIGNED_BYTE),
}], [
  { attachmentPoint: gl.DEPTH_ATTACHMENT, format: gl.DEPTH_STENCIL },
]);

describe('WebGLFBO class', () => {
  let gl;
  beforeAll(() => {
    gl = getWebGL().gl;
  });

  describe('when creating a new instance', () => {
    it('should correctly setup FBO state', () => {
      // const fbo = getFbo(gl);
      // expect(gl.isFramebuffer(fbo.fbo)).toBe(true);
      // expect(fbo.depthRenderBuffer).toBe(undefined);
      // gl.bindFramebuffer(gl.FRAMEBUFFER, fbo.fbo);
      // expect(gl.getFramebufferAttachmentParameter(
      //   gl.FRAMEBUFFER,
      //   gl.COLOR_ATTACHMENT0,
      //   gl.FRAMEBUFFER_ATTACHMENT_OBJECT_NAME,
      // )).toBe(fbo.attachments[0]);
    });

    describe('with depth as render buffer', () => {
      it('should correctly set up fbo state', () => {
        // const fbo = getFBOWithRenderBuffer(gl);
        // expect(gl.isFramebuffer(fbo.fbo)).toBe(true);
        // expect(gl.isRenderbuffer(fbo.depthRenderBuffer)).toBe(true);
        // gl.bindFramebuffer(gl.FRAMEBUFFER, fbo.fbo);
        // expect(gl.getFramebufferAttachmentParameter(
        //   gl.FRAMEBUFFER,
        //   gl.COLOR_ATTACHMENT0,
        //   gl.FRAMEBUFFER_ATTACHMENT_OBJECT_NAME,
        // )).toBe(fbo.attachments[0]);
      });
    });
  });

  describe('when setting size', () => {
    it('should set the size of the textures', () => {
      const fbo = getFbo(gl);
      fbo.setSize(128, 512);
      const colorTexture = fbo.attachments[0].texture;
      expect(colorTexture.width).toBe(128);
      expect(colorTexture.height).toBe(512);
    });

    describe('with depth as render buffer', () => {
      it('should set size for render buffer', () => {
        const fbo = getFBOWithRenderBuffer(gl);
        fbo.setSize(128, 512);
        expect(gl.getRenderbufferParameter(gl.RENDERBUFFER, gl.RENDERBUFFER_WIDTH)).toBe(128);
        expect(gl.getRenderbufferParameter(gl.RENDERBUFFER, gl.RENDERBUFFER_HEIGHT)).toBe(512);
      });
    });
  });

  describe('when rendering to an FBO', () => {
    it('should bind framebuffer and set viewport', () => {
      const fbo = getFbo(gl);
      fbo.renderTo();
      expect(gl.getParameter(gl.VIEWPORT)).toEqual(new Int32Array([0, 0, 512, 512]));
      expect(gl.getParameter(gl.FRAMEBUFFER_BINDING)).toBe(fbo.fbo);
    });
  });

  describe('when disposing of an FBO', () => {
    it('should dispose of framebuffer', () => {
      gl.deleteFramebuffer = jest.fn();
      const fbo = getFbo(gl);
      fbo.dispose();
      expect(gl.deleteFramebuffer).toBeCalledWith(fbo.fbo);
    });

    describe('with depth as render buffer', () => {
      it('should dispose of render buffer', () => {
        gl.deleteRenderbuffer = jest.fn();
        const fbo = getFBOWithRenderBuffer(gl);
        fbo.dispose();
        expect(gl.deleteRenderbuffer).toBeCalledWith(fbo.renderbufferObjects[0].buffer);
      });
    });
  });
});

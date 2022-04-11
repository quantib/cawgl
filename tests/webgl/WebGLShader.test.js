import WebGLShader from 'cawgl/WebGLShader';
import {
  describe,
  it,
  expect,
  jest,
  beforeEach,
} from '@jest/globals';
import getWebGL from '@jest-utils/getWebGL';

const vertexShaderCode = `#version 300 es\n
precision highp float;
in vec3 position;
in vec3 scale;
out vec3 test;
void main() {
  gl_Position = vec4(position * scale, 1.0);
}`;

const fragmentShaderCode = `#version 300 es\n
precision highp float;
in vec3 test;
out vec4 outColor;
void main() {
  outColor = vec4(test, 1.0);
}`;

const getFragmentShaderCodeWithUniform = (uniform, name) => `#version 300 es\n
precision highp float;
in vec3 test;
out vec4 outColor;
uniform  ${uniform} ${name};

void dummyFunction(in ${uniform} dummyParameter) {}

void main() {
  dummyFunction(${name});
  outColor = vec4(test, 1.0);
}
`;

const uniformCases = [
  ['float', 'uniform1f', [expect.anything(), {}]],
  ['vec2', 'uniform2fv', [expect.anything(), {}]],
  ['vec3', 'uniform3fv', [expect.anything(), {}]],
  ['vec4', 'uniform4fv', [expect.anything(), {}]],
  ['bool', 'uniform1i', [expect.anything(), {}]],
  ['int', 'uniform1i', [expect.anything(), {}]],
  ['ivec2', 'uniform2iv', [expect.anything(), {}]],
  ['bvec2', 'uniform2iv', [expect.anything(), {}]],
  ['ivec3', 'uniform3iv', [expect.anything(), {}]],
  ['bvec3', 'uniform3iv', [expect.anything(), {}]],
  ['ivec4', 'uniform4iv', [expect.anything(), {}]],
  ['bvec4', 'uniform4iv', [expect.anything(), {}]],
  ['mat2', 'uniformMatrix2fv', [expect.anything(), false, {}]],
  ['mat2x3', 'uniformMatrix2x3fv', [expect.anything(), false, {}]],
  ['mat2x4', 'uniformMatrix2x4fv', [expect.anything(), false, {}]],
  ['mat3', 'uniformMatrix3fv', [expect.anything(), false, {}]],
  ['mat3x2', 'uniformMatrix3x2fv', [expect.anything(), false, {}]],
  ['mat3x4', 'uniformMatrix3x4fv', [expect.anything(), false, {}]],
  ['mat4', 'uniformMatrix4fv', [expect.anything(), false, {}]],
  ['mat4x2', 'uniformMatrix4x2fv', [expect.anything(), false, {}]],
  ['mat4x3', 'uniformMatrix4x3fv', [expect.anything(), false, {}]],
];

const samplerCases = [
  ['sampler2D', 'uniform1i', { bind: jest.fn() }],
  ['sampler2D', 'uniform1i', 1],
  ['lowp isampler2D', 'uniform1i', { bind: jest.fn() }],
  ['lowp isampler2DArray', 'uniform1i', { bind: jest.fn() }],
  ['lowp isampler3D', 'uniform1i', { bind: jest.fn() }],
  ['lowp usampler3D', 'uniform1i', { bind: jest.fn() }],
  ['lowp usampler2D', 'uniform1i', { bind: jest.fn() }],
  ['lowp usampler2DArray', 'uniform1i', { bind: jest.fn() }],
  ['lowp sampler3D', 'uniform1i', { bind: jest.fn() }],
  ['lowp sampler2DArray', 'uniform1i', { bind: jest.fn() }],
  ['lowp samplerCube', 'uniform1i', { bind: jest.fn() }],
];

describe('Shader class', () => {
  let gl;

  beforeEach(() => {
    gl = getWebGL().gl;
  });

  describe('when creating a new instance', () => {
    it('should create valid shader', () => {
      const shader = new WebGLShader(gl, '', '');
      expect(gl.isProgram(shader.program)).toBe(true);
    });
  });

  describe('when compiling a shader', () => {
    it('should throw error on invalid compilation', () => {
      const shader = new WebGLShader(gl, '', '');
      expect(() => shader.compile()).toThrow();
    });

    it('should compile successfully', () => {
      const shader = new WebGLShader(gl, vertexShaderCode, fragmentShaderCode);
      expect(() => shader.compile()).not.toThrow();
    });

    it('should have location for active attributes', () => {
      const shader = new WebGLShader(gl, vertexShaderCode, fragmentShaderCode);
      shader.compile();

      expect(shader.attributeBindings.position).toBeDefined();
      expect(shader.attributeBindings.scale).toBeDefined();
    });

    it('should bind attribute to given custom location', () => {
      const shader = new WebGLShader(gl, vertexShaderCode, fragmentShaderCode, [{ name: 'position', location: 1 }]);
      shader.compile();

      expect(shader.attributeBindings.position).toBeDefined();
      expect(shader.attributeBindings.position).toBe(1);
      expect(shader.attributeBindings.scale).toBeDefined();
    });

    it('should bind attribute to given custom locations', () => {
      const shader = new WebGLShader(gl, vertexShaderCode, fragmentShaderCode, [
        { name: 'position', location: 1 },
        { name: 'scale', location: 3 },
      ]);
      shader.compile();

      expect(shader.attributeBindings.position).toBeDefined();
      expect(shader.attributeBindings.position).toBe(1);
      expect(shader.attributeBindings.scale).toBeDefined();
      expect(shader.attributeBindings.scale).toBe(3);
    });

    it('should respect layout qualifier', () => {
      const vertWithLayout = vertexShaderCode.replace('in vec3', 'layout (location=2) in vec3');
      const shader = new WebGLShader(gl, vertWithLayout, fragmentShaderCode, [{ name: 'position', location: 1 }]);
      shader.compile();

      expect(shader.attributeBindings.position).toBeDefined();
      expect(shader.attributeBindings.position).toBe(2);
      expect(shader.attributeBindings.scale).toBeDefined();
    });

    it('should respect layout qualifier, when mixed with custom locations', () => {
      const vertWithLayout = vertexShaderCode.replace('in vec3', 'layout (location=2) in vec3');
      const shader = new WebGLShader(gl, vertWithLayout, fragmentShaderCode, [
        { name: 'position', location: 1 },
        { name: 'scale', location: 3 },
      ]);
      shader.compile();

      expect(shader.attributeBindings.position).toBeDefined();
      expect(shader.attributeBindings.position).toBe(2);
      expect(shader.attributeBindings.scale).toBeDefined();
      expect(shader.attributeBindings.scale).toBe(3);
    });

    it('should throw error on linking', () => {
      const modVert = vertexShaderCode.replace('out vec3 test;', '');
      const shader = new WebGLShader(gl, modVert, fragmentShaderCode);

      expect(shader.compile.bind(shader)).toThrow();
    });

    it.each(uniformCases)('should generate valid setter for %s uniform', (uniform, mockFunction, values) => {
      gl[mockFunction] = jest.fn();
      const shader = new WebGLShader(gl, vertexShaderCode, getFragmentShaderCodeWithUniform(uniform, 'uniformTest'));

      shader.compile();
      shader.uniforms.uniformTest(values[values.length - 1]);
      expect(gl[mockFunction]).toBeCalledWith(...values);
    });

    it('should throw error on unknown type', () => {
      gl.getActiveUniform = jest.fn();
      gl.getActiveUniform.mockReturnValue({
        type: 0,
        name: 'uniformTest',
      });

      const shader = new WebGLShader(gl, vertexShaderCode, getFragmentShaderCodeWithUniform('float', 'uniformTest'));

      expect(() => shader.compile()).toThrowError('Unknown uniform type.');
    });

    it.each(samplerCases)('should generate valid setter for %s', (uniform, mockFunction, value) => {
      const shader = new WebGLShader(gl, vertexShaderCode, getFragmentShaderCodeWithUniform(uniform, 'uniformTest'));
      gl[mockFunction] = jest.fn();

      shader.compile();
      shader.uniforms.uniformTest(value);
      if (value.bind) expect(value.bind).toBeCalledWith(0);
      expect(gl[mockFunction]).toBeCalledWith(expect.anything(), 0);
    });

    it.each(samplerCases)('should bind to non default texture unit %s', (uniform, mockFunction, value) => {
      const shader = new WebGLShader(gl, vertexShaderCode, getFragmentShaderCodeWithUniform(uniform, 'uniformTest'));
      gl[mockFunction] = jest.fn();

      shader.compile();
      shader.uniforms.uniformTest(value, 1);
      if (value.bind) expect(value.bind).toBeCalledWith(1);
      expect(gl[mockFunction]).toBeCalledWith(expect.anything(), 1);
    });
  });

  describe('when disposing shader', () => {
    it('should not be valid after dispose call', () => {
      const shader = new WebGLShader(gl, '', '');

      shader.dispose();

      expect(gl.isProgram(shader.program)).toBe(false);
    });
  });
});

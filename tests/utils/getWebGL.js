export default () => {
  const canvas = document.createElement('canvas');
  const gl = canvas.getContext('webgl2');

  return { canvas, gl };
};

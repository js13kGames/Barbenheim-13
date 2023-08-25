/* eslint-disable @typescript-eslint/no-non-null-assertion */
export function glsl(strings: TemplateStringsArray) {
  return strings as unknown as string;
}

export function createShader(
  gl: WebGL2RenderingContext,
  src: string,
  type: WebGL2RenderingContext["VERTEX_SHADER"] | WebGL2RenderingContext["FRAGMENT_SHADER"],
) {
  const shader = gl.createShader(type)!;
  gl.shaderSource(shader, src);
  gl.compileShader(shader);
  const vsok = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
  if (!vsok) {
    console.error(gl.getShaderInfoLog(shader));
    throw new Error(
      `could not compile ${
        type === WebGL2RenderingContext.VERTEX_SHADER ? "vertex" : "fragment"
      } shader`,
    );
  }
  return shader;
}

export function createProgram(
  gl: WebGL2RenderingContext,
  vertexShader: WebGLShader,
  fragmentShader: WebGLShader,
) {
  const program = gl.createProgram()!;
  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);
  const success = gl.getProgramParameter(program, gl.LINK_STATUS);
  if (!success) {
    console.error(gl.getProgramInfoLog(program));
    throw new Error("could not link shader program");
  }
  gl.useProgram(program);
  return program;
}

export function createCanvas(width = 800, height = 600) {
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  return canvas;
}

export function loadImage(url: string, callback: (image: HTMLImageElement) => void) {
  const img = new Image();
  img.src = url;
  img.onload = () => callback(img);
}

export function loadJson(url: string, callback: (json: unknown) => void) {
  fetch(url)
    .then((response) => response.json())
    .then((json) => callback(json));
}

export function gameLoop(update: () => void, render: () => void) {
  function loop() {
    requestAnimationFrame(loop);
    update();
    render();
  }
  requestAnimationFrame(loop);
}

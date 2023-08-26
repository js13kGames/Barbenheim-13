import { createProgram, createShader, glsl } from "./gl-util";

interface DrawCmd {
  x: number;
  y: number;
  u: number;
  v: number;
  w: number;
  h: number;
  cx: number;
  cy: number;
  alpha: number;
  angle: number;
  scale: number;
  flash: number;
}

export class SpriteRenderer {
  gl: WebGL2RenderingContext;
  texture: WebGLTexture;
  queue: DrawCmd[] = [];
  dataview: DataView;

  constructor(
    private canvas: HTMLCanvasElement,
    private pixelSize = 4,
  ) {
    this.gl = this.canvas.getContext("webgl2")!;
    const gl = this.gl;
    gl.viewport(0, 0, canvas.width, canvas.height);

    const vertexShader = createShader(gl, vertexShaderSource, gl.VERTEX_SHADER);
    const fragmentShader = createShader(gl, fragmentShaderSource, gl.FRAGMENT_SHADER);
    const program = createProgram(gl, vertexShader, fragmentShader);

    const positionAttributeLocation = gl.getAttribLocation(program, "a_position");
    const positionBuffer = gl.createBuffer()!;
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

    const stride = 4 * 10;
    const data = new Float32Array(stride * 2000);

    this.dataview = new DataView(data.buffer);

    gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);

    gl.enableVertexAttribArray(positionAttributeLocation);
    gl.vertexAttribPointer(positionAttributeLocation, 2, gl.FLOAT, false, stride, 0);

    const texcoordAttributeLocation = gl.getAttribLocation(program, "a_texcoord");
    gl.enableVertexAttribArray(texcoordAttributeLocation);
    gl.vertexAttribPointer(texcoordAttributeLocation, 2, gl.FLOAT, false, stride, 2 * 4);

    const alphaAttribLocation = gl.getAttribLocation(program, "a_alpha");
    gl.enableVertexAttribArray(alphaAttribLocation);
    gl.vertexAttribPointer(alphaAttribLocation, 1, gl.FLOAT, false, stride, 4 * 4);

    const angleAttribLocation = gl.getAttribLocation(program, "a_angle");
    gl.enableVertexAttribArray(angleAttribLocation);
    gl.vertexAttribPointer(angleAttribLocation, 1, gl.FLOAT, false, stride, 5 * 4);

    const scaleAttribLocation = gl.getAttribLocation(program, "a_scale");
    gl.enableVertexAttribArray(scaleAttribLocation);
    gl.vertexAttribPointer(scaleAttribLocation, 1, gl.FLOAT, false, stride, 6 * 4);

    const flashAttribLocation = gl.getAttribLocation(program, "a_flash");
    gl.enableVertexAttribArray(flashAttribLocation);
    gl.vertexAttribPointer(flashAttribLocation, 1, gl.FLOAT, false, stride, 7 * 4);

    const centerAttribLocation = gl.getAttribLocation(program, "a_center");
    gl.enableVertexAttribArray(centerAttribLocation);
    gl.vertexAttribPointer(centerAttribLocation, 2, gl.FLOAT, false, stride, 8 * 4);

    const resUniformLocation = gl.getUniformLocation(program, "u_resolution");
    gl.uniform2f(resUniformLocation, canvas.width / this.pixelSize, canvas.height / this.pixelSize);

    //const textureUniformLocation = gl.getUniformLocation(program, "u_texture");
    const texture = gl.createTexture()!;
    this.texture = texture;

    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texImage2D(
      gl.TEXTURE_2D,
      0,
      gl.RGBA,
      1,
      1,
      0,
      gl.RGBA,
      gl.UNSIGNED_BYTE,
      new Uint8Array([255, 0, 255, 255]),
    );

    gl.cullFace(gl.BACK);
    gl.disable(gl.CULL_FACE);

    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
  }

  setTexture(img: HTMLImageElement) {
    const gl = this.gl;
    gl.bindTexture(gl.TEXTURE_2D, this.texture);
    gl.texImage2D(
      gl.TEXTURE_2D,
      0,
      gl.RGBA,
      img.width,
      img.height,
      0,
      gl.RGBA,
      gl.UNSIGNED_BYTE,
      img,
    );
    gl.generateMipmap(gl.TEXTURE_2D);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.MIRRORED_REPEAT);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.MIRRORED_REPEAT);
  }

  drawSprite(
    dstX: number,
    dstY: number,
    srcX: number,
    srcY: number,
    width: number,
    height: number,
    alpha = 1,
    angle = 0,
    scale = 1,
    flash = 0,
    cx = dstX + width / 2,
    cy = dstY + height / 2,
  ) {
    this.queue.push({
      x: dstX,
      y: dstY,
      u: srcX,
      v: srcY,
      w: width,
      h: height,
      alpha,
      angle,
      scale,
      flash,
      cx,
      cy,
    });
  }

  render() {
    let painted = 0;
    const batchSize = 100;

    const gl = this.gl;
    // gl.clearColor(159/256, 201/256, 243/256, 1);
    gl.clearColor(0, 0, 0, 1);
    gl.clear(gl.COLOR_BUFFER_BIT);

    let offset = -4;
    this.queue.forEach((cmd) => {
      const cx = cmd.cx;
      const cy = cmd.cy;

      this.dataview.setFloat32((offset += 4), cmd.x, true);
      this.dataview.setFloat32((offset += 4), cmd.y, true);
      this.dataview.setFloat32((offset += 4), cmd.u, true);
      this.dataview.setFloat32((offset += 4), cmd.v, true);
      this.dataview.setFloat32((offset += 4), cmd.alpha, true);
      this.dataview.setFloat32((offset += 4), cmd.angle, true);
      this.dataview.setFloat32((offset += 4), cmd.scale, true);
      this.dataview.setFloat32((offset += 4), cmd.flash, true);
      this.dataview.setFloat32((offset += 4), cx, true);
      this.dataview.setFloat32((offset += 4), cy, true);

      this.dataview.setFloat32((offset += 4), cmd.x, true);
      this.dataview.setFloat32((offset += 4), cmd.y + cmd.h, true);
      this.dataview.setFloat32((offset += 4), cmd.u, true);
      this.dataview.setFloat32((offset += 4), cmd.v + cmd.h, true);
      this.dataview.setFloat32((offset += 4), cmd.alpha, true);
      this.dataview.setFloat32((offset += 4), cmd.angle, true);
      this.dataview.setFloat32((offset += 4), cmd.scale, true);
      this.dataview.setFloat32((offset += 4), cmd.flash, true);
      this.dataview.setFloat32((offset += 4), cx, true);
      this.dataview.setFloat32((offset += 4), cy, true);

      this.dataview.setFloat32((offset += 4), cmd.x + cmd.w, true);
      this.dataview.setFloat32((offset += 4), cmd.y, true);
      this.dataview.setFloat32((offset += 4), cmd.u + cmd.w, true);
      this.dataview.setFloat32((offset += 4), cmd.v, true);
      this.dataview.setFloat32((offset += 4), cmd.alpha, true);
      this.dataview.setFloat32((offset += 4), cmd.angle, true);
      this.dataview.setFloat32((offset += 4), cmd.scale, true);
      this.dataview.setFloat32((offset += 4), cmd.flash, true);
      this.dataview.setFloat32((offset += 4), cx, true);
      this.dataview.setFloat32((offset += 4), cy, true);

      this.dataview.setFloat32((offset += 4), cmd.x + cmd.w, true);
      this.dataview.setFloat32((offset += 4), cmd.y, true);
      this.dataview.setFloat32((offset += 4), cmd.u + cmd.w, true);
      this.dataview.setFloat32((offset += 4), cmd.v, true);
      this.dataview.setFloat32((offset += 4), cmd.alpha, true);
      this.dataview.setFloat32((offset += 4), cmd.angle, true);
      this.dataview.setFloat32((offset += 4), cmd.scale, true);
      this.dataview.setFloat32((offset += 4), cmd.flash, true);
      this.dataview.setFloat32((offset += 4), cx, true);
      this.dataview.setFloat32((offset += 4), cy, true);

      this.dataview.setFloat32((offset += 4), cmd.x, true);
      this.dataview.setFloat32((offset += 4), cmd.y + cmd.h, true);
      this.dataview.setFloat32((offset += 4), cmd.u, true);
      this.dataview.setFloat32((offset += 4), cmd.v + cmd.h, true);
      this.dataview.setFloat32((offset += 4), cmd.alpha, true);
      this.dataview.setFloat32((offset += 4), cmd.angle, true);
      this.dataview.setFloat32((offset += 4), cmd.scale, true);
      this.dataview.setFloat32((offset += 4), cmd.flash, true);
      this.dataview.setFloat32((offset += 4), cx, true);
      this.dataview.setFloat32((offset += 4), cy, true);

      this.dataview.setFloat32((offset += 4), cmd.x + cmd.w, true);
      this.dataview.setFloat32((offset += 4), cmd.y + cmd.h, true);
      this.dataview.setFloat32((offset += 4), cmd.u + cmd.w, true);
      this.dataview.setFloat32((offset += 4), cmd.v + cmd.h, true);
      this.dataview.setFloat32((offset += 4), cmd.alpha, true);
      this.dataview.setFloat32((offset += 4), cmd.angle, true);
      this.dataview.setFloat32((offset += 4), cmd.scale, true);
      this.dataview.setFloat32((offset += 4), cmd.flash, true);
      this.dataview.setFloat32((offset += 4), cx, true);
      this.dataview.setFloat32((offset += 4), cy, true);

      if (offset >= 4 * 10 * 6 * batchSize) {
        gl.bufferSubData(gl.ARRAY_BUFFER, 0, this.dataview, 0);
        gl.drawArrays(gl.TRIANGLES, 0, 6 * (batchSize + 1));
        offset = -4;
        painted += batchSize;
      }
    });

    const remaining = this.queue.length - painted;
    if (remaining > 0) {
      gl.bufferSubData(gl.ARRAY_BUFFER, 0, this.dataview, 0);
      gl.drawArrays(gl.TRIANGLES, 0, 6 * remaining);
    }
    this.queue.length = 0;
  }
}

const vertexShaderSource = glsl`#version 300 es
in vec2 a_position;
in vec2 a_center;
in vec2 a_texcoord;
in float a_alpha;
in float a_angle;
in float a_scale;
in float a_flash;

out vec2 v_texcoord;
out float v_alpha;
out float v_flash;

uniform vec2 u_resolution;

void main() {
  vec2 relpos = a_position - a_center;
  vec2 rotpos = vec2(relpos.x * cos(a_angle) - relpos.y * sin(a_angle), relpos.x * sin(a_angle) + relpos.y * cos(a_angle));

  vec2 position = (a_center + a_scale * rotpos) / u_resolution * 2.0 - 1.0;
  gl_Position = vec4(position.x, -position.y, 0, 1);
  v_texcoord = a_texcoord / 256.0;
  v_alpha = a_alpha;
  v_flash = a_flash;
}
`;

const fragmentShaderSource = glsl`#version 300 es
precision highp float;
in vec2 v_texcoord;
in float v_alpha;
in float v_flash;
out vec4 outColor;
uniform sampler2D u_texture;

void main() {
  vec4 color = texture(u_texture, v_texcoord);
  outColor = vec4(mix(color.xyz, vec3(1), v_flash), color.a * v_alpha);
}`;

precision highp float;
varying vec4 vColor;
uniform sampler2D map;
varying vec2 vUv; 

void main() {
    vec4 textSpark = texture2D( map, vUv );
    gl_FragColor = vColor;
}
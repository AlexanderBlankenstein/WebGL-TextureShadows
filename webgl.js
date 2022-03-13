	// original code taken from MDN Web Docs
	// https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API/Tutorial/Lighting_in_WebGL

  var keyRotation = 0.0;
	// amount to rotate the scene on keypress
//var rotValue = 0.0;
var rotValue = Math.PI/4;

main();

//
// Start here
//
function main() {
	const canvas = document.querySelector('#glcanvas');
	const gl = canvas.getContext('webgl');

  // If we don't have a GL context, give up now

	if (!gl) {
		alert('Unable to initialize WebGL. Your browser or machine may not support it.');
		return;
	}

  // Vertex shader program

	const vsSource = `
		attribute vec4 aVertexPosition;
		attribute vec3 aVertexNormal;
		attribute vec4 aVertexColor;
    attribute vec2 aTextureCoord;
    attribute vec3 aLightDirection;
		uniform mat4 uNormalMatrix;
		uniform mat4 uModelViewMatrix;
		uniform mat4 uProjectionMatrix;
    varying highp vec2 vTextureCoord;
		varying highp vec3 vLighting;
		varying lowp vec4 vColor;
		void main(void) {
			gl_Position = uProjectionMatrix * uModelViewMatrix * aVertexPosition;
      vTextureCoord = aTextureCoord;
			vColor = aVertexColor;
			// Apply lighting effect
			highp vec3 ambientLight = vec3(0.3, 0.3, 0.3);
			highp vec3 directionalLightColor = vec3(1, 1, 1);
      highp vec3 directionalVector = normalize(aLightDirection);
			highp vec4 transformedNormal = uNormalMatrix * vec4(aVertexNormal, 1.0);
			highp float directional = max(dot(transformedNormal.xyz, directionalVector), 0.0);
			vLighting = ambientLight + (directionalLightColor * directional);
		}
	`;

  // Fragment shader program

	const fsSource = `
    precision mediump float;
    varying highp vec2 vTextureCoord;
		varying lowp vec4 vColor;
		varying highp vec3 vLighting;
		uniform sampler2D uSampler;
		void main(void) {
      highp vec4 texelColor = texture2D(uSampler, vTextureCoord);
			gl_FragColor = vec4(texelColor.rgb * vColor.rgb * vLighting, texelColor.a);
		}
	`;
//			gl_FragColor = vColor;

	//highp vec4 texelColor = texture2D(uSampler, vTextureCoord);
	//gl_FragColor = vec4(texelColor.rgb * vLighting, texelColor.a);
//this part does the colour: highp vec4 texelColor = texture2D(uSampler, vTextureCoord); page 34 in slide


  // Initialize a shader program; this is where all the lighting
  // for the vertices and so forth is established.
	const shaderProgram = initShaderProgram(gl, vsSource, fsSource);

  // Collect all the info needed to use the shader program.
  // Look up which attributes our shader program is using
  // for aVertexPosition, aVertexNormal, aTextureCoord,
  // and look up uniform locations.
	const programInfo = {
		program: shaderProgram,
		attribLocations: {
			vertexPosition: gl.getAttribLocation(shaderProgram, 'aVertexPosition'),
			vertexNormal: gl.getAttribLocation(shaderProgram, 'aVertexNormal'),
      textureCoord: gl.getAttribLocation(shaderProgram, 'aTextureCoord'),
      vertexColor: gl.getAttribLocation(shaderProgram, 'aVertexColor'),
      lightDirection: gl.getAttribLocation(shaderProgram, 'aLightDirection'),
		},
		uniformLocations: {
			projectionMatrix: gl.getUniformLocation(shaderProgram, 'uProjectionMatrix'),
			modelViewMatrix: gl.getUniformLocation(shaderProgram, 'uModelViewMatrix'),
			normalMatrix: gl.getUniformLocation(shaderProgram, 'uNormalMatrix'),
			uSampler: gl.getUniformLocation(shaderProgram, 'uSampler'),
		}
	};

  // Here's where we call the routine that builds all the
  // objects we'll be drawing.

	cubebuffers = initBuffers(gl, loadcubevertices(), loadcubenormals(), loadcubecolors(), loadcubetextcoords(), loadcubevertexindices()); //, loadcubetexture(), loadcubewidth(), loadcubeheight());
	planebuffers = initBuffers(gl, loadplanevertices(), loadplanenormals(), loadplanecolors(), loadplanetextcoords(), loadplanevertexindices()); //, loadplanetexture(),  loadplanewidth(), loadplaneheight());

  var objectsToDraw = [
    {
      id: 1,
      programInfo: programInfo,
      bufferInfo: cubebuffers,
      numVertex: getCubeVertexCount(),
    },
    {
      id: 2,
      programInfo: programInfo,
      bufferInfo: planebuffers,
      numVertex: getPlaneVertexCount(),
    }
  ]

  // creates buffers with position, normal, texcoord, and vertex color
  // data for primitives by calling gl.createBuffer, gl.bindBuffer,
  // and gl.bufferData

	//const texture = loadTexture(gl);

	var then = 0;

  // Draw the scene repeatedly
	function render(now) {
		now *= 0.001;  // convert to seconds
		const deltaTime = now - then;
		then = now;

    const cubeTexture = loadTexture(gl, "cube");
    const planeTexture = loadTexture(gl, "plane");

		drawScene(gl, programInfo, objectsToDraw, cubeTexture, planeTexture, deltaTime);

		requestAnimationFrame(render);
	}
	requestAnimationFrame(render);
}

//
// initBuffers
//
// Initialize the buffers we'll need. For this demo, we just
// have one object -- a simple three-dimensional cube.
//
function initBuffers(gl, positions, vertexNormals, colors, textureCoordinates, indices) { //, texturedata, wth, hght) {
  //---------------------------------------------- buffer stuff.---------

  // Create a buffer for the vertex positions.

	const positionBuffer = gl.createBuffer();

  // Select the positionBuffer as the one to apply buffer
  // operations to from here out.

	gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

  // Now create an array of positions for the cube.

	// load vertex data from loaddata.js
	//const cubepositions = loadcubevertices();
  //const planepositions = loadplanevertices();

  // Now pass the list of positions into WebGL to build the
  // shape. We do this by creating a Float32Array from the
  // JavaScript array, then use it to fill the current buffer.

	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.DYNAMIC_DRAW);

  // Set up the normals for the vertices, so that we can compute lighting.

	const normalBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, normalBuffer);

	// load normal data from loaddata.js
	//const cubevertexNormals = loadcubenormals();
  //const planevertexNormals = loadplanenormals();

	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertexNormals),gl.DYNAMIC_DRAW);


	// load color data from the loaddata.js
	//const colors = loadcolors()

	const colorBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.DYNAMIC_DRAW);

  // Now set up the texture coordinates for the faces.

  const textureCoordBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, textureCoordBuffer);

  // load texture coordinates data from loaddata.js
  //const cubetextureCoordinates = loadcubetextcoords();
  //const planetextureCoordinates = loadplanetextcoords();

  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(textureCoordinates),gl.DYNAMIC_DRAW);


  // Build the element array buffer; this specifies the indices
  // into the vertex arrays for each face's vertices.

	const indexBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);

  // This array defines each face as two triangles, using the
  // indices into the vertex array to specify each triangle's
  // position.

	// load indices from loaddata.js
	//const cubeindices = loadcubevertexindices();
  //const planeindices = loadplanevertexindices();

  // Now send the element array to GL

	gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.DYNAMIC_DRAW);


	return {
		position: positionBuffer,
		normal: normalBuffer,
    textureCoord: textureCoordBuffer,
		color: colorBuffer,
		indices: indexBuffer,
    //texture: texture,
	};
}

//
// Initialize a texture and load an image.
// When the image finished loading copy it into the texture.
//
function loadTexture(gl, url) {
  const texture = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, texture);

  // Because images have to be download over the internet
  // they might take a moment until they are ready.
  // Until then put a single pixel in the texture so we can
  // use it immediately. When the image has finished downloading
  // we'll update the texture with the contents of the image.
  const level = 0;
  const internalFormat = gl.RGBA;

  const border = 0;
  const srcFormat = gl.RGBA;
  const srcType = gl.UNSIGNED_BYTE;

	// load height and width functions from loaddata.js
  var width;
  var height;
  var pixel;

  if (url == "cube"){
    width = loadcubewidth();
    height = loadcubeheight();
    pixel = loadcubetexture();
  } else {
    width = loadplanewidth();
    height = loadplaneheight();
    pixel = loadplanetexture();
  }

	// load texture from loaddata.js
  

  gl.texImage2D(gl.TEXTURE_2D, level, internalFormat,
                width, height, border, srcFormat, srcType,
                pixel);

  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);

  return texture;
}

// function loadTexture(gl) {
//   //texture data -------------------

//   const texture = gl.createTexture();
// 	gl.bindTexture(gl.TEXTURE_2D, texture);

//   // Because images have to be download over the internet
//   // they might take a moment until they are ready.
//   // Until then put a single pixel in the texture so we can
//   // use it immediately. When the image has finished downloading
//   // we'll update the texture with the contents of the image.
// 	const level = 0;
// 	const internalFormat = gl.RGBA;

// 	// load height and width functions from loaddata.js
// 	//const width = wth;
// 	//const height = hght;
//   const width = loadcubewidth();
// 	const height = loadcubeheight();

// 	const border = 0;
// 	const srcFormat = gl.RGBA;
// 	const srcType = gl.UNSIGNED_BYTE;

// 	// load texture from loaddata.js
// 	const pixel = loadcubetexture();
//   //const pixel = texturedata;

// 	gl.texImage2D(gl.TEXTURE_2D, level, internalFormat,
//                 width, height, border, srcFormat, srcType,
//                 pixel);

// 	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
// 	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
// 	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
// 	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);

//   return texture;
// }

function isPowerOf2(value) {
	return (value & (value - 1)) == 0;
}

//
// Draw the scene.
//
function drawScene(gl, programInfo, objectsToDraw, texture1, texture2, deltaTime) {
	gl.clearColor(0.0, 0.0, 0.0, 1.0);  // Clear to black, fully opaque
	gl.clearDepth(1.0);                 // Clear everything
	gl.enable(gl.DEPTH_TEST);           // Enable depth testing
	gl.depthFunc(gl.LEQUAL);            // Near things obscure far things

  // Clear the canvas before we start drawing on it.

	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  // Create a perspective matrix, a special matrix that is
  // used to simulate the distortion of perspective in a camera.
  // Our field of view is 45 degrees, with a width/height
  // ratio that matches the display size of the canvas
  // and we only want to see objects between 0.1 units
  // and 100 units away from the camera.

	const fieldOfView = 45 * Math.PI / 180;   // in radians
	const aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
	const zNear = 0.1;
	const zFar = 100.0;
	const projectionMatrix = mat4.create();

  // note: glmatrix.js always has the first argument
  // as the destination to receive the result.
	mat4.perspective(projectionMatrix, fieldOfView, aspect, zNear, zFar);

  // Set the drawing position to the "identity" point, which is
  // the center of the scene.
	const modelViewMatrix = mat4.create();

  // Now move the drawing position a bit to where we want to
  // start drawing.

	// advance frame count, used to control geometry changes
	// this can be removed for the assignment
	frameCount++;

	// reload geometry data for each frame
  cubebuffers = initBuffers(gl, loadcubevertices(), loadcubenormals(), loadcubecolors(), loadcubetextcoords(), loadcubevertexindices()); //, loadcubetexture(), loadcubewidth(), loadcubeheight());
	planebuffers = initBuffers(gl, loadplanevertices(), loadplanenormals(), loadplanecolors(), loadplanetextcoords(), loadplanevertexindices()); //, loadplanetexture(), loadplanewidth(), loadplaneheight());
	//buffers = initBuffers(gl, positions, vertexNormals, textureCoordinates, indices);


	mat4.translate(modelViewMatrix,     // destination matrix
                 modelViewMatrix,     // matrix to translate
                 [-0.0, 0.0, -7.0]);  // amount to translate
	// tilt view so viewer doesn't see it directly from the side
	mat4.rotate(modelViewMatrix,  // destination matrix
              modelViewMatrix,  // matrix to rotate
              Math.PI / 8,     // amount to tilt in radians
              [1, 0, 0]);       // axis to rotate around (X)
	// rotate the object based on keypress 
	mat4.rotate(modelViewMatrix,  // destination matrix
              modelViewMatrix,  // matrix to rotate
              keyRotation,     // amount to rotate in radians
              [0, 1, 0]);       // axis to rotate around (Y)

	const normalMatrix = mat4.create();
	mat4.invert(normalMatrix, modelViewMatrix);
	mat4.transpose(normalMatrix, normalMatrix);

  // go through each object and display it. 
  objectsToDraw.forEach(function(object) {
    var buffers = object.bufferInfo;
    var programInfo = object.programInfo;
    var numVertex = object.numVertex;
    var objID = object.id;

    // Tell WebGL how to pull out the positions from the position
    // buffer into the vertexPosition attribute
    {
      var buffer = buffers.position;
      var numComponents = 3;
      var attribute = programInfo.attribLocations.vertexPosition;
      gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
      gl.vertexAttribPointer(attribute,numComponents,gl.FLOAT,false,0,0);
      gl.enableVertexAttribArray(attribute);
    }
    
    // Tell WebGL how to pull out the colors from 
    // the color buffer into the vertexColor attribute.
    {
    	var buffer = buffers.color;
    	var numComponents = 4;
      var attribute = programInfo.attribLocations.vertexColor;
      gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    	gl.vertexAttribPointer(attribute,numComponents,gl.FLOAT,false,0,0);
    	gl.enableVertexAttribArray(attribute);
    }

    // Tell WebGL how to pull out the texture coordinates from
    // the texture coordinate buffer into the textureCoord attribute.
    {
      var buffer = buffers.textureCoord;
      var numComponents = 2;
      var attribute = programInfo.attribLocations.textureCoord;
      gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
      gl.vertexAttribPointer(attribute,numComponents,gl.FLOAT,false,0,0);
      gl.enableVertexAttribArray(attribute);
    }

    // Tell WebGL how to pull out the normals from
    // the normal buffer into the vertexNormal attribute.
    {
      var buffer = buffers.normal;
      var numComponents = 3;
      var attribute = programInfo.attribLocations.vertexNormal;
      gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
      gl.vertexAttribPointer(attribute,numComponents,gl.FLOAT,false,0,0);
      gl.enableVertexAttribArray(attribute);
    }

    // Tell WebGL how to pull out the Light directional vector from
    // loaddata.js into the lightDirection attribute.
    {
      loadlightdirection();
      var lx = getLightX();
      var ly = getLightY();
      var lz = getLightZ();

      var attribute = programInfo.attribLocations.lightDirection;
      gl.vertexAttrib3f(attribute, lx, ly, lz);
    }

    // Tell WebGL which indices to use to index the vertices
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffers.indices);

    // Tell WebGL to use our program when drawing

    gl.useProgram(programInfo.program);

    // Set the shader uniforms

    gl.uniformMatrix4fv(
      programInfo.uniformLocations.projectionMatrix,
      false,
      projectionMatrix);
    gl.uniformMatrix4fv(
      programInfo.uniformLocations.modelViewMatrix,
      false,
      modelViewMatrix);
    gl.uniformMatrix4fv(
      programInfo.uniformLocations.normalMatrix,
      false,
      normalMatrix);

    // Specify the texture to map onto the faces.
    //var texture = buffers.texture;

    // // Tell WebGL we want to affect texture unit 0
    gl.activeTexture(gl.TEXTURE0);


    if (objID==1) {
      gl.bindTexture(gl.TEXTURE_2D, texture1);
    } else {
      gl.bindTexture(gl.TEXTURE_2D, texture2);
    }
    // // Bind the texture to texture unit 0
    // gl.bindTexture(gl.TEXTURE_2D, texture);

    // // Tell the shader we bound the texture to texture unit 0
    gl.uniform1i(programInfo.uniformLocations.uSampler, 0);


    {
      const vertexCount = numVertex; //getVertexCount();
      const type = gl.UNSIGNED_SHORT;
      const offset = 0;
      gl.drawElements(gl.TRIANGLES, vertexCount, type, offset);
    }
  }
  );

  // Update the rotation for the next draw
	keyRotation = rotValue;
}

//
// Initialize a shader program, so WebGL knows how to draw our data
//
function initShaderProgram(gl, vsSource, fsSource) {
	const vertexShader = loadShader(gl, gl.VERTEX_SHADER, vsSource);
	const fragmentShader = loadShader(gl, gl.FRAGMENT_SHADER, fsSource);

  // Create the shader program

	const shaderProgram = gl.createProgram();
	gl.attachShader(shaderProgram, vertexShader);
	gl.attachShader(shaderProgram, fragmentShader);
	gl.linkProgram(shaderProgram);

  // If creating the shader program failed, alert

	if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
		alert('Unable to initialize the shader program: ' + gl.getProgramInfoLog(shaderProgram));
		return null;
	}

	return shaderProgram;
}

//
// creates a shader of the given type, uploads the source and
// compiles it.
//
function loadShader(gl, type, source) {
	const shader = gl.createShader(type);

  // Send the source to the shader object

	gl.shaderSource(shader, source);

  // Compile the shader program

	gl.compileShader(shader);

  // See if it compiled successfully

	if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
		alert('An error occurred compiling the shaders: ' + gl.getShaderInfoLog(shader));
		gl.deleteShader(shader);
		return null;
	}

	return shader;
}

// flag indicating that data has been loaded and image can be drawn 
let loaded = false;

// global variables for image data, size, and depth
// these are set in the index.html file
let imageData = [];
let imageHeight = 0;
let imageWidth = 0;
let imageDepth = 0;
let divisor = 1;

// some variables used in the demo, these can be removed
var frameCount = 0;  // number of frames drawn
var speed = 25;
var index = 0;
var files = [];
var fileData = [];

var lightX = 1.0;
var lightY = 1.3; 
var lightZ = 1.0;



// ******* Part 1 - load objects and lighting *******

// return the number of vertices in the object
function getCubeVertexCount() {
		return [36];
}

function getPlaneVertexCount() {
		return [6];
}

// vertex positions - 72
function loadcubevertices() {
	return [
		// Front face
		-1.0, -1.0,  1.0,
		1.0, -1.0,  1.0,
		1.0,  1.0,  1.0,
		-1.0,  1.0,  1.0,

		// Back face
		-1.0, -1.0, -1.0,
		-1.0,  1.0, -1.0,
		1.0,  1.0, -1.0,
		1.0, -1.0, -1.0,

		// Top face
		-1.0,  1.0, -1.0,
		-1.0,  1.0,  1.0,
		1.0,  1.0,  1.0,
		1.0,  1.0, -1.0,

		// Bottom face
		-1.0, -1.0, -1.0,
		1.0, -1.0, -1.0,
		1.0, -1.0,  1.0,
		-1.0, -1.0,  1.0,

		// Right face
		1.0, -1.0, -1.0,
		1.0,  1.0, -1.0,
		1.0,  1.0,  1.0,
		1.0, -1.0,  1.0,

		// Left face
		-1.0, -1.0, -1.0,
		-1.0, -1.0,  1.0,
		-1.0,  1.0,  1.0,
		-1.0,  1.0, -1.0,
	];
}
	
// - 12
function loadplanevertices() {
	return [		
		//plane
		-5.0, -1.0, -5.0,
		-5.0, -1.0, 5.0,
		5.0, -1.0, 5.0,
		5.0, -1.0, -5.0,
	];
}

// normals array
// all triangles face in the same direction so the normals are
//   all the same - 72
function loadcubenormals() {
	return [
		// Front
		0.0,  0.0,  1.0,
		0.0,  0.0,  1.0,
		0.0,  0.0,  1.0,
		0.0,  0.0,  1.0,

		// Back
		0.0,  0.0, -1.0,
		0.0,  0.0, -1.0,
		0.0,  0.0, -1.0,
		0.0,  0.0, -1.0,

		// Top
		0.0,  1.0,  0.0,
		0.0,  1.0,  0.0,
		0.0,  1.0,  0.0,
		0.0,  1.0,  0.0,

		// Bottom
		0.0, -1.0,  0.0,
		0.0, -1.0,  0.0,
		0.0, -1.0,  0.0,
		0.0, -1.0,  0.0,

		// Right
		1.0,  0.0,  0.0,
		1.0,  0.0,  0.0,
		1.0,  0.0,  0.0,
		1.0,  0.0,  0.0,

		// Left
		-1.0,  0.0,  0.0,
		-1.0,  0.0,  0.0,
		-1.0,  0.0,  0.0,
		-1.0,  0.0,  0.0
	];
}	
	
// - 12
function loadplanenormals() {
	return [
		//plane
		0.0,  1.0,  0.0,
		0.0,  1.0,  0.0,
		0.0,  1.0,  0.0,
		0.0,  1.0,  0.0
	];
}

// texture coordinates
// the current texture support four colours
// 0.0 to 0.5, 0.0 to 0.5   colour 1
// 0.0 to 0.5, 0.5 to 1.0   colour 2
// 0.5 to 1.0, 0.0 to 0.5   colour 3
// 0.5 to 1.0, 0.5 to 1.0   colour 4 - 48
function loadcubetextcoords() {
	return  [
		// Front
		0.0,  0.0,
		1.0,  0.0,
		1.0,  1.0,
		0.0,  1.0,
		// Back
		0.0,  0.0,
		1.0,  0.0,
		1.0,  1.0,
		0.0,  1.0,
		// Top
		0.0,  0.0,
		1.0,  0.0,
		1.0,  1.0,
		0.0,  1.0,
		// Bottom
		0.0,  0.0,
		1.0,  0.0,
		1.0,  1.0,
		0.0,  1.0,
		// Right
		0.0,  0.0,
		1.0,  0.0,
		1.0,  1.0,
		0.0,  1.0,
		// Left
		0.0,  0.0,
		1.0,  0.0,
		1.0,  1.0,
		0.0,  1.0,
	];
}
	
// - 8
function loadplanetextcoords() {
	return  [
		//plane
		0.0,  0.0,
		1.0,  0.0,
		1.0,  1.0,
		0.0,  1.0,
	];
}

// 1.0,  0.0,  0.0,  1.0,    // red
// 0.0,  1.0,  0.0,  1.0,    // green
// 0.0,  0.0,  1.0,  1.0,    // blue
// 1.0,  0.0,  1.0,  0.0,    // magenta
// 1.0,  1.0,  1.0,  1.0,    // white
// colors for the verticies
function loadcubecolors() {
	return [
		// Front
		1.0,  1.0,  1.0,  1.0,
		1.0,  1.0,  1.0,  1.0,
		1.0,  1.0,  1.0,  1.0,
		1.0,  1.0,  1.0,  1.0,
		1.0,  1.0,  1.0,  1.0,
		1.0,  1.0,  1.0,  1.0,
		// Back
		1.0,  1.0,  1.0,  1.0,
		1.0,  1.0,  1.0,  1.0,
		1.0,  1.0,  1.0,  1.0,
		1.0,  1.0,  1.0,  1.0,
		1.0,  1.0,  1.0,  1.0,
		1.0,  1.0,  1.0,  1.0,
		// Top
		1.0,  1.0,  1.0,  1.0,
		1.0,  1.0,  1.0,  1.0,
		1.0,  1.0,  1.0,  1.0,
		1.0,  1.0,  1.0,  1.0,
		1.0,  1.0,  1.0,  1.0,
		1.0,  1.0,  1.0,  1.0,
		// Bottom
		1.0,  1.0,  1.0,  1.0,
		1.0,  1.0,  1.0,  1.0,
		1.0,  1.0,  1.0,  1.0,
		1.0,  1.0,  1.0,  1.0,
		1.0,  1.0,  1.0,  1.0,
		1.0,  1.0,  1.0,  1.0,
		// Right
		1.0,  1.0,  1.0,  1.0,
		1.0,  1.0,  1.0,  1.0,
		1.0,  1.0,  1.0,  1.0,
		1.0,  1.0,  1.0,  1.0,
		1.0,  1.0,  1.0,  1.0,
		1.0,  1.0,  1.0,  1.0,
		// Left
		1.0,  1.0,  1.0,  1.0,
		1.0,  1.0,  1.0,  1.0,
		1.0,  1.0,  1.0,  1.0,
		1.0,  1.0,  1.0,  1.0,
		1.0,  1.0,  1.0,  1.0,
		1.0,  1.0,  1.0,  1.0,
	];
}

function loadplanecolors() {
	//grey
	return [
		0.5,  0.5,  0.5,  1.0,
		0.5,  0.5,  0.5,  1.0,
		0.5,  0.5,  0.5,  1.0,
		0.5,  0.5,  0.5,  1.0,
		0.5,  0.5,  0.5,  1.0,
		0.5,  0.5,  0.5,  1.0,
	];
}

// load vertex indices - 36
function loadcubevertexindices() {
	return [
		0,  1,  2,      0,  2,  3,    // front
		4,  5,  6,      4,  6,  7,    // back
		8,  9,  10,     8,  10, 11,   // top
		12, 13, 14,     12, 14, 15,   // bottom
		16, 17, 18,     16, 18, 19,   // right
		20, 21, 22,     20, 22, 23,   // left
	];
}

// - 6
function loadplanevertexindices() {
	return [
		0, 1, 2,     0, 2, 3,   // plane
	];
}

//light stuff
function distanceBetween(x1, x2, y1, y2, z1, z2) {
	var d = ((x2-x1) * (x2-x1)) + ((z2-z1) * (z2-z1)); //+ ((y2-y1) * (y2-y1))
	var s = Math.sqrt(d);
	return s;
}

function loadlightdirection() {
	var r = distanceBetween(lightX, 0, lightY, 0, lightZ, 0);
	var t = (frameCount/speed);
	//var r = 1.0; 
	lightX = (r * Math.cos(t));
	lightZ = (r * Math.sin(t));
}

function getLightX() {
	return lightX;
}

function getLightY() {
	return lightY;
}

function getLightZ() {
	return lightZ;
}

// texture array size and data
function loadcubewidth() {
	if (loaded) {
		return 256;
	} else {
		return 2;
	}
}

function loadcubeheight() {
	if (loaded) {
		return 256;
	} else {
		return 2;
	}
}

function loadcubetexture() {
	if (loaded) {
		return( 
			new Uint8Array(fileData[index])
		);
	} else {
		return( 
			new Uint8Array(
				[255,255,255,255,
				255,255,255,255,
				255,255,255,255,
				255,255,255,255]
			)
		);
	}
}

function loadplanewidth() {
	return 2;
}

function loadplaneheight() {
	return 2;
}

function loadplanetexture(){
	return( 
		new Uint8Array(
			[255,255,255,255,
			255,255,255,255,
			255,255,255,255,
			255,255,255,255]
		)
	);
}


// ******* Part 2 - load multiple texture files *******

function loadFile() {
	for (var f=0; f<files.length; f++){
		let reader = new FileReader();
    	reader.readAsText(files[f]);

    	reader.onload = function() {
	   		// split text file input into multiple lines (strings)
        	const lines = reader.result.split('\n');
	    	// retrieve width and height data from pgm file
        	const dim = lines[2].split(" ");
        	imageWidth = dim[0];
        	imageHeight = dim[1];
	         
        	// retrieve pixel depth from pgm file
        	imageDepth = lines[3];
			divisor = 1;
			if (imageDepth != 255) {
				divisor = imageDepth/256;
			}

			imageData = [];

	    	// read image data from pgm file
	    	// and store in the imageData array
			for (var i=4;i<lines.length; i+=3) {
				imageData.push(((parseInt(lines[i]))/divisor));
				imageData.push(((parseInt(lines[i+1]))/divisor));
				imageData.push(((parseInt(lines[i+2]))/divisor));
				imageData.push(255);
			}

			fileData.push(imageData);
		};

		reader.onerror = function() {
			console.log(reader.error);
		};
	}
	loaded = true;
}
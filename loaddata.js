
// some variables used in the demo, these can be removed
var frameCount = 0;  // number of frames drawn
var drawState = 1;   // flag the controls which object drawn
var ht = 0.1;        // initial height of object, changed by keyboard input

//var reinitalizeSystem = ?;
var numberParticles = 1;
var directionOffset = 0.05;
var maximumAge = 10;
var ageVariation = 0;
var repeating = true;
var path = true;


	// return the number of vertices in the object
function getCubeVertexCount() {
		//return [12];
		return [36];
}

function getPlaneVertexCount() {
		//return [12];
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
		//red
		return [
			// Front
			0.7,  0.0,  0.0,  1.0,
			0.7,  0.0,  0.0,  1.0,
			0.7,  0.0,  0.0,  1.0,
			0.7,  0.0,  0.0,  1.0,
			0.7,  0.0,  0.0,  1.0,
			0.7,  0.0,  0.0,  1.0,
			// Back
			0.7,  0.0,  0.0,  1.0,
			0.7,  0.0,  0.0,  1.0,
			0.7,  0.0,  0.0,  1.0,
			0.7,  0.0,  0.0,  1.0,
			0.7,  0.0,  0.0,  1.0,
			0.7,  0.0,  0.0,  1.0,
			// Top
			0.7,  0.0,  0.0,  1.0,
			0.7,  0.0,  0.0,  1.0,
			0.7,  0.0,  0.0,  1.0,
			0.7,  0.0,  0.0,  1.0,
			0.7,  0.0,  0.0,  1.0,
			0.7,  0.0,  0.0,  1.0,
			// Bottom
			0.7,  0.0,  0.0,  1.0,
			0.7,  0.0,  0.0,  1.0,
			0.7,  0.0,  0.0,  1.0,
			0.7,  0.0,  0.0,  1.0,
			0.7,  0.0,  0.0,  1.0,
			0.7,  0.0,  0.0,  1.0,
			// Right
			0.7,  0.0,  0.0,  1.0,
			0.7,  0.0,  0.0,  1.0,
			0.7,  0.0,  0.0,  1.0,
			0.7,  0.0,  0.0,  1.0,
			0.7,  0.0,  0.0,  1.0,
			0.7,  0.0,  0.0,  1.0,
			// Left
			0.7,  0.0,  0.0,  1.0,
			0.7,  0.0,  0.0,  1.0,
			0.7,  0.0,  0.0,  1.0,
			0.7,  0.0,  0.0,  1.0,
			0.7,  0.0,  0.0,  1.0,
			0.7,  0.0,  0.0,  1.0,
		];
	}

	function loadplanecolors() {
		//grey
		return [
			0.6,  0.6,  0.6,  1.0,
			0.6,  0.6,  0.6,  1.0,
			0.6,  0.6,  0.6,  1.0,
			0.6,  0.6,  0.6,  1.0,
			0.6,  0.6,  0.6,  1.0,
			0.6,  0.6,  0.6,  1.0,
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

	// texture array size and data
function loadwidth() {
	return 2;
}

function loadheight() {
	return 2;
}

function loadtexture() {
	return( 
		new Uint8Array(
			[255,255,255,255,
			255,255,255,255,
			255,255,255,255,
			255,255,255,255]
		) 
	);
}


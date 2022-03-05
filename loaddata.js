
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
function getVertexCount() {
		//return [12];
		return [36];
}



	// vertex positions
function loadvertices() {
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
	
	/*
	// every 25 frames causes the object being drawn to change to other
	// object
	// this can be removed for the assignment
	if (frameCount % 25 == 0) {
		drawState *= -1;
	}

	// use drawState to alternate between the objects (high and low objects)
	// you will need to add more complex state control for the assignment
	// all of the other loading function below do the same thing
	if (drawState == 1) {
		return [
			-2.0, -ht, -2.0,
			-2.0, 0.0,  -2.0,
			-2.0, -ht, -2.1,

			-2.0, -ht, -2.1,
			-2.0, 0.0,  -2.0,
			-2.0, 0.0, -2.1,

			2.0, -ht,  2.0,
			2.0, 0.0,   2.0,
			2.0, -ht, 2.1,

			2.0, -ht, 2.1,
			2.0, 0.0,   2.0,
			2.0, 0.0,  2.1,
		];
	} else {
		return [
			-2.0, 0.0, -2.0,
			-2.0, ht,  -2.0,
			-2.0, 0.0, -2.1,

			-2.0, 0.0, -2.1,
			-2.0, ht,  -2.0,
			-2.0, ht, -2.1,

			2.0, 0.0,  2.0,
			2.0, ht,   2.0,
			2.0, 0.0,  2.1,

			2.0, 0.0,  2.1,
			2.0, ht,   2.0,
			2.0, ht,  2.1,
		];
	}
	*/
}


	// normals array
	// all triangles face in the same direction so the normals are
	//   all the same 
function loadnormals() {
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
	/*
	if (drawState == 1) {
		return [
			0.0, 0.0,  1.0,
			0.0, 0.0,  1.0,
			0.0, 0.0,  1.0,
			0.0, 0.0,  1.0,
			0.0, 0.0,  1.0,
			0.0, 0.0,  1.0,
			0.0, 0.0,  1.0,
			0.0, 0.0,  1.0,
			0.0, 0.0,  1.0,
			0.0, 0.0,  1.0,
			0.0, 0.0,  1.0,
			0.0, 0.0,  1.0,
		];
	} else {
		return [
			0.0, 1.0,  1.0,
			0.0, 1.0,  1.0,
			0.0, 1.0,  1.0,
			0.0, 1.0,  1.0,
			0.0, 1.0,  1.0,
			0.0, 1.0,  1.0,
			0.0, 0.0,  1.0,
			0.0, 0.0,  1.0,
			0.0, 0.0,  1.0,
			0.0, 0.0,  1.0,
			0.0, 0.0,  1.0,
			0.0, 0.0,  1.0,
		];
	}
	*/
}


	// texture coordinates
	// the current texture support four colours
	// 0.0 to 0.5, 0.0 to 0.5   colour 1
	// 0.0 to 0.5, 0.5 to 1.0   colour 2
	// 0.5 to 1.0, 0.0 to 0.5   colour 3
	// 0.5 to 1.0, 0.5 to 1.0   colour 4
function loadtextcoords() {
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
	
	/*
	if (drawState == 1) {
		return  [
			0.5,  0.5,
			1.0,  0.5,
			1.0,  1.0,
			0.5,  0.5,
			1.0,  0.5,
			1.0,  1.0,
			0.5,  0.5,
			1.0,  0.5,
			1.0,  1.0,
			0.5,  0.5,
			1.0,  0.5,
			1.0,  1.0,
		];
	} else {
		return  [
			0.0,  0.0,
			0.5,  0.0,
			0.5,  0.5,
			0.0,  0.0,
			0.5,  0.0,
			0.5,  0.5,
			0.0,  0.0,
			0.5,  0.0,
			0.5,  0.5,
			0.0,  0.0,
			0.5,  0.0,
			0.5,  0.5,
		];
	}
	*/
}


	// load vertex indices
function loadvertexindices() {
	return [
		0,  1,  2,      0,  2,  3,    // front
		4,  5,  6,      4,  6,  7,    // back
		8,  9,  10,     8,  10, 11,   // top
		12, 13, 14,     12, 14, 15,   // bottom
		16, 17, 18,     16, 18, 19,   // right
		20, 21, 22,     20, 22, 23,   // left
	];
	
	/*
	if (drawState == 1) {
		return [
			0,1,2,  3,4,5, 6,7,8, 9,10,11
		];
	} else {
		return [
			0,1,2,  3,4,5, 6,7,8, 9,10,11
		];
	}
	*/
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
			[50,100,50,255,
            100,150,100,255,
            150,200,150,255,
            200,250,200,255]
		) 
	);
}


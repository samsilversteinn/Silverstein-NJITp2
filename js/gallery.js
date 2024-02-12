// requestAnim shim layer by Paul Irish
window.requestAnimFrame = (function () {
	return window.requestAnimationFrame ||
		window.webkitRequestAnimationFrame ||
		window.mozRequestAnimationFrame ||
		window.oRequestAnimationFrame ||
		window.msRequestAnimationFrame ||
		function (/* function */ callback, /* DOMElement */ element) {
			window.setTimeout(callback, 1000 / 60);
		};
})();


// example code from mr doob : http://mrdoob.com/lab/javascript/requestanimationframe/

animate();

var mLastFrameTime = 0;
var mWaitTime = 5000; //time in ms
function animate() {
	requestAnimFrame(animate);
	var currentTime = new Date().getTime();
	if (mLastFrameTime === 0) {
		mLastFrameTime = currentTime;
	}

	if ((currentTime - mLastFrameTime) > mWaitTime) {
		swapPhoto();
		mLastFrameTime = currentTime;
	}
}

/************* DO NOT TOUCH CODE ABOVE THIS LINE ***************/

function swapPhoto() {
	//Add code here to access the #slideShow element.
	// Makes the slideshow present with the amount of images in the array.
	if (mCurrentIndex >= mImages.length) {
		mCurrentIndex = 0
	}
	if (mCurrentIndex < 0) {
		mCurrentIndex = mImages.length - 1
	}
	//Access the img element and replace its source
	document.getElementById('photo').src = mImages[mCurrentIndex].imgPath
	// Gets the classes for each element and assigns it to a variable
	var location = document.getElementsByClassName('location')[0]
	var description = document.getElementsByClassName('description')[0]
	var date = document.getElementsByClassName('date')[0]
	// Changes the inner HTML.
	location.innerHTML = "Location: " + mImages[mCurrentIndex].location
	description.innerHTML = "Description: " + mImages[mCurrentIndex].description
	date.innerHTML = "Date: " + mImages[mCurrentIndex].date
	//with a new image from your images array which is loaded 
	var mLastFrameTime = 0
	mCurrentIndex += 1
	//from the JSON string
	console.log('swap photo');
}

// Counter for the mImages array
var mCurrentIndex = 0;

// XMLHttpRequest variable
var mRequest = new XMLHttpRequest();

// Array holding GalleryImage objects (see below).
var mImages = [];

// Holds the retrived JSON information
var mJson;

// URL for the JSON to load by default
// Some options for you are: images.json, images.short.json; you will need to create your own extra.json later
var mUrl = "extra.json";


//You can optionally use the following function as your event callback for loading the source of Images from your json data (for HTMLImageObject).
//@param A GalleryImage object. Use this method for an event handler for loading a gallery Image object (optional).
function makeGalleryImageOnloadCallback(galleryImage) {
	return function (e) {
		galleryImage.img = e.target;
		mImages.push(galleryImage);
	}
}

$(document).ready(function () {
	
	// This initially hides the photos' metadata information
	// $('.details').eq(0).hide();
	fetchJSON()
	$('img.moreIndicator').on('click', function () {
		if ($(this).hasClass('rot90')) {
			$(this).removeClass('rot90').addClass('rot270');
		} else {
			$(this).removeClass('rot270').addClass('rot90');
		}
		$('div.details').slideToggle('slow', animate());
	});
	$('#nextPhoto').position({
		my: 'right',
		at: 'right',
		of: '#nav'
	});
	$('#prevPhoto').on('click', function () {
		mCurrentIndex--;
		swapPhoto()
		mCurrentIndex--;
		console.log(mCurrentIndex)
		
	});
	$('#nextPhoto').on('click', function () {
		mCurrentIndex++;
		swapPhoto()
		mCurrentIndex--;
		console.log(mCurrentIndex)
	});
});

window.addEventListener('load', function () {

	console.log('window loaded');

}, false);

function GalleryImage() {
	//implement me as an object to hold the following data about an image:
	//1. location where photo was taken
	let location
	//2. description of photo
	let description
	//3. the date when the photo was taken
	let date
	//4. either a String (src URL) or an an HTMLImageObject (bitmap of the photo. https://developer.mozilla.org/en-US/docs/Web/API/HTMLImageElement)
	let img
}

function fetchJSON() {
	// When the XMLHttpRequest() state changes, it will trigger a function.
	mRequest.onreadystatechange = function () {
		// If it loads, it will parse the JSON file and get the text from it.
		if (mRequest.readyState == 4 && mRequest.status == 200) {
			var mJson = JSON.parse(mRequest.responseText);
			console.log(mJson.images)

			iterateJSON(mJson)
		} else {
			// If it doesn't load, it will send an error message in the console.
			console.log("We connected to the server, but it returned an error.");
		}
	}
	// The XMLHttpRequest() will open and send.
	mRequest.open("GET", mUrl)
	mRequest.send()
}
function iterateJSON(mJson) {
	for (var x = 0; x < mJson.images.length; x++) {
		mImages[x] = new GalleryImage()
		mImages[x].location = mJson.images[x].imgLocation
		mImages[x].description = mJson.images[x].description
		mImages[x].date = mJson.images[x].date
		mImages[x].imgPath = mJson.images[x].imgPath
	}
}
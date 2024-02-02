// requestAnim shim layer by Paul Irish
    window.requestAnimFrame = (function(){
      return  window.requestAnimationFrame       || 
              window.webkitRequestAnimationFrame || 
              window.mozRequestAnimationFrame    || 
              window.oRequestAnimationFrame      || 
              window.msRequestAnimationFrame     || 
              function(/* function */ callback, /* DOMElement */ element){
                window.setTimeout(callback, 1000 / 60);
              };
    })();
  

// example code from mr doob : http://mrdoob.com/lab/javascript/requestanimationframe/

animate();

var mLastFrameTime = 0;
var mWaitTime = 5000; //time in ms
function animate() {
    requestAnimFrame( animate );
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
	//Access the img element and replace its source
	//with a new image from your images array which is loaded
	//from the JSON string
	$("#photo").attr("src", mImages[mCurrentIndex].img);
	mCurrentIndex += 1;
	mCurrentIndex %= mImages.length;
  }
  
  
  // Counter for the mImages array
  var mCurrentIndex = 0;
  
  
  // XMLHttpRequest variable
  var mRequest = new XMLHttpRequest();
  
  
  // Array holding GalleryImage objects (see below).
  var mImages = [];
  
  
  // Holds the retrieved JSON information
  var mJson;
  
  
  // URL for the JSON to load by default
  // Some options for you are: images.json, images.short.json; you will need to create your own extra.json later
  var mUrl = "images.json";
  
  
  //You can optionally use the following function as your event callback for loading the source of Images from your json data (for HTMLImageObject).
  //@param A GalleryImage object. Use this method for an event handler for loading a gallery Image object (optional).
  function makeGalleryImageOnloadCallback(galleryImage) {
	return function (e) {
	  galleryImage.img = e.target;
	  mImages.push(galleryImage);
	};
  }
  
  
  $(document).ready(function () {
	// This initially hides the photos' metadata information
	$(".details").eq(0).hide();
	fetchJSON();
  });
  
  
  window.addEventListener(
	"load",
	function () {
	  console.log("window loaded");
	},
	false
  );
  
  
  class GalleryImage {
	constructor(location, description, date, img) {
	  //implement me as an object to hold the following data about an image:
	  //1. location where photo was taken
	  this.location = location;
	  //2. description of photo
	  this.description = description;
	  //3. the date when the photo was taken
	  this.date = date;
	  //4. either a String (src URL) or an an HTMLImageObject (bitmap of the photo. https://developer.mozilla.org/en-US/docs/Web/API/HTMLImageElement)
	  this.img = img;
	}
  }
  
  
  function fetchJSON() {
	mRequest.open("GET", mUrl);
	mRequest.send();
	mRequest.onreadystatechange = function () {
	  if (mRequest.readyState == 4 && mRequest.status == 200) {
		mJson = JSON.parse(mRequest.responseText);
		iterateJSON()
		console.log("hi");
	  } else {
		console.log("We connected to the server, but it returned an error.");
	  }
	};
  }
  
  
  function iterateJSON() {
	for (let image of mJson.images) {
	  mImages.push(
		new GalleryImage(
		  image.imgLocation,
		  image.description,
		  image.date,
		  image.imgPath
		)
	  );
	}
  }
  
  
  
  
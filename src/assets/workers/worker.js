var document = self.document = { parentNode: null, nodeType: 9, toString: function () { return "FakeDocument" } };
var window = self.window = self;
var fakeElement = Object.create( document );
fakeElement.nodeType = 1;
fakeElement.toString = function () { return "FakeElement" };
fakeElement.parentNode = fakeElement.firstChild = fakeElement.lastChild = fakeElement;
fakeElement.ownerDocument = document;

document.head = document.body = fakeElement;
document.ownerDocument = document.documentElement = document;
document.getElementById = document.createElement = function () { return fakeElement; };
document.createDocumentFragment = function () { return this; };
document.getElementsByTagName = document.getElementsByClassName = function () { return [fakeElement]; };
document.getAttribute = document.setAttribute = document.removeChild =
    document.addEventListener = document.removeEventListener =
    function () { return null; };
document.cloneNode = document.appendChild = function () { return this; };
document.appendChild = function ( child ) { return child; };
document.childNodes = [];
document.implementation = {
    createHTMLDocument: function () { return document; }
}

self.onmessage = function ( event ) {
    myobject = event.data;
    command = myobject.command;
    switch ( command )
    {
        case 'filterimg':
            self.startImagesFilter( myobject );
            break;
    }
    
}

self.startImagesFilter = function (data) {
    var filteredListArray = [];
    //var img = document.createElement( "img" );
    //var img = document.createElement( "img" );
    //img.setAttribute( 'src', data.Originalimage )
    //console.log( data.domArray )
    data.filters.forEach(( v, i ) => {
        //var filteredCanvas = self.filterImage( data.domArray[0], data.domArray[1], v, 50 );
        var filteredCanvas = self.filterImage( data.Originalimage, v, 50 );
        filteredListArray.push( filteredCanvas.toDataURL( 'image/webp', 1.0 ) );
        //var img = new Image();
        //img.onload = () => {
        //    var filteredList = self.filterImage( img, v, 50 );
        //    filtersImagesArray.push( filteredCanvas.toDataURL( 'image/webp', 1.0 ) );
        //};
        //img.src = data.Originalimage;
    } )
    postMessage( { filteredList: filteredListArray } );
}

//self.filterImage = function (img,canvas, filter, density ) {
//    //compute color intensity for the entire filter and density
//    var rIntensity = (filter.r * density + 255 * (100 - density)) / 25500;
//    var gIntensity = (filter.g * density + 255 * (100 - density)) / 25500;
//    var bIntensity = (filter.b * density + 255 * (100 - density)) / 25500;
//    //create canvas and load image
//    //var canvas = document.createElement("canvas");
//    canvas.width = img.width;
//    canvas.height = img.height;
//    console.log( canvas )
//    var ctx = canvas.getContext("2d");
//    ctx.drawImage(img, 0, 0, img.width, img.height);
//    //get image data and process the pixels
//    var imageData = ctx.getImageData(0, 0, img.width, img.height);
//    var data = imageData.data;
//    for (var i = 0; i < data.length; i += 4) {
//        var luma = 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];
//        data[i] = Math.round(rIntensity * luma);
//        data[i + 1] = Math.round(gIntensity * luma);
//        data[i + 2] = Math.round(bIntensity * luma);
//    }
//    //put the image data back into canvas
//    ctx.putImageData(imageData, 0, 0);
//    return canvas;
//}
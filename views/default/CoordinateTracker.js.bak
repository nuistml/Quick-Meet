// --------------------------------------------------------------------
// //  CoordinateTracker.js
// //  Track the x,y coordinate when mouse click event happen on canvas
// //
// //  Version 0.1 - Kevin, 6, 1/24/17
// //  -Add event listener on Canvas for click
// // --------------------------------------------------------------------

var evenclick = true;
var x1;
var y1;
var x2;
var y2;
var day = [ [100, 200], [200, 300],
            [300, 400], [400, 500],
            [500, 600], [600, 700], [700, 800] ];

var can = document.getElementById('myCanvas'),
    canLeft = can.offsetLeft,
    canTop = can.offsetTop,
    context = can.getContext('2d'),
    element = [];

can.onmousedown = function(event) {
  // saves first click, changes state
  if(evenclick){
    x1 = event.pageX - canLeft;
    y1 = event.pageY - canTop;
    evenclick = false;
  }
}

can.onmouseup = function(e){
  // saves second click, changes state
  if(!evenclick){
    x2 = e.pageX - canLeft;
    y2 = e.pageY - canTop;
    evenclick = true;
    //alert("Width: " + (x2-x1) + " Length: " + (y2-y1) + " x1: " + x1 + " y1: " + y1 + " x2: " + x2 + " y2: " + y2);
    findLocation();
  }
  
  
}

function findLocation (){
  // figures out which hours on the calendar have been selected
  for (var i = 0; i<day.length; i++){
    if( day[i][0] < x1 && x1 < day[i][1] ){
      alert("Day " + i + " selected!");
    }
  }
  
  
}

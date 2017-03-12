// --------------------------------------------------------------------
// //  CoordinateTracker.js
// //  Track the x,y coordinate when mouse click event happen on canvas
// //
// //  Version 0.8 - Nathan, 2/20/17
// //  -Add event listener on Canvas for click
// //  -Detects the day, added CSS file and moved some things.
// //  -Detects and alerts day and time range that the user has selected
// //  -Fixed dragging issues for box
// //
// //  Version 1.1 - Dylan, 2/23/17
// //  - Added tooltips
// //  - Added 10 minute interval on time
// // --------------------------------------------------------------------

// ~~~~~~~~~~~~~~~~
// Variables

var day = [ 100, 200,
            300, 400,
            500, 600,
            700, 800 ];

// will be filled with the pixel locations of the intervals used (currently 10 minutes)
var hour = [];

var currentDataSet = [];

var canvas, startX, endX, startY, endY, maxX, maxY;
var mouseIsDown = false;

var can = document.getElementById('myCanvas'),
    canLeft = can.offsetLeft,
    canTop = can.offsetTop,
    context = can.getContext('2d')

//get the calendar owner's name
var user = getParameterByName("username")
//create these 4 array to store calendar's events data
var btimeStart = [];
var btimeEnd = [];
var bdayStart = [];
var bdayEnd = [];
//get the calendar owner's all events, and then draw the box
get_Data("/QuickMeet/default/api/" + "0/"+ user +".json",function(data){
    var jsonData = JSON.parse(data);
    for (var i = 0; i < jsonData.length; i++) {
        btimeStart.push(jsonData[i].startTime)
        btimeEnd.push(jsonData[i].endTime)
        bdayStart.push(jsonData[i].days[0])
        bdayEnd.push(jsonData[i].days[jsonData[i].days.length -1])
    }
    drawBox(btimeStart, btimeEnd, bdayStart, bdayEnd);
})




// ~~~~~~~~~~~~~~~~
can.addEventListener('mousedown', mouseDown, false);
can.addEventListener('mousemove', mouseMove, false);
can.addEventListener('mouseup', mouseUp, false);

// tooltip
// http://stackoverflow.com/questions/15702867/html-tooltip-position-relative-to-mouse-pointer
var tooltipSpan = document.getElementById('tooltip-span');

/*window.onmousemove = function (e) {
    var x = e.clientX,
        y = e.clientY;
    tooltipSpan.style.top = (y + 20) + 'px';
    tooltipSpan.style.left = (x + 20) + 'px';
};*/

hourChange();
// hourChange generates the pixel area of each hour
function hourChange(){
  var tempHeight = 400/(rows*7);
  for(var i=0; i<=(rows*7); i++){
    hour.push( i*tempHeight );
  }
}


// Updates coordinates to generate box
function mouseUp(eve) {
	var deletion = document.getElementById('deleteswitch').checked;
    if (mouseIsDown != false) {
        mouseIsDown = false;
    }
    ctx.clearRect(0,0,c.width,c.height);
    drawGrid();
    if(deletion==false){
      findLocation();
    }
    if(deletion==true){
      findDeletion();
    }
    drawBox(btimeStart, btimeEnd, bdayStart, bdayEnd);
}

// Tracks user's initial click
function mouseDown(eve) {
    mouseIsDown = true;
    var pos = getMousePos(canvas, eve);
    startX = endX = pos.x;
    startY = endY = pos.y;
    maxX = startX;
    maxY = startY;
}

var toolX;
var toolY;
// Tracks user's drag
function mouseMove(eve) {
    ctx.clearRect(0,0,c.width,c.height);
    drawGrid();
    // mouse position
    drawBox(btimeStart, btimeEnd, bdayStart, bdayEnd);
    var pos = getMousePos(canvas, eve);

    // do drag box
    if (mouseIsDown !== false) {
        endX = pos.x;
        endY = pos.y;
        if(endX>maxX || endY>maxY){
        	ctx.clearRect(0,0,c.width,c.height);
    		drawGrid();
            drawBox(btimeStart, btimeEnd, bdayStart, bdayEnd);
        	maxX=endX;
        	maxY=endY;
        }
        if(endX<maxX || endY<maxY){
   	 	ctx.clearRect(0,0,c.width,c.height);
    	drawGrid();
            drawBox(btimeStart, btimeEnd, bdayStart, bdayEnd);
        	maxX = endX;
        	maxY = endY;

        }
        drawSquare();
    }


    // tooltip
    toolX = [pos.x - 50, pos.x - 10];
    toolY = [pos.y, pos.y+20];
    if(toolY[1] > 350){
      toolY[0] -= 20;
      toolY[1] -= 20;
    }
    
    // box
    ctx.beginPath();
    ctx.fillStyle = "rgba(30,30,30,1)";
    ctx.fillRect(toolX[0], toolY[0], toolX[1]-toolX[0], toolY[1]-toolY[0]);
    ctx.lineWidth = 1;
    
    // current time
    // figure out which hours were selected
    var tipDisplay;
    for (var i = 0; i<hour.length-1; i++){
      if( hour[i] <= pos.y && pos.y < hour[i+1] ){
        tipDisplay = timeCalc(i);
      }
    }
    
    // change tipDisplay to standard time
    if(tipDisplay > 1250){
      tipDisplay -= 1200;
    }else if(!tipDisplay){
      tipDisplay = 700;
    }
    
    // text
		ctx.font = "14px Arial";
		ctx.fillStyle = 'white';
		ctx.fillText(tipDisplay,toolX[0]+5,toolY[1]-5);
    
    
}

// Draws live rendering box
function drawSquare() {
    // creating a square
    var w = maxX - startX;
    var h = maxY - startY;
    var offsetX = (w < 0) ? w : 0;
    var offsetY = (h < 0) ? h : 0;
    var width = Math.abs(w);
    var height = Math.abs(h);
               
    ctx.beginPath();
    ctx.fillStyle = "rgba(128,0,0,1)";
    ctx.fillRect(startX + offsetX, startY + offsetY, width, height);
    ctx.lineWidth = 1;
   
}

function getMousePos(canvas, evt) {
    var rect = can.getBoundingClientRect();
    return {
        x: evt.clientX - rect.left,
        y: evt.clientY - rect.top
    };
}

function findDeletion(){
  var dayTemp = [];
  var hourTemp = [];
  for (var i = 0; i<day.length-1; i++){
    if( day[i] < startX && startX < day[i+1] ){
      dayTemp.push(i);
    }else if( startX < day[i] && day[i+1] < endX ){
      dayTemp.push(i);
    }else if( day[i] < endX && endX < day[i+1] ){
      dayTemp.push(i);
    }
  }

  for (var i = 0; i<hour.length-1; i++){
    if( hour[i] < startY && startY < hour[i+1] ){
      hourTemp.push(i);
    }else if( startY < hour[i] && hour[i+1] < endY ){
      hourTemp.push(i);
    }else if( hour[i] < endY && endY < hour[i+1] ){
      hourTemp.push(i);
    }
  }
  var timeStart = timeCalc(hourTemp[0]);
  var timeEnd = timeCalc(hourTemp[hourTemp.length-1]);

  var dayStart = dayTemp[0];
  var dayEnd = dayTemp[dayTemp.length-1];
  var counter = 0;

  for (a = btimeStart.length-1; a>=0; a--) {
        if((btimeStart[a]<=timeStart) && (timeEnd<=btimeEnd[a]) && (bdayStart[a]<=dayStart) && (dayEnd<=bdayEnd[a])){
            post_data("/QuickMeet/default/api/"+ user + "/1" +".json", btimeStart[a], btimeEnd[a], bdayStart[a], bdayEnd[a]);
            btimeStart.splice(a,1);
            btimeEnd.splice(a,1);
            bdayStart.splice(a,1);
            bdayEnd.splice(a,1);
            counter = counter + 1;
            ctx.clearRect(0,0,c.width,c.height);
            drawGrid();
            drawBox(btimeStart, btimeEnd, bdayStart, bdayEnd); 
            console.log("Deleted");
            break;
        }
    }
}

function findLocation (){
  // figures out which hours on the calendar have been selected
  var dayTemp = [];
  var hourTemp = [];
  // figure out which days were selected
  for (var i = 0; i<day.length-1; i++){
    if( day[i] < startX && startX < day[i+1] ){
      dayTemp.push(i);
    }else if( startX < day[i] && day[i+1] < endX ){
      dayTemp.push(i);
    }else if( day[i] < endX && endX < day[i+1] ){
      dayTemp.push(i);
    }
  }
  // figure out which hours were selected
  for (var i = 0; i<hour.length-1; i++){
    if( hour[i] < startY && startY < hour[i+1] ){
      hourTemp.push(i);
    }else if( startY < hour[i] && hour[i+1] < endY ){
      hourTemp.push(i);
    }else if( hour[i] < endY && endY < hour[i+1] ){
      hourTemp.push(i);
    }
  }

  
  var timeStart = timeCalc(hourTemp[0]);
  var timeEnd = timeCalc(hourTemp[hourTemp.length-1]);

  //var timeStart = hourTemp[0];
 //var timeEnd = hourTemp[hourTemp.length-1];
  var dayStart = dayTemp[0];
  var dayEnd = dayTemp[dayTemp.length-1];

  
  console.log("Busy from " + timeStart + " to " + timeEnd + " " + dayMap(dayStart) + " through " + dayMap(dayEnd));
  //post
  var user = getParameterByName("username")
  post_data("/QuickMeet/default/api/"+ user + "/0" +".json", timeStart, timeEnd, dayStart, dayEnd);

  btimeStart.push(timeStart);
  btimeEnd.push(timeEnd);
  bdayStart.push(dayStart);
  bdayEnd.push(dayEnd);
  return btimeStart, btimeEnd, bdayStart, bdayEnd;

}

// maps the hour selected to the time displayed
function timeCalc(x){
  return (Math.floor(x/7)*100 + (x%7 < 6 ? x%7 : 10)*10 + 700);
}

// maps the days to strings
function dayMap(x){
  switch(x){
    case 0:
      return "Sunday";
    case 1:
      return "Monday";
    case 2:
      return "Tuesday";
    case 3:
      return "Wednesday";
    case 4:
      return "Thursday";
    case 5:
      return "Friday";
    case 6:
      return "Saturday";
    default:
      return "Error: Invalid Day";
  }
}

//link the 'CREATE GROUP' button in the main page, redirect user to group calendar
function group(){
        var user = getParameterByName("username")
        window.location.href = "http://127.0.0.1:8000/Quickmeet/default/group?"+"username="+user
}

//http 'POST' method
function post_data(URL, tStart, tEnd, dStart, dEnd){
    var x = new XMLHttpRequest();
    x.open('POST', URL, false);
    x.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    x.send("timeStart=" + tStart + "&timeEnd=" + tEnd + "&dayStart=" + dStart + "&dayEnd=" + dEnd);
    //alert(x.responseText);
}

//http 'GET' method
function get_Data(theUrl, callback)
{
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function() { 
        if (xmlHttp.readyState == 4 && xmlHttp.status == 200)
            callback(xmlHttp.responseText);
    }
    xmlHttp.open("GET", theUrl, true); // true for asynchronous 
    xmlHttp.send(null);
}


//function to get the calendar owner's name
function getParameterByName(name, url) {
    if (!url) {
      url = window.location.href;
    }
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}

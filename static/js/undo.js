// --------------------------------------------------------------------
//  Undo.js
//  detects ctrl z and deletes previous addition
//
//  created 2/1/17, 6pm by Dylan
// --------------------------------------------------------------------

var control = false;

// detects pressing of a key.
// can be used to add functions for other keys.
document.onkeydown = function(evt) {
  switch(evt.keyCode){
    case 17:
      // ctrl pressed
      control = true;
      break;
    case 90:
      // z pressed, is ctrl still pressed?
      if(control){
        // delete the last element,
        post_data("/QuickMeet/default/api/"+ user +"/1" +".json", btimeStart.pop(), btimeEnd.pop(), bdayStart.pop(), bdayEnd.pop());
        ctx.clearRect(0,0,c.width,c.height);
        drawGrid();
        drawBox(btimeStart, btimeEnd, bdayStart, bdayEnd);
      }
      break;
  }
}

// removes control boolean on release
document.onkeyup = function(evt) {
  switch(evt.keyCode){
    case 17:
      control = false;
      break;
  }
}

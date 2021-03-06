//BoxGenerator.js
//draws a box given start and end times as well as the start and end days
//takes these times from the findLocation() function in coordinateTracker.js
//Isaac
var c = document.getElementById("myCanvas");
var ctx = c.getContext("2d");

function drawBox(tStart, tEnd, dStart, dEnd, user){
    if(user==null){
            ctx.fillStyle = "rgba(128,100,150,0.6)";
        } else{
            for(i = 0; i<colorUser.length; i++){
                var username = user;
                if(username==colorUser[i]){
                    ctx.fillStyle = colors[i];
                    console.log("The user color is "+ colors[i]);
                }
            }
        }
    if(user==="group"){
        ctx.fillStyle = "rgba(102,153,153,0.8)"
    }
       
    for(var i = 0; i < tStart.length; i++){
        //starting x coordinate is determined by the day first clicked on.
        var X_coordinate = dStart[i]*tileWidth+tileWidth;
        //starting y coordinate is determined by the time first clicked on.
        var Y_coordinate = ((tStart[i]-700)/100)*tileHeight;
        //width is change in days times the width of the tile
        var Width = ((dEnd[i]-dStart[i])*tileWidth)+tileWidth;
        //lenth is the difference in times
        var Length = ((tEnd[i]-tStart[i])/100)*tileHeight;
 
        ctx.fillRect(X_coordinate, Y_coordinate, Width, Length);

    }
    
}

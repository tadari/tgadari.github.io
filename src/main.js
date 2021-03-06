var canvas;
var ctx;

var WIDTH = 1200;
var HEIGHT = 800;

tileW = 40;
tileH = 40;

tileRowCount = 16;
tileColumnCount = 16;


boundX = 0;
boundY = 0;

var tiles = [];
for(c = 0; c < tileColumnCount; c++){
	tiles[c] = [];
	for(r = 0; r < tileRowCount; r++){
		tiles[c][r] = {x: c*(tileW+3), y: r*(tileH+3), state: 'e'};
	}
}

function rect(x,y,w,h,state){
	if(state == 'e'){
		ctx.fillStyle = '#AAAAAA';
	}
	else{
		ctx.fillStyle = state;
	}
	ctx.beginPath();
	ctx.rect(x,y,w,h);
	ctx.closePath();
	ctx.fill();
}

function clear(){
	ctx.clearRect(0,0,WIDTH,HEIGHT);
}

function clearAllTiles(){
	for(c = 0; c < tileColumnCount; c++){
		for(r = 0; r < tileRowCount; r++){
			tiles[c][r].state = 'e';
		}
	}
	
}


function sleep(milliseconds) {
  var start = new Date().getTime();
  for (var i = 0; i < 1e7; i++) {
    if ((new Date().getTime() - start) > milliseconds){
      break;
    }
  }
}


function sendData(){
var dataString = "";		
for(r = (tileRowCount-1); r >= 0; r--){
	var rev = 0;
		for(c = 0; c < tileColumnCount; c++){
			//This line is to make sure data gets sent in the order
			//of how the matrix lights are wired
			if(r%2 == 0)c = tileColumnCount - 1 - rev;
			
			//Turn RGB to GRB(since the matrix uses GRB)
			var x = tiles[c][r].state;
			x = x.slice(1,7);
			x = parseInt(x, 16);
			x = (x & 0x0000FF) | ((x & 0xFF0000) >>> 8) | ((x & 0x00FF00) << 8);	

			var ledString = x.toString(16);
while(ledString.length < 6) ledString = '0' + ledString;
			dataString = dataString + ledString;
			c = rev++;
		}
	}
			$.ajax({
			 	type: "POST",
			      	url: "/cgi-bin/pytest.py",
				data: {param: dataString},
			     context: document.body
			    });	
}



function draw(){
	clear();
	
	for(c = 0; c < tileColumnCount; c++){
		for(r = 0; r < tileRowCount; r++){
			rect(tiles[c][r].x, tiles[c][r].y, tileW, tileH, tiles[c][r].state);
		}
	}
}

function init(){
	canvas = document.getElementById("myCanvas");
	ctx = canvas.getContext("2d");
	return setInterval(draw, 10);
}

function myMove(e){
	x = e.pageX - canvas.offsetLeft;
	y = e.pageY - canvas.offsetTop;
	
	for(c=0; c < tileColumnCount; c++){
		for(r=0; r<tileRowCount; r++){
			if(c*(tileW+3) < x && x < c*(tileW+3)+tileW && r*(tileH+3) < y && y < r*(tileH+3)+tileH){
				currentState = document.getElementById("color1").value;
				if((tiles[c][r].state == "e" || tiles[c][r].state != currentState) && (c != boundX || r != boundY)){
					tiles[c][r].state = document.getElementById("color1").value;
					boundX = c;
					boundY = r;
				}
				else if(tiles[c][r].state == currentState  && (c != boundX || r != boundY)){
					tiles[c][r].state = 'e';
					boundX = c;
					boundY = r;
					
				}
			}
		}
	}
}


function myDown(e){
	canvas.onmousemove = myMove;
	
	x = e.pageX - canvas.offsetLeft;
	y = e.pageY - canvas.offsetTop;
	
	for(c=0; c < tileColumnCount; c++){
		for(r=0; r<tileRowCount; r++){
			if(c*(tileW+3) < x && x < c*(tileW+3)+tileW && r*(tileH+3) < y && y < r*(tileH+3)+tileH){
				currentState = document.getElementById("color1").value;
				if((tiles[c][r].state == "e" || tiles[c][r].state != currentState) && (c != boundX || r != boundY)){
					tiles[c][r].state = document.getElementById("color1").value;
					boundX = c;
					boundY = r;
				}
				else if(tiles[c][r].state == currentState  && (c != boundX || r != boundY)){
					tiles[c][r].state = "e";
					boundX = c;
					bounxY = r;
				}
				
			}
		}
	}
}

function myUp(){
	canvas.onmousemove = null;
}

	
init();
canvas.onmousedown = myDown;
canvas.onmouseup = myUp;

canvas.ontouchmove = myMove;
canvas.ontouchstart = (e) => {
	 myDown(e);
	 e.preventDefault();
};
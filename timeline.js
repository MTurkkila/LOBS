// Timeline: width 75*60=4500/6=750 eli skaalaa kaikki kuudella tai ainakin len

var timelineColors = ["#15bef0", "#e5053a", "#fcd116", "#5bbf21", "#3a75c4", "#e63375", "#eda075", "#00b08c", "#9258c8", "#8c0032", "#fca311", "#009e60"];	


function clearTimeline(){
	if( document.getElementById("canvas") == null){return;}
	node =  document.getElementById("divTimeline");
    removed = document.getElementById("canvas");
    node.removeChild(removed);
}


function leading0(tmp){
	if(tmp<10){return "0" + parseInt(tmp);}
	else{return parseInt(tmp);}
}

function sec2time(tmp){
	var mins = Math.floor(tmp/60);
	var secs = tmp-60*mins;
	return  leading0(mins) + ":" + leading0(secs);
}


function createTimeline() {
	if(masterRunning){
		if(!confirm('Are you sure? Stop timer and create timeline.')) return;
			ticker.stop();
			document.getElementById("bM").style.background =  "#009bff";
			document.getElementById("bM").innerHTML = "Start";
			masterRunning = false;
			stopAll();
		}
	else if( document.getElementById("canvas") != null){if(!confirm('Create new timeline?')) return;}
		
	clearTimeline(); // this is not working!!!
		
	var numOfButtons = document.getElementById("divButtons").childElementCount; // get the number of buttons
	
	var labels = [];
	for(var ii=0;ii<numOfButtons;ii++){
	labels.push(document.getElementById("b" + ii).textContent);
	}
	
	var canvas = document.createElement("canvas");
	var ctx = canvas.getContext("2d");
	canvas.id = "canvas";
	document.getElementById("divTimeline").appendChild(canvas);
	// Draw grid, 10px for 1 minute, --> 750 px + labels and totals
	// canvas width
	
	var textLength = 0;
	for(var ii=0;ii<numOfButtons;ii++){
	var txt = document.getElementById("b" + ii).textContent;
		if(ctx.measureText(txt).width > textLength){
			textLength = ctx.measureText(txt).width;
		}
	}
	
	
	var plotWidth; // this from lenght of time
	if(ticks<45*60){plotWidth = 450}
	else if(ticks<75*60){plotWidth = 750}
	else{plotWidth = 900}
	var canvasWidth = plotWidth + textLength + 100;	// add room for totals and then some
	canvas.width = canvasWidth;
	
	// canvas height
	var topMargin = 50;
	var plotHeight = 40*numOfButtons;
	var canvasHeight = plotHeight + 2*topMargin;	// add margin and space for ticks
	canvas.height = canvasHeight

	var plotStart = textLength + 10; // where the plot starts (x), labels to the left

	// postion for labels
	var height = 25; // height of the horizontal bars
	var pos = [];
	for(var pp=0;  pp<numOfButtons; pp++){
		//var step = 20;
		pos.push(pp*plotHeight/numOfButtons + height*0.5 + topMargin);
	}

// draw white background
ctx.fillStyle = "white";
ctx.fillRect(0, 0, canvas.width, canvas.height);
ctx.fillStyle = "black"; // drawcolor back to black

//document.body.appendChild(canvas);

// axes
ctx.moveTo(plotStart, plotHeight + topMargin);
ctx.lineTo(plotStart+plotWidth, plotHeight + topMargin);
ctx.stroke(); 

ctx.moveTo(plotStart, plotHeight + topMargin);
ctx.lineTo(plotStart, topMargin);
ctx.stroke();

// Y-ticks and labels
var labels = [];
for(var ii=0;ii<numOfButtons;ii++){
	var txt = document.getElementById("b" + ii).textContent;
	ctx.fillText(txt, plotStart-(ctx.measureText(txt).width+5), pos[ii]+height/2+2.5);
    ctx.beginPath();
    ctx.lineWidth = 1;
    ctx.strokeStyle = "#000000";
    // Draw a tick mark 6px long (-3 to 3)
    ctx.moveTo(plotStart-3, pos[ii]+height/2);
    ctx.lineTo(plotStart+3, pos[ii]+height/2);
    ctx.stroke();
}

// X-ticks and labels
for(var ii=0;ii<=plotWidth/10;ii++){
    ctx.beginPath(); //?
    ctx.lineWidth = 1;
    // Draw a tick mark 6px long (-3 to 3)
	ctx.setLineDash([]);
	ctx.strokeStyle = "#000000";
	ctx.moveTo(plotStart+10*ii, plotHeight + topMargin);
	ctx.lineTo(plotStart+10*ii, plotHeight + topMargin+5);
	ctx.stroke();
    // Draw gridlines
    if (ii>0 && ii%5==0) {
		ctx.beginPath();
		ctx.strokeStyle = "#8c8c8c";
		ctx.moveTo(plotStart+10*ii, plotHeight + topMargin -1);
		ctx.lineTo(plotStart+10*ii, topMargin);
		ctx.stroke();
		ctx.fillText(ii, plotStart+10*ii-5, plotHeight + topMargin +15);
		}
	 else if (ii>0) {
		ctx.beginPath();
		ctx.setLineDash([2, 2]);
		ctx.strokeStyle = "#cccccc";
		ctx.moveTo(plotStart+10*ii, plotHeight + topMargin -1);
		ctx.lineTo(plotStart+10*ii, topMargin);
		ctx.stroke();
		}
}
	
	// Clear canvas!
	//canvas.style.visibility = "visible";
	var totals = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
	var start, stop, len;
	var found = false;
	for(var ii = 0; ii < numOfButtons; ii++){
		tmp = 'start' + parseInt(ii);
		for(var k = 0; k < data.length; k++){
			if(data[k][0] == tmp){
				found = k;
			}
		}		
		for(var jj = 0; jj < data[found].length-1; jj++){
			start = data[found][jj+1]; 
			stop = data[found+1][jj+1]; 
			len = stop - start;
			totals[ii] += len;			
			ctx.fillStyle = timelineColors[ii];
			ctx.fillRect(plotStart+start/6, pos[ii], len/6, height); // /6 to scale 10px for 1 minute
		}
		ctx.fillStyle = "Black"
		ctx.fillText(sec2time(totals[ii]), plotStart+plotWidth+10, pos[ii]+height/2);
		
	}

// make clickable
canvas.addEventListener('click', function() {
		//var canvasDataUrl = canvas.toDataURL("image/png");
		
		window.open().document.write('<img src="' + canvas.toDataURL() + '" />');
		
		//window.open(canvasDataUrl, '_blank');
}, false);
	
// autoscroll to the bottom of the page to show the timeline
window.scrollTo(0,document.body.scrollHeight);	 
}

function saveTimeline(){
	// check if canvas exists and if not create it
	if(!document.getElementById("canvas")){
		createTimeline();
	}
	
    var link = document.createElement("a");
    link.setAttribute('download', document.getElementById("filename").value);
    link.href = canvas.toDataURL("image/png");
    document.body.appendChild(link);
    link.click();
    link.remove();
}



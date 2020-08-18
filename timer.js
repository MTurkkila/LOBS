	// initialize data-array
	var data;
	function clearData(){
		data = [];
		var startSTR = 'start';
		var stopSTR = 'stop';
		var numOfButtons = document.getElementById("divButtons").childElementCount;
		
		for(ii=0; ii<numOfButtons; ii++){
			data.push(['start' + parseInt(ii)]);
			data.push(['stop' + parseInt(ii)]);
		} 
	}
	clearData();	
//console.log(data);		
 
var tmp;
var ticks = 0;
var masterRunning = false;
var running = []; // as many as buttons

// Add button
function addButton(name) {
	if(masterRunning) return alert("No adding buttons while timer is running!");
	buttons = document.getElementById("divButtons")
	var numOfButtons = buttons.childElementCount;
	if(numOfButtons<12){
		var id = "b" + parseInt(numOfButtons);
		var functionName = "timeStamp('" + parseInt(numOfButtons) + "')";
		var btn = document.createElement("BUTTON");
		btn.id = id;
		btn.className = "buttonMain";
		btn.setAttribute("onclick", functionName);
		if (name == undefined){
			btn.innerHTML = numOfButtons;
			document.getElementById("divButtons").appendChild(btn);
			saveButtons()
			}
		else {
			btn.innerHTML = name;
			document.getElementById("divButtons").appendChild(btn);
			}
		
		data.push(['start' + parseInt(numOfButtons)]);
		data.push(['stop' + parseInt(numOfButtons)]);
		running.push(false);
		
	}
	else{alert("12 buttons max!\nIf you need more open another timer.");}
}

// Remove Button
function removeButton() {
	if(masterRunning) return alert("No removing buttons while timer is running!");
	buttons = document.getElementById("divButtons")
	var numOfButtons = buttons.childElementCount;
	if(numOfButtons>2){
		var id = "b" + parseInt(numOfButtons-1);
		removed = document.getElementById(id);
		buttons.removeChild(removed);
		data.splice(data.length-2, 2);
		running.pop();
		saveButtons();
	}
	else {alert("Timer has to have atleast two buttons!");}
}

// Rename buttons
function renameButtons() {
	buttons = document.getElementById("divButtons")
	var numOfButtons = buttons.childElementCount;
	// for-looppi kaikille napeille
	for(ii=0; ii<numOfButtons; ii++){
		var tmpId = "b" + parseInt(ii);
		var tmpButton = document.getElementById(tmpId);
		var txt = prompt("Please enter text for button", tmpButton.innerHTML);
		//if (txt.length > 30) {txt = txt.substring(0,29) + "...";} // Ei hyvä tapa, ei skaalaudu
		tmpButton.innerHTML = txt;
	}
	saveButtons();
}

// Original timer by Leon Williams @
// https://stackoverflow.com/questions/29971898/how-to-create-an-accurate-timer-in-javascript
/**
 * Self-adjusting interval to account for drifting
 * 
 * @param {function} workFunc  Callback containing the work to be done
 *                             for each interval
 * @param {int}      interval  Interval speed (in milliseconds) - This 
 * @param {function} errorFunc (Optional) Callback to run if the drift
 *                             exceeds interval
 */
function AdjustingInterval(workFunc, interval, errorFunc) {
    var that = this;
    var expected, timeout;
    this.interval = interval;

    this.start = function() {
        expected = Date.now() + this.interval;
        timeout = setTimeout(step, this.interval);
    }

    this.stop = function() {
        clearTimeout(timeout);
        stopAll();
    }
    
    this.clear = function() {
		if(!confirm('Are you sure? Clear data and reset timer.')) return;
		ticker.stop();
		document.getElementById("bM").style.background =  "#009bff";
		document.getElementById("bM").innerHTML = "Start";
		masterRunning = false;
		stopAll();
        ticks = 0;
        document.getElementById("MasterTime").innerHTML = "0:00";
        clearData();
		clearTimeline();
    }

    function step() {
        var drift = Date.now() - expected;
        if (drift > that.interval) {
            // You could have some default stuff here too...
            if (errorFunc) errorFunc();
        }
        workFunc();
        expected += that.interval;
        timeout = setTimeout(step, Math.max(0, that.interval-drift));
    }
}

// Define the work to be done
var doWork = function() {
    console.log(++ticks); // time goes up
    var minutes = Math.floor(ticks/60);
    var seconds = ticks - (60*minutes);
    if (seconds.toString().length < 2){seconds = '0' + seconds.toString()}
    document.getElementById("MasterTime").innerHTML = minutes + ':' + seconds;
};

// Define what to do if something goes wrong
var doError = function() {
    console.warn('The drift exceeded the interval.');
};

// (The third argument is optional)
var ticker = new AdjustingInterval(doWork, 1000, doError);

// MY functions
function masterStartStop() {
 var elem = document.getElementById("bM");
  if (masterRunning == false){
    ticker.start();
    elem.style.background =  "#3ddc97";
    elem.innerHTML = "Stop";
	masterRunning = true;
  } else {
    ticker.stop();
    elem.style.background =  "#009bff";
	elem.innerHTML = "Start";
	masterRunning = false;
  }
}

function stopAll(){
	for (var ii = 0; ii<running.length; ii++){
		if (running[ii] == true){
			tmp = 'stop' + ii;
			for(var k = 0; k < data.length; k++){
				if(data[k][0] == tmp){
					found = k;
				}
			}
			data[found].push(ticks);
			document.getElementById("b" + ii).style.background =  "#009bff";
			running[ii] = false;
		}
	}
}

timeStamp = function(input) {
	var idx = parseInt(input)
	var found = false;
	if (running[idx] == false) {
		tmp = 'start' + input;
		for(var k = 0; k < data.length; k++){
			if(data[k][0] == tmp){
				found = k;
			}
		}		
		data[found].push(ticks);
		document.getElementById("b" + input).style.background =  "#3ddc97";
		running[idx] = true;
		}
	else {
		tmp = 'stop' + input;
		for(var k = 0; k < data.length; k++){
			if(data[k][0] == tmp){
				found = k;
			}
		}
		data[found].push(ticks);
		document.getElementById("b" + input).style.background =  "#009bff";
		running[idx] = false;
	}
}

function transpose(inputArray) {
	// find length of longest inner array
	var len = 0;
	for(ii=0; ii<inputArray.length; ii++){
		var inputLen = inputArray[ii].length;
		if(inputLen > len){len = inputLen};
	}
	// if inner arrays length less than longest, add necessary nulls
	for(ii=0; ii<inputArray.length; ii++){
		var diff = len - inputArray[ii].length;
		console.log(diff);
		if(diff>0){
			for(jj=0; jj<diff; jj++){inputArray[ii].push(null)}
			}
	}
	// return transposed array
	return inputArray[0].map((col, c) => inputArray.map((row, r) => inputArray[r][c]));
}

// Original function for downloading csv by Arne H. Bitubekk @
// https://stackoverflow.com/questions/14964035/how-to-export-javascript-array-info-to-csv-on-client-side
getData = function(){
	dataT = transpose(data);
// Building the CSV from the Data two-dimensional array
// Each column is separated by "," and new line "\n" for next row
// FIKSAA, pitäisi lisätä joka riville oikea määrä pilkkua. Tsekkaa pisimminä arrayn pituus ja lisää tarvittavat määrä pilkkuja. Python scripti ei toimi muuten
	var csvContent = '';
	dataT.forEach(function(infoArray, index) {
		dataString = infoArray.join(',');
		csvContent += index < dataT.length ? dataString + '\n' : dataString;
	});
	var filename = document.getElementById("filename").value;
	filename += '.csv';
	download(csvContent, filename, 'text/csv;encoding:utf-8');
}

// The download function takes a CSV string, the filename and mimeType as parameters
var download = function(content, fileName, mimeType) {
  var a = document.createElement('a');
  mimeType = mimeType || 'application/octet-stream';
  if (navigator.msSaveBlob) { // IE10
    navigator.msSaveBlob(new Blob([content], {
      type: mimeType
    }), fileName);
  } else if (URL && 'download' in a) { //html5 A[download]
    a.href = URL.createObjectURL(new Blob([content], {
      type: mimeType
    }));
    a.setAttribute('download', fileName);
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  } else {
    location.href = 'data:application/octet-stream,' + encodeURIComponent(content); // only this mime type is supported
  }
}
  
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
	
	var plotWidth; // this from lenght of time
	if(ticks<45*60){plotWidth = 450}
	else if(ticks<75*60){plotWidth = 750}
	else{plotWidth = 900}
	var canvasWidth = plotWidth + 250;	
	canvas.width = canvasWidth;
	
	// canvas height
	var plotHeight = 40*numOfButtons;
	var canvasHeight = plotHeight + 60;	// THIS form number of buttons
	canvas.height = canvasHeight

	var plotStart = 200;

	var height = 25;
	var pos = [];
	for(var pp=0;  pp<numOfButtons; pp++){
		var step = 20;
		pos.push(pp*plotHeight/numOfButtons + height*0.5);
	}


//document.body.appendChild(canvas);

// axes
ctx.moveTo(plotStart, plotHeight);
ctx.lineTo(plotStart+plotWidth, plotHeight);
ctx.stroke(); 

ctx.moveTo(plotStart, plotHeight);
ctx.lineTo(plotStart, 0);
ctx.stroke();

// Y-ticks and labels
var labels = [];
for(var ii=0;ii<numOfButtons;ii++){
	var txt = document.getElementById("b" + ii).textContent;
	ctx.fillText(txt, plotStart-(ctx.measureText(txt).width+5), pos[ii]+height/2+2.5);
	console.log(ctx.measureText(txt).width)
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
	ctx.moveTo(plotStart+10*ii, plotHeight);
	ctx.lineTo(plotStart+10*ii, plotHeight+5);
	ctx.stroke();
    // Draw gridlines
    if (ii>0 && ii%5==0) {
		ctx.beginPath();
		ctx.strokeStyle = "#8c8c8c";
		ctx.moveTo(plotStart+10*ii, plotHeight-1);
		ctx.lineTo(plotStart+10*ii, 0);
		ctx.stroke();
		ctx.fillText(ii, plotStart+10*ii-5, plotHeight+15);
		}
	 else if (ii>0) {
		ctx.beginPath();
		ctx.setLineDash([2, 2]);
		ctx.strokeStyle = "#cccccc";
		ctx.moveTo(plotStart+10*ii, plotHeight-1);
		ctx.lineTo(plotStart+10*ii, 0);
		ctx.stroke();
		//ctx.setLineDash([]);
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
}

// Get the modal
var modal = document.getElementById('myModal');

// Get the button that opens the modal
var btn = document.getElementById("infoButton");

// Get the <span> element that closes the modal
var span = document.getElementsByClassName("close")[0];

// When the user clicks the button, open the modal 
btn.onclick = function() {
  modal.style.display = "block";
}

// When the user clicks on <span> (x), close the modal
span.onclick = function() {
  modal.style.display = "none";
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
  
}
   
function saveButtons() {
	var  buttonNames = [];
	buttons = document.getElementById("divButtons")
	var numOfButtons = buttons.childElementCount;
	// for-looppi kaikille napeille
	for(ii=0; ii<numOfButtons; ii++){
		var tmpId = "b" + parseInt(ii);
		var tmpButton = document.getElementById(tmpId);
		buttonNames.push(tmpButton.innerHTML);
	}
	localStorage.buttonNames = JSON.stringify(buttonNames);
	console.log(buttonNames);
}

function delLocal(){
	 localStorage.clear();
}

if (typeof(Storage) !== "undefined") {
	if(localStorage.buttonNames){
		var storedNames = JSON.parse(localStorage.buttonNames);
		for(var ii=0; ii<storedNames.length; ii++){
			addButton(storedNames[ii]);
			running.push(false);
		} 
	}else if(typeof presetNames !== 'undefined'){
		for(var ii=0;ii<presetNames.length;ii++){
			addButton(presetNames[ii]);
			running.push(false);
		}
	}else {
		for(var ii=0;ii<6;ii++){
			addButton(ii);
			running.push(false);
		}
	}
	
} else {
console.log("Sorry, your browser does not support web storage...");
	}

//window.onbeforeunload = function() {
//	if(masterRunning){
//	return "You sure? Timer is still running.";	
//	}
//}

// if (typeof variable !== 'undefined') {
    // the variable is defined


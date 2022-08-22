// share.js for share-button
function ShareLink(){
	if (typeof(localStorage.buttonNames) == "undefined") {
		alert("ei voi jakaa ny")
	}
	else{
		var currentURL = window.location.protocol + window.location.pathname;
		var encoded = encodeURI(JSON.stringify(localStorage.buttonNames));
		console.log(encoded);
		var link = currentURL + "?btn=" + encoded;
		navigator.clipboard.writeText(link);
		alert("Link copied to clipboard: \n\n" + link)}
}

function getBtnNamesFromUrl(){
	var currentURL = window.location.protocol + window.location.pathname;
	const urlParams = new URLSearchParams(window.location.search);
	var tmp = urlParams.get("btn")
	if(tmp){
		var newBtnNames = decodeURI(JSON.parse(tmp));
	}
	//console.log(newBtnNames);
	if (newBtnNames) {
		console.log("pöö");
		localStorage.buttonNames = newBtnNames;
		window.history.replaceState({}, "", currentURL);
	}
}

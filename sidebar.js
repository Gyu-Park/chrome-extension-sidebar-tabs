console.log("side-panel script loaded");

chrome.runtime.onMessage.addListener(function(msg, sender){
    console.log("message received");
    if(msg == "toggle"){
        console.log("message received");
        toggle();
    }
})

var iframe = document.createElement('iframe'); 
iframe.style.background = "white";
iframe.style.height = "100%";
iframe.style.width = "0px";
iframe.style.position = "fixed";
iframe.style.top = "0px";
iframe.style.right = "0px";
iframe.style.zIndex = "9000000000000000000";
iframe.style.border = "1px solid black";
iframe.style.transition = "1s";
iframe.src = chrome.runtime.getURL("popup.html")

document.body.appendChild(iframe);

function toggle(){
    if(iframe.style.width == "0px"){
        iframe.style.width="400px";
    }
    else{
        iframe.style.width="0px";
    }
}
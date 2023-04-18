// Checkboxes
let button = document.getElementById('switch');
let messages = document.getElementById('messages');

// Message functionality
let mainContent = document.getElementById('mainContent');
let popupMessage = document.getElementById('popupMessage');

// Get and set current version
let version = chrome.runtime.getManifest().version;
document.getElementById('version').innerText = version;

// Add or remove stylesheets
function refreshScript(){
  chrome.tabs.query({url: "https://web.whatsapp.com/"}, function(tabs) {
    if (tabs.length !== 0)
      tabs.forEach(function(tab){chrome.tabs.executeScript(tab.id, {file: '/load.js'})});
  });
}

// Set current state in popup
chrome.storage.sync.get([
    'on',
    'messages'
  ], function(data) {
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
      messages.checked=data.messages;
      
      //load message
      xmlhttp=new XMLHttpRequest();
      xmlhttp.onreadystatechange=function(){
        if (xmlhttp.readyState==4 && xmlhttp.status==200){
          let response = JSON.parse(xmlhttp.responseText);
          if(response["*"] && response["*"]["min"] <= version && response["*"]["max"] >= version)
            response = response["*"]["msg"];
          else
            response = response[version] ? response[version] : '';

          if(response != "" && data.currentPopupMessage != response){
            mainContent.style.display = "none";
            popupMessage.innerText = response;
            popupMessage.innerHTML += "<br><a href=\"#\" id=\"popupMessageButton\">Close message</a>";

            let popupMessageButton = document.getElementById('popupMessageButton');
            popupMessageButton.addEventListener('click', function() {
              chrome.storage.sync.set({currentPopupMessage: response});
              popupMessage.innerHTML = "";
              mainContent.style.display = "initial";
            });
          }
        }
      }
      xmlhttp.open("GET", "", true);
      xmlhttp.send();
    });
});

button.addEventListener('change', function() {
  chrome.storage.sync.set({on: this.checked});
  refreshScript();
});

// Update settings values
messages.addEventListener('change', function() {
  chrome.storage.sync.set({messages: this.checked});
  refreshScript();
});
// Called when the user clicks on the browser action.
chrome.pageAction.onClicked.addListener(function(tab) {
  chrome.tabs.sendMessage(tab.id, 'refresh', function() {
    //todo - add response handling
  });
});

// Listen for any changes to the URL of any tab.
chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
  chrome.pageAction[/https?\:\/\//.test(tab.url) ? 'show' : 'hide'](tabId);
});
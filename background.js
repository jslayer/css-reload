// Called when the user clicks on the browser action.
chrome.pageAction.onClicked.addListener(function(tab){
    chrome.pageAction.setIcon({
        tabId : tab.id,
        path : 'icon-48--active.png'
    });

    chrome.tabs.sendMessage(tab.id, 'refresh', function(){
        setTimeout(function() {
            chrome.pageAction.setIcon({
                tabId : tab.id,
                path : 'icon-48.png'
            });
        }, 300);
    });
});

// Listen for any changes to the URL of any tab.
chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab){
    chrome.pageAction[/https?\:\/\//.test(tab.url) ? 'show' : 'hide'](tabId);
    //chrome.pageAction.show(tabId);
});

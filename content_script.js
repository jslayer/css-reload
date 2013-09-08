//todo - add hotkey support
var FILTER, SEARCH_REG_EXPR, IMPORT_REG_EXPR, URL_MATCH;

FILTER = [
    'yui.yahooapis.com',
    'ajax.googleapis.com',
    'fonts.googleapis.com',
    'ajax.aspnetcdn.com',
    'ajax.microsoft.com',
    'code.jquery.com'
];

SEARCH_REG_EXPR = /jcr=\w+/;
IMPORT_REG_EXPR = /(@import[^)]+)/;
URL_MATCH = /url[\s\('"]+([^'"]+)/;

chrome.extension.onMessage.addListener(function(request, sender, sendResponse){
    switch (request) {
        case 'refresh':
            refresh();
            break;
    }
    sendResponse(true);
});

function refresh(){
    var i, item, a, search, newUrl, content, parts, update;

    search = 'jcr=' + (new Date().getTime()).toString(36);

    for (i = 0; i < document.styleSheets.length; i++) {
        update = false;
        item = document.styleSheets[i];

        if (item.ownerNode) {
            if (item.href && item.ownerNode.nodeName === 'LINK') {
                newUrl = generateNewUrl(item.href, search);

                if (newUrl) {
                    item.ownerNode.href = newUrl;
                }
            }
            else if (item.ownerNode.nodeName === 'STYLE') {
                content = item.ownerNode.innerHTML;

                parts = content.split(IMPORT_REG_EXPR);

                parts.forEach(function(part, key){
                    var href, matches;

                    if (IMPORT_REG_EXPR.test(part)) {
                        matches = part.match(URL_MATCH);
                        if (matches.length === 2) {
                            update = true;
                            parts[key] = part.replace(matches[1], generateNewUrl(matches[1], search));
                        }
                    }
                });

                if (update) {
                    item.ownerNode.innerHTML = parts.join('');
                }
            }
        }
    }
}

/**
 * @param url
 * @param search
 * @return {*}
 */
function generateNewUrl(url, search){
    var a = document.createElement('a');

    a.href = url;

    if (FILTER.indexOf(a.host) === -1) {
        a.search = SEARCH_REG_EXPR.test(a.search)
            ? a.search.replace(/jcr=\w+/, search)
            : search;

        return a.href;
    }

    return false;
}

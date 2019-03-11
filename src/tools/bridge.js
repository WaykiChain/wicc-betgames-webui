let ua = navigator.userAgent,
    client = {
        isAndroid: /Android/i.test(ua),
        isIos: /iPhone|iPod|iPad/i.test(ua),
        isWx: /MicroMessenger/i.test(ua),
        isMobile: /AppleWebKit.*Mobile/i.test(ua),
    };
// for ios
function setupWebViewJavascriptBridge(callback) {
    if (window.WebViewJavascriptBridge) {
        return callback(window.WebViewJavascriptBridge)
    }
    if (window.WVJBCallbacks) {
        return window.WVJBCallbacks.push(callback)
    }
    window.WVJBCallbacks = [callback]
    let WVJBIframe = document.createElement('iframe')
    WVJBIframe.style.display = 'none'
    WVJBIframe.src = 'https://__bridge_loaded__'
    document.documentElement.appendChild(WVJBIframe)
    setTimeout(() => {
        document.documentElement.removeChild(WVJBIframe)
    }, 0)
}

//for android
function connectWebViewJavascriptBridge(callback) {
    if (window.WebViewJavascriptBridge) {
        callback(WebViewJavascriptBridge)
    } else {
        document.addEventListener(
            'WebViewJavascriptBridgeReady'
            , function () {
                callback(WebViewJavascriptBridge)
            },
            false
        );
    }
}

export default {
    client,
    callhandler(name, data, callback) {
        if (client.isIos) {
            setupWebViewJavascriptBridge(function (bridge) {
                bridge.callHandler(name, data, callback)
            })
        } else {
            connectWebViewJavascriptBridge(function (bridge) {
                bridge.callHandler(name, data, callback)
            })
        }       
    },
    registerhandler(name, callback) {
        if (client.isIos) {
            setupWebViewJavascriptBridge(function (bridge) {
                bridge.registerHandler(name, function (data, responseCallback) {
                    callback(data, responseCallback)
                })
            })
        } else {
            connectWebViewJavascriptBridge(function (bridge) {
                bridge.registerHandler(name, function (data, responseCallback) {
                    callback(data, responseCallback)
                })
            })
        }
    }
}

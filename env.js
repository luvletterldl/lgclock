var debug = false; //true false 'xlab'

if (debug == true) {
  var domain = "https://dev-melon.didiapp.com";
  var websocket_domain = "ws://dev-melon.didiapp.com";
    var atKey = "access_token";
} else if(debug == 'xlab') {
  var domain = "https://xlab-melon.didiapp.com";
  var websocket_domain = "wss://xlab-melon.didiapp.com"
  var atKey = "online_access_token";
} else if (debug == false){
  var domain = "https://melon.didiapp.com";
  var websocket_domain = "wss://melon.didiapp.com"
  var atKey = "online_access_token";
}
console.log('setting', debug, domain, websocket_domain, atKey)
module.exports = {
    domain: domain,
    atKey: atKey,
    websocket_domain: websocket_domain
}

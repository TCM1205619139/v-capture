window.onload = () => {
  chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    console.log('request: ', request)
    console.log('sender: ', sender)
    sendResponse('我收到了你的消息！');
  });
}
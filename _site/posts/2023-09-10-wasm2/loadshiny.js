import { WebR } from 'https://webr.r-wasm.org/latest/webr.mjs';

const webR = new WebR();

// TODO
const shinyScriptURL = 'https://raw.githubusercontent.com/rstudio/shiny/main/inst/examples/01_hello/app.R';
const shinyScriptName = 'app.R';

let webSocketHandleCounter = 0;
let webSocketRefs = {};

const loadShiny = async () => {
  document.getElementById('statusButton').innerHTML = `<i class="fas fa-spinner fa-spin"></i>Setting up websocket proxy and register service worker`;
  
  class WebSocketProxy {
    url;
    handle;
    bufferedAmount;
    readyState;
    constructor(_url) {
      this.url = _url;
      this.handle = webSocketHandleCounter++;
      this.bufferedAmount = 0;
      this.shelter = null;
      webSocketRefs[this.handle] = this;
      
      webR.evalRVoid(`
        onWSOpen <- options('webr_httpuv_onWSOpen')[[1]]
        if (!is.null(onWSOpen)) { onWSOpen(${this.handle},list(handle = ${this.handle})) }`);
      setTimeout(() => { this.readyState = 1; this.onopen() }, 0);
    }
    
    async send(msg) {
      webR.evalRVoid(`
        onWSMessage <- options('webr_httpuv_onWSMessage')[[1]]
        if (!is.null(onWSMessage)) {onWSMessage(${this.handle}, FALSE, '${msg}')}`);
    }
  }
  
  await webR.init();
  console.log('webR ready');

  (async () => {
  for (; ;) {
    const output = await webR.read();
    switch (output.type) {
      case 'stdout':
        console.log(output.data);
        break;
      case 'stderr':
        console.log(output.data);
        break;
      case '_webR_httpuv_TcpResponse':
        const registration = await navigator.serviceWorker.getRegistration();
        registration.active.postMessage({
          type: "wasm-http-response",
          uuid: output.uuid,
          response: output.data,
        });
        break;
      case '_webR_httpuv_WSResponse':
        const event = { data: output.data.message };
        webSocketRefs[output.data.handle].onmessage(event);
        console.log(event);
        break;
    }
  }})(); // async END
  
  // TODO
  const registration = await navigator.serviceWorker
  .register('/posts/2023-09-10-wasm2/httpuv-serviceworker.js', { scope: '/posts/2023-09-10-wasm2/' });
  
  // .register('/webR/httpuv-serviceworker.js', { scope: '/webR/' }); WORK
  
  // /posts/2023-09-10-wasm2 -> Error
  
  // /posts -> The path of the provided scope ('/posts') is not under the max scope allowed ('/posts/2023-09-10-wasm2/'). Adjust the scope, move the Service Worker script, or use the Service-Worker-Allowed HTTP header to allow the scope.
  
  
  
  navigator.serviceWorker.getRegistration()
  .then((registration) => {
    const scope = registration.scope;
    console.log('Service worker scope:', scope);
  });
    
  await navigator.serviceWorker.ready;
  window.addEventListener('beforeunload', async () => { await registration.unregister(); });
  console.log("service worker registered");
  
  document.getElementById('statusButton').innerHTML = `<i class="fas fa-spinner fa-spin"></i>Downloading R script...`;
  await webR.evalR("download.file('" + shinyScriptURL + "', '" + shinyScriptName + "')");
  console.log("file downloaded");
  
  document.getElementById('statusButton').innerHTML = `<i class="fas fa-spinner fa-spin"></i>Installing packages...`;
  await webR.installPackages(["shiny", "jsonlite"])
  
  document.getElementById('statusButton').innerHTML = `<i class="fas fa-spinner fa-spin"></i>Loading app...`;
  webR.writeConsole(`
    library(shiny)
    runApp('` + shinyScriptName + `')
  `);
  
  // Setup listener for service worker messages
  navigator.serviceWorker.addEventListener('message', async (event) => {
    if (event.data.type === 'wasm-http-fetch') {
      var url = new URL(event.data.url);
      var pathname = url.pathname.replace(/.*\/__wasm__\/([0-9a-fA-F-]{36})/, "");
      var query = url.search.replace(/^\?/, '');
      webR.evalRVoid(`
        onRequest <- options("webr_httpuv_onRequest")[[1]]
        if (!is.null(onRequest)) {
          onRequest(
            list(
              PATH_INFO = "${pathname}",
              REQUEST_METHOD = "${event.data.method}",
              UUID = "${event.data.uuid}",
              QUERY_STRING = "${query}"
            )
          )
        }`);
    }
  });
  
  // Register with service worker and get our client ID
  const clientId = await new Promise((resolve) => {
    navigator.serviceWorker.addEventListener('message', function listener(event) {
      if (event.data.type === 'registration-successful') {
        navigator.serviceWorker.removeEventListener('message', listener);
        resolve(event.data.clientId);
        console.log("event data:")
        console.log(event.data)
      }
    });
    registration.active.postMessage({ type: "register-client" });
  });
  console.log("serviceworker proxy is ready");
  
  // Load the WASM httpuv hosted page in an iframe
  const containerDiv = document.getElementById('iframeContainer');
  let iframe = document.createElement('iframe');
  iframe.id = 'app';
  iframe.src = `./__wasm__/${clientId}/`;
  iframe.frameBorder = '0';
  iframe.style.width = '100%';
  iframe.style.height = '600px'; // Adjust the height as needed
  iframe.style.overflow = 'auto';
  containerDiv.appendChild(iframe);
  
  // Install the websocket proxy for chatting to httpuv
  iframe.contentWindow.WebSocket = WebSocketProxy;
  
  document.getElementById('statusButton').innerHTML = `<i class="fas fa-check-circle"></i>App loaded!`;
  document.getElementById('statusButton').style.backgroundColor = 'green';
  console.log("App loaded!");
};

loadShiny();
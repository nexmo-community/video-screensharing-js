let session;

fetch(location.pathname, { method: "POST" })
  .then(res => {
    return res.json();
  })
  .then(res => {
    const apiKey = res.apiKey;
    const sessionId = res.sessionId;
    const token = res.token;
    initializeSession(apiKey, sessionId, token);
  })
  .catch(handleCallback)

function initializeSession(apiKey, sessionId, token) {
  session = OT.initSession(apiKey, sessionId);
  
  const publisher = OT.initPublisher(
    "publisher",
    {
      insertMode: "append",
      width: "100%",
      height: "100%"
    },
    handleCallback
  );
  
  session.connect(token, error => {
    if(error) {
      handleCallback(error);
    } else {
      session.publish(publisher, handleCallback)
    }
  });
  
  session.on("streamCreated", event => {
    session.subscribe(
      event.stream, 
      "subscriber",
      {
        insertMode: "append",
        width: "50%",
        height: "50%"
      },
      handleCallback
    )
  })
}

function handleCallback(error) {
  if (error) {
    console.log("error: " + error.message);
  } else {
    console.log("callback success");
  }
}

const shareScreenButton = document.getElementById("share-screen");
shareScreenButton.addEventListener("click", event => {
  OT.checkScreenSharingCapability(response => {
    if(!response.supported || !response.extensionRegistered) {
      alert("Screen sharing not supported")
    } else if (!response.extensionInstalled) {
      alert("Browser requires extension")
    } else {
      shareScreen();
    }
  })
});

function shareScreen() {
  const publisher = OT.initPublisher(
    "screen-preview",
    {
      insertMode: "append",
      width: "100%",
      height: "100%",
      videoSource: "screen"
    },
    handleCallback
  )
  
  session.publish(publisher, handleCallback)
  
}
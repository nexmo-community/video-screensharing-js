function initializeSession(apiKey, sessionId, token) {
  const session = OT.initSession(apiKey, sessionId);
  
  const publisher = OT.initPublisher(
    "publisher",
    {
      insertMode: "append",
      width: "100%",
      height: "100%"
    },
    handleCallback
  )

}
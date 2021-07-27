// Configure Firebase.
let twilioConfig = {
  accountProdSid: process.env.REACT_APP_TWILIO_ACCOUNT_PROD_SID,
  videoApiSid: process.env.REACT_APP_TWILIO_VIDEO_API_SID,
  videoApiSecret: process.env.REACT_APP_TWILIO_VIDEO_API_SECRET,
  authToken: process.env.REACT_APP_TWILIO_AUTH_TOKEN
};

export default twilioConfig;
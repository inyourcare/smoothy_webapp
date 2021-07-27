import axios, { AxiosRequestConfig } from "axios";
import logger from "../custom-logger/logger";
// import constants from '../common/constants';
// import logger from '../custom-logger/logger';
// import { getCurrentUser } from '../firebase';

export const getPosts = async () => {
  const response = await axios.get("/posts"); // 도메인이 비워져있으면 현재 리액트가 띄워진 주소로 요청 보낸다. localhost:3000 -> package.json 의 proxy 설정이 되어있어 받으면 그리로 요청
  return response.data;
};

// export const getPostById = async (id) => {
//   const response = await axios.get(`/posts/${id}`);
//   return response.data;
// };

// export const getYoutubeVideoData = async (videoId:string) => {
//   logger('getYoutubeVideoData')
//   axios.get(`https://www.youtube.com/get_video_info?video_id=${videoId}`).then(function(data){
//     logger('axi' , data)
//   }).catch(function(e){
//     logger('axi-err' , e)
//   })
//   const response = await axios.get(`https://www.youtube.com/get_video_info?video_id=${videoId}`)

//   return response.data;
// };

// export const deleteUserDeviceIdAxios = async (currentUid?:string,deviceId?:string) => {
//   if (!currentUid)
//     currentUid = getCurrentUser()?.uid as string
//   if (!deviceId)
//     deviceId = localStorage.getItem(constants.smoothy.device.id) as string

//   const data = JSON.stringify({
//     // "user_id":currentUid,
//     // "device_id":deviceId
//     "user_id": "UZSuEayJRmfdmnXDWjNE91uPEUl2",
//     "device_id": "user_device_-2ae0511a-c8ee-4ba1-96c4-cb25fd67d3a3"
//   })
//   // var data = JSON.stringify({"user_id":"UZSuEayJRmfdmnXDWjNE91uPEUl2","device_id":"user_device_-ab2d02df-a14c-412b-b234-aa3b6e52253f"});
//   // var config = {
//   //   method: 'post',
//   //   url: 'https://us-central1-smoothy-84e22.cloudfunctions.net/deleteUserDeviceOnRequest',
//   //   headers: {
//   //     'Content-Type': 'application/json'
//   //   },
//   //   data : data
//   // };
//   // logger('[deleteUserDeviceId]' , config)
//   // // return axios
//   // // .post(
//   // //   'https://us-central1-smoothy-84e22.cloudfunctions.net/deleteUserDeviceOnRequest'
//   // //   ,body
//   // //   ,{
//   // //     headers: {
//   // //       'Content-Type' : 'application/json'
//   // //     }
//   // //   })
//   // return axios(config as AxiosRequestConfig)
//   //   .then(function(res){
//   //     logger('[deleteUserDeviceId] post res come successfully' , res)
//   //     return res
//   //   })
//   //   .catch(function(err){
//   //     console.error('[deleteUserDeviceId] err' , err)
//   //   })

//   // Simple POST request with a JSON body using fetch
//   // const requestOptions = {
//   //   method: 'POST',
//   //   headers: { 'Content-Type': 'application/json' },
//   //   // body: JSON.stringify({ title: 'React POST Request Example' })
//   //   body: data
//   // };
//   // logger('[deleteUserDeviceId]' , requestOptions)
//   // return fetch('https://us-central1-smoothy-84e22.cloudfunctions.net/deleteUserDeviceOnRequest', requestOptions)
//   //   .then(function(res){
//   //     logger('[deleteUserDeviceId] post res come successfully' , res)
//   //     return res
//   //   })
//   //   .catch(function(err){
//   //     console.error('[deleteUserDeviceId] err' , err)
//   //   })

//   var myHeaders = new Headers();
//   myHeaders.append("Content-Type", "application/json");

//   var raw = JSON.stringify({"user_id":currentUid,"device_id":deviceId});

//   var requestOptions = {
//     method: 'POST',
//     headers: myHeaders,
//     body: raw,
//     redirect: 'follow'
//   };
//   logger('[deleteUserDeviceId]' , requestOptions)
//   const retVal = await fetch("https://us-central1-smoothy-84e22.cloudfunctions.net/deleteUserDeviceOnRequest", requestOptions as RequestInit)
//   .then(function(res){
//         logger('[deleteUserDeviceId] post res come successfully' , res)
//         return res
//       })
//       .catch(function(err){
//         console.error('[deleteUserDeviceId] err' , err)
//       })
//   return retVal
// };

export const getChatlinkFunctionsApi = async (openChatLink: string) => {
  // var data = JSON.stringify({body:{ openchat_key: openchatKey }});
  const domain =
    process.env.REACT_APP_MODE === "development"
      ? "https://us-central1-smoothy-84e22.cloudfunctions.net"
      : "https://us-central1-smoothy-publish.cloudfunctions.net/";
  var config = {
    method: "get",
    url: `${domain}/getUserDataFromLinkKey${openChatLink}`,
    headers: {
      "Content-Type": "application/json",
    },
    // data: data,
  };
  logger("[getChatlinkFunctionsApi]", config);
  return axios(config as AxiosRequestConfig)
    .then(function (res) {
      logger("[getChatlinkFunctionsApi] post res come successfully", res);
      if (res.data.success) {
        res.data.results.openChatLink = openChatLink;
        return res.data.results;
      } else {
        console.error("[getChatlinkFunctionsApi] functions fail::", res.data);
      }
    })
    .catch(function (err) {
      console.error("[getChatlinkFunctionsApi] err", err);
    });
};

export const getYoutubeVideoInfoOembed = async (videoUrl: string) => {
  // var data = JSON.stringify({body:{ openchat_key: openchatKey }});
  var config = {
    method: "get",
    // url: `https://www.youtube.com/watch?v=${videoKey}`,
    // url: `https://www.youtube.com/oembed?format=json&url=https://www.youtube.com/watch?v=${videoKey}`,
    url: `https://www.youtube.com/oembed?format=json&url=${videoUrl}`,
    headers: {
      "Content-Type": "application/json",
    },
    // data: data,
  };
  logger("[getYoutubeHtml]", config);
  return axios(config as AxiosRequestConfig)
    .then(function (res) {
      logger("[getYoutubeHtml] post res come successfully", res.data);
      if (res.data) return res.data;
      else {
        console.error("[getYoutubeHtml] functions fail::", res);
        throw new Error("[getYoutubeHtml] res has no data");
      }
    })
    .catch(function (err) {
      console.error("[getYoutubeHtml] err", err);
      throw new Error("[getYoutubeHtml] api call fail");
    });
};

// var {google} = require('googleapis');
// var MESSAGING_SCOPE = 'https://www.googleapis.com/auth/firebase.messaging';
// var SCOPES = [MESSAGING_SCOPE];

// export function getAccessToken() {

//   return new Promise(function(resolve, reject) {
//       var key = require('./smoothy-84e22-firebase-adminsdk-haylh-02125c9143.json');
//       var jwtClient = new google.auth.JWT(
//           key.client_email,
//           null,
//           key.private_key,
//           SCOPES,
//           null
//       );
//       jwtClient.authorize(function(err, tokens) {
//         if (err) {
//             reject(err);
//             return;
//         }
//         resolve(tokens.access_token);
//     });
//   })
// }
//https://medium.com/@ThatJenPerson/authenticating-firebase-cloud-messaging-http-v1-api-requests-e9af3e0827b8
//https://www.daleseo.com/google-oauth/

// {data:{"groupName":"test","partyID":"test","members":["a","b"],inviter:"c"}}
type createGroupFunctionsApiProps = {
  groupName: string;
  partyID: string;
  members: string[];
  inviter: string;
};
export const createGroupFunctionsApi = async ({
  groupName,
  partyID,
  members,
  inviter,
}: createGroupFunctionsApiProps) => {
  var data = JSON.stringify({ body: { groupName, partyID, members, inviter } });
  const domain =
    process.env.REACT_APP_MODE === "development"
      ? "https://us-central1-smoothy-84e22.cloudfunctions.net"
      : "https://us-central1-smoothy-publish.cloudfunctions.net/";
  var config = {
    method: "post",
    url: `${domain}/createGroupForWeb`,
    headers: {
      "Content-Type": "application/json",
    },
    data: data,
  };
  logger("[createGroupFunctionsApi]", config);
  return axios(config as AxiosRequestConfig)
    .then(function (res) {
      logger("[createGroupFunctionsApi] post res come successfully", res);
      if (res.data.results.success) {
        return res.data.results.detail;
      } else {
        console.error("[createGroupFunctionsApi] functions fail::", res.data);
      }
    })
    .catch(function (err) {
      console.error("[createGroupFunctionsApi] err", err);
    });
};

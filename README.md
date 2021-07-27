# Smoothy Webapp

## Enviconment variables

 - ~~~console.log(process.env.NODE_ENV)~~~ ${process.env.REACT_APP_MODE} // yarn build -> production // yarn start -> development
 - .env files were made, refers to [Adding Custom Environment Variables](https://create-react-app.dev/docs/adding-custom-environment-variables/) you need to set variable as like the belows
 ```
    REACT_APP_API_KEY=
    REACT_APP_AUTH_DOMAIN=
    REACT_APP_DB_URL=
    REACT_APP_PROJECT_ID=
    REACT_APP_STORAGE_BUCKET=
    REACT_APP_MESSAGING_SENDER_ID=
    REACT_APP_APP_ID=
    REACT_APP_MEASUREMENT_ID=
    REACT_APP_VAPIDKEY=
 ```
 - you may find this variables ```process.env.{key}```

 ### project private key
 - smoothy-84e22-firebase-adminsdk-haylh-02125c9143.json

 ## Firebase
 - firebase initialize codes are in *src/lib/firebase.ts*
 - configuration codes are in *src/config/firebase.ts*
 - yarn add react-firebaseui firebase @types/firebase
 ### FCM 메시징
 - messaging 라이브러리에서 처리함
 - [firebase cloud messaging](https://console.firebase.google.com/u/0/project/smoothy-84e22/notification/compose?hl=ko) 에서 테스트 가능
 ### 백그라운드 메시징
 - [background messaging](https://pureinfotech.com/enable-native-chrome-notifications-windows-10/)
 - 설정에서 크롬 알림을 켤 수 있다.

 ## Twilio
 - yarn add twilio twilio-video
 - css selector -> #remote-media-container , #local-media-container , #multi-media-container
 ### muting unmuting
 - https://www.twilio.com/blog/add-muting-unmuting-video-chat-app-30-seconds

 ## Styles
 - yarn add styled-components styled-reset @types/styled-components
 - Animation style (@keyframes) is defined in the index.ts that initializing this app 

 ## Router
 - yarn add react-router-dom @types/react-router-dom
 - we use history like below (useLocation , useParams)
 ```
   import React from 'react';
   import { useHistory } from 'react-router-dom';

   const Home = (): JSX.Element => {
   const history = useHistory();
   // history를 props에서 얻어왔을 때 처럼 동일하게 사용 가능하다.
   
   return (
      <div onClick={() => history.push('/auth')}>
         <div>Hello!</div>
      </div>
   );
   };

   export defualt Home;
 ```

 ## Redux
 - yarn add redux redux-saga redux-devtools-extension redux-logger redux-thunk @types/redux-logger react-redux @types/react-redux

 ## Logging
 - 로깅은 redux-logger (index.ts) , logger (lib/custom-loger/logger.ts) 에 대하여 development 일 때만 나오도록 만들어놓음

 ## Design
 - https://material-ui.com/ 구글 머테리얼 디자인 사용할 예정
 - yarn add @material-ui/core recharts
 - yarn add @material-ui/icons --network-timeout 500000 특별히 오래 걸리기때문에 설정 해주지 않으면 계속 retry함
 - ~~~https://materialdesignthemes.com/ 머테리얼 디자인 테마~~~
 - https://material.io/develop/web/getting-started

 ## YouTube
 - npm install react-youtube
 ```
 The API component will pass an event object as the sole argument to each of those functions the event handler props. The event object has the following properties:

   - The event's target identifies the video player that corresponds to the event.
   - The event's data specifies a value relevant to the event. Note that the onReady event does not specify a data property.
 ```

 ## Etc
 ### typesafe-actions
 - yarn add typesafe-actions

 ### build as development mode
 - yarn add serve --save-dev
 - yarn build:dev
 - yarn start:build
 
 - and could check it by ~~~process.env.NODE_ENV~~~ process.env.REACT_APP_MODE

 ### use-deep-compare-effect
 - useEffect 를 deep compare 하여 사용한다.

 ### develop 배포
 - yarn build:dev 
 - firebase target:apply hosting smoothy-build smoothy-webapp --project smoothy-84e22 (dev 배포)
 - firebase deploy --only hosting --project smoothy-84e22 (임시 배포 : firebase hosting:channel:deploy channel-id)
 #### publish 배포
 - yarn build
 - firebase target:apply hosting smoothy-build smoothy-webapp-publish --project smoothy-publish (publish 배포)
 - firebase deploy --only hosting --project smoothy-publish

 #### 배포에러
 - Error: Task b2090cf9761ef60aa06e4fab97679bd43dfa5e5df073701ead5879d7c68f1ec5 failed: retries exhausted after 6 attempts
 - 위 에러에 대해서 .firebase/hosting.*.cache 를 삭제

 ### Effect
 - https://www.joshwcomeau.com/performance/embracing-modern-image-formats/
 - https://stackoverflow.com/questions/1077041/refresh-image-with-a-new-one-at-the-same-url 이미지 리로딩을 위해서 iframe 사용?


 # 소스 구조
 ## dispatch 활용
 - dispatch 활용은 컨테이너 콤포넌트에서만 하도록 구성했습니다.
 
 ## 독립성
 - lib , modules 하위로 나뉘어진 코드들은 가능한한 독립적이도록 구성했습니다. 두 가지 모두 사용해야하는 로직이 있다면 컨테이너 쪽에서 코드합니다.
 
 ## reducer 활용
 - 모든 async 함수에 대해 action을 만드는 것이 이상적이겠지만, 기능이 크지 않다고 판단되는 경우에는 action dispatcher 구조를 따르지 않고 바로 호출하도록 구현했습니다. (lib 하위의 비동기 호출들에 대한 설명)

 ## 플로우
 - 로그인 화면 => 로그인 => 데이터 싱크 => 챗링크 입력 => 챗 연결
 ### 챗링크 연결 플로우
 - 챗링크 입력 => sender가 친구가 아니면 친구 만듦 => 센더가 방에 없을경우 리턴핑 => 커넥트 => 방 참여자중 친구가 아닌 사람은 친구로

 ## 버튼 컨트롤 
 - const { buttonDisable } = useSelector((state: RootState) => state.smoothy); buttonDisable 로 로직 수행 중 다른 버튼에 영향 없도록한다.
 - 앱에서 사용되는 모든 button 에 disable 속성을 부여한다.
 - saga 에 일반적으로 다음 코드를 사용하여 로딩 구현
  ```
  yield put({type:SET_BUTTON_DISABLE})
  ~~~~
  yield put({type:SET_BUTTON_ENABLE})
  ```
 ## session 
 - 로그인 중복시 db update 가 무차별적으로 일어나기때문에 중복 로그인을 막아야함
 - sessionId 값을 부여하고 profile 에 기록한 뒤 observing 하도록 함
 - onBeforeUnload 를 App.tsx 에서 관리
 - sign out => user 삭제 => app effect 에서 leaveTheRoomWhenSignOut 으로 채팅방 나감
 - onBeforeUnload 상황마다 업데이트 => 채팅시 채팅 나가는 로직 추가
 - sign out 위치
   - 앱 Drawer , subscribeMyProfile
 - 앱에서 profile 에 online 되는 경우 로그아웃 되도록 
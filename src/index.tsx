import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import { AnyAction, Dispatch, Middleware, applyMiddleware, createStore } from "redux";
import { composeWithDevTools } from "redux-devtools-extension";
import logger from "redux-logger";
import createSagaMiddleware from "redux-saga";
import styled, { createGlobalStyle, css } from "styled-components";
import reset from "styled-reset";
import App from "./App";
import constants from "./lib/common/constants";
import { initializeFirebase } from "./lib/firebase";
import rootReducer, { rootSaga } from "./modules";

// initialize firebaase
initializeFirebase();

// reset styles from browser
const GlobalStyles = createGlobalStyle`
   ${reset};
`;

const GlobalAnimationStyles = styled.div`
  // 좌우 흔들림
  ${createWiggleCSS()}

  .${constants.animation.wiggle} {
    animation: wiggle 1.65s infinite;
  }

  @keyframes backToOrigin {
    50% {
      width: 100%;
      height: 100%;
      opacity: 0;
    }
    100% {
      width: 100%;
      height: 100%;
      opacity: 1;
    }
  }

  @keyframes buttonClicked {
    50% {
      transform: scale(0.9);
      /* width: 90%;
      height: 90%; */
      /* transform: translateX(10%) */
    }
    100% {
      transform: scale(1.0);
      /* width: 100%;
      height: 100%; */
      /* transform: translateX(-10%) */
    }
  }
  .${constants.animation.buttonClicked} {
    /* & img { */
      animation: buttonClicked 0.5s infinite;
    /* } */
  }
`;

// fullscreen 진동 effect
function createWiggleCSS() {
  const wiggleBoundary = 10;
  const wiggleCount = 20;
  let plusMinus = 1;
  let styles = "@keyframes wiggle {\n";

  for (let i = 0; i < wiggleCount; i += 1) {
    plusMinus *= -1;
    const transDistance =
      plusMinus * (wiggleBoundary - i * (wiggleBoundary / wiggleCount));
    styles += `
     ${i * (100 / wiggleCount)}% {transform: translateX(${transDistance}%)}\n
     `;
  }
  styles += ` 
    100% {transform: translate(0%,0%)}\n 
  }`;

  return css`
    ${styles}
  `;
}
const sagaMiddleware = createSagaMiddleware();

// const logger: Redux.Middleware<{}, any, Dispatch<AnyAction>> = createLogger(); 
export const store = createStore(
  rootReducer,
  composeWithDevTools(
    process.env.REACT_APP_MODE === "development"
      ? applyMiddleware(sagaMiddleware, logger as Middleware<{}, any, Dispatch<AnyAction>>) // dev
      : applyMiddleware(sagaMiddleware) // produnction , test
  ) // 개발자 도구 활성화
);

sagaMiddleware.run(rootSaga);

// messaging service worker
navigator.serviceWorker
.register(`/firebase-messaging-sw-${process.env.REACT_APP_MODE}.js`, {
  scope: constants.smoothy.registration.push.scope,
})
.then(function (registration) {
  console.log("serviceWorker registered", registration);
});

// document.cookie = "safeCookie1=foo; SameSite=Lax";
// document.cookie = "safeCookie2=foo";
// document.cookie = "crossCookie=bar; SameSite=None; Secure";

ReactDOM.render(
  <>
    <GlobalStyles />
    <GlobalAnimationStyles>
      <Provider store={store}>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </Provider>
    </GlobalAnimationStyles>
  </>,
  document.getElementById("root")
);

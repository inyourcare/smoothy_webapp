// import styled from "styled-components";
// import Dashboard from "../dashboard";
// import SignIn from "../home/sign-in/SignIn";
// import { VolumeMute, VolumeOff ,VideocamOff, Videocam} from "@material-ui/icons";
// import { useSelector } from "react-redux";
// import { RootState } from "../../modules";
// import { authTest } from "../../lib/firebase";
// import SpringDemo from "./AnimationDemo";
// import DragTest from "./DragTest";
// import MediaSelectTest from "./MediaSelectTest";
// import VideoBackgroundTest from "./VideoBackgroundTest";
// import SmoothyVideoFrameLayout from "./VideoChatRoomTest";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import styled from "styled-components";
import {
  TEST_ACTIVATE_TEST_MODE,
  TEST_DEACTIVATE_TEST_MODE,
} from "../../modules/test";
// import ButtonTest from "./ButtonTest"; // 에뮬레이터 테스트
import YoutubeTest from "./YoutubeTest";
// import DialogTest from "./DialogTest";
// import DialogTest2 from "./DialogTest2";
// import RegistrationPageTest from './RegistrationPageTest'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const TestStyle = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  /* border: 5px solid green; */
  box-sizing: border-box;
  height: 100vh;
  /* margin-top: 40%; */
  /* & button {
    background-color: aquamarine; */
  /* } */
  background-color: aquamarine;
`;
function Test() {
  // return <><Dashboard/></>;
  // const { friends } = useSelector((state: RootState) => state.firebase);
  // const onClickTest = () => {
  //   authTest()
  // }
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch({ type: TEST_ACTIVATE_TEST_MODE });
    return () => {
      dispatch({ type: TEST_DEACTIVATE_TEST_MODE });
    };
  }, [dispatch]);
  return (
    <>
      {/* <VolumeMute />
      <VolumeOff />
      <VideocamOff />
      <Videocam /> */}
      {/* <Dashboard/> */}
      {/* {friends.map(friend=>(
        <div>{friend.key}</div>
      ))} */}
      {/* <button onClick={onClickTest} style={{position: "absolute", top: 50, left: 0}}>sign in test</button> */}
      {/* <SmoothyVideoFrameLayout/> 비디오 프레임 & 이펙트 버튼 테스트였으나 지금과 너무 다름 */}
      {/* <DragTest/> */}
      {/* <SpringDemo/> */}
      {/* <MediaSelectTest/> */}
      {/* <VideoBackgroundTest/> */}
      {/* <TestStyle> */}
        {/* <ButtonTest></ButtonTest> */}
        {/* <DialogTest></DialogTest> */}
        {/* <DialogTest2 open={true} setOpen={(b)=>{}} copyTheLink={()=>{}}></DialogTest2> */}
        {/* <RegistrationPageTest></RegistrationPageTest> */}
      {/* </TestStyle> */}
      {/* <RegistrationPageTest></RegistrationPageTest> */}
      <YoutubeTest/>
    </>
  );
}

export default Test;

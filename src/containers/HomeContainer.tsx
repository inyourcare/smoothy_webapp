import { useSelector } from "react-redux";
import styled from "styled-components";
import SignIn from "../components/sign-in/SignIn";
import { RootState } from "../modules";
import Home from "../components/home/Home";
import { getCurrentUser } from "../lib/firebase";

const HomeContainerStyle = styled.div``;

type HomeContainerProps = {
  syncronized: boolean;
};
function HomeContainer({ syncronized = false }: HomeContainerProps) {
  //
  // definitions
  const { user } = useSelector(
    (state: RootState) => state.firebase
  );
  return (
    <>
      <HomeContainerStyle>
        {user && getCurrentUser() && syncronized === true ? (
          <Home
          />
        ) : (
          <SignIn />
        )}
      </HomeContainerStyle>
    </>
  );
}

export default HomeContainer;

// import { useDispatch } from "react-redux";
import { useHistory } from "react-router";
import styled from "styled-components";
import { PushToHomeErrorPageContainer } from "../lib/common/history";
const ErrorPageContainerStyle = styled.div`
  .error-div {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    align-items: center;
  }
`;
function ErrorPageContainer() {
  // const dispatch = useDispatch();
  const history = useHistory();
  const historyState = history.location.state as PushToHomeErrorPageContainer;

  //
  // window close
  // useEffect(() => {
  //   window.onbeforeunload = (event: Event) => {
  //     logger('[ErrorPageContainer] commonClose')
  //     commonClose(dispatch, event);
  //   };
  // }, [dispatch]);

  return (
    <>
      <ErrorPageContainerStyle>
        <div className="error-div">
          {`code${historyState.code} & msg:${historyState.msg}`}
        </div>
      </ErrorPageContainerStyle>
    </>
  );
}

export default ErrorPageContainer;

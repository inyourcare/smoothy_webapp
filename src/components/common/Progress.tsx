import { CircularProgress } from "@material-ui/core";
import styled from "styled-components";

const ProgressStyle = styled.div`
  .progress-div {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
`;
function Progress() {
  return (
    <>
      <ProgressStyle>
        <div className="progress-div">
          <CircularProgress className=""></CircularProgress>
        </div>
      </ProgressStyle>
    </>
  );
}

export default Progress;

import React, { useCallback, useState } from "react";
import { Button, Input, Typography } from "@material-ui/core";
import { testUsername } from "../../lib/util/stringUtils";
import Progress from "../common/Progress";
import HelpIcon from "@material-ui/icons/Help";
import { useSelector } from "react-redux";
import { RootState } from "../../modules";
import { HtmlTooltip } from "../common/CustomComponents";
import { useStyles } from "../common/CustomStyle";

type RegistrationInputsProps = {
  onRegister: (imageProgfile: string | null, username: string) => void;
};
export type ImageProfileType = {
  file: File | null;
  previewURL: string | ArrayBuffer | null;
};
function RegistrationInputs({ onRegister: onInsert }: RegistrationInputsProps) {
  const { buttonDisable } = useSelector((state: RootState) => state.smoothy);
  const classes = useStyles();
  const [imageProgfile, setImageProgfile] = useState({
    file: null,
    previewURL: null,
  } as ImageProfileType);
  const [username, setUsername] = useState("");
  const [usernameError, setUsernameError] = useState("");
  const [usernameErrorOn, setUsernameErrorOn] = useState(false);
  const [completeBtnDisable, setCompleteBtnDisable] = useState(false);
  const profileImgOnChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      e.preventDefault();
      let reader = new FileReader();
      if (e.target.files && e.target.files?.length > 0) {
        let file = e.target.files[0];
        reader.onloadend = () => {
          setImageProgfile({
            file: file,
            previewURL: reader.result,
          });
        };
        reader.readAsDataURL(file);
      }
    },
    []
  );
  const usernameOnChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(e.target.value);
    setUsernameError("확인중");
    const error = await testUsername(e.target.value);
    if (error) {
      setUsernameErrorOn(true);
      setUsernameError(error);
    } else {
      setUsernameErrorOn(false);
      setUsernameError("멋진 아이디에요!");
    }
  };

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setCompleteBtnDisable(true);
    onInsert(null, username); // todo:: imageProgfile -> customPhotoURL
    setUsername("");
    setImageProgfile({ file: null, previewURL: null });
  };
  return (
    <>
      <form onSubmit={onSubmit}>
        <input
          id="registration-image-file-upload-btn"
          type="file"
          accept="image/jpg,impge/png,image/jpeg,image/gif"
          name="profile_img"
          onChange={profileImgOnChange}
          hidden
        />
        {/* <label htmlFor="registration-image-file-upload-btn">No file chosen</label> */}
        <br />
        {imageProgfile.previewURL && (
          <img
            className="profile_preview"
            src={imageProgfile.previewURL as string}
            alt="profileImage"
          />
        )}
        <br />
        <Typography
          variant="overline"
          color={usernameErrorOn ? "error" : "textPrimary"}
        >
          아이디 만들기
        </Typography>
        <Input
          // fullWidth
          error={usernameErrorOn}
          placeholder="@영문, 숫자4~20자"
          onChange={usernameOnChange}
          className={`${classes.fullWidth}`}
        ></Input>
        <Typography
          variant="overline"
          color={usernameErrorOn ? "error" : "textPrimary"}
        >
          {usernameError}
        </Typography>
        <br />
        <HtmlTooltip
          // title={"아이디(Username) 스무디 앱에서 친구가 나를 검색할 때 쓰는 고유 아이디. 가입 이후에는 변경이 불가능합니다."}
          title={
            <React.Fragment>
              {/* <div style={{width:"200px"}}> */}
              <Typography color="inherit">
                <b>아이디(Username)</b>
              </Typography>
              {/* <em>{"And here's"}</em> <b>{'some'}</b> <u>{'amazing content'}</u>.{' '} */}
              {
                "스무디 앱에서 친구가 나를 검색할 때 쓰는 고유 아이디. 가입 이후에는 변경이 불가능합니다."
              }
              {/* </div> */}
            </React.Fragment>
          }
          placement="right-start"
          style={{ float: "right" }}
        >
          {/* <Button><HelpIcon fontSize="small"/></Button> */}
          <HelpIcon fontSize="small" color="action" />
        </HtmlTooltip>
        <Button
          // fullWidth
          type="submit"
          variant="contained"
          color="primary"
          // className={classes.registerBtn}
          className={`${classes.registerBtn} ${classes.fullWidth} ${classes.root}`}
          disabled={buttonDisable || usernameErrorOn || completeBtnDisable}
        >
          완료
          {completeBtnDisable ? <Progress /> : ""}
        </Button>
      </form>
    </>
  );
}

export default RegistrationInputs;

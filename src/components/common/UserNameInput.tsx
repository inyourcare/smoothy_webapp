type UserNameInputProps = {
  usernameErrorOn: boolean;
  setUsername: (s: string) => void;
  setUsernameErrorOn: (b:boolean)=>void;
  title:string;
};
// eslint-disable-next-line no-empty-pattern
function UserNameInput({
  usernameErrorOn,
  setUsername,
  setUsernameErrorOn,
  title
}: UserNameInputProps) {
  // const [usernameError, setUsernameError] = useState("");
  // const classes = useStyles()
  // const usernameOnChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
  //   setUsername(e.target.value);
  //   setUsernameError("확인중");
  //   const error = await testUsername(e.target.value);
  //   if (error) {
  //     setUsernameErrorOn(true);
  //     setUsernameError(error);
  //   } else {
  //     setUsernameErrorOn(false);
  //     setUsernameError("멋진 아이디에요!");
  //   }
  // };
  return (
    <>
      {/* <Typography
        variant="overline"
        color={usernameErrorOn ? "error" : "textPrimary"}
      >
        {`${title}`}
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
      </Typography> */}
    </>
  );
}

export default UserNameInput;

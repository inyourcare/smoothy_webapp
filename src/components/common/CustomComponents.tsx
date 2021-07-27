import { Button, Tooltip, Typography, withStyles } from "@material-ui/core";

export const WhiteTextTypography = withStyles({
  root: {
    color: "#FFFFFF",
  },
})(Typography);

export const ChangeProfileBtn = withStyles({
  root: {
    // background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)',
    backgroundColor: "#5782d2",
    borderRadius: 20,
    border: 0,
    color: "white",
    height: 40,
    padding: "0 30px",
    boxShadow: "0 3px 5px 2px rgba(255, 105, 135, .3)",
  },
  label: {
    textTransform: "capitalize",
  },
  containedPrimary: {
    "&:hover": {
      backgroundColor: "#3261ba",
    },
  },
})(Button);

export const ChangeUserNameBtn = withStyles({
  root: {
    // background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)',
    backgroundColor: "#5782d2",
    borderRadius: 20,
    border: 0,
    color: "white",
    height: 40,
    padding: "0 30px",
    boxShadow: "0 3px 5px 2px rgba(255, 105, 135, .3)",
  },
  label: {
    textTransform: "capitalize",
  },
  containedPrimary: {
    "&:hover": {
      backgroundColor: "#3261ba",
    },
  },
})(Button);

export const CopyLinkBtn = withStyles({
  root: {
    // background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)',
    backgroundColor: "#5782d2",
    borderRadius: 20,
    border: 0,
    color: "white",
    height: 40,
    padding: "0 30px",
    // boxShadow: "0 3px 5px 2px rgba(255, 105, 135, .3)",
  },
  label: {
    textTransform: "capitalize",
  },
  containedPrimary: {
    "&:hover": {
      backgroundColor: "#3261ba",
    },
  },
})(Button);

export const AfterCopyLinkBtn = withStyles({
  root: {
    // background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)',
    backgroundColor: "#22ffbd",
    borderRadius: 20,
    border: 0,
    color: "white",
    height: 40,
    padding: "0 30px",
    // boxShadow: "0 3px 5px 2px rgba(255, 105, 135, .3)",
  },
  label: {
    textTransform: "capitalize",
  },
  containedPrimary: {
    "&:hover": {
      backgroundColor: "#19ab7f",
    },
  },
})(Button);


export const HtmlTooltip = withStyles((theme) => ({
  tooltip: {
    backgroundColor: '#f5f5f9',
    color: 'rgba(0, 0, 0, 0.87)',
    maxWidth: 230,
    fontSize: theme.typography.pxToRem(12),
    // border: '1px solid #dadde9',
  },
}))(Tooltip);
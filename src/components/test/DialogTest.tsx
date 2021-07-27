import {
  Button,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from "@material-ui/core";
import InboxIcon from "@material-ui/icons/MoveToInbox";
import MailIcon from "@material-ui/icons/Mail";
import React, { useState } from "react";
import styled from "styled-components";
import MoreVertIcon from '@material-ui/icons/MoreVert';
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';
import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos';
import ListIcon from '@material-ui/icons/List';
import MenuOpenIcon from '@material-ui/icons/MenuOpen';
const DialogTestStyle = styled.div``;
type DialogTestProps = {};
// eslint-disable-next-line no-empty-pattern
function DialogTest({}: DialogTestProps) {
  const anchor = "left";
  const [drawerOpen, setDrawerOpen] = useState(false);
  return (
    <DialogTestStyle>
      <React.Fragment key={anchor}>
        <IconButton
          aria-label="more"
          aria-controls="long-menu"
          aria-haspopup="true"
          // onClick={handleClick}
        >
          <MoreVertIcon />
          <ArrowBackIosIcon />
          <ArrowForwardIosIcon />
          <ListIcon />
          <MenuOpenIcon />
        </IconButton>
        <Button onClick={() => setDrawerOpen(true)}>{anchor}</Button>
        <Drawer
          anchor={anchor}
          open={drawerOpen}
          onClose={() => setDrawerOpen(false)}
        >
          {/* {list(anchor)} */}
          <List>
            {["Inbox", "Starred", "Send email", "Drafts"].map((text, index) => (
              <ListItem button key={text}>
                <ListItemIcon>
                  {index % 2 === 0 ? <InboxIcon /> : <MailIcon />}
                </ListItemIcon>
                <ListItemText primary={text} />
              </ListItem>
            ))}
          </List>
          <Divider />
          <List>
            {["All mail", "Trash", "Spam"].map((text, index) => (
              <ListItem button key={text}>
                <ListItemIcon>
                  {index % 2 === 0 ? <InboxIcon /> : <MailIcon />}
                </ListItemIcon>
                <ListItemText primary={text} />
              </ListItem>
            ))}
          </List>
        </Drawer>
      </React.Fragment>
    </DialogTestStyle>
  );
}
export default DialogTest;

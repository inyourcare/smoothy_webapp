import { getUsername } from "../../lib/firebase/firestore";
import logger from "../custom-logger/logger";

function isStringMeaningful(source: string) {
  if (source) return true;
  return false;
}

export function isChatlinkValid(chatlink: string) {
  let regex =
    /(http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-/]))?/;
  if (regex.test(chatlink)) {
    let splited = chatlink.split("/");
    let linkKey = splited.pop() as string;
    let splitor = splited.pop();
    if (isStringMeaningful(linkKey) && splitor === "ch") return true;
  }
  return false;
}

export function isInvitelinkValid(chatlink: string) {
  let regex =
    /(http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-/]))?/;
  if (regex.test(chatlink)) {
    let splited = chatlink.split("/");
    let linkKey = splited.pop() as string;
    let splitor = splited.pop();
    if (isStringMeaningful(linkKey) && splitor === "id") return true;
  }
  return false;
}

export async function testUsername(username: string) {
  // const usernameRegx = /^(?=.*[A-Za-z0-9])[a-z0-9_-]{3,20}$/;
  logger("[testUsername]", username);
  const usernameLengthRegx = /^.{3,20}$/;
  const usernameAtLeastRegx = /^(?=.*[A-Za-z0-9]).{3,20}$/;
  const usernameRegx = /^(?=.*[A-Za-z0-9])[a-z0-9_-]{3,20}$/;
  if (usernameLengthRegx.test(username)) {
    // logger('[testUsername] 1')
    if (usernameAtLeastRegx.test(username)) {
      // logger('[testUsername] 2')
      if (usernameRegx.test(username)) {
        // logger('[testUsername] 3')
        const usernameExist = await getUsername(username);
        if (usernameExist.success === true && usernameExist.exist) {
          return "이미 존재하는 아이디입니다.";
        } else if (usernameExist.success === true && !usernameExist.exist) {
          return "";
        } else {
          return "연결상태가 좋지 않습니다. 다시 로그인 해 주세요";
        }
      } else {
        return "영문 대소문자,숫자,특수기호 (-),(_)만 사용가능합니다.";
      }
    } else {
      return "영문 대소문자,숫자를 하나 이상 가지고 있어야합니다.";
    }
  } else {
    return "4~20자까지 입력 가능합니다.";
  }
}

export function copyToClipboard(val: string) {
  logger("[copyToClipboard] val::", val);
  // const t = document.createElement("textarea");
  // // var brRegex = /<br\s*[\/]?>/gi;
  // document.body.appendChild(t);
  // t.value = val;
  // // t.value = t.value.replace(brRegex,"\r\n").replace(/<\/?[a-zA-Z]+\/?>/g, '').trim()
  // // t.value = t.value.trim()
  // // alert(t.value)
  // // alert(window.getSelection()?.rangeCount)
  // // t.select();
  // var sel = window.getSelection();
  // sel?.removeAllRanges();
  // var range = document.createRange();
  // // range.selectNode(t);
  // range.selectNodeContents(t);
  // sel?.addRange(range);
  // // alert(sel?.rangeCount)
  // document.execCommand("copy");
  // document.body.removeChild(t);

  // const input = document.createElement("input")
  // document.body.appendChild(input);
  // input.value = val

  // // var sel = window.getSelection();
  // // sel?.removeAllRanges();
  // // var range = document.createRange();
  // // range.selectNodeContents(input);
  // // sel?.addRange(range)
  // input.select()

  // document.execCommand("copy");
  // document.body.removeChild(input)

  navigator.permissions.query({name: "clipboard-write"}).then(result => {
    if (result.state === "granted" || result.state === "prompt") {
      /* write to the clipboard now */
      navigator.clipboard.writeText(val).then(function() {
        /* clipboard successfully set */
      }, function() {
        /* clipboard write failed */
      });
    }
  });
}

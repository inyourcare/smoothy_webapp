import logger from "../custom-logger/logger";
import 'moment/locale/ko';
import moment from 'moment'

export function timeConverter(UNIX_timestamp:number){
  logger('[timeConverter] UNIX_timestamp' , UNIX_timestamp)
  var a = new Date(UNIX_timestamp);
  var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  var year = a.getFullYear();
  var month = months[a.getMonth()];
  var date = a.getDate();
  var hour = a.getHours();
  var min = a.getMinutes();
  var sec = a.getSeconds();
  var time = date + ' ' + month + ' ' + year + ' ' + hour + ':' + min + ':' + sec ;
  return time;
}

export function fromNow(time:number){
  moment.locale('ko')
  return moment(new Date(time), 'LLL').fromNow()
}
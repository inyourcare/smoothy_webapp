// function isInterface<T>(result:T): result is T {
//   console.log(Object.keys(result));
//   // console.log(new Object(result).);
//   return false
// }

// type HistoryProps = {
//   key: string;
//   nickname: string;
//   username: string;
// };
// const s:HistoryProps = { key: "", nickname: "dd" , username:"dsad" };
// const a:any = {}
// console.log(Object.keys(s));
// console.log('hihi')
// console.log(isInterface(a))

// const FullscreenEffect = {
//   "012_eachscreen_hammer": "012_eachscreen_hammer"
// }
// console.log(FullscreenEffect["012_eachscreen_hammer"])

// const test = ['1s3' , 'my-us3r_n4m31332' , '1s' , 'my-us3r_n4m31332-' , 'my-us3r_n4m%133', 'dsadasd' , '231312']
// // const usernameRex : RegExp = new RegExp('/^[a-z0-9_-]{3,20}$/')
// // const usernameRegx = /^[a-z0-9_-]{3,20}$/
// const usernameRegx = /^(?=.*[A-Za-z0-9])[a-z0-9_-]{3,20}$/

// test.forEach(s=>{
//   console.log(usernameRegx.test(s))
// })

// const wiggleBoundary = 10;
// const wiggleCount = 20;
// let plusMinus = 1;
// let styles = "@keyframes wiggle {\n";

// for (let i = 0; i < wiggleCount; i += 1) {
//   plusMinus *= -1;
//   const transDistance =
//     plusMinus * (wiggleBoundary - i * (wiggleBoundary / wiggleCount));
//   styles += `
//     ${i * (100 / wiggleCount)}% {transform: translateX(${transDistance}%)}\n
//     `;
// }
// styles += `
//   100% {transform: translate(0%,0%)}\n
// }`;

// console.log(styles)

const ss = ""
const partyMembers = new Map()
partyMembers.set("hi1","value1")
partyMembers.set("hi2","value2")
partyMembers.set("hi3","value3")
// const list = Array.from(partyMembers.keys())
// const concatList = ['hi1','hi4']
// const newConcatList = concatList.filter(e=>!partyMembers.has(e))

// // const set = new Set(list.concat(concatList));
// // const uniqueArr = Array.from(set)
// const uniqueArr =list.concat(newConcatList)

// console.log(uniqueArr,list,concatList,newConcatList)
// uniqueArr.splice(uniqueArr.indexOf('hi1'),1)
// console.log(uniqueArr)
// console.log(Number(undefined),Number(undefined)>0)

console.log(partyMembers)
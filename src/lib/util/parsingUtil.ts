import { load } from "cheerio";

export function getYTPlayerJson(element: string) {
  var parsedHTML = load(element);
  return parsedHTML("script")
    .get()
    .filter((node) => {
      return (
        node.children.filter((node2) => {
          // logger('node2',node2,node2.next,node2.nextSibling,node2.nodeType,node2.type)
          const text = parsedHTML(node2).text();
          return text.includes("var ytInitialPlayerResponse = {");
        }).length > 0
      );
    })
    .map((node) => {
      return node.children
        .filter((node2) => {
          // logger('node2',node2,node2.next,node2.nextSibling,node2.nodeType,node2.type)
          const text = parsedHTML(node2).text();
          return text.includes("var ytInitialPlayerResponse = {");
        })
        .map((node3) => {
          const text = parsedHTML(node3).text();
          const jsonText = text.slice(30, text.length - 1);
          // logger(jsonText)
          return JSON.parse(jsonText);
          // logger(json)
        });
    })[0][0];
}

export function parseYoutubeVideoId(url: string) {
  var regExp =
    /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
  var match = url.match(regExp);
  return match && match[7].length === 11 ? match[7] : false;
}

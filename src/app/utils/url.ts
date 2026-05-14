export interface URLParts {
  "protocol": string,
  "host": string,
  "paths": string[],
  "queries": any
}


export function getUrlQueries(url: string) {
  var queries: any = {}, hash: string[];
  var hashes = url.slice(url.indexOf('?') + 1).split('&');
  for (var i = 0; i < hashes.length; i++) {
    hash = hashes[i].split('=');
    queries[hash[0]] = hash[1];
  }
  return queries;
}

export function breakDownUrl(url: string): URLParts {
  let urlArray = url.split("/");
  let queries: any;
  let paths: string[] = [];
  let host = urlArray[2];
  if (urlArray.length > 3) {
    let i: number;
    for (i = 3; i < urlArray.length; i++) {
      if (i === urlArray.length - 1 && urlArray[i].indexOf("?") != -1) {
        let separator = urlArray[i].split("?");
        paths.push(separator[0]);
      }
      else paths.push(urlArray[i]);
    }
  };
  if (url.indexOf('?') != -1) queries = getUrlQueries(url);
  let urlParts: URLParts = { protocol: urlArray[0], host, paths, queries };
  return urlParts;
}
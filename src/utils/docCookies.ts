export function getCookie(sKey) {
  return decodeURIComponent(document.cookie.replace(new RegExp("(?:(?:^|.*;)\\s*" + encodeURIComponent(sKey).replace(/[-.+*]/g, "\\$&") + "\\s*\\=\\s*([^;]*).*$)|^.*$"), "$1")) || null;
}

// time 例如: 's20' 20秒  'h12' 12小时   'd30' 30天
export function setCookie(sKey, sValue, time, sPath, sDomain, bSecure) {
  if (!sKey || /^(?:expires|max\-age|path|domain|secure)$/i.test(sKey)) { return false; }
  let sExpires = '';
  if (time) {
    let strsec = getsec(time);
    let exp = new Date();
    exp.setTime(exp.getTime() + strsec * 1);
    sExpires = ';expires=' + exp.toGMTString();
  }
  document.cookie = encodeURIComponent(sKey) + "=" + encodeURIComponent(sValue) + sExpires + (sDomain ? "; domain=" + sDomain : "") + (sPath ? "; path=" + sPath : "") + (bSecure ? "; secure" : "");
  return true;
}

export function removeCookie(sKey, sPath, sDomain) {
  if (!sKey || !this.hasItem(sKey)) { return false; }
  document.cookie = encodeURIComponent(sKey) + "=; expires=Thu, 01 Jan 1970 00:00:00 GMT" + ( sDomain ? "; domain=" + sDomain : "") + ( sPath ? "; path=" + sPath : "");
  return true;
}

export function hasCookie(sKey) {
  return (new RegExp("(?:^|;\\s*)" + encodeURIComponent(sKey).replace(/[-.+*]/g, "\\$&") + "\\s*\\=")).test(document.cookie);
}


function getsec(str) {
  let str1 = str.substring(1, str.length) * 1;
  let str2 = str.substring(0, 1);
  if (str2 == 's') {
    return str1 * 1000;
  } else if (str2 == 'h') {
    return str1 * 60 * 60 * 1000;
  } else if (str2 == 'd') {
    return str1 * 24 * 60 * 60 * 1000;
  }
}

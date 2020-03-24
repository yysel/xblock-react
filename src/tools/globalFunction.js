
window.dd = function dd(...$value) {
  console.log(...$value);
};

window.send = (route, body, header = '') => {
  if (!body || !route) return;
  if (ws && ws.readyState === 1) {
    const message = {
      route,
      body,
      header,
    };
    // dd(JSON.stringify(message));
    ws.send(JSON.stringify(message));
  } else {
    dd('server is poweroff!');
  }
};


window.trim = (s, str) => {
  if (str && str.substr(0, 1) == s) return str.substr(1);
  return str;
};


window.guid = function guid() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
};


var pack = function (data, boundary) {
  var body = [];
  for (let i in data) {

    var t = data[i].type.toUpperCase(),
      noBody = ['GET', 'DELETE'];

    body.push('--' + boundary);
    body.push('Content-Type: application/http; msgtype=request', '');
    body.push(t + ' ' + data[i].url + ' HTTP/1.1');

    /* Don't care about content type for requests that have no body. */
    if (noBody.indexOf(t) < 0) {
      body.push('Content-Type: ' + (data[i].contentType || 'application/json; charset=utf-8'));
    }

    body.push('Host: ' + location.host);
    body.push('', data[i].data ? JSON.stringify(data[i].data) : '');
  }
  body.push('--' + boundary + '--', '');

  return body.join('\r\n');
}

var unpack = function (xhr, status) {
  let lines = xhr.responseText.split('\r\n'),
    boundary = lines[0],
    data = [],
    d = {
      status: '',
      data: []
    };
  for (let i in lines) {
    if (lines[i].length) {
      if (lines[i].indexOf(boundary) == 0) {
        if (d) data.push(d);
        d = {
          status: '',
          data: ''
        };
      } else if (d) {
        if (!d.status) {
          d.status = parseInt((function (m) {
            return m || [0, 0];
          })(/HTTP\/1.1 ([0-9]+)/g.exec(lines[i]))[1], 10);
        } else if (!d.data) {
          try {
            d.data = JSON.parse(lines[i]);
          } catch (ex) {}
        }
      }
    }
  }
}
export {
  pack,
  unpack
}
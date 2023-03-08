const para = {};
para.token = '';

para.batchPack = function(entitySet, method, param, rows) {
    let batchContents = new Array();
    let batchBoday = '';
    batchContents.push('--batch');
    batchContents.push('content-Type: multipart/mixed;boundary=changeset');
    batchContents.push('');
    for (let i = 0; i < rows.length; i++) {
        batchContents.push('--changeset');
        batchContents.push('Content-Type: application/http');
        batchContents.push('Content-Transfer-Encoding: binary');
        batchContents.push('');

        let uri = entitySet + ' ' + method + '(';
        let uriParam = '';
        for (let j = 0; j < param.length; j++) {
            if (j === param.length - 1) {
                uriParam = uriParam + param[j] + "='" + rows[i][param[j]] + "'";
            } else {
                uriParam = uriParam + param[j] + "='" + rows[i][param[j]] + "',";
            }
        }
        uri = uri + uriParam + ') HTTP/1.1';
        batchContents.push(uri);
        batchContents.push('Accept: application/json;');
        //batchContents.push('DELETE authReqSet(object=' + "'" + rows[i].object + "'" + ',ttext=' + "''" + ') HTTP/1.1');
        batchContents.push('');
        batchContents.push('');
    }
    batchContents.push('--changeset--');
    batchContents.push('--batch--');
    batchBoday = batchContents.join('\r\n');
    return batchBoday;
};

para.batchUnpack = function(xhr, status) {
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
                    d.status = parseInt(
                        (function(m) {
                            return m || [0, 0];
                        })(/HTTP\/1.1 ([0-9]+)/g.exec(lines[i]))[1],
                        10
                    );
                } else if (!d.data) {
                    try {
                        d.data = JSON.parse(lines[i]);
                    } catch (ex) {}
                }
            }
        }
    }
    return data;
};

para.translateDate = function(row, column, cellValue, index) {
    // 1	DD.MM.YYYY
    // 2	MM/DD/YYYY
    // 3	MM-DD-YYYY
    // 4	YYYY.MM.DD
    // 5	YYYY/MM/DD
    // 6	YYYY-MM-DD
    let userInfo = JSON.parse(localStorage.getItem('userInfo'));
    if (cellValue == undefined || cellValue == '' || cellValue == '00000000') {
        return;
    }
    let year = cellValue.slice(0, 4);
    let month = cellValue.slice(4, 6);
    let day = cellValue.slice(6, 8);

    switch (userInfo.datfm) {
        case '1':
            return day + '.' + month + '.' + year;
        case '2':
            return month + '/' + day + '/' + year;
        case '3':
            return month + '-' + day + '-' + year;
        case '4':
            return year + '.' + month + '.' + day;
        case '5':
            return year + '/' + month + '/' + day;
        case '6':
            return year + '-' + month + '-' + day;
    }
};

para.translateTime = function(row, column, cellValue, index) {
    // 0	hh.:mm:ss
    // 1	hh.:mm:ss pm
    // 2	hh.:mm:ss PM

    let userInfo = JSON.parse(localStorage.getItem('userInfo'));
    if (cellValue == undefined || cellValue == '' || cellValue == '000000') {
        return;
    }
    let hh = cellValue.slice(0, 2);
    let mm = cellValue.slice(2, 4);
    let ss = cellValue.slice(4, 6);

    switch (userInfo.timefm) {
        case '0':
            return hh + ':' + mm + ':' + ss;
        case '1':
            if (hh > 12) {
                return hh - 12 + ':' + mm + ':' + ss + 'PM';
            } else {
                return hh + ':' + mm + ':' + ss + 'AM';
            }

        case '2':
            if (hh > 12) {
                return hh - 12 + ':' + mm + ':' + ss + 'pm';
            } else {
                return hh + ':' + mm + ':' + ss + 'am';
            }
    }
};

para.translateStatus = function(row, column, cellValue, index) {
    return cellValue == 'X' ? '激活' : '未激活';
};

para.translateUflag = function(row, column, cellValue, index) {
    switch (cellValue) {
        case 0:
            return '未锁定';
        case 32:
            return '被管理员全局锁定';
        case 64:
            return '被管理员本地锁定';
        case 132:
            return '因不正确登录（限制条款）而被锁定';
    }
};

para.datePickerType = function() {
    // 1	DD.MM.YYYY
    // 2	MM/DD/YYYY
    // 3	MM-DD-YYYY
    // 4	YYYY.MM.DD
    // 5	YYYY/MM/DD
    // 6	YYYY-MM-DD
    let userInfo = JSON.parse(localStorage.getItem('userInfo'));

    switch (userInfo.datfm) {
        case '1':
            return 'dd.MM.yyyy';
        case '2':
            return 'MM/dd/yyyy';
        case '3':
            return 'MM-dd-yyyy';
        case '4':
            return 'yyyy.MM.dd';
        case '5':
            return 'yyyy/MM/dd';
        case '6':
            return 'yyyy-MM-dd';
    }
};

para.convertToBackEndDate = function(val) {
    let fdate = new Date(val);
    let year = fdate.getFullYear();
    let month = fdate.getMonth() + 1 < 10 ? '0' + (fdate.getMonth() + 1) : fdate.getMonth() + 1;
    let day = fdate.getDate();
    return year.toString() + month.toString() + day.toString();
};

para.convertToFrontEndDate = function(val) {
    let year = val.slice(0, 4);
    let month = val.slice(4, 6);
    let day = val.slice(6, 8);
    return year.toString() + '-' + month.toString() + '-' + day.toString();
};

para.clearFileCache = function(url) {
    let current = new Date();
    let timestamp = '?v=' + current.getTime();
    let head = document.getElementsByTagName('head')[0];
    if (url) {
        let urlString = url.slice(-2);
        if (urlString === 'ss') {
            let link = document.createElement('link');
            link.type = 'text/css';
            link.rel = 'stylesheet';
            link.href = url + timestamp;
            head.appendChild(link);
        } else {
            console.log('无法识别');
        }
    }
};

export default para;

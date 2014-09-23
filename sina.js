var http = require('http');

var requestListener = function(req, res) {
    //The url we want is: 'http://int.dpool.sina.com.cn/iplookup/iplookup.php?ip=180.157.199.109&format=json'
    var ip = req.headers['x-forwarded-for'] ||
        req.connection.remoteAddress ||
        req.socket.remoteAddress ||
        req.connection.socket.remoteAddress;
    var obj = {}
    var req_outer = req;
    var res_outer = res;

    var options = {
        host: 'int.dpool.sina.com.cn',
        path: '/iplookup/iplookup.php?ip=180.157.199.109&format=json',
        method: 'get'
    };
    var req_ip = http.request(options, function(res) {
        var data = '';

        res.on('data', function(chunk) {
            data += chunk;
        });

        res.on('end', function() {
            console.log('data...', data);
            var obj = JSON.parse(data);
            console.log("IP", ip);
            console.log("国家", obj.country);
            console.log("省份", obj.province);
            console.log("城市", obj.city);

            res_outer.on('end', function() {
                res_outer.write([obj.country, obj.province, obj.city])
                console.log('hello world')
            });
        });
    });

    req_ip.on('error', function(e) {
        console.log('problem with request: ' + e.message);
    });

    res_outer.end();
}

var server = http.createServer(requestListener);
server.listen(8080);

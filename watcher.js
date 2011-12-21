var fs = require('fs'),
    http = require('http'),
    crypto = require('crypto'),
    nodemailer = require('nodemailer'),
    exec = require('child_process').exec;


var Watcher = module.exports = function(config) {

    this.merge(this, config);

    nodemailer.SMTP = {host: this.smtp};

    var fileName = this.curlConfig.path.split('/');
    fileName = fileName[fileName.length - 1];

    this.directoryPath = './tmp';
    this.localFilePath = this.directoryPath + '/' + fileName;
    this.remoteFilePath = this.directoryPath + '/' + fileName + '_tmp';

    this.getRemoteFileContent(this.curlConfig, function(content) {
        this.remoteFileContent = content;

        if ((this.localFileContent = this.getLocalFileContent()) && this.checkFilesHashDiff()) {
                this.saveFile(this.remoteFilePath, this.remoteFileContent);
                this.getDiff(function(diff) {
                    diff = this.formatDiff(diff);
                    this.sendMail(diff, function() {
                        this.saveFile(this.localFilePath, this.remoteFileContent);
                    });
                });

        } else {

            this.saveFile(this.localFilePath, this.remoteFileContent);

        }

    });

};


Watcher.prototype.log = function() {};


Watcher.prototype.merge = function(obj1, obj2) {
    for (var key in obj2) obj1[key] = obj2[key];
    return obj1;
};


Watcher.prototype.md5 = function(data) {
    return crypto.createHash('md5').update(data).digest("hex");
};


Watcher.prototype.saveFile = function(path, content) {
    return fs.writeFileSync.apply(fs, arguments);
};


Watcher.prototype.getRemoteFileContent = function(options, callback) {
    var req, me = this, tmp = [];

    req = http.request(options, function(res) {
        res.setEncoding('utf8');

        res.on('data', function (chunk) {
            tmp.push(chunk);
        });

        res.on('end', function () {
            tmp = tmp.join('');
            me.log('--> remote file fetched: YES');
            callback.call(me, tmp);
        });

    });

    req.on('error', function(error) {
        console.log('--> request error: ', error);
    });

    req.end();
};


Watcher.prototype.getLocalFileContent = function() {
    var file = false;
    try {
        file = fs.readFileSync(this.localFilePath, 'utf8');
    } catch(error) {}

    this.log('--> local file exists: ' + (file ? 'YES' : 'NO'));
    return file;
};


Watcher.prototype.checkFilesHashDiff = function() {
    remoteFile = this.md5(this.remoteFileContent);
    localFile = this.md5(this.localFileContent);
    if (remoteFile === localFile) {
        this.log('--> files are different: NO');
        return false;
    } else  {
        this.log('--> files are different: YES');
        return true;
    }
};


Watcher.prototype.getDiff = function(callback) {
    var me = this,
        cmd = 'diff ' + this.localFilePath + ' ' + this.remoteFilePath;
    exec(cmd, function(error, stdout, stderr) {
        if (!stderr) callback.call(me, stdout);
        else me.log('--> exec error: ', stderr);
    });
};


Watcher.prototype.formatDiff = function(diff) {
    var tmp = [], line = null, rows = null;
    diff = diff.split('\n');
    for (var i = 0, l = diff.length; i < l; i++) {
        line = diff[i];
        if (line.length && line.indexOf('<') === -1 && line.indexOf('>') === -1) {
            if (line.indexOf('a') !== -1) {
                tmp.push('<h3>Lines have been added: ' + line.split('a')[1] + '</h3>');
            } else if (line.indexOf('c') !== -1) {
                rows = line.split('c');
                tmp.push('<h3>Lines '+ rows[0] +' have been replaced by lines ' + rows[1] + '</h3>');
            } else if (line.indexOf('d') !== -1) {
                tmp.push('<h3>Lines have been deleted: ' + line.split('d')[0] + '</h3>');
            }
        } else {
            tmp.push(line);
        }
    }
    return tmp.join('<br>');
};


Watcher.prototype.sendMail = function(diff, callback) {
    var me = this,
        mail = this.merge(this.mailConfig, {
            html: diff,
            body: diff
        });

    nodemailer.send_mail(mail, function(error, success) {
        if (!error) {
            me.log('--> mail sent: YES');
            callback.call(me);
        } else me.log('--> mail error: ', error);
    });
};

var fs = require('fs'),
    http = require('http'),
    crypto = require('crypto'),
    colors = require('colors'),
    nodemailer = require('nodemailer'),
    exec = require('child_process').exec;


var urlWatch = module.exports = function(config) {
    this.applyConfig(config);
};


urlWatch.prototype.log = function() {};


urlWatch.prototype.directoryPath = '/tmp';


urlWatch.prototype.applyConfig = function(config) {

    this.merge(this, config);

    this.initialConfig = config;

    nodemailer.SMTP = {host: this.smtp};

    this.fileName = this.curlConfig.path.split('/');
    this.fileName = this.fileName[this.fileName.length - 1];

    this.localFilePath = this.directoryPath + '/' + this.fileName;
    this.remoteFilePath = this.directoryPath + '/' + this.fileName + '_tmp';
};


urlWatch.prototype.run = function() {
    this.getRemoteFileContent(function(content) {
        this.remoteFileContent = content;
        this.localFileContent = this.getLocalFileContent();

        if (this.localFileContent && this.checkFilesHashDiff()) {

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
}


urlWatch.prototype.merge = function(obj1, obj2) {
    for (var key in obj2) {
        if (obj2.hasOwnProperty(key)) {
            obj1[key] = obj2[key];
        }
    }
    return obj1;
};


urlWatch.prototype.formatDiff = function(diff) {
    return diff;
};


urlWatch.prototype.formatAttachment = function(attachment) {
    return attachment;
};


urlWatch.prototype.md5 = function(data) {
    return crypto.createHash('md5').update(data).digest("hex");
};


urlWatch.prototype.saveFile = function(path, content) {
    return fs.writeFileSync.apply(fs, arguments);
};


urlWatch.prototype.getRemoteFileContent = function(callback) {
    var req, me = this, tmp = [];

    req = http.request(this.curlConfig, function(res) {
        res.setEncoding('utf8');
        res.on('data', tmp.push.bind(tmp));

        res.on('end', function () {
            me.log('--> remote file fetched:', 'YES'.green);
            callback.call(me, tmp.join(''));
        });
    });

    req.on('error', function(error) {
        console.log('--> ' + 'request error'.red + ':', error);
    });

    req.end();
};


urlWatch.prototype.getLocalFileContent = function() {
    var file = false;
    try {
        file = fs.readFileSync(this.localFilePath, 'utf8');
    } catch(error) {}

    this.log('--> local file exists:', file ? 'YES'.green : 'NO'.red);
    return file;
};


urlWatch.prototype.checkFilesHashDiff = function() {
    if (this.md5(this.remoteFileContent) === this.md5(this.localFileContent)) {
        this.log('--> files are different:', 'NO'.red);
        return false;
    } else {
        this.log('--> files are different:', 'YES'.green);
        return true;
    }
};


urlWatch.prototype.getDiff = function(callback) {
    var me = this,
        cmd = 'diff ' + this.localFilePath + ' ' + this.remoteFilePath;

    exec(cmd, function(error, stdout, stderr) {
        if (!stderr) callback.call(me, stdout);
        else me.log('--> ' + 'exec error'.red + ':', stderr);
    });
};


urlWatch.prototype.sendMail = function(diff, callback) {
    var me = this,
        mail = this.merge(this.mailConfig, {
            html: diff,
            body: diff,
            attachments: [{
                filename: this.attachmentName || this.fileName,
                contents: this.formatAttachment(this.remoteFileContent)
            }]
        });

    nodemailer.send_mail(mail, function(error, success) {
        if (!error) {
            me.log('--> mail sent:', 'YES'.green);
            callback.call(me);
        } else me.log('--> ' + 'mail error'.red + ':', error);
    });
};

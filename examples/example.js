var formatDiff = function(diff) {
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


var urlWatch = require('../index.js');

// global override (required)
urlWatch.prototype.smtp = 'smtp.numericable.fr';

// global override (required)
urlWatch.prototype.directoryPath = '/tmp';

// global override (required)
urlWatch.prototype.mailConfig = {
    sender: 'contact@revolunet.com',
    to: 'goldledoigt@chewam.com',
    subject: 'urlWatch'
};

// enable debug
urlWatch.prototype.log = console.log;

var items = [{
    smtp: 'smtp.numericable.fr', // local override (not required)
    attachmentName: 'new_file.xml', // replace attachment file name (not required)
    formatDiff: formatDiff, // local override (not required)
    curlConfig: {
        host: 'office.revolunet.com',
        port: 80,
        path: '/juju/xml/auwohMae4nohph5V.xml',
        method: 'POST',
    },
    mailConfig: { // local override (not required)
        sender: 'contact@revolunet.com',
        to: 'goldledoigt@chewam.com',
        subject: 'urlWatch'
    }
}];

for (var i = 0, l = items.length; i < l; i++) {
    (new urlWatch(items[i])).run();
}

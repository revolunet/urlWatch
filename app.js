var formatAttachment = function() {
    console.log("formatAttachment", this, arguments);
};

var http = require('http'),
    Watcher = require('./watcher');

// global override
Watcher.prototype.smtp = 'smtp.numericable.fr';

// global override (not required)
Watcher.prototype.formatAttachment = formatAttachment;

// global override
Watcher.prototype.mailConfig = {
    sender: 'contact@revolunet.com',
    to: 'gary@chewam.com',
    subject: 'urlWatcher'
};

// enable debug
Watcher.prototype.log = console.log;

var items = [{
    smtp: 'smtp.numericable.fr', // local override (not required)
    formatAttachment: formatAttachment, // local override (not required)
    curlConfig: {
        host: 'office.revolunet.com',
        port: 80,
        path: '/juju/xml/auwohMae4nohph5V.xml',
        method: 'POST',
    },
    mailConfig: { // local override (not required)
        sender: 'contact@revolunet.com',
        to: 'gary@chewam.com',
        subject: 'urlWatcher'
    }
}];

for (var i = 0, l = items.length; i < l; i++) new Watcher(items[i]);

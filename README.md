## INSTALLATION

    npm install urlWatch

## SIMPLE USAGE

``` js

var urlWatch = require('urlWatch');

var options = {
    smtp: 'my.smtp.com',
    curlConfig: {
        host: 'my.domaine.com',
        port: 80,
        path: '/target/file/path',
        method: 'POST',
    },
    mailConfig: {
        sender: 'sender@mail.com',
        to: 'receiver@mail.com',
        subject: 'urlWatch'
    }
};

var watcher = new urlWatch(options);

watcher.run();

```

Take a look to `examples` for more complex usages.

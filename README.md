## INSTALLATION

    npm install urlWatch

## USAGE

``` js

var urlWatch = require('urlWatch');

new urlWatch({
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
});

```

Take a look to `examples` for more complex usage.

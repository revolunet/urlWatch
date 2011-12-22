## INSTALLATION

    npm install urlWatch

## USAGE

``` js

var urlWatch = require('../index.js');

new urlWatch({
    smtp: 'smtp.numericable.fr',
    curlConfig: {
        host: 'office.revolunet.com',
        port: 80,
        path: '/juju/xml/auwohMae4nohph5V.xml',
        method: 'POST',
    },
    mailConfig: {
        sender: 'contact@revolunet.com',
        to: 'goldledoigt@chewam.com',
        subject: 'urlWatch'
    }
});

```

Take a look to `examples` for more complex usage.

# SagePay Administration API for Node.js

Provides a wrapper for making requests to SagePay that deals with its custom
authentication and request signing, and reducing the results to their simplest
form.

## Overview

Knowledge of the [Customised reporting and admin API](https://www.sagepay.co.uk/support/find-an-integration-document/direct-integration-documents)
is essential.

The API uses a tiny subset of XML syntax, so transformation of both requests
and responses into simpler Javascript objects is performed. String properties
of an object map to text elements of the same name, and visa-versa. Non-string
properties, which must be arrays, are mapped to nested elements of the same
name as the property, and visa-versa.

## Quick Start

```
const SagepayAdminApiClient = require("sagepay-admin-api");
var client = new SagepayAdminApiClient({
    user: "me",
    password: "you",
    vendor: "acme"
});
client.request({
    command: "version"
})
.then(console.log);
```

## Command line

```
node node_modules/sagepay-admin-api/cmd --user me --password you --vendor acme
> request({command:"version"});
```

## Documentation

### SagepayAdminApiClient

A class that provides access to the SagePay Administration and Reporting API.

### SagepayAdminApiClient.constructor

```
var foo = new SagepayAdminApiClient(options);
```

Creates a new instance.

#### Parameters

* `options` Required, connection options.
* `options.endpoint` Optional, defaults to the test system.
* `options.user` Required, passed as the `user` to the API.
* `options.password` Required, used to sign the requests.
* `options.vendor` Required, passed as the `vendor` to the API.

### SagepayAdminApiClient.request

```
var foo = client.request(options);
```

Makes a request and returns a promise that resolves to the response.

#### Parameters

* `options` Required, values to pass with the request.
* `options.command` Required, the SagePay API requires this at a minimum.

## Licence

MIT

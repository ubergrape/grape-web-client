## First time requirements

The web client does not come with its own Vagrant machine to build therefore you have to setup your dev environment manually.
No worries though this process is pretty straightforward.

Make sure you are using the required Node version specified in `package.json`:

```bash
cat package.json | grep \"node\"
```

Make sure your npm is up to date:

```bash
# needs sudo on mac
sudo npm install -g npm
```

Clone the `grape-web-client` repo and install the dependencies:

```bash
git clone git@github.com:ubergrape/grape-web-client.git
cd grape-web-client
npm i
```

## Development

Start a local dev server:

```bash
npm run start:dev
```

This will start a local server at `0.0.0.0:8080` that will serve your assets to the prod app.

In another console session start a local web proxy:

```bash
npm run start:proxy
```

This will start a local web proxy at `0.0.0.0:3128` that redirects the assets of a chatgrape installation to the
local assets. This is currently hard coded to support `staging` and `dev` instances.

On your first run the certificate `.http-mitm-proxy/certs/ca.pem` is created. You have to
install and trust this certifiate using your standard OS tools.

Also install the `ca/chatgrape-labs.pem` certificate.

![A dialog showing current trust settings](./ca-trust.jpg)

In order to use the web proxy you have to change your network settings to use
the web proxy for both http and https.

### For Mac

![A configuration dialog for proxy settings](./proxy-mac.jpg)

## For Windows (IE):

VirtualBox localhost address (from Mac): 10.0.2.2

![A configuration dialog for proxy settings](./proxy-ie.png)

## Trusting certificate on Firefox

Firefox doesn't trust the trusted system certificate, you need to add it as an authority additionally.

Add all certificates here manually.

![Firefox authorities dialog](./authorities.png)

## Trusting certificate on Windows

1. Open shell as an admin (right click in start menu).
2. Install both certificates using `certutil –addstore -enterprise –f “Root” <pathtocertificatefile>``

## Parallels

You can use your Mac's public IP address and default bridged network adapter to configure the proxy instead of 0.0.0.0.

## Build once

```bash
npm run build
```

## Manage Dependencies

To add a dependency just call `npm install package --save ` or `npm install package --save-dev`.
A shrinkwrap hook will be automatically called.

When changing or adding dependencies directly in `package.json` you need to call `npm shrinkwrap` afterwards.

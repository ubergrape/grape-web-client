## Logging into console

We use the [debug](https://www.npmjs.com/package/debug) package which allows to turn on/off logging for specific or multiple packages at runtime via console.

- E.g. Enable WebSocket connection debugging: `localStorage.debug='ws'`
- You can define more than one logging modules: `localStorage.debug='lpio,ws,rpc'`
- Available logging modules:
  - `rpc` - RPC calls and responses
  - `ws` - WebSocket connection
  - `wamp` - WAMP events, including ping/pong
  - `lpio` - Longpolling (deprecated)

After setting this, reload the page.

## More feature flags

General:

- After setting a flag, reload the page.
- Remove flag `localStorage.removeItem('...')`

Flags:

- Force long polling for the current session `localStorage.forceLongpolling = true`
  - Disable forced longpolling `delete localStorage.forceLongpolling`
- Use new history implementation `localStorage.newHistory = true`
  - Disable new history implementation `delete localStorage.newHistory`

## Trigger RPC calls from the console

Don't forget to turn on logging before:
`localStorage.debug='rpc'`
This is easier to work with than the browsers' built in tools to debug websockets.

```javascript
rpc({
  ns: 'users',
  action: 'get_profile',
  args: [...]
})
```

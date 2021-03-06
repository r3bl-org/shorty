# Introduction

This Chrome extension provides a browser action that simply takes the current
URL in the address bar and shortens it (using tinyurl.com) and saves this short
URL to the clipboard. It can be activated via a keyboard shortcut 
`Ctrl + Shift + P`.

You can install this extension from the [Chrome Web
Store](https://chrome.google.com/webstore/detail/shorty/cbgcnhimnlnjejdopldfdicfingmaijg?hl=en-US&gl=US).

## Publish to the Chrome web store

- [Step by step guide](https://developer.chrome.com/webstore/publish)

## Resources

- [Tutorial for creating an extension](https://grantwinney.com/creating-my-first-google-chrome-extension-part-1/)
- [Asynchronous Javascript (promises, async/await)](https://eloquentjavascript.net/11_async.html)
- [Learn more about browser
actions](https://developer.chrome.com/extensions/browserAction)
- [Browser Action
Samples](https://chromium.googlesource.com/chromium/src/+/master/chrome/common/extensions/docs/examples/api/browserAction/)
- [SO article on browser
action](https://stackoverflow.com/questions/18766886/unable-to-trigger-chrome-browseraction-onclicked-addlistener-with-google-chrome)
- [chrome.tabs](https://developer.chrome.com/extensions/tabs)
- [Script loading and async and
defer](https://flaviocopes.com/javascript-async-defer/)
- [Bypass CORS in Chrome
Extension](https://stackoverflow.com/questions/44123426/how-to-bypass-cors-for-chrome-extension)
    - The `manifest.json` needs to be updated as follows.
    ```
      "permissions": [
        "activeTab",
        "tabs",
        "*://*.tinyurl.com/*"
    ```
- [Copy to
clipboard](https://stackoverflow.com/questions/49618618/copy-current-url-to-clipboard)

## More about keyboard shortcuts

- https://developer.chrome.com/apps/commands
- Please note that on Mac `Ctrl` is automatically converted to `Command`. If you
want `Ctrl` instead, please specify `MacCtrl` under `"mac"`.

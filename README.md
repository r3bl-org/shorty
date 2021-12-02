# Introduction

This Chrome extension provides a browser action that simply takes the current URL in the address bar
and shortens it (using tinyurl.com) and saves this short URL to the clipboard. It can be activated
via a keyboard shortcut `Ctrl + Shift + P`.

You can install this extension from the [Chrome Web Store][2021-12-02.store].

## Publish to the Chrome web store

- [Step by step guide][2021-12-02.guide]

## Resources

- [Tutorial for creating an extension][2021-12-02.tut-ext-create]
- [Asynchronous Javascript (promises, async/await)][2021-12-02.promise]
- [Learn more about browser actions][2021-12-02.browser-actions]
- [Browser Action Samples][2021-12-02.samples]
- [SO article on browser action][2021-12-02.so-ba]
- [chrome.tabs][2021-12-02.tabs]
- [Script loading and async and defer][2021-12-02.script]
- [Bypass CORS in Chrome Extension][2021-12-02.bypass]
  - The `manifest.json` needs to be updated as follows.
    `"permissions": [ "activeTab", "tabs", "*://*.tinyurl.com/*"`
- [Copy to clipboard][2021-12-02.copy]

## More about keyboard shortcuts

- https://developer.chrome.com/apps/commands
- Please note that on Mac `Ctrl` is automatically converted to `Command`. If you want `Ctrl`
  instead, please specify `MacCtrl` under `"mac"`.

<!-- prettier-ignore-start -->
[2021-12-02.store]: https://chrome.google.com/webstore/detail/shorty/cbgcnhimnlnjejdopldfdicfingmaijg?hl=en-US&gl=US
[2021-12-02.guide]: https://developer.chrome.com/webstore/publish
[2021-12-02.tut-ext-create]: https://grantwinney.com/creating-my-first-google-chrome-extension-part-1/
[2021-12-02.promise]: https://eloquentjavascript.net/11_async.html
[2021-12-02.browser-actions]: https://developer.chrome.com/extensions/browserAction
[2021-12-02.samples]: https://chromium.googlesource.com/chromium/src/+/master/chrome/common/extensions/docs/examples/api/browserAction/
[2021-12-02.so-ba]: https://stackoverflow.com/questions/18766886/unable-to-trigger-chrome-browseraction-onclicked-addlistener-with-google-chrome
[2021-12-02.tabs]: https://developer.chrome.com/extensions/tabs
[2021-12-02.script]: https://flaviocopes.com/javascript-async-defer/
[2021-12-02.bypass]: https://stackoverflow.com/questions/44123426/how-to-bypass-cors-for-chrome-extension
[2021-12-02.copy]: https://stackoverflow.com/questions/49618618/copy-current-url-to-clipboard
<!-- prettier-ignore-end -->

/*
 * Copyright 2019 Nazmul Idris All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

//
// Helper functions.
//

/**
 * Can't use `window.location.href` since this is the URL of the popup.html.
 * Instead, get the current tab, and then get its URL.
 */
const getCurrentBrowserUrl = () => {
  // Get the currently selected tab
  chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {
    const current = tabs[0];
    const longUrl = current.url;
    updateUI(longUrl);
    fetchShortUrl(longUrl);
  });
};

/**
 * Make a fetch call to tinyurl.com to shorten it.
 * More info: https://stackoverflow.com/questions/44123426/how-to-bypass-cors-for-chrome-extension
 */
const fetchShortUrl = (longUrl) => {
  const tinyUrl = `https://tinyurl.com/api-create.php?url=${longUrl}`;
  fetch(tinyUrl)
    .then(function (response) {
      return response.text();
    })
    .then(function (text) {
      updateUI(`<a href=${text} target="_blank">${text}</a>`);
      copyToClipboard(text);
    });
};

/**
 * Copy the short URL to the clipboard.
 * More info: https://stackoverflow.com/questions/49618618/copy-current-url-to-clipboard
 */
const copyToClipboard = (shortUrl) => {
  const dummy = document.createElement('input');
  document.body.appendChild(dummy);
  dummy.value = shortUrl;
  dummy.select();
  document.execCommand('copy');
  document.body.removeChild(dummy);
  triggerAutoCloseWindowWithDelay();
};

/** Update the `#content` element of the HTML w/ the given text */
const updateUI = (text) => {
  document.querySelector('#output').innerHTML = text;
};

const triggerAutoCloseWindowWithDelay = () => {
  setTimeout()
};

//
// Do the extension's main work.
//

getCurrentBrowserUrl();

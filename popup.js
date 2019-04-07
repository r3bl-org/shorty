/*
 * Copyright 2019 R3BL LLC. All rights reserved.
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
// Main entry point.
//

/** Kick off the extension's main function every time the page loads. */
document.addEventListener('DOMContentLoaded', () => {
  shortenCurrentBrowserTabUrl();
}, false);

//
// Helper functions.
//

/**
 * Can't use `window.location.href` since this is the URL of the popup.html.
 * Instead, get the current tab, and then get its URL.
 */
const shortenCurrentBrowserTabUrl = () => {
  // Get the currently selected tab.
  chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
    const current = tabs[0];
    const longUrl = current.url;
    updateUI("Shortening URL ...");
    makeNetworkRequest(longUrl);
  });
};

/**
 * Make a fetch call to tinyurl.com to shorten it. When the response comes in
 * update the UI and auto close the window.
 * More info: https://stackoverflow.com/questions/44123426/how-to-bypass-cors-for-chrome-extension
 * More info: https://dev.to/johnpaulada/synchronous-fetch-with-asyncawait
 */
const makeNetworkRequest = (longUrl) => {
  const makeAsyncRequest = async () => {
    const tinyWebServiceUrl = `https://tinyurl.com/api-create.php?url=${longUrl}`;
    const response = await fetch(tinyWebServiceUrl);
    const shortUrlText = await response.text();
    updateUIWithShortLink(shortUrlText);
    copyToClipboard(shortUrlText);
    triggerAutoCloseWindowWithDelay();
  };
  makeAsyncRequest();
};

/**
 * Create a link element w/ the given text. This link has no target, but will
 * close the current window when clicked.
 * @param text
 * @returns {HTMLAnchorElement}
 */
const createLinkElement = (text) => {
  const linkElement = document.createElement('a');
  const linkText = document.createTextNode(text);
  linkElement.appendChild(linkText);
  linkElement.title = "URL copied to clipboard, click to close popup";
  linkElement.addEventListener('click', () => {
    window.close();
  });
  return linkElement;
};

/** Replace the H1 element w/ a new H1 element that contains a link */
const updateUIWithShortLink = (text) => {
  // Create a H1 element.
  removeElement(document.querySelector('h1'));
  const element = document.createElement('h1');
  element.appendChild(createLinkElement(text));
  document.body.appendChild(element);

  // Show toast.
  showToast('URL copied to clipboard!');
};

/**
 * More info: https://github.com/mlcheng/js-toast
 * @param text
 */
const showToast = (text) => {
  const options = {
    settings: {
      duration: AUTO_WINDOW_CLOSE_TIMEOUT_MS / 2
    }
  };
  iqwerty.toast.Toast('URL copied to clipboard!', options);
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
};

/** Update the h1 element of the HTML w/ the given text */
const updateUI = (text) => {
  // Remove the existing h1 element.
  removeElement(document.querySelector('h1'));

  // Add a new h1 element to DOM.
  const element = document.createElement('h1');
  element.innerText = text;
  document.body.appendChild(element);
  console.log(text);
};

/** Helper function to remove the given element (if it exists). */
const removeElement = (element) => {
  if (element) {
    element.parentNode.removeChild(element);
  }
};

/** Set a timeout to close the window after short delay. */
const AUTO_WINDOW_CLOSE_TIMEOUT_MS = 5000;
const triggerAutoCloseWindowWithDelay = () => {
  setTimeout(() => {
    updateUI("Done!");
    window.close();
  }, AUTO_WINDOW_CLOSE_TIMEOUT_MS);
};

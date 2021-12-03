/*
 * Copyright 2021 R3BL LLC. All rights reserved.
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

/** Kick off the extension's index function every time the page loads. */
document.addEventListener(
  "DOMContentLoaded",
  () => {
    main()
  },
  false
)

//
// Helper functions.
//

/**
 * Can't use `window.location.href` since this is the URL of the index.html.
 * Instead, get the current tab, and then get its URL.
 */
const main = () => {
  // Get the currently selected tab.
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    const current = tabs[0]
    const longUrl = current.url
    makeNetworkRequest(longUrl)
  })
}

const Delays = {
  preparing: 1500,
  done: 2500,
  autoClose: 2500,
}

const Messages = {
  // Emoji: https://www.w3schools.com/html/html_emojis.asp
  preparingHeading: "<span>&#128640;</span> Preparing your short link ...",
  preparingToast: "Shortening with tinyurl ...",
}

/**
 * Make a fetch call to tinyurl.com to shorten it. When the response comes in update the UI and
 * auto close the window.
 *
 * CORS bypass: https://stackoverflow.com/questions/44123426/how-to-bypass-cors-for-chrome-extension
 * Async fetch: https://dev.to/johnpaulada/synchronous-fetch-with-asyncawait
 */
const makeNetworkRequest = (longUrl) => {
  const [linkEl, _] = updateUIWithShortLink(Messages.preparingHeading)
  linkEl.innerHTML = Messages.preparingHeading.replaceAll(" ", "&nbsp;")
  showToast(Messages.preparingToast, Delays.preparing, "info")

  const _makeAsyncRequest = async () => {
    const tinyWebServiceUrl = `https://tinyurl.com/api-create.php?url=${longUrl}`
    const response = await fetch(tinyWebServiceUrl)
    const shortUrlText = await response.text()
    updateUIWithShortLink(shortUrlText)
    showToast("URL copied to clipboard!", Delays.done, "success")
    copyToClipboard(shortUrlText)
    triggerAutoCloseWindowWithDelay()
  }

  setTimeout(async () => {
    await _makeAsyncRequest()
  }, Delays.preparing)
}

/**
 * Create a link element w/ the given text. This link has no target, but will
 * close the current window when clicked.
 * @param text
 * @returns {HTMLAnchorElement}
 */
const createLinkElement = (text) => {
  const linkElement = document.createElement("a")
  const linkText = document.createTextNode(text)
  linkElement.appendChild(linkText)
  linkElement.title = "Click to close popup"
  linkElement.addEventListener("click", () => {
    window.close()
  })
  return linkElement
}

/**
 * Create a reusable heading element that can accept a new link element, everytime this
 * function is called.
 * @returns [HTMLLinkElement, HTMLHeadingElement]
 */
const updateUIWithShortLink = (text) => {
  let headingEl = document.querySelector("h1")
  if (!headingEl) {
    // Create a heading element.
    headingEl = document.createElement("h1")
    document.body.appendChild(headingEl)
  }

  // Create a new link element.
  let linkEl = createLinkElement(text)

  // Clean up heading element.
  if (headingEl.hasChildNodes()) removeAllChildNodes(headingEl)

  // Add the new link element to the heading element.
  headingEl.appendChild(linkEl)

  return [linkEl, headingEl]
}

const removeAllChildNodes = (parent) => {
  while (parent.firstChild) {
    parent.removeChild(parent.firstChild)
  }
}

const showToast = (text, delay, type) => {
  nativeToast({
    message: text,
    position: "north",
    timeout: delay /* Self destruct in 5 sec. */,
    type: type,
    rounded: true,
    closeOnClick: true,
  })
}

/**
 * Copy the short URL to the clipboard.
 * More info: https://stackoverflow.com/questions/49618618/copy-current-url-to-clipboard
 */
const _copyToClipboard = (shortUrl) => {
  const dummy = document.createElement("input")
  document.body.appendChild(dummy)
  dummy.value = shortUrl
  dummy.select()
  document.execCommand("copy")
  document.body.removeChild(dummy)
}

/**
 * https://stackoverflow.com/a/59695008/2085356
 * https://developer.chrome.com/docs/extensions/mv3/declare_permissions/
 * https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/Interact_with_the_clipboard#writing_to_the_clipboard
 */
const copyToClipboard = (shortUrl) => {
  navigator.clipboard
    .writeText(shortUrl)
    .then(
      undefined /* Clipboard successfully set. */,
      () => _copyToClipboard(shortUrl) /* Clipboard write failed, use fallback. */
    )
}

/** Helper function to remove the given element (if it exists). */
const removeElement = (element) => {
  if (element) {
    element.parentNode.removeChild(element)
  }
}

/** Set a timeout to close the window after short delay. */
const triggerAutoCloseWindowWithDelay = () => {
  setTimeout(() => {
    window.close()
  }, Delays.autoClose)
}

// ==UserScript==
// @license MIT
// @name         Smart Translate with DeepL API
// @namespace    http://tampermonkey.net/
// @version      1.1.0
// @description  Translate chosen text to another language with DeepL API.
// @author       Twil3akine
// @match        *://*/*
// @match        file:///*
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/521946/Smart%20Translate%20with%20DeepL%20API.user.js
// @updateURL https://update.greasyfork.org/scripts/521946/Smart%20Translate%20with%20DeepL%20API.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const apiKey = 'YOUR_DEEPL_API_KEY';

    console.log('Smart-Translate is started!');
    // set keyboard-shortcut (Alt+T)
    document.addEventListener('keydown', function(event) {
        if (event.altKey && event.key === "t") {
            const selectedText = window.getSelection().toString().trim();
            if (selectedText) {
                // send request to DeepL API
                translateText(selectedText);
            } else {
                alert('Please select text!');
            }
        }
    });

    const translateText = (text) => {
        const url = 'https://api-free.deepl.com/v2/translate';

        const params = {
            auth_key: apiKey,
            text: text,
            target_lang: 'JA',
        };

        GM_xmlhttpRequest({
            method: 'POST',
            url: url,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            data: new URLSearchParams(params).toString(),
            onload: (response) => {
                try {
                    const result = JSON.parse(response.responseText);
                    const translatedText = result.translations[0].text;
                    alert(`${text}\n\n->\n\n${translatedText}`);
                    console.log(`${text}\n\n->\n\n${translatedText}`);
                } catch (e) {
                    console.log('Error parsing the response from DeepL:', e);
                }
            },
            onerror: (error) => {
                console.error('Error with DeepL API request:', error);
                alert('Error occurred while traslating. Please try again later.');
            }
        });
    }
})();
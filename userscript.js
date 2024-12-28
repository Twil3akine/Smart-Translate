// ==UserScript==
// @license MIT
// @name         Smart Translate with DeepL API
// @namespace    http://tampermonkey.net/
// @version      1.2.0
// @description  Translate chosen text to another language with DeepL API.
// @author       Twil3akine
// @match        *://*/*
// @match        file:///*
// @grant        GM_xmlhttpRequest
// @grant        GM_getValue
// @grant        GM_setValue
// @downloadURL  https://update.greasyfork.org/scripts/521946/Smart%20Translate%20with%20DeepL%20API.user.js
// @updateURL    https://update.greasyfork.org/scripts/521946/Smart%20Translate%20with%20DeepL%20API.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // APIキーを取得または保存
    const getApiKey = async () => {
        let apiKey = await GM_getValue('DEEPL_API_KEY', null);
        if (!apiKey) {
            apiKey = prompt('Enter your DeepL API key:');
            if (apiKey) {
                await GM_setValue('DEEPL_API_KEY', apiKey);
            } else {
                alert('API key is required to use this script.');
            }
        }
        return apiKey;
    };

    const translateText = async (text, lang) => {
        const apiKey = await getApiKey();
        if (!apiKey) return;

        const url = 'https://api-free.deepl.com/v2/translate';
        const params = {
            auth_key: apiKey,
            text: text,
            target_lang: lang,
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
                    console.error('Error parsing the response from DeepL:', e);
                    alert('An error occurred while processing the translation.');
                }
            },
            onerror: (error) => {
                console.error('Error with DeepL API request:', error);
                alert('Error occurred while translating. Please try again later.');
            },
        });
    };

    console.log('Smart-Translate is started!');
    document.addEventListener('keydown', async (event) => {
        if (event.altKey && event.key === 't') {
            const selectedText = window.getSelection().toString().trim();
            if (selectedText) {
                await translateText(selectedText, 'JA');
            } else {
                alert('Please select text!');
            }
        }

        if (event.altKey && event.key === 'r') {
            const apiKey = await getApiKey();
            const newKey = prompt(`Please input your new API key\nNow API key: ${apiKey}`);
            if (newKey) {
                await GM_setValue('DEEPL_API_KEY', newKey);
                alert('API key updated successfully.');
            }
        }
    });
})();
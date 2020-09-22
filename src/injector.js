import browser from 'webextension-polyfill';

browser.webRequest.onBeforeRequest.addListener(
    (x) => {
        if (x.url.includes('alpha') && !x.url.includes('eppEntry') && !x.url.includes('bl'))
            return {
                redirectUrl: browser.runtime.getURL('content.bundle.js'),
            };
    },
    {
        urls: ['*://bonk2.io/beta/*'],
    },
    ['blocking']
);

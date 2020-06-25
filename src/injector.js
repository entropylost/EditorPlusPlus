import browser from 'webextension-polyfill';

console.log('Hi');
browser.webRequest.onBeforeRequest.addListener(
    (x) => {
        if (x.url.includes('alpha') && !x.url.includes('eppEntry'))
            return {
                redirectUrl: browser.runtime.getURL('content.bundle.js'),
            };
    },
    {
        urls: ['*://bonk2.io/beta/*'],
    },
    ['blocking']
);

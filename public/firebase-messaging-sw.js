/* eslint-disable no-unused-expressions */
/* eslint-disable no-restricted-globals */
/* eslint-disable no-sequences */
/* eslint-disable no-undef */
importScripts("https://www.gstatic.com/firebasejs/8.10.0/firebase-app.js"),
    importScripts("https://www.gstatic.com/firebasejs/8.10.0/firebase-messaging.js"),
    importScripts("https://cdnjs.cloudflare.com/ajax/libs/crypto-js/3.1.2/rollups/aes.js");
const configFirebase = {
    apiKey: "AIzaSyCZm8qE3rpk9u2X8R-KF54GcSFNc8HgNMU",
    authDomain: "connect-x-production.firebaseapp.com",
    databaseURL: "https://connect-x-production.firebaseio.com",
    projectId: "connect-x-production",
    storageBucket: "connect-x-production.appspot.com",
    messagingSenderId: "103388376992",
    appId: "1:103388376992:web:611219c7fa3e90487f7ec5",
    measurementId: "G-6RVYHZKQ6N",
};
firebase.apps.length || firebase.initializeApp(configFirebase);
const messaging = firebase.messaging();
messaging.onBackgroundMessage((g) => {
    let { data: a } = g,
        h = a.title,
        { actionButtonOneIdentifier: m = "", actionButtonOneText: i = "", actionButtonOneUrl: e = "", actionButtonTwoIdentifier: n = "", actionButtonTwoText: j = "", actionButtonTwoUrl: f = "", callToAction: k = "false" } = a,
        c = [];
    "true" === k && (e && c.push({ action: e, title: i }), f && c.push({ action: f, title: j }));
    let b = {
            body: a.body,
            icon: a.icon,
            image: a.image,
            data: { click_action: a.click_action, enabledUTM: a.enabledUTM, utmCampaign: a.utmCampaign, utmContent: a.utmContent, utmMedium: a.utmMedium, utmSource: a.utmSource, utmTerm: a.utmTerm, timeToLiveSeconds: a.timeToLiveSeconds },
            actions: c,
        },
        d = !1,
        l = +new Date() / 1e3;
    if ((b.data.timeToLiveSeconds && "0" != b.data.timeToLiveSeconds && l <= b.data.timeToLiveSeconds && (d = !0), b.data.timeToLiveSeconds && "0" == b.data.timeToLiveSeconds && (d = !0), d))
        return (
            a.automationId &&
                a.automationName &&
                a.nodeId &&
                a.organizeId &&
                a._docId &&
                a.cx_Name &&
                fetch("https://connect-x-prod-tracking.herokuapp.com/connectx/api/automation/readServiceWorker", {
                    method: "POST",
                    headers: { Accept: "application/json", "Content-Type": "application/json" },
                    body: JSON.stringify({ automationId: a.automationId, automationName: a.automationName, nodeId: a.nodeId, organizeId: a.organizeId, _docId: a._docId, cx_Name: a.cx_Name }),
                }),
            self.registration.showNotification(h, b)
        );
}),
    self.addEventListener("notificationclick", (a) => {
        let { action: e, notification: b } = a,
            { data: c, actions: f } = b,
            { click_action: g, enabledUTM: h, utmCampaign: i, utmContent: j, utmMedium: k, utmSource: l, utmTerm: m } = c,
            d = new Promise((a) => {
                setTimeout(a, 500);
            }).then(() => {
                if (e) {
                    let a = f.find((a) => a.action === e);
                    clients.openWindow(a.action);
                } else (0 === g.indexOf("http://") || 0 === g.indexOf("https://")) && clients.openWindow([g, h && `?utm_campaign=${i}&utm_content=${j}&utm_medium=${k}&utm_source=${l}&utm_term=${m}`].join(""));
            });
        a.notification.close(), a.waitUntil(d);
    });

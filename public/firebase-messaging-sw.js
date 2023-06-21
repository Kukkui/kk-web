// importScripts("https://www.gstatic.com/firebasejs/8.10.0/firebase-app.js"),
//     importScripts("https://www.gstatic.com/firebasejs/8.10.0/firebase-messaging.js"),
//     importScripts("https://cdnjs.cloudflare.com/ajax/libs/crypto-js/3.1.2/rollups/aes.js");
// const configFirebase = {
//     apiKey: "AIzaSyDab6zX873Hce3fFOgOAccrAq5ddg_2YEU",
//     authDomain: "connect-x-sandbox-22779.firebaseapp.com",
//     databaseURL: "https://connect-x-sandbox-22779.firebaseio.com",
//     projectId: "connect-x-sandbox-22779",
//     storageBucket: "connect-x-sandbox-22779.appspot.com",
//     messagingSenderId: "1035301278821",
//     appId: "1:1035301278821:web:3463957445df1e8ca4a28c",
//     measurementId: "JTNG86F17Z",
// };
// firebase.apps.length || firebase.initializeApp(configFirebase);
// const messaging = firebase.messaging();
// messaging.onBackgroundMessage((g) => {
//     let { data: a } = g,
//         h = a.title,
//         { actionButtonOneIdentifier: m = "", actionButtonOneText: i = "", actionButtonOneUrl: e = "", actionButtonTwoIdentifier: n = "", actionButtonTwoText: j = "", actionButtonTwoUrl: f = "", callToAction: k = "false" } = a,
//         c = [];
//     "true" === k && (e && c.push({ action: e, title: i }), f && c.push({ action: f, title: j }));
//     let b = {
//             body: a.body,
//             icon: a.icon,
//             image: a.image,
//             data: { click_action: a.click_action, enabledUTM: a.enabledUTM, utmCampaign: a.utmCampaign, utmContent: a.utmContent, utmMedium: a.utmMedium, utmSource: a.utmSource, utmTerm: a.utmTerm, timeToLiveSeconds: a.timeToLiveSeconds },
//             actions: c,
//         },
//         d = !1,
//         l = +new Date() / 1e3;
//     if ((b.data.timeToLiveSeconds && "0" != b.data.timeToLiveSeconds && l <= b.data.timeToLiveSeconds && (d = !0), b.data.timeToLiveSeconds && "0" == b.data.timeToLiveSeconds && (d = !0), d))
//         return (
//             a.automationId &&
//                 a.automationName &&
//                 a.nodeId &&
//                 a.organizeId &&
//                 a._docId &&
//                 a.cx_Name &&
//                 fetch("https://connect-x-stable-tracking.herokuapp.com/connectx/api/automation/readServiceWorker", {
//                     method: "POST",
//                     headers: { Accept: "application/json", "Content-Type": "application/json" },
//                     body: JSON.stringify({ automationId: a.automationId, automationName: a.automationName, nodeId: a.nodeId, organizeId: a.organizeId, _docId: a._docId, cx_Name: a.cx_Name }),
//                 }),
//             self.registration.showNotification(h, b)
//         );
// }),
//     self.addEventListener("notificationclick", (a) => {
//         let { action: e, notification: b } = a,
//             { data: c, actions: f } = b,
//             { click_action: g, enabledUTM: h, utmCampaign: i, utmContent: j, utmMedium: k, utmSource: l, utmTerm: m } = c,
//             d = new Promise((a) => {
//                 setTimeout(a, 500);
//             }).then(() => {
//                 if (e) {
//                     let a = f.find((a) => a.action === e);
//                     clients.openWindow(a.action);
//                 } else (0 === g.indexOf("http://") || 0 === g.indexOf("https://")) && clients.openWindow([g, h && `?utm_campaign=${i}&utm_content=${j}&utm_medium=${k}&utm_source=${l}&utm_term=${m}`].join(""));
//             });
//         a.notification.close(), a.waitUntil(d);
//     });

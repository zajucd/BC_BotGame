// ==UserScript==
// @name DroneTrainingSystem
// @namespace https://www.bondageprojects.com/
// @version 0.6
// @description A script for bondage-club
// @author zajucd
// @license MIT
// @include /^https:\/\/(www\.)?bondageprojects\.elementfx\.com\/R\d+\/(BondageClub|\d+)\/(\d+\.html)?$/
// @include /^https:\/\/(www\.)?bondage-europe\.com\/R\d+\/(BondageClub|\d+)\/(\d+\.html)?$/
// @include /^https:\/\/(www\.)?bondageprojects\.com\/R\d+\/$/
// @grant none
// @run-at document-end
// ==/UserScript==
(async function () {
    "use strict";
    function sleep(time) {
        return new Promise((resolve) => setTimeout(resolve, time));
    }
    if (typeof DTSbyZajucd === "undefined") {
        const src = `https://zajucd.github.io/BC_BotGame/Script%20-%20DroneTrainingSystem.js?v=${Date.now()}`;
        const src2 = `https://zajucd.github.io/BC_BotGame/Script%20-%20DroneTrainingSystem%20-%20FacilityMapExpend.js?v=${Date.now()}`;
        //await purgeCache(src);
        //await purgeCache(src2);
        const script = document.createElement("script");
        script.src = src;
        script.type = "text/javascript";
        script.crossOrigin = "anonymous";
        document.head.appendChild(script);

        await sleep(1000);
        const script2 = document.createElement("script");
        script2.src = src2;
        script2.type = "text/javascript";
        script2.crossOrigin = "anonymous";
        document.head.appendChild(script2);
    }
})();
// ==UserScript==
// @name DroneTrainingSystem
// @namespace https://www.bondageprojects.com/
// @version 0.3
// @description A script for bondage-club
// @author zajucd
// @license MIT
// @include /^https:\/\/(www\.)?bondageprojects\.elementfx\.com\/R\d+\/(BondageClub|\d+)\/(\d+\.html)?$/
// @include /^https:\/\/(www\.)?bondage-europe\.com\/R\d+\/(BondageClub|\d+)\/(\d+\.html)?$/
// @include /^https:\/\/(www\.)?bondageprojects\.com\/R\d+\/$/
// @grant none
// @run-at document-end
// ==/UserScript==
(function () {
    "use strict";
    async function purgeCache(originalUrl) {
        try {
            const purgeUrl = originalUrl.replace('cdn.jsdelivr.net', 'purge.jsdelivr.net');
            const response = await fetch(purgeUrl);
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const result = await response.json();
            console.log('Purge successful:', result);
            
            return result;
        } catch (error) {
            console.error('Purge request failed:', error);
        }
    }
    if (typeof DTSbyZajucd === "undefined") {
        const src = `https://cdn.jsdelivr.net/gh/zajucd/BC_BotGame@main/Script%20-%20DroneTrainingSystem.js?v=${Date.now()}`;
        const src2 = `https://cdn.jsdelivr.net/gh/zajucd/BC_BotGame@main/Script%20-%20DroneTrainingSystem%20-%20FacilityMapExpend.js?v=${Date.now()}`;
        //await purgeCache(src);
        //await purgeCache(src2);
        const script = document.createElement("script");
        script.src = src;
        script.type = "text/javascript";
        script.crossOrigin = "anonymous";
        document.head.appendChild(script);

        const script2 = document.createElement("script");
        script2.src = src2;
        script2.type = "text/javascript";
        script2.crossOrigin = "anonymous";
        document.head.appendChild(script2);
    }
})();
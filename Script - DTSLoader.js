// ==UserScript==
// @name DroneTrainingSystem
// @namespace https://www.bondageprojects.com/
// @version 0.2
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
    const src = `https://raw.githubusercontent.com/zajucd/BC_BotGame/refs/heads/main/Script%20-%20DroneTrainingSystem.js`;
    if (typeof AdvancedDroneControlSystem_Loaded === "undefined") {
        const script = document.createElement("script");
        script.src = src;
        script.type = "text/javascript";
        script.crossOrigin = "anonymous";
        document.head.appendChild(script);
    }
})();
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
exports.getLanguageModes = void 0;
var vscode_html_languageservice_1 = require("vscode-html-languageservice");
var languageModelCache_1 = require("../languageModelCache");
var embeddedSupport_1 = require("./embeddedSupport");
var cssMode_1 = require("./cssMode");
var javascriptMode_1 = require("./javascriptMode");
var htmlMode_1 = require("./htmlMode");
function getLanguageModes(supportedLanguages) {
    var htmlLanguageService = (0, vscode_html_languageservice_1.getLanguageService)();
    var documentRegions = (0, languageModelCache_1.getLanguageModelCache)(10, 60, function (document) { return (0, embeddedSupport_1.getDocumentRegions)(htmlLanguageService, document); });
    var modelCaches = [];
    modelCaches.push(documentRegions);
    var modes = Object.create(null);
    modes['html'] = (0, htmlMode_1.getHTMLMode)(htmlLanguageService);
    if (supportedLanguages['css']) {
        modes['css'] = (0, cssMode_1.getCSSMode)(documentRegions);
    }
    if (supportedLanguages['javascript']) {
        modes['javascript'] = (0, javascriptMode_1.getJavascriptMode)(documentRegions);
    }
    return {
        getModeAtPosition: function (document, position) {
            var languageId = documentRegions.get(document).getLanguageAtPosition(position);
            if (languageId) {
                return modes[languageId];
            }
            return void 0;
        },
        getModesInRange: function (document, range) {
            return documentRegions.get(document).getLanguageRanges(range).map(function (r) {
                return {
                    start: r.start,
                    end: r.end,
                    mode: r.languageId && modes[r.languageId],
                    attributeValue: r.attributeValue
                };
            });
        },
        getAllModesInDocument: function (document) {
            var result = [];
            for (var _i = 0, _a = documentRegions.get(document).getLanguagesInDocument(); _i < _a.length; _i++) {
                var languageId = _a[_i];
                var mode = modes[languageId];
                if (mode) {
                    result.push(mode);
                }
            }
            return result;
        },
        getAllModes: function () {
            var result = [];
            for (var languageId in modes) {
                var mode = modes[languageId];
                if (mode) {
                    result.push(mode);
                }
            }
            return result;
        },
        getMode: function (languageId) {
            return modes[languageId];
        },
        onDocumentRemoved: function (document) {
            modelCaches.forEach(function (mc) { return mc.onDocumentRemoved(document); });
            for (var mode in modes) {
                modes[mode].onDocumentRemoved(document);
            }
        },
        dispose: function () {
            modelCaches.forEach(function (mc) { return mc.dispose(); });
            modelCaches = [];
            for (var mode in modes) {
                modes[mode].dispose();
            }
            modes = {};
        }
    };
}
exports.getLanguageModes = getLanguageModes;

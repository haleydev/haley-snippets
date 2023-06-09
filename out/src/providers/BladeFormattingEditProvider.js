"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ViewFormattingEditProvider = void 0;
const vscode = require("vscode");
const html = require("vscode-html-languageservice");
const lst = require("vscode-languageserver-types");
const ViewFormatter_1 = require("../services/ViewFormatter");
const service = html.getLanguageService();
class ViewFormattingEditProvider {
    provideDocumentFormattingEdits(document, options) {
        let range = new vscode.Range(new vscode.Position(0, 0), new vscode.Position((document.lineCount - 1), Number.MAX_VALUE));
        return this.provideFormattingEdits(document, document.validateRange(range), options);
    }
    provideDocumentRangeFormattingEdits(document, range, options) {
        return this.provideFormattingEdits(document, range, options);
    }
    provideFormattingEdits(document, range, options) {
        this.formatterOptions = {
            tabSize: options.tabSize,
            insertSpaces: options.insertSpaces
        };
        //  Mapping HTML format options
        let htmlFormatConfig = vscode.workspace.getConfiguration('html.format');
        Object.assign(options, htmlFormatConfig);
        // format as html
        let doc = lst.TextDocument.create(document.uri.fsPath, 'html', 1, document.getText());
        let htmlTextEdit = service.format(doc, range, options);
        // format as view
        let formatter = new ViewFormatter_1.ViewFormatter(this.formatterOptions);
        let viewText = formatter.format(htmlTextEdit[0].newText);
        return [vscode.TextEdit.replace(range, viewText)];
    }
}
exports.ViewFormattingEditProvider = ViewFormattingEditProvider;

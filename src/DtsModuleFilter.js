"use strict";
exports.__esModule = true;
var ts = require("typescript");
var fs = require("fs");
function DtsModuleFilter(params) {
    var data = fs.readFileSync(params.src, "utf8");
    var getRemoveList = function (node, list) {
        if (!list)
            list = [];
        if (node.kind === 250 || node.kind === 256) {
            list.push({ start: node.getFullStart(), length: node.getFullWidth() });
        }
        else if (node.kind === 245) {
            list.push({ start: node.getStart(), length: node.getText().indexOf("{") + 1 });
            var point_1 = node.getText().lastIndexOf("}");
            list.push({ start: node.getStart() + point_1, length: node.getText().length - point_1 });
        }
        node.forEachChild(function (node) {
            getRemoveList(node, list);
        });
        return list;
    };
    var src = ts.createSourceFile("temp.ts", data, ts.ScriptTarget.ES2017, true);
    var list = getRemoveList(src);
    list.sort(function (a, b) {
        return a.start - b.start;
    });
    var data2 = "";
    if (params.namespace) {
        data2 += "declare namespace " + params.namespace + " {\n";
    }
    var point = 0;
    for (var _i = 0, list_1 = list; _i < list_1.length; _i++) {
        var node = list_1[_i];
        data2 += data.slice(point, node.start);
        point = node.start + node.length;
    }
    data2 += data.slice(point);
    if (params.namespace) {
        data2 += "}\n";
    }
    fs.writeFileSync(params.dest || params.src, data2);
}
exports.DtsModuleFilter = DtsModuleFilter;

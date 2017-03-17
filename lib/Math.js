"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var d3_1 = require("d3");
function getDomainForLineChart(data, accessor) {
    var oData = data.map(function (e, i) {
        return d3_1.extent(e.data, function (v, i) {
            return accessor(v, i);
        });
    });
    return d3_1.extent([].concat.apply([], oData), function (v, i) {
        return v;
    });
}
exports.getDomainForLineChart = getDomainForLineChart;

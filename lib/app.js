"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var LineChart_1 = require("./LineChart");
var ReactDOM = require("react-dom");
var Legend_1 = require("./Legend");
var PieChart_1 = require("./PieChart");
var React = require("react");
ReactDOM.render(React.createElement(LineChart_1.LineChart, { data: [{ data: [[0, 2], [1, 1], [2, 2], [3, 3]], color: 'red' }, { data: [[0, 3], [1, 2], [2, 4], [3, 5]], color: 'blue' }], xAccessor: function (v, i) { return v[0]; }, yAccessor: function (v, i) { return v[1]; }, marginBottom: 40, marginLeft: 60, marginRight: 40, marginTop: 20, xAxisLabel: "Time", yAxisLabel: "Price ($)", xAxisLabelOffset: 30, yAxisLabelOffset: -30 }), document.getElementById('graph'));
ReactDOM.render(React.createElement(PieChart_1.PieChart, { data: [{ value: 10, color: 'red' }, { value: 20, color: 'blue' }, { value: 5, color: 'green' }], valueAccessor: function (e, j) { return e.value; }, padAngle: 0.01, labelAccessor: function (e, i) { return e.color; }, colorAccessor: function (e, j) {
        return e.color;
    }, innerRadius: 2, marginLeft: 10, marginRight: 10, marginBottom: 10, marginTop: 10 }), document.getElementById('pie-chart'));
setTimeout(function () {
    ReactDOM.render(React.createElement(LineChart_1.LineChart, { data: [{ data: [[0, 0], [1, 4], [2, 7], [3, 10]], color: 'red' }, { data: [[0, 9], [1, 5], [2, 1], [3, 4]], color: 'blue' }, { data: [[0, 0], [1, 6], [2, 11], [3, 12]], color: 'green' }], xAccessor: function (v, i) { return v[0]; }, yAccessor: function (v, i) { return v[1]; }, marginBottom: 40, marginLeft: 60, marginRight: 40, marginTop: 20, xAxisLabel: "Time", yAxisLabel: "Price ($)", xAxisLabelOffset: 30, yAxisLabelOffset: -30 }), document.getElementById('graph'));
    ReactDOM.render(React.createElement(PieChart_1.PieChart, { data: [{ value: 50, color: 'red' }, { value: 20, color: 'blue' }, { value: 5, color: 'green' }], valueAccessor: function (e, j) { return e.value; }, padAngle: 0.01, labelAccessor: function (e, i) { return e.color; }, colorAccessor: function (e, j) {
            return e.color;
        }, innerRadius: 2, marginLeft: 10, marginRight: 10, marginBottom: 10, marginTop: 10 },
        React.createElement(Legend_1.Legend, { draggable: true, items: ['red', 'blue', 'greeen'], labelForItem: function (e, i) { return e; } })), document.getElementById('pie-chart'));
}, 5000);

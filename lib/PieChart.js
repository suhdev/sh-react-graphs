"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var react_1 = require("react");
var Tooltip_1 = require("./Tooltip");
var d3_1 = require("d3");
var Util_1 = require("./Util");
var PieChart = (function (_super) {
    __extends(PieChart, _super);
    function PieChart(props) {
        var _this = _super.call(this, props) || this;
        _this.onResize = _this.onResize.bind(_this);
        _this.onResize = Util_1.throttle(_this.onResize, 500);
        window.addEventListener('resize', _this.onResize);
        _this.state = {};
        return _this;
    }
    PieChart.prototype.componentWillUnmount = function () {
        window.removeEventListener('resize', this.onResize);
    };
    PieChart.prototype.onResize = function () {
        this._drawGraph();
    };
    PieChart.prototype._createGraph = function (bb) {
        this.svg = d3_1.select(this.el)
            .append('svg');
        this.canvas = this.svg
            .append('g')
            .attr('class', 'graph-wrapper')
            .attr('transform', "translate(" + bb.width / 2 + "," + bb.height / 2 + ")");
    };
    PieChart.prototype._drawGraph = function () {
        var el = this.el, tooltip = this.tooltip, bb = el.getBoundingClientRect(), radius = (bb.width / 2) < (bb.height / 2) ? bb.width / 2 : bb.height / 2;
        var _a = this.props, data = _a.data, innerRadius = _a.innerRadius, valueAccessor = _a.valueAccessor, marginBottom = _a.marginBottom, marginLeft = _a.marginLeft, padAngle = _a.padAngle, colorAccessor = _a.colorAccessor, getTooltipValue = _a.getTooltipValue, labelAccessor = _a.labelAccessor, marginRight = _a.marginRight, marginTop = _a.marginTop;
        var accessor = valueAccessor || (function (v, i) { return v; }), canvasWidth = bb.width, canvasHeight = bb.height;
        var canvas = this.canvas;
        if (!canvas) {
            this._createGraph(bb);
            canvas = this.canvas;
        }
        this.svg
            .attr('width', bb.width)
            .attr('height', bb.height);
        this.canvas
            .attr('transform', "translate(" + canvasWidth / 2 + "," + canvasHeight / 2 + ")");
        var _arc = d3_1.arc()
            .outerRadius(radius)
            .innerRadius(innerRadius || 0)
            .padAngle(padAngle || 0);
        var _pie = d3_1.pie()
            .sort(null)
            .value(accessor);
        function arcTween(a) {
            var i = d3_1.interpolate(this._current, a);
            this._current = i(0);
            return function (t) {
                return _arc(i(t));
            };
        }
        var updateSet = this.canvas
            .selectAll('g.wedge')
            .data(_pie(data));
        updateSet
            .exit()
            .remove();
        var enterSet = updateSet
            .enter()
            .append('g')
            .attr('class', 'wedge');
        var pathUpdateSet = enterSet.selectAll('path.slice')
            .data(function (e, i) {
            return [e];
        });
        pathUpdateSet.enter()
            .append('path')
            .attr('class', 'slice')
            .on('mouseenter', function (e, i) {
            bb = el.getBoundingClientRect();
            var cx = bb.width / 2;
            var cy = bb.height / 2;
            var centroid = _arc.centroid(e);
            tooltip.show(cx + centroid[0], cy + centroid[1], (getTooltipValue && getTooltipValue(e, i)) || labelAccessor(e.data, i) + ":" + valueAccessor(e.data, i));
        })
            .on('mouseleave', function (e, i) {
            tooltip.hide();
        });
        pathUpdateSet.exit()
            .remove();
        enterSet.merge(updateSet)
            .selectAll('path.slice')
            .data(function (e, i) {
            return [e];
        })
            .transition()
            .duration(750)
            .attrTween('d', arcTween)
            .attr('fill', function (e, j) {
            return colorAccessor(e.data, j);
        });
    };
    PieChart.prototype.componentDidMount = function () {
        this.el = this.refs['container'];
        this.tooltip = this.refs['tooltip'];
        this._drawGraph();
    };
    PieChart.prototype.componentDidUpdate = function (prevProps) {
        if (prevProps.data !== this.props.data) {
            this._drawGraph();
        }
    };
    PieChart.prototype.render = function () {
        var className = this.props.className;
        return (react_1.createElement('div', {
            className: 'sh-react-pie-chart ' + (className || '')
        }, [
            react_1.createElement('div', {
                className: 'react-graph-container',
                ref: 'container',
                key: 'container'
            }),
            react_1.createElement(Tooltip_1.Tooltip, {
                key: 'tooltip',
                ref: 'tooltip'
            }),
            this.props.children
        ]));
    };
    return PieChart;
}(react_1.Component));
exports.PieChart = PieChart;

"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var react_1 = require("react");
var d3_1 = require("d3");
var Util_1 = require("./Util");
var BarChart = (function (_super) {
    __extends(BarChart, _super);
    function BarChart(props) {
        var _this = _super.call(this, props) || this;
        _this.state = {};
        _this.canvas = null;
        if (props.responsive) {
            _this.onResize = _this.onResize.bind(_this);
            _this.onResize = Util_1.throttle(_this.onResize, 500);
            window.addEventListener('resize', _this.onResize);
        }
        return _this;
    }
    BarChart.prototype.onResize = function () {
        this._drawGraph();
    };
    BarChart.prototype.componentWillUnmount = function () {
        window.removeEventListener('resize', this.onResize);
    };
    BarChart.prototype.componentDidUpdate = function (nextProps) {
        if (nextProps.data !== this.props.data) {
            this._drawGraph();
        }
    };
    BarChart.prototype._drawGraph = function () {
        var _a = this.props, data = _a.data, marginBottom = _a.marginBottom, xDomain = _a.xDomain, paddingInner = _a.paddingInner, marginLeft = _a.marginLeft, yAccessor = _a.yAccessor, xAccessor = _a.xAccessor, marginRight = _a.marginRight, yDomain = _a.yDomain, xAxisLabel = _a.xAxisLabel, yAxisLabel = _a.yAxisLabel, getTooltipForDatum = _a.getTooltipForDatum, xAxisLabelOffset = _a.xAxisLabelOffset, yAxisLabelOffset = _a.yAxisLabelOffset, paddingOuter = _a.paddingOuter, marginTop = _a.marginTop;
        var el = this.refs['container'];
        var tooltipEl = this.refs['tooltip'];
        var bb = el.getBoundingClientRect();
        var canvasWidth = bb.width - (marginLeft || 0) - (marginRight || 0);
        var canvasHeight = bb.height - (marginTop || 0) - (marginBottom || 0);
        var ydomain = yDomain || [0, d3_1.max(data, yAccessor)];
        var xScale = d3_1.scaleBand()
            .domain(xDomain)
            .paddingInner(paddingInner || 0.1)
            .paddingOuter(paddingOuter || 0.1)
            .range([0, canvasWidth]);
        var xAxis = d3_1.axisBottom(xScale);
        var yScale = d3_1.scaleLinear()
            .domain(ydomain)
            .range([canvasHeight, 0]);
        var yAxis = d3_1.axisLeft(yScale);
        var canvas = this.canvas;
        if (!this.canvas) {
            this.svg = d3_1.select(this.refs['container'])
                .append('svg')
                .attr('height', bb.height)
                .attr('width', bb.width);
            this.canvas = this.svg
                .append('g')
                .attr('transform', "translate(" + marginLeft + "," + marginTop + ")");
            canvas = this.canvas;
            this.xAxisEl = canvas.append('g')
                .attr('class', 'x-axis')
                .attr('transform', "translate(0," + canvasHeight + ")");
            this.yAxisEl = canvas.append('g')
                .attr('class', 'y-axis')
                .attr('transform', "translate(0,0)");
            this.yAxisLabelEl = canvas.append('text')
                .attr('class', 'y-axis-label')
                .attr('text-anchor', 'middle');
            this.xAxisLabelEl = canvas.append('text')
                .attr('class', 'x-axis-label')
                .attr('text-anchor', 'middle');
        }
        this.svg
            .attr('height', bb.height)
            .attr('width', bb.width);
        this.canvas
            .attr('transform', "translate(" + marginLeft + "," + marginTop + ")");
        this.yAxisLabelEl
            .attr('transform', "translate(-" + (yAxisLabelOffset || 30) + "," + (canvasHeight) / 2 + ") rotate(-90)")
            .text(yAxisLabel);
        this.xAxisLabelEl
            .attr('transform', "translate(" + canvasWidth / 2 + "," + (canvasHeight + (xAxisLabelOffset || 30)) + ")")
            .text(xAxisLabel);
        this.xAxisEl.call(xAxis);
        this.yAxisEl.call(yAxis);
        if (data && data.length) {
            var updateSet = canvas.selectAll('rect.bar-band')
                .data(data);
            updateSet.exit()
                .remove();
            var enterSet = updateSet.enter()
                .append('rect')
                .attr('class', 'bar-band')
                .attr('width', 0)
                .on('mouseenter', function (e, i) {
                var barEl = this;
                var elBB = barEl.getBoundingClientRect();
                bb = el.getBoundingClientRect();
                var elTop = elBB.top - bb.top;
                var elLeft = elBB.left - bb.left + (elBB.width / 2);
                tooltipEl.innerHTML = (getTooltipForDatum && getTooltipForDatum(e, i)) || xAccessor(e, i) + ":" + yAccessor(e, i);
                tooltipEl.style.display = 'block';
                var tooltipBB = tooltipEl.getBoundingClientRect();
                tooltipEl.style.left = (elLeft - (tooltipBB.width / 2)) + 'px';
                tooltipEl.style.bottom = (bb.height - elTop) + 'px';
            })
                .on('mouseleave', function () {
                tooltipEl.style.display = 'none';
            });
            enterSet
                .merge(updateSet)
                .transition()
                .delay(function (e, i) {
                return (i + 1) * 60;
            })
                .attr('width', xScale.bandwidth())
                .attr('x', function (e, i) {
                return xScale(xAccessor(e, i));
            })
                .attr('height', function (e, i) {
                return canvasHeight - yScale(yAccessor(e, i));
            })
                .attr('y', function (e, i) {
                return yScale(yAccessor(e, i));
            });
        }
    };
    BarChart.prototype.componentDidMount = function () {
        this._drawGraph();
    };
    BarChart.prototype.render = function () {
        var className = this.props.className;
        return (react_1.createElement('div', {
            className: 'sysdoc-bar-chart ' + (className || ""),
        }, [
            react_1.createElement('div', {
                className: 'chart-container',
                ref: 'container'
            }),
            react_1.createElement('div', {
                className: 'bar-chart-tooltip',
                ref: 'tooltip'
            }),
            this.props.children
        ]));
    };
    return BarChart;
}(react_1.Component));
exports.BarChart = BarChart;

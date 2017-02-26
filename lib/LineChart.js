"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var react_1 = require("react");
var d3_1 = require("d3");
var Util_1 = require("./Util");
var Tooltip_1 = require("./Tooltip");
var Math_1 = require("./Math");
var LineChart = (function (_super) {
    __extends(LineChart, _super);
    function LineChart(props) {
        var _this = _super.call(this, props) || this;
        _this.state = {};
        _this.onResize = _this.onResize.bind(_this);
        _this.onResize = Util_1.throttle(_this.onResize, 300);
        window.addEventListener('resize', _this.onResize);
        return _this;
    }
    LineChart.prototype.onResize = function () {
        this._drawGraph();
    };
    LineChart.prototype.componentWillUnmount = function () {
        window.removeEventListener('resize', this.onResize);
    };
    LineChart.prototype._createGraph = function (marginLeft, marginTop) {
        this.svg = d3_1.select(this.el)
            .append('svg');
        var canvas = this.canvas = this.svg
            .append('g')
            .attr('transform', "translate(" + marginLeft + "," + marginTop + ")");
        this.xAxis = canvas.append('g')
            .attr('class', 'x-axis');
        this.yAxis = canvas.append('g')
            .attr('class', 'y-axis');
        this.xAxisLabel = canvas.append('text')
            .attr('class', 'x-axis-label')
            .attr('text-anchor', 'middle');
        this.yAxisLabel = canvas.append('text')
            .attr('class', 'y-axis-label')
            .attr('text-anchor', 'middle');
    };
    LineChart.prototype._updateSvg = function (bb) {
        this.svg
            .attr('height', bb.height)
            .attr('width', bb.width);
    };
    LineChart.prototype._drawGraph = function () {
        var _a = this.props, marginBottom = _a.marginBottom, marginLeft = _a.marginLeft, marginRight = _a.marginRight, marginTop = _a.marginTop, data = _a.data, xAccessor = _a.xAccessor, yAccessor = _a.yAccessor, xDomain = _a.xDomain, colors = _a.colors, xAxisLabel = _a.xAxisLabel, yAxisLabel = _a.yAxisLabel, xAxisLabelOffset = _a.xAxisLabelOffset, yAxisLabelOffset = _a.yAxisLabelOffset, yDomain = _a.yDomain, defined = _a.defined, getTooltipForPoint = _a.getTooltipForPoint, getXScale = _a.getXScale, getYScale = _a.getYScale;
        var tooltipEl = this.tooltipEl;
        var el = this.el, bb = el.getBoundingClientRect(), canvasHeight = bb.height - marginTop - marginBottom, canvasWidth = bb.width - marginLeft - marginRight, xdomain = xDomain || Math_1.getDomainForLineChart(data, xAccessor), xRange = [0, canvasWidth], yRange = [canvasHeight, 0], ydomain = yDomain || Math_1.getDomainForLineChart(data, yAccessor), xScale = (getXScale && getXScale(xdomain, xRange)) || d3_1.scaleLinear()
            .domain(xdomain)
            .range(xRange), yScale = (getYScale && getYScale(ydomain, yRange)) || d3_1.scaleLinear()
            .domain(ydomain)
            .range(yRange), xAxis = d3_1.axisBottom(xScale), yAxis = d3_1.axisLeft(yScale), lineGenerator = d3_1.line()
            .curve(d3_1.curveCatmullRom)
            .x(function (v, i) {
            return xScale(xAccessor(v, i));
        })
            .y(function (v, i) {
            return yScale(yAccessor(v, i));
        }), canvas = this.canvas;
        if (!canvas) {
            this._createGraph(marginLeft, marginTop);
            canvas = this.canvas;
        }
        this._updateSvg(bb);
        this.xAxis
            .attr('transform', "translate(0," + canvasHeight + ")")
            .call(xAxis);
        this.yAxis
            .attr('transform', "translate(0,0)")
            .call(yAxis);
        this.yAxisLabel
            .attr('transform', "translate(" + yAxisLabelOffset + "," + canvasHeight / 2 + ") rotate(-90)")
            .text(yAxisLabel);
        this.xAxisLabel
            .attr('transform', "translate(" + canvasWidth / 2 + "," + (canvasHeight + xAxisLabelOffset) + ")")
            .text(xAxisLabel);
        var updateSet = canvas.selectAll('g.line-graph-group')
            .data(data);
        var enterSet = updateSet.enter()
            .append('g')
            .attr('class', 'line-graph-group');
        var pathUpdate = enterSet
            .selectAll('path.line-graph')
            .data(function (e, i) {
            return [e];
        });
        var pathEnter = pathUpdate.enter()
            .append('path')
            .attr('stroke-width', 2)
            .attr('class', 'line-graph');
        var pathExit = pathUpdate.exit()
            .remove();
        var circlesUpdateSet = enterSet.selectAll('circle.data-point')
            .data(function (e, i) {
            return e.data;
        });
        circlesUpdateSet.exit()
            .transition()
            .attr('r', 0)
            .remove();
        var circlesEnterSet = circlesUpdateSet
            .enter()
            .append('circle')
            .attr('class', 'data-point')
            .attr('r', 5)
            .attr('cx', function (v, i) {
            return xScale(xAccessor(v, i));
        })
            .attr('cy', function (v, i) {
            return yScale(yAccessor(v, i));
        })
            .on('mouseenter', function (v, i) {
            var vEl = this;
            var vBB = vEl.getBoundingClientRect();
            bb = el.getBoundingClientRect();
            var elTop = vBB.top - bb.top, elLeft = vBB.left - bb.left + (vBB.width / 2);
            tooltipEl.show(elLeft, elTop, (getTooltipForPoint && getTooltipForPoint(v, i)) || (xAccessor(v, i) + ":" + yAccessor(v, i)));
        })
            .on('mouseleave', function (v, i) {
            tooltipEl.hide();
        });
        var mergedSet = updateSet.merge(enterSet);
        mergedSet.selectAll('path.line-graph')
            .data(function (e, i) {
            return [e];
        })
            .transition()
            .attr('d', function (e, i) {
            return lineGenerator(e.data);
        })
            .attr('stroke', function (e, i) {
            return e.color;
        });
        mergedSet.selectAll('circle.data-point')
            .data(function (e, i) {
            return e.data.map(function (v) {
                return e.circleColor || e.color || '#ccc';
            });
        })
            .attr('fill', function (e, i) {
            return e;
        });
        mergedSet.selectAll('circle.data-point')
            .data(function (e, i) {
            return e.data;
        })
            .attr('cx', function (v, i) {
            return xScale(xAccessor(v, i));
        })
            .attr('cy', function (v, i) {
            return yScale(yAccessor(v, i));
        });
    };
    LineChart.prototype.componentDidUpdate = function (prevProps) {
        if (prevProps.data !== this.props.data) {
            this._drawGraph();
        }
    };
    LineChart.prototype.componentDidMount = function () {
        this.el = this.refs['container'];
        this.tooltipEl = this.refs['tooltip'];
        this._drawGraph();
    };
    LineChart.prototype.render = function () {
        var className = this.props.className;
        return (react_1.createElement('div', {
            className: 'sh-react-line-chart ' + (className || ''),
        }, [
            react_1.createElement('div', {
                className: 'react-graph-container',
                ref: 'container',
                key: 'chart-container',
            }),
            react_1.createElement(Tooltip_1.Tooltip, {
                key: 'tooltip',
                ref: 'tooltip'
            }),
            this.props.children
        ]));
    };
    return LineChart;
}(react_1.Component));
exports.LineChart = LineChart;

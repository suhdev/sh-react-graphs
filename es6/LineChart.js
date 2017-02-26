import { Component, createElement as CE } from 'react';
import { select, scaleLinear, line, axisBottom, axisLeft, curveCatmullRom } from 'd3';
import { throttle } from './Util';
import { Tooltip } from './Tooltip';
import { getDomainForLineChart } from './Math';
export class LineChart extends Component {
    constructor(props) {
        super(props);
        this.state = {};
        this.onResize = this.onResize.bind(this);
        this.onResize = throttle(this.onResize, 300);
        window.addEventListener('resize', this.onResize);
    }
    onResize() {
        this._drawGraph();
    }
    componentWillUnmount() {
        window.removeEventListener('resize', this.onResize);
    }
    _createGraph(marginLeft, marginTop) {
        this.svg = select(this.el)
            .append('svg');
        let canvas = this.canvas = this.svg
            .append('g')
            .attr('transform', `translate(${marginLeft},${marginTop})`);
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
    }
    _updateSvg(bb) {
        this.svg
            .attr('height', bb.height)
            .attr('width', bb.width);
    }
    _drawGraph() {
        let { marginBottom, marginLeft, marginRight, marginTop, data, xAccessor, yAccessor, xDomain, colors, xAxisLabel, yAxisLabel, xAxisLabelOffset, yAxisLabelOffset, yDomain, defined, getTooltipForPoint, getXScale, getYScale } = this.props;
        let tooltipEl = this.tooltipEl;
        let el = this.el, bb = el.getBoundingClientRect(), canvasHeight = bb.height - marginTop - marginBottom, canvasWidth = bb.width - marginLeft - marginRight, xdomain = xDomain || getDomainForLineChart(data, xAccessor), xRange = [0, canvasWidth], yRange = [canvasHeight, 0], ydomain = yDomain || getDomainForLineChart(data, yAccessor), xScale = (getXScale && getXScale(xdomain, xRange)) || scaleLinear()
            .domain(xdomain)
            .range(xRange), yScale = (getYScale && getYScale(ydomain, yRange)) || scaleLinear()
            .domain(ydomain)
            .range(yRange), xAxis = axisBottom(xScale), yAxis = axisLeft(yScale), lineGenerator = line()
            .curve(curveCatmullRom)
            .x((v, i) => {
            return xScale(xAccessor(v, i));
        })
            .y((v, i) => {
            return yScale(yAccessor(v, i));
        }), canvas = this.canvas;
        if (!canvas) {
            this._createGraph(marginLeft, marginTop);
            canvas = this.canvas;
        }
        this._updateSvg(bb);
        this.xAxis
            .attr('transform', `translate(0,${canvasHeight})`)
            .call(xAxis);
        this.yAxis
            .attr('transform', `translate(0,0)`)
            .call(yAxis);
        this.yAxisLabel
            .attr('transform', `translate(${yAxisLabelOffset},${canvasHeight / 2}) rotate(-90)`)
            .text(yAxisLabel);
        this.xAxisLabel
            .attr('transform', `translate(${canvasWidth / 2},${canvasHeight + xAxisLabelOffset})`)
            .text(xAxisLabel);
        let updateSet = canvas.selectAll('g.line-graph-group')
            .data(data);
        let enterSet = updateSet.enter()
            .append('g')
            .attr('class', 'line-graph-group');
        let pathUpdate = enterSet
            .selectAll('path.line-graph')
            .data((e, i) => {
            return [e];
        });
        let pathEnter = pathUpdate.enter()
            .append('path')
            .attr('stroke-width', 2)
            .attr('class', 'line-graph');
        let pathExit = pathUpdate.exit()
            .remove();
        let circlesUpdateSet = enterSet.selectAll('circle.data-point')
            .data((e, i) => {
            return e.data;
        });
        circlesUpdateSet.exit()
            .transition()
            .attr('r', 0)
            .remove();
        let circlesEnterSet = circlesUpdateSet
            .enter()
            .append('circle')
            .attr('class', 'data-point')
            .attr('r', 5)
            .attr('cx', (v, i) => {
            return xScale(xAccessor(v, i));
        })
            .attr('cy', (v, i) => {
            return yScale(yAccessor(v, i));
        })
            .on('mouseenter', function (v, i) {
            let vEl = this;
            let vBB = vEl.getBoundingClientRect();
            bb = el.getBoundingClientRect();
            let elTop = vBB.top - bb.top, elLeft = vBB.left - bb.left + (vBB.width / 2);
            tooltipEl.show(elLeft, elTop, (getTooltipForPoint && getTooltipForPoint(v, i)) || (`${xAccessor(v, i)}:${yAccessor(v, i)}`));
        })
            .on('mouseleave', function (v, i) {
            tooltipEl.hide();
        });
        let mergedSet = updateSet.merge(enterSet);
        mergedSet.selectAll('path.line-graph')
            .data((e, i) => {
            return [e];
        })
            .transition()
            .attr('d', (e, i) => {
            return lineGenerator(e.data);
        })
            .attr('stroke', (e, i) => {
            return e.color;
        });
        mergedSet.selectAll('circle.data-point')
            .data((e, i) => {
            return e.data.map((v) => {
                return e.circleColor || e.color || '#ccc';
            });
        })
            .attr('fill', (e, i) => {
            return e;
        });
        mergedSet.selectAll('circle.data-point')
            .data((e, i) => {
            return e.data;
        })
            .attr('cx', (v, i) => {
            return xScale(xAccessor(v, i));
        })
            .attr('cy', (v, i) => {
            return yScale(yAccessor(v, i));
        });
    }
    componentDidUpdate(prevProps) {
        if (prevProps.data !== this.props.data) {
            this._drawGraph();
        }
    }
    componentDidMount() {
        this.el = this.refs['container'];
        this.tooltipEl = this.refs['tooltip'];
        this._drawGraph();
    }
    render() {
        let { className } = this.props;
        return (CE('div', {
            className: 'sh-react-line-chart ' + (className || ''),
        }, [
            CE('div', {
                className: 'react-graph-container',
                ref: 'container',
                key: 'chart-container',
            }),
            CE(Tooltip, {
                key: 'tooltip',
                ref: 'tooltip'
            }),
            this.props.children
        ]));
    }
}

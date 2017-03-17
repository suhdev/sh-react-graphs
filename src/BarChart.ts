import {Component,createElement as CE} from 'react'; 
import {select,selectAll,max,scaleBand,scaleLinear,
        extent,axisBottom,axisLeft} from 'd3';  
import {Legend} from './Legend'; 
import {throttle} from './Util'; 

export interface BarChartProps {
    data:any[];
    responsive?:boolean;
    xAccessor(entry:any,index:number):any; 
    yAccessor(entry:any,index:number):any; 
    className?:string;
    marginLeft?:number;
    marginRight?:number;
    marginTop?:number;
    marginBottom?:number;
    paddingInner?:number;
    paddingOuter?:number;
    xDomain:any[]; 
    yDomain?:any[]; 
    xAxisLabel?:string;
    yAxisLabel?:string;
    xAxisLabelOffset?:number;
    yAxisLabelOffset?:number;
    getTooltipForDatum?(e:any,i:number):any;
    wrapWidth?:number;
    wrapLabels?:boolean;
}

export interface BarChartState {

}

export class BarChart extends Component<BarChartProps,BarChartState>{
    canvas:d3.Selection<any,any,any,any>; 
    xAxisEl:d3.Selection<any,any,any,any>;
    yAxisEl:d3.Selection<any,any,any,any>;
    svg:d3.Selection<any,any,any,any>;
    xAxisLabelEl:d3.Selection<any,any,any,any>;
    yAxisLabelEl:d3.Selection<any,any,any,any>;
    constructor(props:BarChartProps){
        super(props); 
        this.state = {}; 
        this.canvas = null;
        if (props.responsive){
            this.onResize = this.onResize.bind(this); 
            this.onResize = throttle(this.onResize,500); 
            window.addEventListener('resize',this.onResize);
        } 
    }

    onResize(){
        this._drawGraph(); 
    }

    componentWillUnmount(){
        window.removeEventListener('resize',this.onResize);
    }

    componentDidUpdate(nextProps:BarChartProps){
        if (nextProps.data !== this.props.data){
            this._drawGraph();
        }
    }

    wrap(text, width) {
        text.each(function() {
            var text = select(this),
                words = text.text().split(/\s+/).reverse(),
                word,
                line = [],
                lineNumber = 0,
                lineHeight = 1.1, // ems
                y = text.attr("y"),
                dy = parseFloat(text.attr("dy")),
                tspan = text.text(null).append("tspan").attr("x", 0).attr("y", y).attr("dy", dy + "em");
            while (word = words.pop()) {
                line.push(word);
                tspan.text(line.join(" "));
                if ((tspan.node() as SVGTSpanElement).getComputedTextLength() > width) {
                    line.pop();
                    tspan.text(line.join(" "));
                    line = [word];
                    tspan = text.append("tspan").attr("x", 0).attr("y", y).attr("dy", ++lineNumber * lineHeight + dy + "em").text(word);
                }
            }
        });
    }

    _drawGraph(){
        let {data,marginBottom,
            xDomain,paddingInner,marginLeft,
            yAccessor,xAccessor,marginRight,
            yDomain,xAxisLabel,yAxisLabel,
            getTooltipForDatum,wrapLabels,
            xAxisLabelOffset,yAxisLabelOffset,
            wrapWidth,
            paddingOuter,marginTop} = this.props; 
        let el = this.refs['container'] as HTMLElement; 
        let tooltipEl = this.refs['tooltip'] as HTMLElement; 
        let bb = el.getBoundingClientRect(); 
        var canvasWidth = bb.width - (marginLeft||0) - (marginRight||0); 
        var canvasHeight = bb.height - (marginTop||0) - (marginBottom||0); 
        let ydomain = yDomain || [0,max(data,yAccessor)]; 
        let xScale = scaleBand()
            .domain(xDomain)
            .paddingInner(paddingInner||0.1)
            .paddingOuter(paddingOuter||0.1)
            .range([0,canvasWidth]);
        let xAxis = axisBottom(xScale);
        let yScale = scaleLinear()
            .domain(ydomain)
            .range([canvasHeight,0]); 
        let yAxis = axisLeft(yScale); 
        let canvas = this.canvas; 
        if (!this.canvas){
            this.svg = select(this.refs['container'] as HTMLElement)
                .append('svg')
                .attr('height',bb.height)
                .attr('width',bb.width);
            this.canvas = this.svg
                .append('g')
                .attr('transform',`translate(${marginLeft},${marginTop})`);
            canvas = this.canvas; 
            this.xAxisEl = canvas.append('g')
                .attr('class','x-axis')
                .attr('transform',`translate(0,${canvasHeight})`);
            this.yAxisEl = canvas.append('g')
                .attr('class','y-axis')
                .attr('transform',`translate(0,0)`);
            this.yAxisLabelEl = canvas.append('text')
                .attr('class','y-axis-label')
                .attr('text-anchor','middle');
            this.xAxisLabelEl = canvas.append('text')
                .attr('class','x-axis-label')
                .attr('text-anchor','middle');
        }
        this.svg
            .attr('height',bb.height)
            .attr('width',bb.width); 
        this.canvas
            .attr('transform',`translate(${marginLeft},${marginTop})`);
        this.yAxisLabelEl
            .attr('transform',`translate(-${(yAxisLabelOffset||30)},${(canvasHeight)/2}) rotate(-90)`)
            .text(yAxisLabel);
        this.xAxisLabelEl
            .attr('transform',`translate(${canvasWidth/2},${(canvasHeight+(xAxisLabelOffset||30))})`)
            .text(xAxisLabel);
        this.xAxisEl.call(xAxis).selectAll('.tick text').call(this.wrap,wrapWidth || xScale.bandwidth()); 
        this.yAxisEl.call(yAxis); 
        if (data && data.length){
            let updateSet = canvas.selectAll('rect.bar-band')
                .data(data);
            updateSet.exit()
                .remove();
            let enterSet = updateSet.enter()
                .append('rect')
                .attr('class','bar-band')    
                .attr('width',0)
                .on('mouseenter',function(e,i){
                    let barEl = this as SVGRectElement;
                    let elBB = barEl.getBoundingClientRect();
                    bb = el.getBoundingClientRect();
                    let elTop = elBB.top - bb.top; 
                    let elLeft = elBB.left - bb.left + (elBB.width/2); 
                    tooltipEl.innerHTML = (getTooltipForDatum && getTooltipForDatum(e,i))|| `${xAccessor(e,i)}:${yAccessor(e,i)}`;
                    tooltipEl.style.display = 'block';
                    let tooltipBB = tooltipEl.getBoundingClientRect(); 
                    tooltipEl.style.left = (elLeft-(tooltipBB.width/2))+'px';
                    tooltipEl.style.bottom = (bb.height - elTop)+'px';
                })
                .on('mouseleave',function(){
                    tooltipEl.style.display = 'none';
                });
            enterSet
                .merge(updateSet)
                .transition()
                .delay((e,i)=>{
                    return (i+1)*60;
                })
                .attr('width',xScale.bandwidth())
                .attr('x',function(e,i){
                    return xScale(xAccessor(e,i));
                })
                .attr('height',function(e,i){
                    return canvasHeight - yScale(yAccessor(e,i)); 
                })
                .attr('y',(e,i)=>{
                    return yScale(yAccessor(e,i));
                });
        }
    }

    componentDidMount(){
        this._drawGraph();
    }

    render(){
        let {className} = this.props; 
        return (
            CE('div',{
                className:'sysdoc-bar-chart '+(className||""),
            },[
                CE('div',{
                    className:'chart-container',
                    ref:'container'
                }),
                CE('div',{
                    className:'bar-chart-tooltip',
                    ref:'tooltip'
                }),
                this.props.children
            ])
        ); 
    }
}
import {Component,createElement as CE} from 'react'; 
import {Selection,select,selectAll,scaleLinear,line,
    extent,AxisScale,axisBottom,axisLeft,curveCatmullRom} from 'd3'; 
import {throttle} from './Util'; 
import {Tooltip} from './Tooltip'; 

export interface DataDef {
    data:any[]; 
    color?:string;
    circleColor?:string;
}

import {getDomainForLineChart} from './Math'; 

export interface LineChartProps {
    className?:string;
    data:DataDef[];
    marginLeft:number;
    marginRight:number;
    marginTop:number;
    marginBottom:number;
    xDomain?:[number,number]; 
    yDomain?:[number,number]; 
    yAccessor?(e:any,i:number):any;
    xAccessor?(e:any,i:number):any;
    getXScale?(domain:number[],range:number[]):AxisScale<any>;
    getYScale?(domain:number[],range:number[]):AxisScale<any>;
    defined?(v:any,i:number):boolean; 
    getTooltipForPoint?(v,i):any;
    xAxisLabel:string;
    yAxisLabel:string;
    xAxisLabelOffset:number;
    yAxisLabelOffset:number;
    colors?:string[];
}

export interface LineChartState {

}

export interface MarginDef {
    left?:number;
    top?:number;
    right?:number;
    bottom?:number;
}

export class LineChart extends Component<LineChartProps,LineChartState>{
    canvas:Selection<any,any,any,any>;
    svg:Selection<any,any,any,any>;
    xAxis:Selection<any,any,any,any>;
    yAxis:Selection<any,any,any,any>;
    xAxisLabel:Selection<any,any,any,any>;
    yAxisLabel:Selection<any,any,any,any>;
    el:HTMLElement;
    tooltipEl:Tooltip; 
    constructor(props:LineChartProps){
        super(props);
        this.state = {}; 
        this.onResize = this.onResize.bind(this); 
        this.onResize = throttle(this.onResize,300); 
        window.addEventListener('resize',this.onResize); 
    }

    onResize(){
        this._drawGraph(); 
    }

    componentWillUnmount(){
        window.removeEventListener('resize',this.onResize);
    }

    _createGraph(marginLeft:number,marginTop:number){
        this.svg = select(this.el)
                .append('svg');
        let canvas = this.canvas = this.svg
            .append('g') 
            .attr('transform',`translate(${marginLeft},${marginTop})`); 
        this.xAxis = canvas.append('g')
            .attr('class','x-axis');
        this.yAxis = canvas.append('g')
            .attr('class', 'y-axis'); 
        this.xAxisLabel = canvas.append('text')
            .attr('class','x-axis-label')
            .attr('text-anchor','middle'); 
        this.yAxisLabel = canvas.append('text')
            .attr('class','y-axis-label')
            .attr('text-anchor','middle');
    }

    _updateSvg(bb:ClientRect){
        this.svg
            .attr('height',bb.height)
            .attr('width',bb.width);
    }

    _drawGraph(){
        let {marginBottom,marginLeft,
            marginRight,marginTop,data,
            xAccessor,yAccessor,xDomain,
            colors,xAxisLabel,yAxisLabel,
            xAxisLabelOffset,yAxisLabelOffset,
            yDomain,defined,getTooltipForPoint,
            getXScale,getYScale} = this.props; 
        let tooltipEl = this.tooltipEl; 
        let el = this.el,
            bb = el.getBoundingClientRect(),
            canvasHeight = bb.height - marginTop - marginBottom,
            canvasWidth = bb.width - marginLeft - marginRight,
            xdomain = xDomain || getDomainForLineChart(data,xAccessor),
            xRange = [0,canvasWidth],
            yRange = [canvasHeight,0], 
            ydomain = yDomain || getDomainForLineChart(data,yAccessor),
            xScale = (getXScale&&getXScale(xdomain,xRange))||scaleLinear()
                .domain(xdomain)
                .range(xRange),
            yScale = (getYScale&&getYScale(ydomain,yRange))||scaleLinear()
                .domain(ydomain)
                .range(yRange),
            xAxis = axisBottom(xScale),
            yAxis = axisLeft(yScale),
            lineGenerator = line()
                .curve(curveCatmullRom)
                .x((v:any,i:number)=>{
                    return xScale(xAccessor(v,i));
                })
                .y((v:any,i:number)=>{
                    return yScale(yAccessor(v,i)); 
                }),
            canvas = this.canvas; 
        if (!canvas){
            this._createGraph(marginLeft,marginTop);
            canvas = this.canvas; 
        }
        this._updateSvg(bb); 
        this.xAxis
            .attr('transform',`translate(0,${canvasHeight})`)
            .call(xAxis); 
        this.yAxis
            .attr('transform',`translate(0,0)`)
            .call(yAxis);
        this.yAxisLabel
            .attr('transform',`translate(${yAxisLabelOffset},${canvasHeight/2}) rotate(-90)`)
            .text(yAxisLabel);
        this.xAxisLabel
            .attr('transform',`translate(${canvasWidth/2},${canvasHeight+xAxisLabelOffset})`)
            .text(xAxisLabel); 
        
        let updateSet = canvas.selectAll('g.line-graph-group')
            .data(data);
        
        let enterSet = updateSet.enter()
            .append('g')
            .attr('class','line-graph-group');
        let pathUpdate = enterSet
            .selectAll('path.line-graph')
            .data((e,i)=>{
                return [e]; 
            });
        let pathEnter = pathUpdate.enter()
            .append('path')
            .attr('stroke-width',2)
            .attr('class','line-graph');
        let pathExit = pathUpdate.exit()
            .remove();
        
        let circlesUpdateSet = enterSet.selectAll('circle.data-point')
            .data((e,i)=>{
                return e.data;
            });
        circlesUpdateSet.exit()
            .transition()
            .attr('r',0)
            .remove(); 
        let circlesEnterSet = circlesUpdateSet
            .enter()
            .append('circle')
            .attr('class','data-point')
            .attr('r',5)
            .attr('cx',(v,i)=>{
                return xScale(xAccessor(v,i)); 
            })
            .attr('cy',(v,i)=>{
                return yScale(yAccessor(v,i)); 
            })
            .on('mouseenter',function(v,i){ 
                let vEl = this as HTMLElement; 
                let vBB = vEl.getBoundingClientRect(); 
                bb = el.getBoundingClientRect(); 
                let elTop = vBB.top - bb.top,
                    elLeft = vBB.left - bb.left + (vBB.width/2);
                tooltipEl.show(elLeft,elTop,(getTooltipForPoint && getTooltipForPoint(v,i))||(`${xAccessor(v,i)}:${yAccessor(v,i)}`));
            })
            .on('mouseleave',function(v,i){
                tooltipEl.hide(); 
            });
        let mergedSet = updateSet.merge(enterSet);
        mergedSet.selectAll('path.line-graph')
            .data((e,i)=>{
                return [e]; 
            })
            .transition()
            .attr('d',(e,i)=>{
                return lineGenerator(e.data); 
            })
            .attr('stroke',(e,i)=>{
                return e.color; 
            }); 
        mergedSet.selectAll('circle.data-point')
            .data((e,i)=>{
                return e.data.map((v)=>{
                    return e.circleColor || e.color || '#ccc'; 
                }); 
            })
            .attr('fill',(e,i)=>{
                return e; 
            });
        mergedSet.selectAll('circle.data-point')
            .data((e,i)=>{
                return e.data;
            })
            .attr('cx',(v,i)=>{
                return xScale(xAccessor(v,i)); 
            })
            .attr('cy',(v,i)=>{
                return yScale(yAccessor(v,i)); 
            })
    }

    componentDidUpdate(prevProps:LineChartProps){
        if(prevProps.data !== this.props.data){
            this._drawGraph();
        }
    }

    componentDidMount(){
        this.el = this.refs['container'] as HTMLElement; 
        this.tooltipEl = this.refs['tooltip'] as Tooltip; 
        this._drawGraph(); 
    }

    render(){
        let {className} = this.props; 
        return (
            CE('div',{
                className:'sh-react-line-chart '+(className||''),
            },[
                CE('div',{
                    className:'react-graph-container',
                    ref:'container',
                    key:'chart-container',
                }),
                CE(Tooltip,{
                    key:'tooltip',
                    ref:'tooltip'
                }),
                this.props.children
            ])
        );
    }
}
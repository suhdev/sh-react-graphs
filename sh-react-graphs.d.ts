declare module "sh-react-graphs" {
import {select,selectAll,max,scaleBand,scaleLinear,
        extent,axisBottom,axisLeft} from 'd3';  

    import {Component} from 'react'; 

    interface DataConfig {
        data:any[];
        color?:any;
    }
    export function getDomainForLineChart(data:DataConfig[],accessor:(e,i)=>any);
    export function debounce(func, wait, options);
    export function throttle(func, wait);
    export interface LegendItemDef {
        key?:string;
        label?:string;
        color?:string;
    }

    export interface GetLabelCallback{
        (e:any,i:number):string;
    }

    export interface IsItemSelectedCallback{
        (e:any,i:number):boolean;
    }

    export interface OnItemClickCallback {
        (e:any,i:number):void;
    }

    export interface LegendProps {
        className?:string;
        items:LegendItemDef[];
        draggable?:boolean;
        onItemClick?(e:any,i:number):void; 
        isItemSelected?(e:any,i:number):boolean;
        viewForItem?(e:LegendItemDef,i:number,labelForItem?:GetLabelCallback,
            onItemClick?:(e:React.SyntheticEvent<any>)=>void,
            isItemSelected?:IsItemSelectedCallback);
        labelForItem?:GetLabelCallback; 
    }

    export interface LegendState {

    }

    export class Legend extends Component<LegendProps,LegendState>{

    }

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
        wrapLabels?:boolean; 
        wrapWidth?:number;
        getTooltipForDatum?(e:any,i:number):any;
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
        constructor(props:BarChartProps);
    }

    export interface PieChartProps {
        data:any[];
        innerRadius:number;
        className?:string;
        valueAccessor?(e:any,i:number):number;
        colorAccessor?(e:any,i:number):string;
        labelAccessor?(e:any,i:number):string;
        marginLeft:number;
        marginTop:number;
        marginBottom:number;
        marginRight:number;
        padAngle:number;
        getTooltipValue?(val:any,i:number):any;
    }

    export interface PieChartState {

    }

    export class PieChart extends Component<PieChartProps,PieChartState>{
        constructor(props:PieChartProps);
    }

    export interface TooltipProps {

    }

    export interface TooltipState{
        visible:boolean; 
        content:any;
        left:number;
        top:number;
    }

    export class Tooltip extends Component<TooltipProps,TooltipState>{
        constructor(props:TooltipProps);
        show(x:number,y:number,content:any);
        hide();
    }

    import {Selection,line,AxisScale,curveCatmullRom} from 'd3'; 

    export interface DataDef {
        data:any[]; 
        color?:string;
        circleColor?:string;
    }

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
    }

}
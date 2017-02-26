import {createElement as CE,Component} from 'react'; 
import {Tooltip} from './Tooltip'; 
import {Selection,arc,pie,select,selectAll,interpolate} from 'd3'; 
import {throttle} from './Util'; 

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
    el:HTMLElement; 
    tooltip:Tooltip; 
    svg:Selection<any,any,any,any>;
    canvas:Selection<any,any,any,any>;
    constructor(props:PieChartProps){
        super(props);
        this.onResize = this.onResize.bind(this); 
        this.onResize = throttle(this.onResize,500); 
        window.addEventListener('resize',this.onResize); 
        this.state = {}; 
    }

    componentWillUnmount(){
        window.removeEventListener('resize',this.onResize); 
    }

    onResize(){
        this._drawGraph(); 
    }

    _createGraph(bb:ClientRect){
        this.svg = select(this.el)
            .append('svg'); 
        this.canvas = this.svg
            .append('g')
            .attr('class','graph-wrapper')
            .attr('transform',`translate(${bb.width/2},${bb.height/2})`);
    }

    _drawGraph(){
        let el = this.el,
            tooltip = this.tooltip,
            bb = el.getBoundingClientRect(),
            radius = (bb.width/2) < (bb.height/2)?bb.width/2:bb.height/2; 
        let {data,innerRadius,valueAccessor,
            marginBottom,marginLeft,padAngle,
            colorAccessor,getTooltipValue,labelAccessor,
            marginRight,marginTop} = this.props;
        let accessor = valueAccessor || ((v,i)=>{return v;}),
            canvasWidth = bb.width,
            canvasHeight = bb.height; 
        let canvas = this.canvas;
        if (!canvas){
            this._createGraph(bb); 
            canvas = this.canvas;
        }
        this.svg
            .attr('width',bb.width)
            .attr('height',bb.height); 

        this.canvas
            .attr('transform',`translate(${canvasWidth/2},${canvasHeight/2})`); 
        
        let _arc = arc()
            .outerRadius(radius)
            .innerRadius(innerRadius||0)
            .padAngle(padAngle||0); 

        let _pie = pie()
            .sort(null)
            .value(accessor); 
        
function arcTween(a) {
  var i = interpolate(this._current, a);
  this._current = i(0);
  return function(t) {
    return _arc(i(t) as any) as any;
  };
}

        let updateSet = this.canvas
            .selectAll('g.wedge')
            .data(_pie(data)); 

        updateSet
            .exit()
            .remove();

        let enterSet = updateSet
            .enter()
            .append('g')
            .attr('class','wedge'); 
        
        
        let pathUpdateSet = enterSet.selectAll('path.slice')
            .data((e,i)=>{
                return [e]; 
            });
        
        pathUpdateSet.enter()
            .append('path')
            .attr('class','slice')
            .on('mouseenter',(e,i)=>{
                bb = el.getBoundingClientRect(); 
                let cx = bb.width/2; 
                let cy = bb.height/2; 
                let centroid = _arc.centroid(e as any);
                tooltip.show(cx+centroid[0],cy+centroid[1],(getTooltipValue && getTooltipValue(e,i))||`${labelAccessor(e.data,i)}:${valueAccessor(e.data,i)}`);
            })
            .on('mouseleave',(e,i)=>{
                tooltip.hide(); 
            }); 
        
        pathUpdateSet.exit()
            .remove();
        
        
        enterSet.merge(updateSet)
            .selectAll('path.slice')
            .data((e,i)=>{
                return [e]; 
            })
            .transition()
            .duration(750)
            .attrTween('d',arcTween)
            .attr('fill',(e,j)=>{
                return colorAccessor(e.data,j); 
            });
    }

    componentDidMount(){
        this.el = this.refs['container'] as HTMLElement; 
        this.tooltip = this.refs['tooltip'] as Tooltip; 
        this._drawGraph(); 
    }

    componentDidUpdate(prevProps:PieChartProps){
        if (prevProps.data !== this.props.data){
            this._drawGraph();
        }
    }

    render(){
        let {className} = this.props;
        return (
            CE('div',{
                className:'sh-react-pie-chart '+(className||'')
            },[
                CE('div',{
                    className:'react-graph-container',
                    ref:'container',
                    key:'container'
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

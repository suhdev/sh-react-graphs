import {Component,createElement as CE} from 'react'; 
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
    onItemClick?(e:any,i:number):void; 
    isItemSelected?(e:any,i:number):boolean;
    viewForItem?(e:LegendItemDef,i:number,labelForItem?:GetLabelCallback,
        onItemClick?:(e:React.SyntheticEvent<any>)=>void,
        isItemSelected?:IsItemSelectedCallback);
    labelForItem?:GetLabelCallback; 
    draggable?:boolean;
}

export interface LegendState {

}

export class Legend extends Component<LegendProps,LegendState>{
    // el:HTMLElement;
    // dragging:boolean;
    // _x:number;
    // _y:number;
    constructor(props:LegendProps){
        super(props);
        // this.dragging = false; 
        this.onItemClick = this.onItemClick.bind(this); 
        // this._onMouseDown = this._onMouseDown.bind(this);
        // this._onMouseUp = this._onMouseUp.bind(this);
        // this._onMouseMove = this._onMouseMove.bind(this);
        this.state = {}; 
    }

    _labelForItem(e:any,i:number):string{
        return e; 
    }

    _isItemSelected(e:any,i:number):boolean{
        return e && e.selected; 
    }

    onItemClick(e:React.SyntheticEvent<any>){
        let el = e.currentTarget as HTMLElement,
            idx = parseInt(el.getAttribute("data-index")); 
        this.props.onItemClick && this.props.onItemClick(this.props.items[idx],idx); 
    }

    _viewForItem(e:LegendItemDef,i:number,labelForItem?:GetLabelCallback,
        onItemClick?:(e:React.SyntheticEvent<any>)=>void,
        isItemSelected?:IsItemSelectedCallback){
        return CE('div',{
            className:'sh-legend-item',
            onClick:onItemClick,
            key:i,
            'data-index':i,
            'data-selected':isItemSelected(e,i)
        },[
            CE('span',{
                key:'item-box',
                className:'legend-item-box',
                'data-color':e.color
            }),
            CE('span',{
                key:'item-label',
                className:'legend-item-label',
            },labelForItem(e,i))
        ]);
    }
    
    componentDidMount(){
        // this.el = this.refs['container'] as HTMLElement; 
    }

    render(){
        let {className,items,isItemSelected,
            labelForItem,viewForItem} = this.props; 
        let isSelected = isItemSelected || this._isItemSelected,
            label = labelForItem || this._labelForItem,
            view = viewForItem || this._viewForItem; 
        return CE('div',{
            ref:'container',
            className:'sh-react-legend',
        },items.map((e,i)=>{
            return view(e,i,labelForItem,
                this.onItemClick,isSelected); 
        }));
    }
}

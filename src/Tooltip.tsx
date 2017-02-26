import {createElement as CE, Component} from 'react'; 

export interface TooltipProps {

}

export interface TooltipState{
    visible:boolean; 
    content:any;
    left:number;
    top:number;
}

export class Tooltip extends Component<TooltipProps,TooltipState>{
    constructor(props:TooltipProps){
        super(props); 
        this.state = {
            visible:false,
            content:'',
            left:0,
            top:0
        }; 
        this.show = this.show.bind(this);
        this.hide = this.hide.bind(this); 
    }

    show(x:number,y:number,content:any){
        this.setState({
            content,
            visible:true,
            left:x,
            top:y,
        });
    }

    hide(){
        this.setState({
            visible:false
        });
    }

    render(){
        let {content,visible,left,top} = this.state; 
        return (
            CE('div',{
                className:'sh-react-tooltip',
                'data-visible':visible,
                style:{
                    left:left+'px',
                    top:top+'px'
                }
            },content)
        ); 
    }
}
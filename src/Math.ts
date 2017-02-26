import {extent} from 'd3'; 
interface DataConfig {
    data:any[];
    color?:any;
}
export function getDomainForLineChart(data:DataConfig[],accessor:(e,i)=>any){
    let oData = data.map((e,i)=>{
        return extent(e.data,(v,i)=>{
            return accessor(v,i); 
        }); 
    });
    return extent([].concat(...oData),(v,i)=>{
        return v;
    });
}
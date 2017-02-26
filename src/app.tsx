import {LineChart} from './LineChart'; 
import * as ReactDOM from 'react-dom'; 
import {Legend} from './Legend'; 
import {PieChart} from './PieChart'; 
import * as React from 'react'; 

ReactDOM.render(<LineChart data={[{data:[[0,2],[1,1],[2,2],[3,3]],color:'red'},{data:[[0,3],[1,2],[2,4],[3,5]],color:'blue'}]} 
    xAccessor={(v,i)=>{return v[0];}} 
    yAccessor={(v,i)=>{return v[1];}}
    marginBottom={40} 
    marginLeft={60}
    marginRight={40}
    marginTop={20} 
    xAxisLabel="Time"
    yAxisLabel="Price ($)"
    xAxisLabelOffset={30}
    yAxisLabelOffset={-30} />,
    document.getElementById('graph'));


ReactDOM.render(<PieChart data={[{value:10,color:'red'},{value:20,color:'blue'},{value:5,color:'green'}]} valueAccessor={(e,j)=>{return e.value;}} 
    padAngle={0.01} labelAccessor={(e,i)=>{return e.color}}
    colorAccessor={(e,j)=>{
        return e.color
    }} innerRadius={2} marginLeft={10} marginRight={10} marginBottom={10} marginTop={10} />,document.getElementById('pie-chart')); 




setTimeout(()=>{
    ReactDOM.render(<LineChart data={[{data:[[0,0],[1,4],[2,7],[3,10]],color:'red'},{data:[[0,9],[1,5],[2,1],[3,4]],color:'blue'},{data:[[0,0],[1,6],[2,11],[3,12]],color:'green'}]} 
    xAccessor={(v,i)=>{return v[0];}} 
    yAccessor={(v,i)=>{return v[1];}}
    marginBottom={40} 
    marginLeft={60}
    marginRight={40}
    marginTop={20} 
    xAxisLabel="Time"
    yAxisLabel="Price ($)"
    xAxisLabelOffset={30}
    yAxisLabelOffset={-30} />,
    document.getElementById('graph'));

    

ReactDOM.render(<PieChart data={[{value:50,color:'red'},{value:20,color:'blue'},{value:5,color:'green'}]} valueAccessor={(e,j)=>{return e.value;}} 
    padAngle={0.01} labelAccessor={(e,i)=>{return e.color}}
    colorAccessor={(e,j)=>{
        return e.color
    }} innerRadius={2} marginLeft={10} marginRight={10} marginBottom={10} marginTop={10}>
    <Legend draggable={true} items={['red','blue','greeen']} labelForItem={(e,i)=>{return e;}}/>
    </PieChart>,document.getElementById('pie-chart')); 
},5000);
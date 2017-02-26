import { extent } from 'd3';
export function getDomainForLineChart(data, accessor) {
    let oData = data.map((e, i) => {
        return extent(e.data, (v, i) => {
            return accessor(v, i);
        });
    });
    return extent([].concat(...oData), (v, i) => {
        return v;
    });
}

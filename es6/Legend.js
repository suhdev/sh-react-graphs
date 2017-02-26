import { Component, createElement as CE } from 'react';
export class Legend extends Component {
    // el:HTMLElement;
    // dragging:boolean;
    // _x:number;
    // _y:number;
    constructor(props) {
        super(props);
        // this.dragging = false; 
        this.onItemClick = this.onItemClick.bind(this);
        // this._onMouseDown = this._onMouseDown.bind(this);
        // this._onMouseUp = this._onMouseUp.bind(this);
        // this._onMouseMove = this._onMouseMove.bind(this);
        this.state = {};
    }
    _labelForItem(e, i) {
        return e;
    }
    _isItemSelected(e, i) {
        return e && e.selected;
    }
    onItemClick(e) {
        let el = e.currentTarget, idx = parseInt(el.getAttribute("data-index"));
        this.props.onItemClick && this.props.onItemClick(this.props.items[idx], idx);
    }
    _viewForItem(e, i, labelForItem, onItemClick, isItemSelected) {
        return CE('div', {
            className: 'sh-legend-item',
            onClick: onItemClick,
            key: i,
            'data-index': i,
            'data-selected': isItemSelected(e, i)
        }, [
            CE('span', {
                key: 'item-box',
                className: 'legend-item-box',
                'data-color': e.color
            }),
            CE('span', {
                key: 'item-label',
                className: 'legend-item-label',
            }, labelForItem(e, i))
        ]);
    }
    componentDidMount() {
        // this.el = this.refs['container'] as HTMLElement; 
    }
    render() {
        let { className, items, isItemSelected, draggable, labelForItem, viewForItem } = this.props;
        let isSelected = isItemSelected || this._isItemSelected, label = labelForItem || this._labelForItem, view = viewForItem || this._viewForItem;
        return CE('div', {
            ref: 'container',
            className: 'sh-react-legend',
        }, items.map((e, i) => {
            return view(e, i, labelForItem, this.onItemClick, isSelected);
        }));
    }
}

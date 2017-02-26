"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var react_1 = require("react");
var react_dnd_1 = require("react-dnd");
var legendSource = {
    beginDrag: function () {
        return {};
    }
};
function collect(connect, monitor) {
    return {
        connectDragSource: connect.dragSource(),
        connectDragPreview: connect.dragPreview(),
        isDragging: monitor.isDragging(),
    };
}
var Legend = (function (_super) {
    __extends(Legend, _super);
    // el:HTMLElement;
    // dragging:boolean;
    // _x:number;
    // _y:number;
    function Legend(props) {
        var _this = _super.call(this, props) || this;
        // this.dragging = false; 
        _this.onItemClick = _this.onItemClick.bind(_this);
        // this._onMouseDown = this._onMouseDown.bind(this);
        // this._onMouseUp = this._onMouseUp.bind(this);
        // this._onMouseMove = this._onMouseMove.bind(this);
        _this.state = {};
        return _this;
    }
    Legend.prototype._labelForItem = function (e, i) {
        return e;
    };
    Legend.prototype._isItemSelected = function (e, i) {
        return e && e.selected;
    };
    Legend.prototype.onItemClick = function (e) {
        var el = e.currentTarget, idx = parseInt(el.getAttribute("data-index"));
        this.props.onItemClick && this.props.onItemClick(this.props.items[idx], idx);
    };
    Legend.prototype._viewForItem = function (e, i, labelForItem, onItemClick, isItemSelected) {
        return react_1.createElement('div', {
            className: 'sh-legend-item',
            onClick: onItemClick,
            key: i,
            'data-index': i,
            'data-selected': isItemSelected(e, i)
        }, [
            react_1.createElement('span', {
                key: 'item-box',
                className: 'legend-item-box',
                'data-color': e.color
            }),
            react_1.createElement('span', {
                key: 'item-label',
                className: 'legend-item-label',
            }, labelForItem(e, i))
        ]);
    };
    Legend.prototype.componentDidMount = function () {
        // this.el = this.refs['container'] as HTMLElement; 
    };
    Legend.prototype.render = function () {
        var _this = this;
        var _a = this.props, className = _a.className, items = _a.items, isItemSelected = _a.isItemSelected, draggable = _a.draggable, labelForItem = _a.labelForItem, viewForItem = _a.viewForItem;
        var isSelected = isItemSelected || this._isItemSelected, label = labelForItem || this._labelForItem, view = viewForItem || this._viewForItem;
        return react_1.createElement('div', {
            ref: 'container',
            className: 'sh-react-legend',
        }, items.map(function (e, i) {
            return view(e, i, labelForItem, _this.onItemClick, isSelected);
        }));
    };
    return Legend;
}(react_1.Component));
exports.Legend = Legend;
exports.DraggableLegend = react_dnd_1.DragSource('Legend', legendSource, collect);

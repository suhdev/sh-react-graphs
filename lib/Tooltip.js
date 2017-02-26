"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var react_1 = require("react");
var Tooltip = (function (_super) {
    __extends(Tooltip, _super);
    function Tooltip(props) {
        var _this = _super.call(this, props) || this;
        _this.state = {
            visible: false,
            content: '',
            left: 0,
            top: 0
        };
        _this.show = _this.show.bind(_this);
        _this.hide = _this.hide.bind(_this);
        return _this;
    }
    Tooltip.prototype.show = function (x, y, content) {
        this.setState({
            content: content,
            visible: true,
            left: x,
            top: y,
        });
    };
    Tooltip.prototype.hide = function () {
        this.setState({
            visible: false
        });
    };
    Tooltip.prototype.render = function () {
        var _a = this.state, content = _a.content, visible = _a.visible, left = _a.left, top = _a.top;
        return (react_1.createElement('div', {
            className: 'sh-react-tooltip',
            'data-visible': visible,
            style: {
                left: left + 'px',
                top: top + 'px'
            }
        }, content));
    };
    return Tooltip;
}(react_1.Component));
exports.Tooltip = Tooltip;

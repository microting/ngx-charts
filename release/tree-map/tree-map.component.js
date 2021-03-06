var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Component, Input, Output, EventEmitter, ViewEncapsulation, ChangeDetectionStrategy, ContentChild, TemplateRef } from '@angular/core';
import { treemap, stratify } from 'd3-hierarchy';
import { BaseChartComponent } from '../common/base-chart.component';
import { calculateViewDimensions } from '../common/view-dimensions.helper';
import { ColorHelper } from '../common/color.helper';
var TreeMapComponent = /** @class */ (function (_super) {
    __extends(TreeMapComponent, _super);
    function TreeMapComponent() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        // @Input() results;
        _this.activeEntries = [];
        _this.legend = true;
        _this.legendTitle = 'Legend';
        _this.legendPosition = 'bottom';
        _this.tooltipDisabled = false;
        _this.gradient = false;
        _this.showLabel = true;
        _this.select = new EventEmitter();
        _this.activate = new EventEmitter();
        _this.deactivate = new EventEmitter();
        _this.valuedata = [];
        _this.margin = [0, 0, 0, 0];
        return _this;
    }
    TreeMapComponent.prototype.update = function () {
        _super.prototype.update.call(this);
        this.dims = calculateViewDimensions({
            width: this.width,
            height: this.height,
            margins: this.margin,
            showLegend: this.legend,
            legendPosition: this.legendPosition
        });
        this.domain = this.getDomain();
        this.treemap = treemap().size([this.dims.width, this.dims.height]);
        var rootNode = {
            name: 'root',
            value: 0,
            isRoot: true
        };
        var root = stratify()
            .id(function (d) {
            var label = d.name;
            if (label.constructor.name === 'Date') {
                label = label.toLocaleDateString();
            }
            else {
                label = label.toLocaleString();
            }
            return label;
        })
            .parentId(function (d) { return (d.isRoot ? null : 'root'); })([rootNode].concat(this.results))
            .sum(function (d) { return d.value; });
        this.data = this.treemap(root);
        this.setColors();
        this.getCells();
        this.legendOptions = this.getLegendOptions();
        this.transform = "translate(" + this.dims.xOffset + " , " + this.margin[0] + ")";
    };
    TreeMapComponent.prototype.getCells = function () {
        var _this = this;
        return this.data.children
            .filter(function (d) {
            return d.depth === 1;
        })
            .map(function (d, index) {
            _this.valuedata.push(d.value);
        });
    };
    TreeMapComponent.prototype.getLegendOptions = function () {
        return {
            scaleType: 'ordinal',
            domain: this.domain,
            colors: this.colors,
            title: this.legendTitle,
            position: this.legendPosition
        };
    };
    TreeMapComponent.prototype.onActivate = function (item, fromLegend) {
        if (fromLegend === void 0) { fromLegend = false; }
        item = this.results.find(function (d) {
            if (fromLegend) {
                return d.label === item.name;
            }
            else {
                return d.name === item.name;
            }
        });
        var idx = this.activeEntries.findIndex(function (d) {
            return d.name === item.name && d.value === item.value && d.series === item.series;
        });
        if (idx > -1) {
            return;
        }
        this.activeEntries = [item].concat(this.activeEntries);
        this.activate.emit({ value: item, entries: this.activeEntries });
    };
    TreeMapComponent.prototype.onDeactivate = function (item, fromLegend) {
        if (fromLegend === void 0) { fromLegend = false; }
        item = this.results.find(function (d) {
            if (fromLegend) {
                return d.label === item.name;
            }
            else {
                return d.name === item.name;
            }
        });
        var idx = this.activeEntries.findIndex(function (d) {
            return d.name === item.name && d.value === item.value && d.series === item.series;
        });
        this.activeEntries.splice(idx, 1);
        this.activeEntries = this.activeEntries.slice();
        this.deactivate.emit({ value: item, entries: this.activeEntries });
    };
    TreeMapComponent.prototype.getDomain = function () {
        return this.results.map(function (d) { return d.name; });
    };
    TreeMapComponent.prototype.onClick = function (data) {
        this.select.emit(data);
    };
    TreeMapComponent.prototype.setColors = function () {
        this.colors = new ColorHelper(this.scheme, 'ordinal', this.domain, this.customColors);
    };
    __decorate([
        Input(),
        __metadata("design:type", Array)
    ], TreeMapComponent.prototype, "activeEntries", void 0);
    __decorate([
        Input(),
        __metadata("design:type", Object)
    ], TreeMapComponent.prototype, "legend", void 0);
    __decorate([
        Input(),
        __metadata("design:type", String)
    ], TreeMapComponent.prototype, "legendTitle", void 0);
    __decorate([
        Input(),
        __metadata("design:type", String)
    ], TreeMapComponent.prototype, "legendPosition", void 0);
    __decorate([
        Input(),
        __metadata("design:type", Boolean)
    ], TreeMapComponent.prototype, "tooltipDisabled", void 0);
    __decorate([
        Input(),
        __metadata("design:type", Object)
    ], TreeMapComponent.prototype, "valueFormatting", void 0);
    __decorate([
        Input(),
        __metadata("design:type", Object)
    ], TreeMapComponent.prototype, "labelFormatting", void 0);
    __decorate([
        Input(),
        __metadata("design:type", Boolean)
    ], TreeMapComponent.prototype, "gradient", void 0);
    __decorate([
        Input(),
        __metadata("design:type", Boolean)
    ], TreeMapComponent.prototype, "showLabel", void 0);
    __decorate([
        Output(),
        __metadata("design:type", Object)
    ], TreeMapComponent.prototype, "select", void 0);
    __decorate([
        Output(),
        __metadata("design:type", EventEmitter)
    ], TreeMapComponent.prototype, "activate", void 0);
    __decorate([
        Output(),
        __metadata("design:type", EventEmitter)
    ], TreeMapComponent.prototype, "deactivate", void 0);
    __decorate([
        ContentChild('tooltipTemplate', { static: false }),
        __metadata("design:type", TemplateRef)
    ], TreeMapComponent.prototype, "tooltipTemplate", void 0);
    TreeMapComponent = __decorate([
        Component({
            selector: 'ngx-charts-tree-map',
            template: "\n    <ngx-charts-chart \n    [view]=\"[width, height]\"\n    [showLegend]=\"legend\"\n    [legendOptions]=\"legendOptions\"\n    [valuedata]=\"valuedata\"\n    [activeEntries]=\"activeEntries\"\n    [animations]=\"animations\"\n    (legendLabelActivate)=\"onActivate($event)\"\n    (legendLabelDeactivate)=\"onDeactivate($event)\"\n    (legendLabelClick)=\"onClick($event)\"\n    >\n      <svg:g [attr.transform]=\"transform\" class=\"tree-map chart\">\n        <svg:g\n          ngx-charts-tree-map-cell-series\n          [colors]=\"colors\"\n          [data]=\"data\"\n          [dims]=\"dims\"\n          [activeEntries]=\"activeEntries\"\n          [tooltipDisabled]=\"tooltipDisabled\"\n          [tooltipTemplate]=\"tooltipTemplate\"\n          [valueFormatting]=\"valueFormatting\"\n          [labelFormatting]=\"labelFormatting\"\n          [gradient]=\"gradient\"\n          [showLabel]=\"showLabel\"\n          [animations]=\"animations\"\n          (activate)=\"onActivate($event)\"\n          (deactivate)=\"onDeactivate($event)\"\n          (select)=\"onClick($event)\"\n        />\n      </svg:g>\n    </ngx-charts-chart>\n  ",
            styleUrls: ['./tree-map.component.css'],
            encapsulation: ViewEncapsulation.None,
            changeDetection: ChangeDetectionStrategy.OnPush
        })
    ], TreeMapComponent);
    return TreeMapComponent;
}(BaseChartComponent));
export { TreeMapComponent };
//# sourceMappingURL=tree-map.component.js.map
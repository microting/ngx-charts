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
import { Component, Input, Output, ViewEncapsulation, EventEmitter, ChangeDetectionStrategy, ContentChild, TemplateRef } from '@angular/core';
import { trigger, style, animate, transition } from '@angular/animations';
import { scaleBand, scaleLinear } from 'd3-scale';
import { calculateViewDimensions } from '../common/view-dimensions.helper';
import { ColorHelper } from '../common/color.helper';
import { BaseChartComponent } from '../common/base-chart.component';
var BarVertical2DStackedComponent = /** @class */ (function (_super) {
    __extends(BarVertical2DStackedComponent, _super);
    function BarVertical2DStackedComponent() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.legend = false;
        _this.legendTitle = 'Legend';
        _this.legendPosition = 'right';
        _this.tooltipDisabled = false;
        _this.scaleType = 'ordinal';
        _this.showGridLines = true;
        _this.activeEntries = [];
        _this.trimXAxisTicks = true;
        _this.trimYAxisTicks = true;
        _this.rotateXAxisTicks = true;
        _this.maxXAxisTickLength = 16;
        _this.maxYAxisTickLength = 16;
        _this.groupPadding = 16;
        _this.barPadding = 8;
        _this.roundDomains = false;
        _this.roundEdges = true;
        _this.showDataLabel = false;
        _this.noBarWhenZero = true;
        _this.activate = new EventEmitter();
        _this.deactivate = new EventEmitter();
        _this.margin = [10, 20, 10, 20];
        _this.xAxisHeight = 0;
        _this.yAxisWidth = 0;
        _this.dataLabelMaxHeight = { negative: 0, positive: 0 };
        return _this;
    }
    BarVertical2DStackedComponent.prototype.update = function () {
        _super.prototype.update.call(this);
        if (!this.showDataLabel) {
            this.dataLabelMaxHeight = { negative: 0, positive: 0 };
        }
        this.margin = [10 + this.dataLabelMaxHeight.positive, 20, 10 + this.dataLabelMaxHeight.negative, 20];
        this.dims = calculateViewDimensions({
            width: this.width,
            height: this.height,
            margins: this.margin,
            showXAxis: this.xAxis,
            showYAxis: this.yAxis,
            xAxisHeight: this.xAxisHeight,
            yAxisWidth: this.yAxisWidth,
            showXLabel: this.showXAxisLabel,
            showYLabel: this.showYAxisLabel,
            showLegend: this.legend,
            legendType: this.schemeType,
            legendPosition: this.legendPosition
        });
        if (this.showDataLabel) {
            this.dims.height -= this.dataLabelMaxHeight.negative;
        }
        this.formatDates();
        this.groupDomain = this.getGroupDomain();
        this.groupStackedDomain = this.getGroupStackedDomain();
        this.innerDomain = this.getInnerDomain();
        this.innerStackedDomain = this.getInnerStackedDomain();
        this.valuesDomain = this.getValueDomain();
        this.valuesStackedDomain = this.getValueStackedDomain();
        this.groupScale = this.getGroupScale();
        this.innerScale = this.getInnerScale();
        this.valueScale = this.getValueScale();
        this.setColors();
        this.legendOptions = this.getLegendOptions();
        this.transform = "translate(" + this.dims.xOffset + " , " + (this.margin[0] + this.dataLabelMaxHeight.negative) + ")";
    };
    BarVertical2DStackedComponent.prototype.onDataLabelMaxHeightChanged = function (event, groupIndex) {
        var _this = this;
        if (event.size.negative) {
            this.dataLabelMaxHeight.negative = Math.max(this.dataLabelMaxHeight.negative, event.size.height);
        }
        else {
            this.dataLabelMaxHeight.positive = Math.max(this.dataLabelMaxHeight.positive, event.size.height);
        }
        if (groupIndex === this.results.length - 1) {
            setTimeout(function () { return _this.update(); });
        }
    };
    BarVertical2DStackedComponent.prototype.getGroupScale = function () {
        var spacing = this.groupDomain.length / (this.dims.height / this.groupPadding + 1);
        return scaleBand()
            .rangeRound([0, this.dims.width])
            .paddingInner(spacing)
            .paddingOuter(spacing / 2)
            .domain(this.groupDomain);
    };
    BarVertical2DStackedComponent.prototype.getInnerScale = function () {
        var width = this.groupScale.bandwidth();
        var spacing = this.innerDomain.length / (width / this.barPadding + 1);
        return scaleBand()
            .rangeRound([0, width])
            .paddingInner(spacing)
            .domain(this.innerDomain);
    };
    BarVertical2DStackedComponent.prototype.getValueScale = function () {
        var scale = scaleLinear()
            .range([this.dims.height, 0])
            .domain(this.valuesStackedDomain);
        return this.roundDomains ? scale.nice() : scale;
    };
    BarVertical2DStackedComponent.prototype.getXScale = function () {
        var spacing = this.groupStackedDomain.length / (this.dims.width / this.barPadding + 1);
        return scaleBand()
            .rangeRound([0, this.dims.width])
            .paddingInner(spacing)
            .domain(this.groupStackedDomain);
    };
    BarVertical2DStackedComponent.prototype.getYScale = function () {
        var scale = scaleLinear()
            .range([this.dims.height, 0])
            .domain(this.valueDomain);
        return this.roundDomains ? scale.nice() : scale;
    };
    BarVertical2DStackedComponent.prototype.getGroupDomain = function () {
        var domain = [];
        for (var _i = 0, _a = this.results; _i < _a.length; _i++) {
            var group = _a[_i];
            if (!domain.includes(group.label)) {
                domain.push(group.label);
            }
        }
        return domain;
    };
    BarVertical2DStackedComponent.prototype.getGroupStackedDomain = function () {
        var domain = [];
        for (var _i = 0, _a = this.results; _i < _a.length; _i++) {
            var group = _a[_i];
            for (var _b = 0, _c = group.series; _b < _c.length; _b++) {
                var stack = _c[_b];
                if (!domain.includes(stack.label)) {
                    domain.push(stack.label);
                }
            }
        }
        return domain;
    };
    BarVertical2DStackedComponent.prototype.getInnerDomain = function () {
        var domain = [];
        for (var _i = 0, _a = this.results; _i < _a.length; _i++) {
            var group = _a[_i];
            for (var _b = 0, _c = group.series; _b < _c.length; _b++) {
                var d = _c[_b];
                if (!domain.includes(d.label)) {
                    domain.push(d.label);
                }
            }
        }
        return domain;
    };
    BarVertical2DStackedComponent.prototype.getInnerStackedDomain = function () {
        var domain = [];
        for (var _i = 0, _a = this.results; _i < _a.length; _i++) {
            var group = _a[_i];
            for (var _b = 0, _c = group.series; _b < _c.length; _b++) {
                var stack = _c[_b];
                for (var _d = 0, _e = stack.series; _d < _e.length; _d++) {
                    var d = _e[_d];
                    if (!domain.includes(d.label)) {
                        domain.push(d.label);
                    }
                }
            }
        }
        return domain;
    };
    BarVertical2DStackedComponent.prototype.getValueDomain = function () {
        var domain = [];
        for (var _i = 0, _a = this.results; _i < _a.length; _i++) {
            var group = _a[_i];
            for (var _b = 0, _c = group.series; _b < _c.length; _b++) {
                var d = _c[_b];
                if (!domain.includes(d.value)) {
                    domain.push(d.value);
                }
            }
        }
        var min = Math.min.apply(Math, [0].concat(domain));
        var max = this.yScaleMax ? Math.max.apply(Math, [this.yScaleMax].concat(domain)) : Math.max.apply(Math, [0].concat(domain));
        return [min, max];
    };
    BarVertical2DStackedComponent.prototype.getValueStackedDomain = function () {
        var domain = [];
        var smallest = 0;
        var biggest = 0;
        for (var _i = 0, _a = this.results; _i < _a.length; _i++) {
            var group = _a[_i];
            for (var _b = 0, _c = group.series; _b < _c.length; _b++) {
                var stack = _c[_b];
                var smallestSum = 0;
                var biggestSum = 0;
                for (var _d = 0, _e = stack.series; _d < _e.length; _d++) {
                    var d = _e[_d];
                    if (d.value < 0) {
                        smallestSum += d.value;
                    }
                    else {
                        biggestSum += d.value;
                    }
                    smallest = d.value < smallest ? d.value : smallest;
                    biggest = d.value > biggest ? d.value : biggest;
                }
                domain.push(smallestSum);
                domain.push(biggestSum);
            }
        }
        domain.push(smallest);
        domain.push(biggest);
        var min = Math.min.apply(Math, [0].concat(domain));
        var max = this.yScaleMax ? Math.max.apply(Math, [this.yScaleMax].concat(domain)) : Math.max.apply(Math, domain);
        return [min, max];
    };
    BarVertical2DStackedComponent.prototype.groupTransform = function (group) {
        return "translate(" + this.groupScale(group.label) + ", 0)";
    };
    BarVertical2DStackedComponent.prototype.onClick = function (data, group) {
        if (group) {
            data.series = group.name;
        }
        this.select.emit(data);
    };
    BarVertical2DStackedComponent.prototype.trackBy = function (index, item) {
        return item.name;
    };
    BarVertical2DStackedComponent.prototype.setColors = function () {
        var domain;
        if (this.schemeType === 'ordinal') {
            domain = this.innerDomain;
        }
        else {
            domain = this.valuesDomain;
        }
        this.colors = new ColorHelper(this.scheme, this.schemeType, domain, this.customColors);
    };
    BarVertical2DStackedComponent.prototype.getLegendOptions = function () {
        var opts = {
            scaleType: this.schemeType,
            colors: undefined,
            domain: [],
            title: undefined,
            position: this.legendPosition
        };
        if (opts.scaleType === 'ordinal') {
            opts.domain = this.innerDomain;
            opts.colors = this.colors;
            opts.title = this.legendTitle;
        }
        else {
            opts.domain = this.valuesDomain;
            opts.colors = this.colors.scale;
        }
        return opts;
    };
    BarVertical2DStackedComponent.prototype.updateYAxisWidth = function (_a) {
        var width = _a.width;
        this.yAxisWidth = width;
        this.update();
    };
    BarVertical2DStackedComponent.prototype.updateXAxisHeight = function (_a) {
        var height = _a.height;
        this.xAxisHeight = height;
        this.update();
    };
    BarVertical2DStackedComponent.prototype.onActivate = function (event, group, fromLegend) {
        if (fromLegend === void 0) { fromLegend = false; }
        var item = Object.assign({}, event);
        if (group) {
            item.series = group.name;
        }
        var items = this.results
            .map(function (g) { return g.series; })
            .flat()
            .filter(function (i) {
            if (fromLegend) {
                return i.label === item.name;
            }
            else {
                return i.name === item.name && i.series === item.series;
            }
        });
        this.activeEntries = items.slice();
        this.activate.emit({ value: item, entries: this.activeEntries });
    };
    BarVertical2DStackedComponent.prototype.onDeactivate = function (event, group, fromLegend) {
        if (fromLegend === void 0) { fromLegend = false; }
        var item = Object.assign({}, event);
        if (group) {
            item.series = group.name;
        }
        this.activeEntries = this.activeEntries.filter(function (i) {
            if (fromLegend) {
                return i.label !== item.name;
            }
            else {
                return !(i.name === item.name && i.series === item.series);
            }
        });
        this.deactivate.emit({ value: item, entries: this.activeEntries });
    };
    __decorate([
        Input(),
        __metadata("design:type", Object)
    ], BarVertical2DStackedComponent.prototype, "legend", void 0);
    __decorate([
        Input(),
        __metadata("design:type", String)
    ], BarVertical2DStackedComponent.prototype, "legendTitle", void 0);
    __decorate([
        Input(),
        __metadata("design:type", String)
    ], BarVertical2DStackedComponent.prototype, "legendPosition", void 0);
    __decorate([
        Input(),
        __metadata("design:type", Object)
    ], BarVertical2DStackedComponent.prototype, "xAxis", void 0);
    __decorate([
        Input(),
        __metadata("design:type", Object)
    ], BarVertical2DStackedComponent.prototype, "yAxis", void 0);
    __decorate([
        Input(),
        __metadata("design:type", Object)
    ], BarVertical2DStackedComponent.prototype, "showXAxisLineTop", void 0);
    __decorate([
        Input(),
        __metadata("design:type", Object)
    ], BarVertical2DStackedComponent.prototype, "showYAxisLineLeft", void 0);
    __decorate([
        Input(),
        __metadata("design:type", Object)
    ], BarVertical2DStackedComponent.prototype, "showYAxisLineRight", void 0);
    __decorate([
        Input(),
        __metadata("design:type", Object)
    ], BarVertical2DStackedComponent.prototype, "showXAxisLabel", void 0);
    __decorate([
        Input(),
        __metadata("design:type", Object)
    ], BarVertical2DStackedComponent.prototype, "showYAxisLabel", void 0);
    __decorate([
        Input(),
        __metadata("design:type", Object)
    ], BarVertical2DStackedComponent.prototype, "xAxisLabel", void 0);
    __decorate([
        Input(),
        __metadata("design:type", Object)
    ], BarVertical2DStackedComponent.prototype, "yAxisLabel", void 0);
    __decorate([
        Input(),
        __metadata("design:type", Boolean)
    ], BarVertical2DStackedComponent.prototype, "tooltipDisabled", void 0);
    __decorate([
        Input(),
        __metadata("design:type", Object)
    ], BarVertical2DStackedComponent.prototype, "scaleType", void 0);
    __decorate([
        Input(),
        __metadata("design:type", Boolean)
    ], BarVertical2DStackedComponent.prototype, "gradient", void 0);
    __decorate([
        Input(),
        __metadata("design:type", Boolean)
    ], BarVertical2DStackedComponent.prototype, "showGridLines", void 0);
    __decorate([
        Input(),
        __metadata("design:type", Array)
    ], BarVertical2DStackedComponent.prototype, "activeEntries", void 0);
    __decorate([
        Input(),
        __metadata("design:type", String)
    ], BarVertical2DStackedComponent.prototype, "schemeType", void 0);
    __decorate([
        Input(),
        __metadata("design:type", Boolean)
    ], BarVertical2DStackedComponent.prototype, "trimXAxisTicks", void 0);
    __decorate([
        Input(),
        __metadata("design:type", Boolean)
    ], BarVertical2DStackedComponent.prototype, "trimYAxisTicks", void 0);
    __decorate([
        Input(),
        __metadata("design:type", Boolean)
    ], BarVertical2DStackedComponent.prototype, "rotateXAxisTicks", void 0);
    __decorate([
        Input(),
        __metadata("design:type", Number)
    ], BarVertical2DStackedComponent.prototype, "maxXAxisTickLength", void 0);
    __decorate([
        Input(),
        __metadata("design:type", Number)
    ], BarVertical2DStackedComponent.prototype, "maxYAxisTickLength", void 0);
    __decorate([
        Input(),
        __metadata("design:type", Object)
    ], BarVertical2DStackedComponent.prototype, "xAxisTickFormatting", void 0);
    __decorate([
        Input(),
        __metadata("design:type", Object)
    ], BarVertical2DStackedComponent.prototype, "yAxisTickFormatting", void 0);
    __decorate([
        Input(),
        __metadata("design:type", Array)
    ], BarVertical2DStackedComponent.prototype, "xAxisTicks", void 0);
    __decorate([
        Input(),
        __metadata("design:type", Array)
    ], BarVertical2DStackedComponent.prototype, "yAxisTicks", void 0);
    __decorate([
        Input(),
        __metadata("design:type", Object)
    ], BarVertical2DStackedComponent.prototype, "groupPadding", void 0);
    __decorate([
        Input(),
        __metadata("design:type", Object)
    ], BarVertical2DStackedComponent.prototype, "barPadding", void 0);
    __decorate([
        Input(),
        __metadata("design:type", Boolean)
    ], BarVertical2DStackedComponent.prototype, "roundDomains", void 0);
    __decorate([
        Input(),
        __metadata("design:type", Boolean)
    ], BarVertical2DStackedComponent.prototype, "roundEdges", void 0);
    __decorate([
        Input(),
        __metadata("design:type", Number)
    ], BarVertical2DStackedComponent.prototype, "barWidth", void 0);
    __decorate([
        Input(),
        __metadata("design:type", Number)
    ], BarVertical2DStackedComponent.prototype, "yScaleMax", void 0);
    __decorate([
        Input(),
        __metadata("design:type", Boolean)
    ], BarVertical2DStackedComponent.prototype, "showDataLabel", void 0);
    __decorate([
        Input(),
        __metadata("design:type", Object)
    ], BarVertical2DStackedComponent.prototype, "dataLabelFormatting", void 0);
    __decorate([
        Input(),
        __metadata("design:type", Boolean)
    ], BarVertical2DStackedComponent.prototype, "noBarWhenZero", void 0);
    __decorate([
        Output(),
        __metadata("design:type", EventEmitter)
    ], BarVertical2DStackedComponent.prototype, "activate", void 0);
    __decorate([
        Output(),
        __metadata("design:type", EventEmitter)
    ], BarVertical2DStackedComponent.prototype, "deactivate", void 0);
    __decorate([
        ContentChild('tooltipTemplate', { static: false }),
        __metadata("design:type", TemplateRef)
    ], BarVertical2DStackedComponent.prototype, "tooltipTemplate", void 0);
    BarVertical2DStackedComponent = __decorate([
        Component({
            selector: 'ngx-charts-bar-vertical-2d-stacked',
            template: "\n    <ngx-charts-chart\n      [view]=\"[width, height]\"\n      [showLegend]=\"legend\"\n      [legendOptions]=\"legendOptions\"\n      [activeEntries]=\"activeEntries\"\n      [animations]=\"animations\"\n      (legendLabelActivate)=\"onActivate($event, undefined, true)\"\n      (legendLabelDeactivate)=\"onDeactivate($event, undefined, true)\"\n      (legendLabelClick)=\"onClick($event)\"\n    >\n      <svg:g [attr.transform]=\"transform\" class=\"bar-chart chart\">\n        <svg:g\n          ngx-charts-grid-panel-series\n          [xScale]=\"groupScale\"\n          [yScale]=\"valueScale\"\n          [data]=\"results\"\n          [dims]=\"dims\"\n          orient=\"vertical\"\n        ></svg:g>\n        <svg:g\n          ngx-charts-x-axis\n          *ngIf=\"xAxis\"\n          [xScale]=\"groupScale\"\n          [dims]=\"dims\"\n          [showLabel]=\"showXAxisLabel\"\n          [showXAxisLineTop]=\"showXAxisLineTop\"\n          [labelText]=\"xAxisLabel\"\n          [trimTicks]=\"trimXAxisTicks\"\n          [rotateTicks]=\"rotateXAxisTicks\"\n          [maxTickLength]=\"maxXAxisTickLength\"\n          [tickFormatting]=\"xAxisTickFormatting\"\n          [ticks]=\"xAxisTicks\"\n          [xAxisOffset]=\"dataLabelMaxHeight.negative\"\n          (dimensionsChanged)=\"updateXAxisHeight($event)\"\n        ></svg:g>\n        <svg:g\n          ngx-charts-y-axis\n          *ngIf=\"yAxis\"\n          [yScale]=\"valueScale\"\n          [dims]=\"dims\"\n          [showYAxisLineLeft]=\"showYAxisLineLeft\"\n          [showYAxisLineRight]=\"showYAxisLineRight\"\n          [showGridLines]=\"showGridLines\"\n          [showLabel]=\"showYAxisLabel\"\n          [labelText]=\"yAxisLabel\"\n          [trimTicks]=\"trimYAxisTicks\"\n          [maxTickLength]=\"maxYAxisTickLength\"\n          [tickFormatting]=\"yAxisTickFormatting\"\n          [ticks]=\"yAxisTicks\"\n          (dimensionsChanged)=\"updateYAxisWidth($event)\"\n        ></svg:g>\n        <svg:g\n          *ngFor=\"let group of results; let index = index; trackBy: trackBy\"\n          [attr.transform]=\"groupTransform(group)\"\n        >\n          <svg:g\n          *ngFor=\"let stack of group.series; let index = index; trackBy: trackBy\"\n          [@animationState]=\"'active'\"\n          >\n            <svg:g\n              ngx-charts-series-vertical\n              type=\"stacked\"\n              [@animationState]=\"'active'\"\n              [activeEntries]=\"activeEntries\"\n              [xScale]=\"groupScale\"\n              [yScale]=\"valueScale\"\n              [colors]=\"colors\"\n              [series]=\"stack.series\"\n              [dims]=\"dims\"\n              [gradient]=\"gradient\"\n              [tooltipDisabled]=\"tooltipDisabled\"\n              [tooltipTemplate]=\"tooltipTemplate\"\n              [showDataLabel]=\"showDataLabel\"\n              [dataLabelFormatting]=\"dataLabelFormatting\"\n              [seriesName]=\"stack.name\"\n              [stackNumber]=\"index\"\n              [stackCount]=\"group.series.length\"\n              [roundEdges]=\"roundEdges\"\n              [barWidth]=\"10\"\n              [animations]=\"animations\"\n              [noBarWhenZero]=\"noBarWhenZero\"\n              (select)=\"onClick($event, group)\"\n              (activate)=\"onActivate($event, group)\"\n              (deactivate)=\"onDeactivate($event, group)\"\n              (dataLabelHeightChanged)=\"onDataLabelMaxHeightChanged($event, index)\"\n            />\n          </svg:g>\n        </svg:g>\n      </svg:g>\n    </ngx-charts-chart>\n  ",
            styleUrls: ['../common/base-chart.component.css'],
            encapsulation: ViewEncapsulation.None,
            changeDetection: ChangeDetectionStrategy.OnPush,
            animations: [
                trigger('animationState', [
                    transition(':leave', [
                        style({
                            opacity: 1,
                            transform: '*'
                        }),
                        animate(500, style({ opacity: 0, transform: 'scale(0)' }))
                    ])
                ])
            ]
        })
    ], BarVertical2DStackedComponent);
    return BarVertical2DStackedComponent;
}(BaseChartComponent));
export { BarVertical2DStackedComponent };
//# sourceMappingURL=bar-vertical-2d-stacked.component.js.map
import {
  Component,
  Input,
  Output,
  ViewEncapsulation,
  EventEmitter,
  ChangeDetectionStrategy,
  ContentChild,
  TemplateRef
} from '@angular/core';
import { trigger, style, animate, transition } from '@angular/animations';
import { scaleBand, scaleLinear } from 'd3-scale';

import { calculateViewDimensions, ViewDimensions } from '../common/view-dimensions.helper';
import { ColorHelper } from '../common/color.helper';
import { BaseChartComponent } from '../common/base-chart.component';
import {ScaleType} from '../utils/scale-type.enum';
import {LegendPosition} from '../common/legend/legend-position.enum';

@Component({
  selector: 'ngx-charts-bar-vertical-2d-stacked',
  template: `
    <ngx-charts-chart
      [view]="[width, height]"
      [showLegend]="legend"
      [legendOptions]="legendOptions"
      [activeEntries]="activeEntries"
      [animations]="animations"
      (legendLabelActivate)="onActivate($event, undefined, true)"
      (legendLabelDeactivate)="onDeactivate($event, undefined, true)"
      (legendLabelClick)="onClick($event)"
    >
      <svg:g [attr.transform]="transform" class="bar-chart chart">
        <svg:g
          ngx-charts-grid-panel-series
          [xScale]="groupScale"
          [yScale]="valueScale"
          [data]="results"
          [dims]="dims"
          orient="vertical"
        ></svg:g>
        <svg:g
          ngx-charts-x-axis
          *ngIf="xAxis"
          [xScale]="groupScale"
          [dims]="dims"
          [showLabel]="showXAxisLabel"
          [showXAxisLineTop]="showXAxisLineTop"
          [labelText]="xAxisLabel"
          [trimTicks]="trimXAxisTicks"
          [xOrient]="'top'"
          [rotateTicks]="rotateXAxisTicks"
          [maxTickLength]="maxXAxisTickLength"
          [tickFormatting]="xAxisTickFormatting"
          [ticks]="xAxisTicks"
          [xAxisOffset]="dataLabelMaxHeight.negative + 40"
          (dimensionsChanged)="updateXAxisHeight($event)"
        ></svg:g>
        <svg:g
          ngx-charts-y-axis
          *ngIf="yAxis"
          [yScale]="valueScale"
          [dims]="dims"
          [showYAxisLineLeft]="showYAxisLineLeft"
          [showYAxisLineRight]="showYAxisLineRight"
          [showGridLines]="showGridLines"
          [showLabel]="showYAxisLabel"
          [labelText]="yAxisLabel"
          [trimTicks]="trimYAxisTicks"
          [maxTickLength]="maxYAxisTickLength"
          [tickFormatting]="yAxisTickFormatting"
          [ticks]="yAxisTicks"
          (dimensionsChanged)="updateYAxisWidth($event)"
        ></svg:g>
        <svg:g
          *ngFor="let group of results; let index = index; trackBy: trackBy"
          [attr.transform]="groupTransform(group)"
        >
          <svg:g
            ngx-charts-x-axis
            *ngIf="xAxis"
            [xScale]="innerScale"
            [dims]="innerDims"
            [showLabel]="false"
            [trimTicks]="true"
            [rotateTicks]="true"
            [xOrient]="'bottom'"
            [xAxisTickInterval]=""
            [maxTickLength]="maxXAxisTickLength"
            [tickFormatting]="xAxisTickFormatting"
            [ticks]="xAxisTicks"
            [forcedRotationAngle]="300"
            [attr.transform]="groupLabelTransform(group)"
            [xAxisOffset]="dataLabelMaxHeight.negative"
            (dimensionsChanged)="updateXAxisHeight($event)"
          ></svg:g>
          <svg:g
          *ngFor="let stack of group.series; let index = index; trackBy: trackBy"
          [@animationState]="'active'"
          >
            <svg:g
              ngx-charts-series-vertical
              type="stacked"
              [@animationState]="'active'"
              [activeEntries]="activeEntries"
              [xScale]="groupScale"
              [yScale]="valueScale"
              [colors]="colors"
              [series]="stack.series"
              [dims]="dims"
              [gradient]="gradient"
              [tooltipDisabled]="tooltipDisabled"
              [tooltipTemplate]="tooltipTemplate"
              [showDataLabel]="showDataLabel"
              [dataLabelFormatting]="dataLabelFormatting"
              [seriesName]="stack.name"
              [stackNumber]="index"
              [stackCount]="group.series.length"
              [roundEdges]="roundEdges"
              [barWidth]="barWidth"
              [animations]="animations"
              [noBarWhenZero]="noBarWhenZero"
              (select)="onClick($event, group)"
              (activate)="onActivate($event, group)"
              (deactivate)="onDeactivate($event, group)"
              (dataLabelHeightChanged)="onDataLabelMaxHeightChanged($event, index)"
            />
          </svg:g>
        </svg:g>
      </svg:g>
    </ngx-charts-chart>
  `,
  styleUrls: ['../common/base-chart.component.scss'],
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
export class BarVertical2DStackedComponent extends BaseChartComponent {
  @Input() legend = false;
  @Input() legendTitle: string = 'Legend';
  @Input() legendPosition = LegendPosition.right;
  @Input() xAxis;
  @Input() yAxis;
  @Input() showXAxisLineTop;
  @Input() showYAxisLineLeft;
  @Input() showYAxisLineRight;
  @Input() showXAxisLabel;
  @Input() showYAxisLabel;
  @Input() xAxisLabel;
  @Input() yAxisLabel;
  @Input() tooltipDisabled: boolean = false;
  @Input() scaleType = 'ordinal';
  @Input() gradient: boolean;
  @Input() showGridLines: boolean = true;
  @Input() activeEntries: any[] = [];
  @Input() schemeType: ScaleType;
  @Input() trimXAxisTicks: boolean = true;
  @Input() trimYAxisTicks: boolean = true;
  @Input() rotateXAxisTicks: boolean = true;
  @Input() maxXAxisTickLength: number = 16;
  @Input() maxYAxisTickLength: number = 16;
  @Input() xAxisTickFormatting: any;
  @Input() yAxisTickFormatting: any;
  @Input() xAxisTicks: any[];
  @Input() xAxisStackedTicks: any[];
  @Input() yAxisTicks: any[];
  @Input() groupPadding = 16;
  @Input() barPadding = 8;
  @Input() roundDomains: boolean = false;
  @Input() roundEdges: boolean = true;
  @Input() barWidth: number;
  @Input() yScaleMax: number;
  @Input() showDataLabel: boolean = false;
  @Input() dataLabelFormatting: any;
  @Input() noBarWhenZero: boolean = true;

  @Output() activate: EventEmitter<any> = new EventEmitter();
  @Output() deactivate: EventEmitter<any> = new EventEmitter();

  @ContentChild('tooltipTemplate', { static: false }) tooltipTemplate: TemplateRef<any>;

  dims: ViewDimensions;
  innerDims: ViewDimensions;
  innerChartWidth: number;
  groupDomain: any[];
  groupStackedDomain: any[];
  innerDomain: any[];
  innerStackedDomain: any[];
  valuesDomain: any[];
  valuesStackedDomain: any[];
  valueDomain: any[];
  xScale: any;
  yScale: any;
  groupScale: any;
  innerScale: any;
  valueScale: any;
  transform: string;
  colors: ColorHelper;
  margin = [10, 20, 10, 20];
  xAxisHeight: number = 0;
  yAxisWidth: number = 0;
  legendOptions: any;
  dataLabelMaxHeight: any = { negative: 0, positive: 0 };

  update(): void {
    super.update();

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

    this.innerDims = calculateViewDimensions({
      // TODO: FIX HERE
      width: this.width / 3,
      height: this.height,
      margins: [10, 20, 10, 20],
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
    this.transform = `translate(${this.dims.xOffset} , ${this.margin[0] + this.dataLabelMaxHeight.negative})`;
  }

  onDataLabelMaxHeightChanged(event, groupIndex) {
    if (event.size.negative) {
      this.dataLabelMaxHeight.negative = Math.max(this.dataLabelMaxHeight.negative, event.size.height);
    } else {
      this.dataLabelMaxHeight.positive = Math.max(this.dataLabelMaxHeight.positive, event.size.height);
    }
    if (groupIndex === this.results.length - 1) {
      setTimeout(() => this.update());
    }
  }

  getGroupScale(): any {
    const spacing = this.groupDomain.length / (this.dims.height / this.groupPadding);

    return scaleBand()
      .rangeRound([0, this.dims.width])
      .paddingInner(spacing)
      .paddingOuter(spacing / 2)
      .domain(this.groupDomain);
  }

  getInnerScale(): any {
    // TODO: FIX HERE
    this.innerChartWidth = this.groupScale.bandwidth();

    const spacing = this.innerDomain.length / (this.innerChartWidth / this.barPadding + 1);
    return scaleBand()
      .rangeRound([0, this.innerChartWidth ])
      .paddingOuter(this.innerChartWidth - ((this.barWidth + this.barPadding) * 6))
      .domain(this.innerDomain);
  }

  getValueScale(): any {
    const scale = scaleLinear()
      .range([this.dims.height, 0])
      .domain(this.valuesStackedDomain);
    return this.roundDomains ? scale.nice() : scale;
  }

  getXScale(): any {
    const spacing = this.groupStackedDomain.length / (this.dims.width / this.barPadding + 1);
    return scaleBand()
      .rangeRound([0, this.dims.width])
      .paddingInner(spacing)
      .domain(this.groupStackedDomain);
  }

  getYScale(): any {
    const scale = scaleLinear()
      .range([this.dims.height, 0])
      .domain(this.valueDomain);
    return this.roundDomains ? scale.nice() : scale;
  }

  getGroupDomain() {
    const domain = [];
    for (const group of this.results) {
      if (!domain.includes(group.label)) {
        domain.push(group.label);
      }
    }

    return domain;
  }

  getGroupStackedDomain() {
    const domain = [];

    for (const group of this.results) {
      for(const stack of group.series) {

        if (!domain.includes(stack.label)) {
          domain.push(stack.label);
        }
      }
    }
    return domain;
  }

  getInnerDomain() {
    const domain = [];
    for (const group of this.results) {
      for (const d of group.series) {
        if (!domain.includes(d.label)) {
          domain.push(d.label);
        }
      }
    }

    return domain;
  }

  getInnerStackedDomain() {
    const domain = [];

    for (const group of this.results) {
      for(const stack of group.series) {
        for (const d of stack.series) {
          if (!domain.includes(d.name)) {
            domain.push(d.name);
          }
        }
      }
    }
    return domain;
  }

  getValueDomain() {
    const domain = [];
    for (const group of this.results) {
      for (const d of group.series) {
        if (!domain.includes(d.value)) {
          domain.push(d.value);
        }
      }
    }

    const min = Math.min(0, ...domain);
    const max = this.yScaleMax ? Math.max(this.yScaleMax, ...domain) : Math.max(0, ...domain);

    return [min, max];
  }

  getValueStackedDomain() {
    const domain = [];
    let smallest = 0;
    let biggest = 0;

    for (const group of this.results) {

      for(const stack of group.series) {

        let smallestSum = 0;
        let biggestSum = 0;

        for (const d of stack.series) {

          if (d.value < 0) {
            smallestSum += d.value;
          } else {
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

    const min = Math.min(0, ...domain);
    const max = this.yScaleMax ? Math.max(this.yScaleMax, ...domain) : Math.max(...domain);
    return [min, max];
  }

  groupTransform(group) {
    const scale = this.groupScale(group.label);
    return `translate(${scale}, 0)`;
  }

  groupLabelTransform(group) {
    return `translate(${this.margin[0]}, 0)`;
  }

  onClick(data, group?) {
    if (group) {
      data.series = group.name;
    }

    this.select.emit(data);
  }

  trackBy(index, item) {
    return item.name;
  }

  setColors(): void {
    let domain;
    if (this.schemeType === 'ordinal') {
      domain = this.innerStackedDomain;
    } else {
      domain = this.innerDomain;
    }

    this.colors = new ColorHelper(this.scheme, this.schemeType, domain, this.customColors);
  }

  getLegendOptions() {
    const opts = {
      scaleType: this.schemeType,
      colors: undefined,
      domain: [],
      title: undefined,
      position: this.legendPosition
    };
    if (opts.scaleType === 'ordinal') {
      opts.domain = this.innerStackedDomain;
      opts.colors = this.colors;
      opts.title = this.legendTitle;
    } else {
      opts.domain = this.valuesDomain;
      opts.colors = this.colors.scale;
    }

    return opts;
  }

  updateYAxisWidth({ width }) {
    this.yAxisWidth = width;
    this.update();
  }

  updateXAxisHeight({ height }) {
    this.xAxisHeight = height;
    this.update();
  }

  onActivate(event, group, fromLegend = false) {
    const item = Object.assign({}, event);
    if (group) {
      item.series = group.name;
    }

    const items = this.results
      .map(g => g.series)
      .flat();
      // .filter(i => {
      //   if (fromLegend) {
      //     return i.label === item.name;
      //   } else {
      //     return i.name === item.name && i.series === item.series;
      //   }
      // });

    this.activeEntries = [...items];
    this.activate.emit({ value: item, entries: this.activeEntries });
  }

  onDeactivate(event, group, fromLegend = false) {
    const item = Object.assign({}, event);
    if (group) {
      item.series = group.name;
    }

    this.activeEntries = this.activeEntries.filter(i => {
      if (fromLegend) {
        return i.label !== item.name;
      } else {
        return !(i.name === item.name && i.series === item.series);
      }
    });

    this.deactivate.emit({ value: item, entries: this.activeEntries });
  }
}

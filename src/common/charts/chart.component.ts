import {
  Component, Input, OnChanges, ViewContainerRef, ChangeDetectionStrategy, EventEmitter,
  Output, SimpleChanges
} from '@angular/core';
import {
  trigger,
  style,
  animate,
  transition
} from '@angular/animations';
import { TooltipService } from '../tooltip';
import { LegendType } from '../../common/legend/legend-type.enum';
import { LegendOptions } from '../legend/legend-options';

@Component({
  providers: [TooltipService],
  selector: 'ngx-charts-chart',
  template: `
    <div
      class="ngx-charts-outer"
      [style.width.px]="view[0]"
      [@animationState]="'active'"
      [@.disabled]="!animations">
      <svg
        class="ngx-charts"
        [attr.width]="chartWidth"
        [attr.height]="view[1]">
        <ng-content></ng-content>
      </svg>
      <ngx-charts-scale-legend
        *ngIf="showLegend && legendType === 'scaleLegend'"
        class="chart-legend"
        [horizontal]="legendOptions && legendOptions.position === 'below'"
        [valueRange]="legendOptions.domain"
        [colors]="legendOptions.colors"
        [height]="view[1]"
        [width]="legendWidth">
      </ngx-charts-scale-legend>
      <ngx-charts-legend
        *ngIf="showLegend && legendType === 'legend'"
        class="chart-legend"
        [horizontal]="legendOptions && legendOptions.position === 'below'"
        [data]="legendOptions.domain"
        [valuedata]="valuedata"
        [title]="legendOptions.title"
        [colors]="legendOptions.colors"
        [height]="view[1]"
        [width]="legendWidth"
        [activeEntries]="activeEntries"
        (labelClick)="legendLabelClick.emit($event)"
        (labelActivate)="legendLabelActivate.emit($event)"
        (labelDeactivate)="legendLabelDeactivate.emit($event)">
      </ngx-charts-legend>
      <ngx-charts-advanced-legend
        *ngIf="legendAdvanced"
        [data]="advancedData"
        [height]="view[1]"
        [width]="legendWidth"
        [colors]="legendOptions.colors"
        [label]="label"
        [animations]="animations"
        [valueFormatting]="valueFormatting"
        [labelFormatting]="nameFormatting"
        [percentageFormatting]="percentageFormatting"
        (select)="legendLabelClick.emit($event)"
        (activate)="legendLabelActivate.emit($event)"
        (deactivate)="legendLabelDeactivate.emit($event)"
      >
      </ngx-charts-advanced-legend>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    trigger('animationState', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('500ms 100ms', style({ opacity: 1 }))
      ])
    ])
  ]
})
export class ChartComponent implements OnChanges {

  @Input() view: [number, number];
  @Input() showLegend = false;
  @Input() legendOptions: any;
  @Input() legendAdvanced: boolean = false;

  // remove
  @Input() data;
  @Input() valuedata;
  @Input() advancedData;
  @Input() legendData;
  @Input() legendType: LegendType;
  @Input() colors: any;
  @Input() activeEntries: any[];
  @Input() animations: boolean = true;

  @Output() legendLabelClick: EventEmitter<any> = new EventEmitter();
  @Output() legendLabelActivate: EventEmitter<any> = new EventEmitter();
  @Output() legendLabelDeactivate: EventEmitter<any> = new EventEmitter();

  chartWidth: any;
  title: any;
  legendWidth: any;

  constructor(
    private vcr: ViewContainerRef,
    private tooltipService: TooltipService) {
    this.tooltipService.injectionService.setRootViewContainer(this.vcr);
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.update();
  }

  update(): void {
    let legendColumns = 0;
    if (this.showLegend || this.advancedData) {
      this.legendType = this.getLegendType();

      if (!this.legendOptions || this.legendOptions.position === 'right') {
        if (this.legendType === 'scaleLegend') {
          legendColumns = 1;
        } else {
          legendColumns = 2;
        }
      }
    }

    const chartColumns = 12 - legendColumns;

    this.chartWidth = Math.max(0, Math.floor((this.view[0] * chartColumns / 12.0)));
    this.legendWidth = (!this.legendOptions || this.legendOptions.position === 'right' || this.legendAdvanced)
      ? Math.floor((this.view[0] * legendColumns / 12.0))
      : this.chartWidth;
  }

  getLegendType(): LegendType {
    if (this.legendOptions.scaleType === 'linear') {
      return LegendType.scaleLegend;
    } else {
      return LegendType.legend;
    }
  }

}

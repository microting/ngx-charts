import { EventEmitter, ElementRef, OnChanges } from '@angular/core';
export declare class TreeMapCellComponent implements OnChanges {
    data: any;
    fill: any;
    x: any;
    y: any;
    width: any;
    height: any;
    label: any;
    value: any;
    valueType: any;
    valueFormatting: any;
    labelFormatting: any;
    gradient: boolean;
    animations: boolean;
    showLabel: boolean;
    pointerEvents: boolean;
    isActive: boolean;
    select: EventEmitter<{}>;
    activate: EventEmitter<{}>;
    deactivate: EventEmitter<{}>;
    gradientStops: any[];
    gradientId: string;
    gradientUrl: string;
    element: HTMLElement;
    transform: string;
    formattedLabel: string;
    formattedValue: string;
    initialized: boolean;
    constructor(element: ElementRef);
    ngOnChanges(): void;
    update(): void;
    loadAnimation(): void;
    getPointerEvents(): "auto" | "none";
    getTextColor(): string;
    animateToCurrentForm(): void;
    onClick(): void;
    getGradientStops(): {
        offset: number;
        color: any;
        opacity: number;
    }[];
}

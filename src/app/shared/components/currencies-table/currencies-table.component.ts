import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-currencies-table',
  templateUrl: './currencies-table.component.html',
  styleUrls: ['./currencies-table.component.scss'],
})
export class CurrenciesTableComponent {
  @Input() header1: string = '';
  @Input() header2: string = '';
  @Input() header3: string = '';
  @Input() fromInput:any[] = [];
  @Input() data: any[] = [];
  @Input() amount!: number;
  @Input() devideValue!: number[];
  @Input() muliValue!: number[];
}

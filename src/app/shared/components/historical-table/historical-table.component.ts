import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-historical-table',
  templateUrl: './historical-table.component.html',
  styleUrls: ['./historical-table.component.scss'],
})
export class HistoricalTableComponent {
  @Input() fromKey: string = '';
  @Input() toKey: string = '';

  @Input() convertedAmountInLastDay!: number;
  @Input() convertedAmountInLastMonth!: number;
  @Input() convertedAmountInLastYear!: number;

  @Input() sameDayLastMonth!: string;
  @Input() sameDayLastYear!: string;
  @Input() yesterday!: string;
}

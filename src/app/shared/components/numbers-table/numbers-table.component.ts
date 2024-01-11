import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-numbers-table',
  templateUrl: './numbers-table.component.html',
  styleUrls: ['./numbers-table.component.scss'],
})
export class NumbersTableComponent {
  @Input() header1: string = '';
  @Input() header2: string = '';
  @Input() data: any[] = [];
  @Input() devideValue!: number;
  @Input() muliValue!: number;
}

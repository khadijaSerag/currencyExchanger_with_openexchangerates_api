import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SelectComponent } from './components/select/select.component';
import { FormsModule } from '@angular/forms';
import { NumbersTableComponent } from './components/numbers-table/numbers-table.component';
import { CurrenciesTableComponent } from './components/currencies-table/currencies-table.component';
import { HistoricalTableComponent } from './components/historical-table/historical-table.component';



@NgModule({
  declarations: [
    SelectComponent,
    NumbersTableComponent,
    CurrenciesTableComponent,
    HistoricalTableComponent
  ],
  imports: [
    CommonModule,
    FormsModule
  ],
  exports:[
    SelectComponent,
    NumbersTableComponent,
    CurrenciesTableComponent,
    HistoricalTableComponent
  ]
})
export class SharedModule { }

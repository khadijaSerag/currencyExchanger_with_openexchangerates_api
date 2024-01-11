import { Component, OnInit } from '@angular/core';
import { CurrenciesConvertService } from '../shared/services/currencies-convert.service';
import { Rates } from '../shared/models/rates.interface';

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.scss'],
})
export class DetailsComponent implements OnInit {
  amount!: number;
  from!: string;
  to!: string;
  fromCode!: string;
  toCode!: string;
  converted!: number;

  fromRate: number[] = [];
  toRate: number[] = [];

  exchangeRates: any;

  staticToCurrencies: any[];
  staticFromCurrencies: any[];

  convertedAmountLastDay!: number;
  convertedAmountLastMonth!: number;
  convertedAmountLastYear!: number;

  currentDate: Date = new Date();
  rates!: number;

  loading: boolean = false;

  constructor(private currenciesService: CurrenciesConvertService) {
    // Use in Currency-converter component
    this.amount = this.currenciesService.amountValue;
    this.from = this.currenciesService.fromValue;
    this.to = this.currenciesService.toValue;
    this.converted = this.currenciesService.convertedAmountValue;

    // Use in Currencies-table shared
    this.fromCode = this.currenciesService.fromKey;
    this.staticToCurrencies = ['EGP', 'EUR', 'AUD'];
    this.staticFromCurrencies = [this.fromCode, this.fromCode, this.fromCode];

    this.toCode = this.currenciesService.toKey;
  }

  ngOnInit() {
    this.getRates();
    this.getHistoricalRates();
  }

  // Get rates to calculate the converted amount in staticToCurrencies
  getRates() {
    this.loading = true;
    let latestRates: Rates;
    this.currenciesService.getLatestRates().subscribe((data: any) => {
      latestRates = data;
      this.exchangeRates = latestRates.rates;
      this.rateValues();
      this.loading = false;
    });
  }

  // Loop in staticToCurrencies list
  rateValues() {
    for (let i = 0; i <= this.staticToCurrencies.length; i++) {
      this.fromRate.push(this.exchangeRates[this.fromCode]);
      this.toRate.push(this.exchangeRates[this.staticToCurrencies[i]]);
    }
  }

  // Bring the rates to last day,month and year date
  getHistoricalRates() {
    let historicalRates: any;
    let fromRate: any;
    let toRate: any;
    this.loading = true;

    // Same day last month
    let sameDayLastMonth: string = new Date(
      this.currentDate.getFullYear(),
      this.currentDate.getMonth(),
      0
    )
      .toISOString()
      .split('T')[0];

    this.currenciesService
      .getAllHistoricalRates(sameDayLastMonth)
      .subscribe((res: any) => {
        historicalRates = res.rates;
        fromRate = historicalRates[this.fromCode];
        toRate = historicalRates[this.toCode];
        this.convertedAmountLastMonth = (this.amount / fromRate) * toRate;
        this.loading = false;
      });

    // Same day last year
    let sameDayLastYear: string = new Date(
      this.currentDate.getFullYear() - 1,
      this.currentDate.getMonth(),
      this.currentDate.getDate()
    )
      .toISOString()
      .split('T')[0];

    this.currenciesService
      .getAllHistoricalRates(sameDayLastYear)
      .subscribe((res: any) => {
        historicalRates = res.rates;
        fromRate = historicalRates[this.fromCode];
        toRate = historicalRates[this.toCode];
        this.convertedAmountLastYear = (this.amount / fromRate) * toRate;
        this.loading = false;
      });

    // Yesterday
    let yesterday: string = new Date(
      this.currentDate.getFullYear(),
      this.currentDate.getMonth(),
      this.currentDate.getDate() - 1
    )
      .toISOString()
      .split('T')[0];
    this.currenciesService
      .getAllHistoricalRates(yesterday)
      .subscribe((res: any) => {
        historicalRates = res.rates;
        fromRate = historicalRates[this.fromCode];
        toRate = historicalRates[this.toCode];
        this.convertedAmountLastDay = (this.amount / fromRate) * toRate;
        this.loading = false;
      });
  }
}

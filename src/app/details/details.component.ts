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

  sameDayLastMonth: string = '';
  sameDayLastYear: string = '';
  yesterday: string = '';

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

    // Same day last month
    this.sameDayLastMonth = new Date(
      this.currentDate.getFullYear(),
      this.currentDate.getMonth() - 1,
      this.currentDate.getDate() + 1
    )
      .toISOString()
      .split('T')[0];

    this.currenciesService
      .getAllHistoricalRates(this.sameDayLastMonth)
      .subscribe((res: any) => {
        console.log('sameDayLastMonth', this.sameDayLastMonth);
        historicalRates = res.rates;
        fromRate = historicalRates[this.fromCode];
        toRate = historicalRates[this.toCode];
        this.convertedAmountLastMonth = (this.amount / fromRate) * toRate;
      });

    // Same day last year
    this.sameDayLastYear = new Date(
      this.currentDate.getFullYear() - 1,
      this.currentDate.getMonth(),
      this.currentDate.getDate() + 1
    )
      .toISOString()
      .split('T')[0];

    this.currenciesService
      .getAllHistoricalRates(this.sameDayLastYear)
      .subscribe((res: any) => {
        console.log('sameDayLastYear', this.sameDayLastYear);
        historicalRates = res.rates;
        fromRate = historicalRates[this.fromCode];
        toRate = historicalRates[this.toCode];
        this.convertedAmountLastYear = (this.amount / fromRate) * toRate;
      });

    // Yesterday
    this.yesterday = new Date(
      this.currentDate.getFullYear(),
      this.currentDate.getMonth(),
      this.currentDate.getDate()
    )
      .toISOString()
      .split('T')[0];
    this.currenciesService
      .getAllHistoricalRates(this.yesterday)
      .subscribe((res: any) => {
        console.log('yes', this.yesterday);
        historicalRates = res.rates;
        fromRate = historicalRates[this.fromCode];
        toRate = historicalRates[this.toCode];
        this.convertedAmountLastDay = (this.amount / fromRate) * toRate;
      });
  }
}

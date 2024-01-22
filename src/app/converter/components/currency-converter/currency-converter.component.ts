import { Component, Input, OnInit } from '@angular/core';
import { CurrenciesConvertService } from '../../../shared/services/currencies-convert.service';
import { Currencies } from 'src/app/shared/models/currencies.interface';
import { Rates } from 'src/app/shared/models/rates.interface';

@Component({
  selector: 'app-currency-converter',
  templateUrl: './currency-converter.component.html',
  styleUrls: ['./currency-converter.component.scss'],
})
export class CurrencyConverterComponent implements OnInit {
  currenciesCode: string[] = [];

  @Input() amount!: number;

  @Input() fromCurrency!: string;
  @Input() toCurrency!: string;
  @Input() convertedAmount: any;

  @Input() isHome: boolean = true;

  exchangeRates: any;

  fromRate!: number;
  toRate!: number;

  staticAmounts = [1, 10, 50, 100, 1000];

  currencies: any;
  loading: boolean = false;

  constructor(private currenciesService: CurrenciesConvertService) {}

  ngOnInit() {
    this.getCurrencies();
    this.getRates();

    // when click on button backToHome continue save the same data that in datails to show in home again
    // save the data to show [ from details(parent) to home (child) ] so that I used @Input
    // but when I want to save and show data from [ home (child) to datails (parent) ] i use the variables in service
    if (this.isHome) {
      this.fromCurrency = this.currenciesService.fromKey
        ? this.currenciesService.fromKey
        : 'From';
      this.toCurrency = this.currenciesService.toKey
        ? this.currenciesService.toKey
        : 'To';
      this.amount = this.currenciesService.amountValue;
      this.convertedAmount = this.currenciesService.convertedAmountValue;
      this.fromRate = this.currenciesService.fromRateValue;
      this.toRate = this.currenciesService.toRateValue;
    }
  }

  // Detect the changes in FromCurrency selected option
  onSelectFromCurrency(event: any) {
    this.fromCurrency = event.target.value;
    this.fromRate = this.exchangeRates[this.fromCurrency];
    this.convertedAmount = null;
    this.updateServiceValues();
  }

  // Detect the changes in ToCurrency selected option
  onSelectToCurrency(event: any) {
    this.toCurrency = event.target.value;
    this.toRate = this.exchangeRates[this.toCurrency];

    this.convertedAmount = null;
    this.updateServiceValues();
  }

  // Detect the changes in amount input and empty the convertedAmount display input
  onKeyUp() {
    this.convertedAmount = null;
    this.currenciesService.amountValue = this.amount; // Update service amount to be used in details page
    this.updateServiceValues();
  }

  // Get all keys and values from api object in selected option value
  getCurrencies() {
    this.loading = true;
    this.currenciesService.getAllCurrencies().subscribe((res: any) => {
      this.currencies = res;
      this.loading = false;
      if (this.isHome) {
        this.currenciesCode = Object.keys(this.currencies);
      } else {
        this.currenciesCode = Object.values(this.currencies);
      }
    });
  }

  // Get all rates in api latest to use in OnConvertCurrency method(calculate the convertedAmount value)
  getRates() {
    this.loading = true;
    let latestRates: Rates;
    this.currenciesService.getLatestRates().subscribe((data: any) => {
      latestRates = data;
      this.exchangeRates = latestRates.rates;
      this.loading = false;
    });
  }

  // Calculate the convertedAmount value and display the result
  onConvertCurrency() {
    this.fromRate = this.exchangeRates[this.fromCurrency];
    this.toRate = this.exchangeRates[this.toCurrency];
    this.convertedAmount = (this.amount / this.fromRate) * this.toRate;
    this.currenciesService.convertedAmountValue = this.convertedAmount; // Update service convertedAmountValue to be used in details page
  }

  // Make swap button
  swapValues() {
    const temp = this.fromCurrency;
    this.fromCurrency = this.toCurrency;
    this.toCurrency = temp;

    this.updateServiceValues();
    this.onConvertCurrency();
  }

  // Update shared service values to be used in navigation between pages(CurrencyConverter & Details components)
  private updateServiceValues() {
    this.currenciesService.fromKey = this.fromCurrency;
    this.currenciesService.fromValue = this.currencies[this.fromCurrency];
    this.currenciesService.fromRateValue =
      this.exchangeRates[this.fromCurrency];

    this.currenciesService.toKey = this.toCurrency;
    this.currenciesService.toValue = this.currencies[this.toCurrency];
    this.currenciesService.toRateValue = this.exchangeRates[this.toCurrency];

    this.currenciesService.convertedAmountValue = this.convertedAmount;
  }
}

import { Injectable, OnInit } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class CurrenciesConvertService {
  amountValue!: number;
  fromValue!: string;
  toValue!: string;
  convertedAmountValue!: number;

  fromKey!: string;
  toKey!: string;

  fromRateValue!: number;
  toRateValue!: number;

  accessKey: string = 'bfd5e3a3eab64707ba85cd18009773ac';
  paramsKey = new HttpParams();

  constructor(private http: HttpClient) {
    this.paramsKey = this.paramsKey.set('app_id', this.accessKey);
  }

  getAllCurrencies() {
    let params = this.paramsKey;
    return this.http.get(environment.baseUrl + 'currencies.json', { params });
  }

  getLatestRates() {
    let params = this.paramsKey;

    return this.http.get(environment.baseUrl + 'latest.json', { params });
  }

  getAllHistoricalRates(date: string) {
    let params = this.paramsKey;
    return this.http.get(environment.baseUrl + 'historical/' + date + '.json', {
      params,
    });
  }
}

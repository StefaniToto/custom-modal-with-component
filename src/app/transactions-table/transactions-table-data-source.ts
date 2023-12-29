import { Transaction } from '../transaction-overview/transaction-overview.component';
import { Injectable, Provider, InjectionToken, Inject } from '@angular/core';

import { DatePipe } from '@angular/common';
import {
  FetchDataFn,
  TableServerSideDataSource,
} from '../services/table-server-side-data-source';
import { TableConfig } from '../models/table.models';

const TRANSACTIONS_TABLE_CONFIG = new InjectionToken(
  'Transactions Table configuration',
);

type TransactionViewModel = {
  [Property in keyof Omit<Transaction, 'Transactions'>]: string;
};

export const TRANSACTIONS_FETCH_DATA_FN_TOKEN = new InjectionToken(
  'Fetch data',
);

@Injectable({
  providedIn: 'root',
})
export class TransactionsTableDataSource extends TableServerSideDataSource<
  Transaction,
  TransactionViewModel
> {
  constructor(
    @Inject(TRANSACTIONS_TABLE_CONFIG)
    config: TableConfig<TransactionViewModel>,
    @Inject(TRANSACTIONS_FETCH_DATA_FN_TOKEN)
    fetchDataFn: FetchDataFn<Transaction>,
  ) {
    super(config, fetchDataFn);
  }
}
export function TransactionsTableConfig(
  factory: () => TableConfig<TransactionViewModel>,
): Provider {
  return {
    provide: TRANSACTIONS_TABLE_CONFIG,
    useFactory: factory,
  };
}

export function TransactionsTableFetchDataProvider(
  factory: (...args: any[]) => FetchDataFn<any>,
  deps: any[] = [],
): Provider {
  return {
    provide: TRANSACTIONS_FETCH_DATA_FN_TOKEN,
    useFactory: factory,
    deps,
  };
}
export const TransactionsTableDataSourceProviders: Provider[] = [
  TransactionsTableDataSource,
];

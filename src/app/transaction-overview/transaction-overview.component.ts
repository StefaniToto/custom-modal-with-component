import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserService } from '../services/user.service';
import { FetchDataFn } from '../services/table-server-side-data-source';
import {
  TransactionsTableConfig,
  TransactionsTableFetchDataProvider,
} from '../transactions-table/transactions-table-data-source';
import { TransactionsTableComponent } from '../transactions-table/transactions-table.component';
import { MaterialModule } from '../material-components.module';

export interface Transaction {
  Id: number;
  IP: string;
  FromFullName: string;
  FromImageName: string;
  ToFullName: string;
  ToImageName: string;
  FromCountry: string;
  ToCountry: string;
}
export function TransactionsTableFetchDataFn(
  userService: UserService,
): FetchDataFn<Transaction> {
  return () => userService.getTransactionsOverview();
}
@Component({
  selector: 'app-transaction-overview',
  standalone: true,
  imports: [CommonModule, MaterialModule, TransactionsTableComponent],
  templateUrl: './transaction-overview.component.html',
  styleUrls: ['./transaction-overview.component.scss'],
  providers: [
    TransactionsTableFetchDataProvider(TransactionsTableFetchDataFn, [
      UserService,
    ]),
    TransactionsTableConfig(() => ({
      columns: [
        {
          name: 'Main Transaction',
          property: 'MainAccountTransactionId',
          visible: true,
        },
        {
          name: 'Status',
          property: 'StatusDisplay',
          visible: true,
        },
      ],
      withExpansion: true,
      showExpansionArrow: true,
      disableSortOn: ['StatusDisplay'],
      xlsxName: 'TransactionsOverview',
      pdfName: 'TransactionsOverview',
      sortOn: {
        column: 'CreatedDate',
        direction: 'desc',
      },
    })),
  ],
})
export class TransactionOverviewComponent {}

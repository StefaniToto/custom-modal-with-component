import {
  AfterViewInit,
  Component,
  ContentChildren,
  Input,
  OnInit,
  QueryList,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  TransactionsTableDataSource,
  TransactionsTableDataSourceProviders,
} from './transactions-table-data-source';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MaterialModule } from '../material-components.module';
import { animations } from '../services/table-server-side-data-source';
import { RouterModule } from '@angular/router';
@Component({
  selector: 'app-transactions-table',
  standalone: true,
  imports: [CommonModule, MaterialModule, RouterModule],
  templateUrl: './transactions-table.component.html',
  styleUrls: ['./transactions-table.component.scss'],
  providers: [...TransactionsTableDataSourceProviders],
  animations: [
    animations.fadeInUp,
    animations.fadeInRight,
    animations.detailExpand,
  ],
})
export class TransactionsTableComponent implements OnInit, AfterViewInit {
  // @ts-ignore
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  // @ts-ignore
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @Input() newTabRoute = '';
  @Input() fromToLinks = true;
  @Input() isSuccessful = true;
  public datesRange: any;
  public readonly CURRENCIES: any;
  public hasDetails = true;
  @ContentChildren('row_menu_actions') rowMenuActions:
    | QueryList<TemplateRef<any>>
    | undefined;
  constructor(public readonly dataSource: TransactionsTableDataSource) {
    this.datesRange = {
      to: {
        max: new Date(),
      },
      from: {
        max: new Date(),
      },
    };
  }
  ngOnInit() {}

  ngAfterViewInit() {}
}

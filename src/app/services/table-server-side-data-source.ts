import { Inject, Injectable, InjectionToken, OnDestroy } from '@angular/core';
import {
  BehaviorSubject,
  EMPTY,
  map,
  merge,
  mergeAll,
  Observable,
  ReplaySubject,
  startWith,
  Subscription,
  switchMap,
  tap,
} from 'rxjs';
import { CollectionViewer, DataSource } from '@angular/cdk/collections';
import { catchError } from 'rxjs/operators';
import {
  fadeInOutUpAnimation,
  fadeInUpAnimation,
} from '../fade-in-up.animation';
import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
import { fadeInRightAnimation } from '../fade-in-right.animation';
import {
  ModelType,
  SearchPagination,
  SearchPaginationResponse,
  TableConfig,
  ViewModelType,
} from '../models/table.models';

export const FETCH_DATA_FN_TOKEN = new InjectionToken('Fetch data');
export const TABLE_CONFIG = new InjectionToken('Table configuration');

export type FetchDataFn<T> = (
  parameters: SearchPagination,
) => Observable<SearchPaginationResponse<T>>;

@Injectable({
  providedIn: 'root',
})
export class TableServerSideDataSource<
    TModel,
    TViewModel extends ViewModelType<TModel>,
    TTableConfig extends TableConfig<TViewModel> = TableConfig<TViewModel>,
  >
  extends DataSource<ModelType<TModel>>
  implements OnDestroy
{
  readonly details_tab = 'details_tab';
  readonly expansionArrow = 'expansion-arrow';
  protected readonly parametersSbj = new BehaviorSubject<SearchPagination>({
    Page: 1,
    PageSize: 10,
    OrderBy: this.config.sortOn?.column,
    Descending: this.config.sortOn?.direction === 'desc',
    Properties: {},
    DateRangeFilters: [],
  });

  protected readonly subscription = new Subscription();
  expandedElementIndex: number | null = null;
  protected _dataArray: ModelType<TModel>[] = [];
  protected readonly _loading = new ReplaySubject<boolean>(1);
  readonly loading$ = this._loading.asObservable();
  protected _dataLoaded = false;
  constructor(
    @Inject(TABLE_CONFIG) protected config: TTableConfig,
    @Inject(FETCH_DATA_FN_TOKEN) protected fetchDataFn: FetchDataFn<TModel>,
  ) {
    super();
  }
  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
  protected fetchData(parameters: SearchPagination) {
    this._loading.next(true);
    return this.fetchDataFn(parameters).pipe(
      tap(() => this._loading.next(false)),
      catchError(() => {
        this._loading.next(false);
        return EMPTY;
      }),
    );
  }
  connect(
    _collectionViewer: CollectionViewer,
  ): Observable<readonly ModelType<TModel>[]> {
    return merge([
      this.parametersSbj.pipe(
        switchMap((parameters) =>
          this.fetchData(parameters).pipe(
            map((response) => {
              this._dataArray = response?.Data?.map((t, index) =>
                this.createModelType(t, index),
              );

              return this._dataArray ?? [];
            }),
            startWith([]),
          ),
        ),
      ),
    ]).pipe(mergeAll());
  }

  disconnect(_collectionViewer: CollectionViewer): void {}

  private createModelType(model: TModel, index: number): ModelType<TModel> {
    const modelType = model as ModelType<TModel>;
    modelType._viewModel = {} as TViewModel;
    modelType._index = index;
    return modelType;
  }

  protected projectObject(object: any, keyPrefix = ''): any {
    return {
      ...Object.entries(object).reduce(
        (viewModel, [key, value]) => ({
          ...viewModel,
          ...this.projectPropertyValue(keyPrefix + key, value),
        }),
        {},
      ),
    };
  }

  protected projectPropertyValue(key: string, value: any): any {
    return value === null || value === undefined || typeof value !== 'object'
      ? { [key]: value?.toString() ?? '' }
      : this.projectObject(value, key + '_');
  }

  get sortColumn(): string {
    return this.config.sortOn?.column ?? '';
  }

  get sortDirection() {
    return this.config.sortOn?.direction ?? '';
  }

  get disableSortOn(): string[] {
    return this.config.disableSortOn ?? [];
  }

  trackByFn(_index: number, item: ModelType<TModel>) {
    return item?.['_index'] ?? item;
  }
  get withExpansion(): boolean {
    return this.config.withExpansion ?? false;
  }

  get columns(): any[] {
    return this.config.columns;
  }
  flattenProperty(property: string | string[]): string {
    return Array.isArray(property) ? property.join('_') : property;
  }
  get genericColumns() {
    return this.columns
      .map((column) => ({
        ...column,
        property: this.flattenProperty(column.property),
      }))
      .filter((column) => !column.custom);
  }
  getModelValue(item: TModel, property: string | string[]) {
    if (
      !Array.isArray(property) &&
      Object.prototype.hasOwnProperty.call(item, property)
    ) {
      // @ts-ignore
      return item[property];
    }
    const path = Array.isArray(property) ? property : property.split('_');
    let value: any = item;
    for (const prop of path) {
      if (value === null || value === undefined) {
        value = null;
        break;
      }
      value = value[prop];
    }
    return value;
  }

  getViewModelValue(model: ModelType<TModel>, property: string): any {
    // @ts-ignore
    return (model._viewModel[property] =
      // @ts-ignore
      model._viewModel[property] ??
      this.projectPropertyValue(property, this.getModelValue(model, property))[
        property
      ]);
  }

  get columnsToDisplay(): string[] {
    const columns = [];
    if (this.config.showExpansionArrow) {
      columns.push(this.expansionArrow);
    }
    columns.push(
      ...this.columns
        .filter((column) => column.visible)
        .map((column) => this.flattenProperty(column.property)),
    );
    return columns;
  }
}

export const animations = {
  fadeInUp: fadeInUpAnimation,
  fadeInOutUp: fadeInOutUpAnimation,
  fadeInRight: fadeInRightAnimation,
  detailExpand: trigger('detailExpand', [
    state('collapsed', style({ height: '0px', minHeight: '0' })),
    state('expanded', style({ height: '*' })),
    transition(
      'expanded <=> collapsed',
      animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)'),
    ),
  ]),
};

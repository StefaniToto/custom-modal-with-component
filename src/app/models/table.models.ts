export interface SearchPaginationResponse<T> {
  Data: T[];
  TotalCount: number;
}
export interface SearchPagination {
  Page: number;
  PageSize: number;
  OrderBy?: string;
  Descending?: boolean;
  IsForExport?: boolean;
  Filter?: string;
  Properties?: { [key: string]: string };
  DateRangeFilters?: DateRangeFilter[];
}
export interface DateRangeFilter {
  Key: string;
  FromDate?: Date | string;
  ToDate?: Date | string;
}

export interface TableConfig<TViewModel> {
  columns: any[];
  columnFilters?: any[];
  withExpansion?: boolean;
  showExpansionArrow?: boolean;
  withActions?:
    | boolean
    | { [actionCategory: string]: { [actionType: string]: boolean } | boolean };
  xlsxName: string;
  pdfName: string;
  sortOn?: {
    column: string;
    direction: 'asc' | 'desc';
  };
  page?: {
    size?: number;
    sizeOptions?: number[];
  };
  disableSortOn?: string[];
}
export type ViewModelType<TModel> = {
  [Property in keyof Partial<TModel>]: string;
};
export type ModelType<TModel> = TModel & {
  _viewModel: ViewModelType<TModel>;
  _expansionShowing?: boolean;
  _index: number;
  _isNew?: boolean;
};

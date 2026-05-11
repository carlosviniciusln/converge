export interface ApiResponsePaginado<T> {
    succeeded: boolean;
    data: Data<T>;
    errors: string[];
  }
  
  export interface Data<T> {
    results: T[];
    pageNumber: number;
    pageSize: number;
    firstPage: string;
    lastPage: string;
    totalPages: number;
    totalRecords: number;
    nextPage?: any;
    previousPage?: any;
  }
  
  export interface ApiResponse<T> {
    succeeded: boolean;
    data: T;
    errors: string[];
  }
  
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class ApiService {
  private readonly apiUrl = '/api';

  constructor(private readonly http: HttpClient) {}

  public getCurrentLangCode(): string {
    return 'en';
  }

  public get(path: string, params?: any): Observable<any> {
    const headers = this.createHeaders();
    return this.http
      .get(`${this.apiUrl}${path}`, { headers, params })
      .pipe(catchError(this.formatErrors));
  }

  public put(path: string, body: any = {}): Observable<any> {
    const headers = this.createHeaders(withContentType);
    return this.http
      .put(`${this.apiUrl}${path}`, JSON.stringify(body), { headers })
      .pipe(catchError(this.formatErrors));
  }

  public putFormUrlEncoded(path: string, body: any = {}): Observable<any> {
    const headers = this.createHeaders().set(
      'Content-Type',
      'application/x-www-form-urlencoded',
    );
    return this.http
      .put(`${this.apiUrl}${path}`, body, { headers })
      .pipe(catchError(this.formatErrors));
  }

  public putIgnoreResponse(path: string, body: any = {}): Observable<any> {
    const headers = this.createHeaders(withContentType);
    return this.http
      .put(`${this.apiUrl}${path}`, JSON.stringify(body), {
        headers,
        responseType: 'text',
      })
      .pipe(catchError(this.formatErrors));
  }

  public post(
    path: string,
    body: any = {},
    params: { [param: string]: any },
  ): Observable<any> {
    const headers = this.createHeaders(withContentType);
    return this.http
      .post(`${this.apiUrl}${path}`, JSON.stringify(body), { headers, params })
      .pipe(catchError(this.formatErrors));
  }

  public postIgnoreResponse(path: string, body: any = {}): Observable<any> {
    const headers = this.createHeaders(withContentType);
    return this.http
      .post(`${this.apiUrl}${path}`, JSON.stringify(body), {
        headers,
        responseType: 'text',
      })
      .pipe(catchError(this.formatErrors));
  }

  public postFormData(path: string, formData: FormData): Observable<any> {
    const headers = this.createHeaders();
    return this.http
      .post(`${this.apiUrl}${path}`, formData, { headers })
      .pipe(catchError(this.formatErrors));
  }

  public postFormUrlEncoded(path: string, body: any = {}): Observable<any> {
    const headers = this.createHeaders().set(
      'Content-Type',
      'application/x-www-form-urlencoded',
    );
    return this.http
      .post(`${this.apiUrl}${path}`, body, { headers })
      .pipe(catchError(this.formatErrors));
  }

  public patch(path: string, body: any = {}): Observable<any> {
    const headers = this.createHeaders(withContentType);
    return this.http
      .patch(`${this.apiUrl}${path}`, JSON.stringify(body), {
        headers,
      })
      .pipe(catchError(this.formatErrors));
  }

  public delete(path: string): Observable<any> {
    const headers = this.createHeaders();
    return this.http
      .delete(`${this.apiUrl}${path}`, { headers })
      .pipe(catchError(this.formatErrors));
  }

  private formatErrors(error: any) {
    try {
      // somehow, the error was not deserialized
      return throwError(JSON.parse(error.error));
    } catch {
      return throwError(error.error);
    }
  }

  private createHeaders(addContentType: boolean = false): HttpHeaders {
    let headers = new HttpHeaders().set(
      'Accept-Language',
      this.getCurrentLangCode(),
    );
    if (addContentType) {
      headers = headers.set('Content-Type', 'application/json');
    }
    return headers;
  }

  public getBlob(path: string): Observable<any> {
    const headers = this.createHeaders();
    return this.http
      .get(`${this.apiUrl}${path}`, {
        headers,
        observe: 'response',
        responseType: 'blob',
      })
      .pipe(catchError(this.formatErrors));
  }
}

// kind of alias for readability
const withContentType = true;

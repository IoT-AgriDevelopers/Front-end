import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, retry, throwError } from 'rxjs';
import { Plants } from '../model/Plants';

@Injectable({
  providedIn: 'root',
})
export class PlantsService {
  basePath = 'https://apppagripure.herokuapp.com/api/plants';
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    }),
  };
  constructor(public http: HttpClient) {}
  handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      console.log(`An error occurred: ${error.error.message}`);
    } else {
      console.error(
        `Backend returned code ${error.status}, body was: ${error.error}`
      );
    }
    return throwError(
      () => new Error('Something happened with request, please try again later')
    );
  }

  getAll(): Observable<Plants> {
    return this.http
      .get<Plants>(this.basePath, this.httpOptions)
      .pipe(retry(2), catchError(this.handleError));
  }

  getById(id: any): Observable<Plants> {
    return this.http
      .get<Plants>(`${this.basePath}/${id}`, this.httpOptions)
      .pipe(retry(2), catchError(this.handleError));
  }

  getAllPlantsByUserId(userId: any): Observable<Plants> {
    let urlPath = `https://apppagripure.herokuapp.com/api/users/${userId}/plants`;
    return this.http
      .get<Plants>(urlPath, this.httpOptions)
      .pipe(retry(2), catchError(this.handleError));
  }

  update(id: any, item: any): Observable<Plants> {
    return this.http
      .put<Plants>(
        `${this.basePath}/${id}`,
        JSON.stringify(item),
        this.httpOptions
      )
      .pipe(retry(2), catchError(this.handleError));
  }

  patch(id: any, item: any): Observable<Plants> {
    return this.http
      .patch<Plants>(
        `${this.basePath}/${id}`,
        JSON.stringify(item),
        this.httpOptions
      )
      .pipe(retry(2), catchError(this.handleError));
  }
}

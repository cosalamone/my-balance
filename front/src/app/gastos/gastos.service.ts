import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface Gasto {
  id?: number;
  amount: number;
  category: string;
  description: string;
  date: string;
  isFixed: boolean;
  isRecurring: boolean;
  recurrencePattern?: string;
  createdAt?: string;
  updatedAt?: string;
  userId?: number;
}

@Injectable({ providedIn: 'root' })
export class GastosService {
  private apiUrl = '/api/expense';

  constructor(private http: HttpClient) {}

  getAll(): Observable<Gasto[]> {
    return this.http.get<Gasto[]>(this.apiUrl);
  }

  getById(id: number): Observable<Gasto> {
    return this.http.get<Gasto>(`${this.apiUrl}/${id}`);
  }

  create(gasto: Gasto): Observable<Gasto> {
    return this.http.post<Gasto>(this.apiUrl, gasto);
  }

  update(gasto: Gasto): Observable<void> {
    return this.http.put<void>(
      `${this.apiUrl}/${gasto.id}`,
      gasto
    );
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}

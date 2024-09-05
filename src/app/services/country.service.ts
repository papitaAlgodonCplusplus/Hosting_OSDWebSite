import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CountryService {

  // URL de la API de REST Countries
  private apiUrl = 'https://restcountries.com/v3.1/all';

  constructor(private http: HttpClient) { }

  // Método para obtener los países
  getCountries(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }
}

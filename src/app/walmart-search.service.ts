import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { environment } from 'environments/environment'
import { Observable } from 'rxjs'

@Injectable()
export class WalmartSearchService {
  
  constructor(private http: HttpClient) { }

  getResultList(searchText): Observable<any> {
  	return this.http.get(`/v1/search?query=${searchText}&format=json&apiKey=${environment.walmartAPIKey}`)
  }

  getRecommendations(id): Observable<any> {
  	return this.http.get(`/v1/nbp?apiKey=${environment.walmartAPIKey}&itemId=${id}`)
  }

  getDetails(id): Observable<any> {
  	return this.http.get(`/v1/items/${id}?format=json&apiKey=${environment.walmartAPIKey}`)
  }

}

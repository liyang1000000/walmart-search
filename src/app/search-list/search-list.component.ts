import { Component, OnInit } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { WalmartSearchService } from './../walmart-search.service'
import { ActivatedRoute } from '@angular/router'
import { Location, PlatformLocation } from '@angular/common'
import { Observable } from 'rxjs'


@Component({
  selector: 'app-search-list',
  templateUrl: './search-list.component.html',
  styleUrls: ['./search-list.component.css']
})
export class SearchListComponent implements OnInit {
  searchText: string
  products: any[]
  noResults: boolean = false


  constructor(private platformLocation: PlatformLocation, private http: HttpClient, private walmartSearchService: WalmartSearchService, private route: ActivatedRoute, private location: Location) {
    platformLocation.onPopState(() => {
      this.searchText = this.route.snapshot.params['searchText']
      this.getResults()
    })
  }

  ngOnInit() {
    this.searchText = this.route.snapshot.params['searchText']
    this.getResults()
  }

  getResults() {
    this.location.go(`/search-list/${this.searchText}`)
  	if (this.searchText && this.searchText.length > 0) {
      this.walmartSearchService.getResultList(this.searchText).subscribe( response => {
        if (response['items'].length === 0) {
          this.noResults = true
        } else {
          this.noResults = false
        }

        let items = response['items']
        this.products = []


        /*according to publicApi document, only 5 call could be made at most in 1 sec, so I can only set a timeout to make separated api call(5 each time)*/
        /*Also, I have a question: 
        we have got all information that we need(name, salePrice, desc, thumbnail...) in search API, 
        I don't really get why we need to loop to call Lookup api again. 
        However I can only follow the requirement in the homework pdf to make the loop*/

        Observable.forkJoin(items.splice(0, 5).map((item) => {
          return this.walmartSearchService.getDetails(item.itemId)
        })).subscribe((values) => {
          this.products = values
        })

        setTimeout(() => {
          Observable.forkJoin(items.splice(0, 5).map((item) => {
            return this.walmartSearchService.getDetails(item.itemId)
          })).subscribe((values) => {
            this.products = this.products.concat(values)
          })
        }, 1600)
        
        
      })
    }
  }

}

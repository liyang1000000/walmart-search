import { Component, OnInit } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { ActivatedRoute } from '@angular/router'
import { WalmartSearchService } from './../walmart-search.service'
import { Observable } from 'rxjs'
import { PlatformLocation, Location } from '@angular/common'


@Component({
  selector: 'app-search-detail',
  templateUrl: './search-detail.component.html',
  styleUrls: ['./search-detail.component.css']
})
export class SearchDetailComponent implements OnInit {
  
  productDetails
  recommendations

  constructor(private location: Location, private platformLocation: PlatformLocation, private http: HttpClient, private route: ActivatedRoute, private walmartSearchService: WalmartSearchService) {
    platformLocation.onPopState(() => {
      this.getProductDetails()
      this.getRecommendations()
    })
  }

  ngOnInit() {
  	this.getProductDetails()
  	this.getRecommendations()
  }

  getProductDetails() {
  	const id = this.route.snapshot.paramMap.get('id')
  	this.walmartSearchService.getDetails(id).subscribe(response => {
  		this.productDetails = response
  	})
  }

  navigateTo(id) {
    this.location.go(`/search-detail/${id}`)
    this.walmartSearchService.getDetails(id).subscribe(response => {
      this.productDetails = response
      this.getRecommendations()
    })
    
  }

  /*The same with list page*/
  /*according to publicApi document, only 5 call could be made at most in 1 sec, so I can only set a timeout to make separated api call(5 each time)*/
  /*Also, I have a question: 
  we have got all information that we need(name, salePrice, desc, thumbnail...) in recommendation API, 
  I don't really get why we need to loop to call Lookup api again. 
  However I can only follow the requirement in the homework pdf to make the loop*/
  getRecommendations() {
  	const id = this.route.snapshot.paramMap.get('id')
  	this.walmartSearchService.getRecommendations(id).subscribe(response => {
      let items = response
      this.recommendations = []
      Observable.forkJoin(items.splice(0, 5).map((item) => {
        return this.walmartSearchService.getDetails(item.itemId)
      })).subscribe((values) => {
        this.recommendations = values
      })

      setTimeout(() => {
        Observable.forkJoin(items.splice(0, 5).map((item) => {
          return this.walmartSearchService.getDetails(item.itemId)
        })).subscribe((values) => {
          this.recommendations = this.recommendations.concat(values)
        })
      }, 1600)
  	})
  }

}

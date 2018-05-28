import { Component, OnInit } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { ActivatedRoute } from '@angular/router'
import { WalmartSearchService } from './../walmart-search.service'
import { Observable } from 'rxjs'
import { PlatformLocation, Location } from '@angular/common'


@Component({
  selector: 'app-search-recommendation',
  templateUrl: './search-recommendation.component.html',
  styleUrls: ['./search-recommendation.component.css']
})
export class SearchRecommendationComponent implements OnInit {
  
  recommendations

  constructor(private location: Location, private platformLocation: PlatformLocation, private http: HttpClient, private route: ActivatedRoute, private walmartSearchService: WalmartSearchService) {
    platformLocation.onPopState(() => {
      this.getRecommendations()
    })
  }

  ngOnInit() {
  	this.getRecommendations()
  }

  navigateTo(id) {
    this.location.go(`/search-recommendation/${id}`)
    this.getRecommendations()
    
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

      const getFiveResultsEachTime = () => {
        Observable.forkJoin(items.splice(0, 5).map((item) => {
          return this.walmartSearchService.getDetails(item.itemId)
        })).subscribe((values) => {
          this.recommendations = this.recommendations.concat(values)
        })
      }

      setTimeout(() => {
        getFiveResultsEachTime()
      }, 1000)
      

      setTimeout(() => {
        getFiveResultsEachTime()
      }, 2000)
  	})
  }

}

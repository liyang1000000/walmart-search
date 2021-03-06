import { BrowserModule } from '@angular/platform-browser'
import { NgModule } from '@angular/core'
import { FormsModule } from '@angular/forms'
import { Routes, RouterModule } from '@angular/router'
import { HttpClientModule } from '@angular/common/http'


import { AppComponent } from './app.component'
import { SearchListComponent } from './search-list/search-list.component'
import { SearchRecommendationComponent } from './search-recommendation/search-recommendation.component'
import { WalmartSearchService } from './walmart-search.service';
import { SearchLandingComponent } from './search-landing/search-landing.component';
import { SearchBoxComponent } from './search-box/search-box.component'

export const routes: Routes = [
	{
		path: 'search-landing',
		component: SearchLandingComponent
	},
	{
		path: 'search-list/:searchText',
		component: SearchListComponent
	},
	{
		path: 'search-recommendation/:id',
		component: SearchRecommendationComponent
	},
	{
		path: '',
		redirectTo: '/search-landing',
		pathMatch: 'full'
	}

]


@NgModule({
  declarations: [
    AppComponent,
    SearchListComponent,
    SearchRecommendationComponent,
    SearchLandingComponent,
    SearchBoxComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    RouterModule.forRoot(routes)
  ],
  providers: [WalmartSearchService],
  bootstrap: [AppComponent]
})
export class AppModule { }

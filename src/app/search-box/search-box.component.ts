import { Component, OnInit } from '@angular/core'
import { Router } from '@angular/router'

@Component({
  selector: 'app-search-box',
  templateUrl: './search-box.component.html',
  styleUrls: ['./search-box.component.css']
})
export class SearchBoxComponent implements OnInit {

  searchText: string
  showError: boolean

  constructor(private router: Router) { }

  ngOnInit() {
  }

  checkIfEmpty() {
    return !this.searchText || this.searchText.replace(/\s+/g, '') === ''
  }

  startSearch() {
    if (this.checkIfEmpty()) {
      this.showError = true
    } else {
      this.showError = false
      this.router.navigate(['/search-list', this.searchText] )
    }
  }

}

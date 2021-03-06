import {Component, EventEmitter, Input, OnChanges, OnInit, Output} from '@angular/core';
import { Observable } from 'rxjs/Rx';

@Component({
  selector: 'user-pagination',
  templateUrl: './user-pagination.component.html'
})
export class UserPaginationComponent implements OnChanges, OnInit {
  @Output() onPageChanged: EventEmitter<number> = new EventEmitter<number>();
  @Input() offset = 0;
  @Input() limit = 1;
  @Input() size = 1;
  @Input() range = 3;
  currentPage: number;
  totalPages: number;
  pages: Observable<number[]>;

  constructor() {
  }

  selectPage(page: number) {
    if (page == 0 || page > this.totalPages) {
      return;
    }
    if (this.isValidPageNumber(page, this.totalPages)) {
      this.onPageChanged.emit((page - 1) * this.limit);
    }
  }

  getPages(offset: number, limit: number, size: number) {
    this.currentPage = this.getCurrentPage(offset, limit);
    this.totalPages = this.getTotalPages(limit, size);
    this.pages = Observable.range(-this.range, this.range * 2 + 1)
      .map((offset) => this.currentPage + offset)
      .filter(page => this.isValidPageNumber(page, this.totalPages))
      .toArray();
  }

  getCurrentPage(offset: number, limit: number): number {
    return Math.floor(offset / limit) + 1;
  }

  isValidPageNumber(page: number, totalPages: number): boolean {
    return page > 0 && page <= totalPages;
  }

  getTotalPages(limit: number, size: number): number {
    return Math.ceil(Math.max(size, 1) / Math.max(limit, 1));
  }

  ngOnChanges() {
    this.getPages(this.offset, this.limit, this.size);
  }

  ngOnInit() {
    this.getPages(this.offset, this.limit, this.size);
  }
}

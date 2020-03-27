import {Component, EventEmitter, OnDestroy, OnInit, Output, ViewChild} from '@angular/core';
import {AutoUnsubscribe} from 'ngx-auto-unsubscribe';
import {Subscription} from 'rxjs';
import {EmailRecipientsTagsService} from '../../../../../common/services/email-recipients';

@AutoUnsubscribe()
@Component({
  selector: 'app-email-recipient-tag-new',
  templateUrl: './email-recipient-tag-new.component.html',
  styleUrls: ['./email-recipient-tag-new.component.scss']
})
export class EmailRecipientTagNewComponent implements OnInit, OnDestroy {
  @ViewChild('frame', {static: false}) frame;
  @Output() tagCreated: EventEmitter<void> = new EventEmitter<void>();
  @Output() tagCreateCancelled: EventEmitter<void> = new EventEmitter<void>();
  name = '';
  spinnerStatus = false;
  createTag$: Subscription;

  constructor(private tagsService: EmailRecipientsTagsService) {
  }

  ngOnInit() {
  }

  show() {
    this.frame.show();
  }

  createItem() {
    this.spinnerStatus = true;
    this.createTag$ = this.tagsService.createEmailRecipientTag({id: 0, name: this.name}).subscribe((data) => {
      if (data && data.success) {
        this.frame.hide();
        this.tagCreated.emit();
      }
      this.spinnerStatus = false;
    });
  }

  cancelCreate() {
    this.frame.hide();
    this.tagCreateCancelled.emit();
  }

  ngOnDestroy(): void {
  }
}
import {Component, OnInit} from '@angular/core';
import {SettingsService} from 'app/services';
import {HeaderSettingsModel} from 'app/models/settings/header-settings.model';

@Component({
  selector: 'eform-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  headerSettingsModel: HeaderSettingsModel = new HeaderSettingsModel;
  logoImage: any;

  constructor(private settingsService: SettingsService) {
  }

  ngOnInit() {
    this.settingsService.connectionStringExist().subscribe((result) => {
      if (result && result.success === true) {
        this.settingsService.getHeaderSettings().subscribe((data => {
          if (data && data.success) {
            this.headerSettingsModel = data.model;
            if (this.headerSettingsModel.imageLink && this.headerSettingsModel.imageLinkVisible) {
              this.logoImage = 'api/images/eform-images?fileName=' + this.headerSettingsModel.imageLink;
            } else if (!this.headerSettingsModel.imageLink) {
              this.logoImage = '../../../assets/images/logo.png';
            }
          }
        }));
      } else {
        this.logoImage = '../../../assets/images/logo.png';
        this.headerSettingsModel.imageLinkVisible = true;
        this.headerSettingsModel.mainTextVisible = true;
        this.headerSettingsModel.secondaryTextVisible = true;
        this.headerSettingsModel.mainText = 'Microting eForm';
        this.headerSettingsModel.secondaryText = 'No more paper-forms and back-office data entry';
      }
    });

  }

}

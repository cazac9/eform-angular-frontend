import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {TranslateModule} from '@ngx-translate/core';
import {DragulaModule} from 'ng2-dragula';
import {MDBBootstrapModule} from 'angular-bootstrap-md';
import {EformSharedModule} from 'src/app/common/modules/eform-shared/eform-shared.module';
import {NgSelectModule} from '@ng-select/ng-select';
import {AdvancedRoutingModule} from './advanced.routing';
import {
  EntitySearchComponent,
  EntitySearchCreateComponent, EntitySearchEditComponent,
  EntitySearchEditNameComponent,
  EntitySearchImportListComponent,
  EntitySearchRemoveComponent,
  EntitySelectComponent,
  EntitySelectCreateComponent, EntitySelectEditComponent,
  EntitySelectEditNameComponent,
  EntitySelectImportListComponent,
  EntitySelectRemoveComponent,
  SiteDeleteComponent,
  SiteEditComponent,
  SitesComponent,
  UnitsComponent,
  UnitCreateComponent,
  UnitMoveComponent,
  UnitsOtpCodeComponent,
  WorkerCreateComponent,
  WorkerDeleteComponent,
  WorkerEditComponent,
  WorkersComponent,
  FoldersComponent,
  FolderCreateComponent, SiteTagsComponent
} from './components';
import { FolderEditComponent } from './components/folders/folder-edit/folder-edit.component';
import { FolderDeleteComponent } from './components/folders/folder-delete/folder-delete.component';
import {FontAwesomeModule} from '@fortawesome/angular-fontawesome';

@NgModule({
    imports: [
        AdvancedRoutingModule,
        CommonModule,
        MDBBootstrapModule,
        TranslateModule,
        EformSharedModule,
        NgSelectModule,
        FormsModule,
        DragulaModule,
        FontAwesomeModule,
        MDBBootstrapModule
    ],
  declarations: [
    EntitySearchComponent,
    EntitySelectComponent,
    SitesComponent,
    SiteEditComponent,
    SiteDeleteComponent,
    UnitsComponent,
    UnitCreateComponent,
    UnitMoveComponent,
    UnitsOtpCodeComponent,
    WorkersComponent,
    WorkerEditComponent,
    WorkerDeleteComponent,
    WorkerCreateComponent,
    EntitySearchCreateComponent,
    EntitySearchRemoveComponent,
    EntitySearchImportListComponent,
    EntitySearchEditNameComponent,
    EntitySearchEditComponent,
    EntitySelectRemoveComponent,
    EntitySelectCreateComponent,
    EntitySelectEditNameComponent,
    EntitySelectImportListComponent,
    EntitySelectEditComponent,
    FoldersComponent,
    FolderCreateComponent,
    FolderEditComponent,
    FolderDeleteComponent,
    SiteTagsComponent
  ]
})
export class AdvancedModule {
}

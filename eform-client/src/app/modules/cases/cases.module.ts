import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {CasesRoutingModule} from './cases-routing.module';
import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {NgxGalleryModule} from 'ngx-gallery';
import {CasesComponent} from './components/cases.component';
import {CasesTableComponent} from './components/cases-table/cases-table.component';
import {CasesEditComponent} from './components/cases-edit/cases-edit.component';
import {CaseEditElementComponent} from './components/case-edit-element/case-edit-element.component';
import {CaseEditSwitchComponent} from 'app/modules/cases/components/case-edit-switch/case-edit-switch.component';

import {
  ElementCheckboxComponent,
  ElementCommentComponent,
  ElementDateComponent,
  ElementMultiselectComponent,
  ElementNumberComponent,
  ElementPictureComponent,
  ElementPdfComponent,
  ElementSingleselectComponent,
  ElementContainerComponent,
  ElementTextComponent,
  ElementInfoboxComponent,
  ElementTimerComponent,
  ElementSignatureComponent,
  TrumbowygComponent,
  ElementEntitysearchComponent,
  ElementEntityselectComponent
} from './components/case-elements';
import {CollapseModule, TooltipModule} from 'ngx-bootstrap';
import {Ng2Bs3ModalModule} from 'ng2-bs3-modal/ng2-bs3-modal';
import {NgxSelectModule} from 'ngx-select-ex';

@NgModule({
  imports: [
    CommonModule,
    NgxGalleryModule,
    FormsModule,
    ReactiveFormsModule,
    CasesRoutingModule,
    CollapseModule.forRoot(),
    Ng2Bs3ModalModule,
    TooltipModule.forRoot(),
    NgxSelectModule
  ],
  declarations: [CasesComponent,
    TrumbowygComponent,
    CasesEditComponent,
    CaseEditSwitchComponent,
    CasesTableComponent,
    CaseEditElementComponent,
    ElementCommentComponent,
    ElementMultiselectComponent,
    ElementPdfComponent,
    ElementSingleselectComponent,
    ElementNumberComponent,
    ElementTextComponent,
    ElementContainerComponent,
    ElementPictureComponent,
    ElementCheckboxComponent,
    ElementDateComponent,
    ElementInfoboxComponent,
    ElementTimerComponent,
    ElementSignatureComponent,
    ElementEntitysearchComponent,
    ElementEntityselectComponent
  ]
})
export class CasesModule {
}

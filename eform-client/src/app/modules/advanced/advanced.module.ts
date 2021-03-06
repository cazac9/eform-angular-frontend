import {HelpersModule} from '../helpers/helpers.module';
import {FormsModule} from '@angular/forms';
import {AdvancedRoutingModule} from './advanced-routing.module';
import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {Ng2Bs3ModalModule} from 'ng2-bs3-modal/ng2-bs3-modal';
import {AdvancedComponent} from './components/advanced.component';
import {UnitsComponent} from './components/units/units.component';
import {SitesComponent} from './components/sites/sites.component';
import {WorkersComponent} from './components/workers/workers.component';
import {WorkerEditComponent} from './components/worker-edit/worker-edit.component';
import {SiteEditComponent} from './components/site-edit/site-edit.component';
import {TooltipModule} from 'ngx-bootstrap/tooltip';
import {EntitySearchComponent} from './components/entity-search/entity-search.component';
import {EntitySelectComponent} from './components/entity-select/entity-select.component';
import {EditEntitySearchableGroupComponent} from 'app/modules/advanced/components/edit-entity-searchable-group/edit-entity-searchable-group.component';
import {EditEntitySelectableGroupComponent} from 'app/modules/advanced/components/edit-entity-selectable-group/edit-entity-selectable-group.component';
import {EntitySelectableGridComponent} from 'app/modules/advanced/components/entity-select-grid/entity-select-grid.component';
import {EntitySearchableGridComponent} from 'app/modules/advanced/components/entity-search-grid/entity-search-grid.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    AdvancedRoutingModule,
    TooltipModule.forRoot(),
    Ng2Bs3ModalModule,
    HelpersModule
  ],
  declarations: [
    AdvancedComponent,
    UnitsComponent,
    SitesComponent,
    WorkersComponent,
    WorkerEditComponent,
    SiteEditComponent,
    EntitySearchComponent,
    EntitySelectComponent,
    EditEntitySearchableGroupComponent,
    EditEntitySelectableGroupComponent,
    EntitySearchableGridComponent,
    EntitySelectableGridComponent
  ],
})
export class AdvancedModule {
}

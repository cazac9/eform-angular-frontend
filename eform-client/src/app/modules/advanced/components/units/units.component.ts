import {Component, OnInit, ViewChild} from '@angular/core';
import {UnitDto} from 'src/app/common/models/dto';
import {UnitsService} from 'src/app/common/services/advanced';
import {AuthService} from 'src/app/common/services/auth';

@Component({
  selector: 'app-units',
  templateUrl: './units.component.html'
})
export class UnitsComponent implements OnInit {

  @ViewChild('modalUnitsOtpCode', { static: true }) modalUnitsOtpCode;
  @ViewChild('modalUnitsCreate', { static: true }) modalUnitsCreate;
  @ViewChild('modalUnitsMove', { static: true }) modalUnitsMove;
  unitModels: Array<UnitDto> = [];
  selectedUnitModel: UnitDto = new UnitDto();

  get userClaims() { return this.authService.userClaims; }

  constructor(private unitsService: UnitsService, private authService: AuthService) {
  }

  ngOnInit() {
    this.loadAllUnits();
  }

  loadAllUnits() {
    this.unitsService.getAllUnits().subscribe(operation => {
      if (operation && operation.success) {
        this.unitModels = operation.model;
      }
    });
  }

  openCreateModal() {
    this.modalUnitsCreate.show();
  }

  openMoveModal(selectedUnitDto: UnitDto) {
    this.selectedUnitModel = selectedUnitDto;
    this.modalUnitsMove.show(selectedUnitDto);
  }

  openModalUnitsOtpCode(selectedUnitDto: UnitDto) {
    this.selectedUnitModel = selectedUnitDto;
    this.modalUnitsOtpCode.show();
  }
}

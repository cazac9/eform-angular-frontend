import {Injectable} from '@angular/core';
import {Router} from '@angular/router';
import {ToastrService} from 'ngx-toastr';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {
  EformFullReportModel,
  EformReportModel,
  OperationDataResult,
  OperationResult,
} from 'src/app/common/models';
import {BaseService} from 'src/app/common/services/base.service';

const TemplateReportMethods = {
  Templates: '/api/templates/',
};

@Injectable()
export class EformReportService extends BaseService {
  constructor(private _http: HttpClient, router: Router, toastrService: ToastrService) {
    super(_http, router, toastrService);
  }

  getSingle(templateId: number): Observable<OperationDataResult<EformFullReportModel>> {
    return this.get(TemplateReportMethods.Templates + templateId + '/report');
  }

  updateSingle(model: EformReportModel): Observable<OperationResult> {
    return this.put(TemplateReportMethods.Templates, model);
  }
}
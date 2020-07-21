﻿namespace eFormAPI.Web.Services.Export
{
    using System.IO;
    using System.Threading.Tasks;
    using Controllers.Eforms;
    using eFormAPI.Web.Infrastructure.Models;
    using Microting.eFormApi.BasePn.Infrastructure.Models.API;

    public interface IEformExcelExportService
    {
        Task<OperationDataResult<Stream>> EformExport(EformDownloadExcelModel excelModel);
    }
}
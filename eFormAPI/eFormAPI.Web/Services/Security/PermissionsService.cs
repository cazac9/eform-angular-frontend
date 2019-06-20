﻿/*
The MIT License (MIT)

Copyright (c) 2007 - 2019 Microting A/S

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/
using System;
using System.Linq;
using System.Threading.Tasks;
using eFormAPI.Web.Abstractions;
using eFormAPI.Web.Abstractions.Security;
using eFormAPI.Web.Infrastructure.Database;
using eFormAPI.Web.Infrastructure.Database.Entities;
using eFormAPI.Web.Infrastructure.Models.Permissions;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Microting.eFormApi.BasePn.Infrastructure.Models.API;

namespace eFormAPI.Web.Services.Security
{
    public class PermissionsService : IPermissionsService
    {
        private readonly ILocalizationService _localizationService;
        private readonly ILogger<PermissionsService> _logger;
        private readonly BaseDbContext _dbContext;

        public PermissionsService(BaseDbContext dbContext,
            ILocalizationService localizationService,
            ILogger<PermissionsService> logger)
        {
            _dbContext = dbContext;
            _localizationService = localizationService;
            _logger = logger;
        }

        public async Task<OperationDataResult<PermissionsModel>> GetGroupPermissions(int groupId)
        {
            try
            {
                SecurityGroup group = await _dbContext.SecurityGroups.FirstOrDefaultAsync(x => x.Id == groupId);
                if (group == null)
                {
                    return new OperationDataResult<PermissionsModel>(false,
                        _localizationService.GetString("SecurityGroupNotFound"));
                }

                var permissionModels = await _dbContext.Permissions
                    .Select(x => new PermissionModel()
                    {
                        Id = x.Id,
                        ClaimName = x.ClaimName,
                        PermissionName = x.PermissionName,
                        PermissionType = x.PermissionType.Name,
                        PermissionTypeId = x.PermissionTypeId,
                        IsEnabled = _dbContext.GroupPermissions.Any(g => g.SecurityGroupId == groupId
                                                                         && g.PermissionId == x.Id)
                    })
                    .ToListAsync();

                var permissionTypes = permissionModels
                    .OrderBy(x => x.PermissionType)
                    .GroupBy(x => x.PermissionType)
                    .Select(g => new PermissionTypeModel()
                    {
                        Name = g.Key,
                        Permissions = g.Select(permission => permission).ToList()
                    }).ToList();

                var result = new PermissionsModel
                {
                    GroupId = groupId,
                    GroupName = group.Name,
                    PermissionTypes = permissionTypes
                };
                return new OperationDataResult<PermissionsModel>(true, result);
            }
            catch (Exception e)
            {
                _logger.LogError(e.Message);
                return new OperationDataResult<PermissionsModel>(false,
                    _localizationService.GetString("ErrorWhileObtainingPermissions"));
            }
        }

        public async Task<OperationResult> UpdatePermissions(PermissionsUpdateModel requestModel)
        {
            try
            {
                if (!await _dbContext.SecurityGroups.AnyAsync(x => x.Id == requestModel.GroupId))
                {
                    return new OperationDataResult<PermissionsModel>(false,
                        _localizationService.GetString("SecurityGroupNotFound"));
                }

                using (var transaction = await _dbContext.Database.BeginTransactionAsync())
                {
                    var enabledList = requestModel.Permissions
                        .Where(x => x.IsEnabled)
                        .Select(x => x.Id)
                        .ToList();

                    // for delete
                    var forDelete = _dbContext.GroupPermissions
                        .Where(x => x.SecurityGroupId == requestModel.GroupId)
                        .Where(x => !enabledList.Contains(x.Permission.Id));

                    _dbContext.GroupPermissions.RemoveRange(forDelete);
                    await _dbContext.SaveChangesAsync();

                    var list = _dbContext.GroupPermissions
                        .Where(x => x.SecurityGroupId == requestModel.GroupId)
                        .Where(x => enabledList.Contains(x.Permission.Id))
                        .Select(x => x.Permission.Id)
                        .ToList();

                    foreach (var permissionId in enabledList)
                    {
                        if (!list.Contains(permissionId))
                        {
                            await _dbContext.GroupPermissions.AddAsync(new GroupPermission()
                            {
                                PermissionId = permissionId,
                                SecurityGroupId = requestModel.GroupId
                            });
                        }
                    }

                    await _dbContext.SaveChangesAsync();
                    transaction.Commit();
                }

                return new OperationResult(true,
                    _localizationService.GetString("PermissionsUpdatedSuccessfully"));
            }
            catch (Exception e)
            {
                _logger.LogError(e.Message);
                return new OperationResult(false,
                    _localizationService.GetString("ErrorWhileUpdatingPermissions"));
            }
        }
    }
}
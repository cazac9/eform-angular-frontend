﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Web.Http;
using eFormAPI.Web.Infrastructure.Helpers;
using eFormAPI.Web.Infrastructure.Models.API;
using eFormAPI.Web.Infrastructure.Models.Common;
using eFormAPI.Web.Infrastructure.Models.SelectableList;
using eFormData;
using eFormShared;

namespace eFormAPI.Web.Controllers
{
    [Authorize]
    public class EntitySelectController : ApiController
    {
        private readonly EFormCoreHelper _coreHelper = new EFormCoreHelper();

        [HttpPost]
        [Route("api/selectable-groups")]
        public OperationDataResult<EntityGroupList> GetEntityGroupList(
            AdvEntitySelectableGroupListRequestModel requestModel)
        {
            try
            {
                var core = _coreHelper.GetCore();
                var model = core.Advanced_EntityGroupAll(requestModel.Sort, requestModel.NameFilter,
                    requestModel.PageIndex, requestModel.PageSize, Constants.FieldTypes.EntitySelect,
                    requestModel.IsSortDsc,
                    Constants.WorkflowStates.NotRemoved);
                return new OperationDataResult<EntityGroupList>(true, model);
            }
            catch (Exception)
            {
                return new OperationDataResult<EntityGroupList>(false, "Searchable list loading failed");
            }
        }

        [HttpPost]
        [Route("api/selectable-groups/create")]
        public OperationResult CreateEntityGroup(AdvEntitySelectableGroupEditModel editModel)
        {
            try
            {
                var core = _coreHelper.GetCore();
                var groupCreate = core.EntityGroupCreate(Constants.FieldTypes.EntitySelect, editModel.Name);
                if (editModel.AdvEntitySelectableItemModels.Any())
                {
                    var entityGroup = core.EntityGroupRead(groupCreate.EntityGroupMUId);
                    var nextItemUid = entityGroup.EntityGroupItemLst.Count;
                    foreach (var entityItem in editModel.AdvEntitySelectableItemModels)
                    {
                        entityGroup.EntityGroupItemLst.Add(new EntityItem(entityItem.Name,
                            entityItem.Description, nextItemUid.ToString(), Constants.WorkflowStates.Created));
                        nextItemUid++;
                    }
                    core.EntityGroupUpdate(entityGroup);
                }
                return new OperationResult(true, $"{groupCreate.EntityGroupMUId} created successfully");
            }
            catch (Exception)
            {
                return new OperationResult(false, "Searchable list creation failed");
            }
        }

        [HttpPost]
        [Route("api/selectable-groups/update")]
        public OperationResult UpdateEntityGroup(AdvEntitySelectableGroupEditModel editModel)
        {
            try
            {
                var core = _coreHelper.GetCore();
                var entityGroup = core.EntityGroupRead(editModel.GroupUid);
                entityGroup.EntityGroupItemLst = editModel.AdvEntitySelectableItemModels;
                entityGroup.Name = editModel.Name;
                core.EntityGroupUpdate(entityGroup);
                return new OperationResult(true, $"{editModel.GroupUid} updated successfully");
            }
            catch (Exception)
            {
                return new OperationResult(false, "Searchable list creation failed");
            }
        }

        [HttpGet]
        [Route("api/selectable-groups/get/{entityGroupUid}")]
        public OperationDataResult<EntityGroup> GetEntityGroup(string entityGroupUid)
        {
            try
            {
                var core = _coreHelper.GetCore();

                var entityGroup = core.EntityGroupRead(entityGroupUid);

                return new OperationDataResult<EntityGroup>(true, entityGroup);
            }
            catch (Exception)
            {
                return new OperationDataResult<EntityGroup>(false, "Error when obtaining searchable list");
            }
        }

        [HttpGet]
        [Route("api/selectable-groups/dict/{entityGroupUid}")]
        public OperationDataResult<List<CommonDictionaryTextModel>> GetEntityGroupDictionary(string entityGroupUid)
        {
            try
            {
                var core = _coreHelper.GetCore();

                var entityGroup = core.EntityGroupRead(entityGroupUid);

                var mappedEntityGroupDict = new List<CommonDictionaryTextModel>();

                foreach (var entityGroupItem in entityGroup.EntityGroupItemLst)
                {
                    mappedEntityGroupDict.Add(new CommonDictionaryTextModel()
                    {
                        Id = entityGroupItem.MicrotingUId,
                        Text = entityGroupItem.Name
                    });
                }

                return new OperationDataResult<List<CommonDictionaryTextModel>>(true, mappedEntityGroupDict);
            }
            catch (Exception)
            {
                return new OperationDataResult<List<CommonDictionaryTextModel>>(false,
                    "Error when obtaining searchable list");
            }
        }

        [HttpGet]
        [Route("api/selectable-groups/delete/{entityGroupUid}")]
        public OperationResult DeleteEntityGroup(string entityGroupUid)
        {
            try
            {
                var core = _coreHelper.GetCore();


                return core.EntityGroupDelete(entityGroupUid)
                    ? new OperationResult(true, $"{entityGroupUid} deleted successfully")
                    : new OperationResult(false, "Error when deleting searchable list");
            }
            catch (Exception )
            {
                return new OperationResult(false, "Error when deleting searchable list");
            }
        }


        [HttpPost]
        [Route("api/selectable-groups/send")]
        public OperationResult SendSearchableGroup(string entityGroupUid)
        {
            try
            {
                var core = _coreHelper.GetCore();


                return new OperationResult(true, $"deleted successfully");
            }
            catch (Exception)
            {
                return new OperationResult(false, "Error when deleting searchable list");
            }
        }
    }
}
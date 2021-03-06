﻿using Microsoft.AspNet.Identity.EntityFramework;

namespace eFormAPI.Web.Infrastructure.Data.Entities
{
    public class EformRoleStore : RoleStore<EformRole, int, EformUserRole>
    {
        public EformRoleStore(BaseDbContext context)
            : base(context)
        {
        }
    }
}
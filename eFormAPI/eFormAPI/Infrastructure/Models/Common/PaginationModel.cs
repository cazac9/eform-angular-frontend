﻿namespace eFormAPI.Web.Infrastructure.Models.Common
{
    public class PaginationModel
    {
        public int PageIndex { get; set; }
        public int PageSize { get; set; }
        public int Offset { get; set; }
    }
}
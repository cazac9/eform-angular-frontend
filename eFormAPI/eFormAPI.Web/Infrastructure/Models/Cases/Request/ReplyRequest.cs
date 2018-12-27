﻿using System.Collections.Generic;

namespace eFormAPI.Web.Infrastructure.Models.Cases.Request
{
    public class ReplyRequest
    {
        public int Id { get; set; }
        public string Label { get; set; }
        public List<CaseEditRequest> ElementList { get; set; }
    }
}
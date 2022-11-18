using System;
using System.Collections.Generic;

namespace API.DTO
{
    public class AddServiceForPassengerInput
    {
        public Guid TicketId { get; set; }
        public ICollection<Guid> ServiceIdList { get; set; }
    }
}

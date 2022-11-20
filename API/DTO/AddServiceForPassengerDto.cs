using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace API.DTO
{
    public class AddServiceForPassengerDto
    {
        public Guid Id { get; set; }
        public string ServiceName { get; set; }
        public float Cost { get; set; }
        public Guid TicketId { get; set; }
    }
}

using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace API.DTO
{
    public class CheckCreateFlightInput
    {
        public Guid PlaneId { get; set; }
        public DateTime DepartureTime { get; set; }
        public DateTime LandedTime { get; set; }
    }
}

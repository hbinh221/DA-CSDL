using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace API.DTO
{
    public class CheckCreateFlightInput
    {
        public Guid PlaneId { get; set; }
        public string DepartureTime { get; set; }
        public string LandedTime { get; set; }
    }
}

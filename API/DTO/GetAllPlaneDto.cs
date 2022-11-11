using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace API.DTO
{
    public class GetAllPlaneDto
    {
        public Guid Id { get; set; }
        public string PlaneName { get; set; }
        public int SeatQuantity { get; set; }
        public string AirlineName { get; set; }
    }
}

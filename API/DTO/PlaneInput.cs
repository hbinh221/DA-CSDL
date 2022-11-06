using System;

namespace API.DTO
{
    public class PlaneInput
    {
        public string PlaneName { get; set; }
        public int SeatQuantity { get; set; }
        public string PlaneType { get; set; }
        public Guid AirlineId { get; set; }
    }
}

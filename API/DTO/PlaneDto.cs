using System;

namespace API.DTO
{
    public class PlaneDto
    {
        public Guid Id { get; set; }
        public string PlaneName { get; set; }
        public int SeatQuantity { get; set; }
        public string PlaneType { get; set; }
        public Guid AirlineId { get; set; }
    }
}

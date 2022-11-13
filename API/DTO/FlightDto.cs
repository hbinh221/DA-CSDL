using System;

namespace API.DTO
{
    public class FlightDto
    {
        public Guid Id { get; set; }
        public string AirlineName { get; set; }
        public Guid AirlineId { get; set; }
        public string FlightNo { get; set; }
        public Guid PlaneId { get; set; }
        public string PlaneName { get; set; }
        public Guid FromLocationId { get; set; }
        public string FromLocation { get; set; }
        public string ToLocation { get; set; }
        public Guid ToLocationId { get; set; }
        public int SeatQuantity { get; set; }
        public DateTime DepartureTime { get; set; }
        public DateTime LandedTime { get; set; }
        public float Cost { get; set; }
        public string Remark { get; set; }
    }
}

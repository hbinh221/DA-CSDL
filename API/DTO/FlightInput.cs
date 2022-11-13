using System;

namespace API.DTO
{
    public class FlightInput
    {
        public string FlightNo { get; set; }
        public Guid? AirlineId { get; set; }
        public Guid PlaneId { get; set; }
        public int SeatQuantity { get; set; }
        public Guid FromLocationId { get; set; }
        public Guid ToLocationId { get; set; }
        public DateTime DepartureTime { get; set; }
        public DateTime LandedTime { get; set; }
        public float Cost { get; set; }
        public string Remark { get; set; }
    }
}

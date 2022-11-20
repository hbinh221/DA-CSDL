using System;

namespace API.DTO
{
    public class FlightForViewDto
    {
        public Guid Id { get; set; }
        public Guid AirlineId { get; set; }
        public string AirlineName { get; set; }
        public string FlightNo { get; set; }
        public Guid PlaneId { get; set; }
        public string PlaneName { get; set; }
        public Guid FromLocationId { get; set; }
        public string FromLocation { get; set; }
        public Guid ToLocationId { get; set; }
        public string ToLocation { get; set; }
        public DateTime DepartureTime { get; set; }
        public DateTime LandedTime { get; set; }
        public DateTime FlightTime { get; set; }
        public int SeatQuantity { get; set; }
        public string BusinessCLass { get; set; }
        public int RemaningBusinessCLassSeat { get; set; }
        public string EconomyCLass { get; set; }
        public int RemaningEconomyCLassSeat { get; set; }
        public float Price { get; set; }
        public string Remark { get; set; }
    }
}

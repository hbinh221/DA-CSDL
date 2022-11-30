using System;

namespace API.DTO
{
    public class GetFlightForPassengerInput
    {
        public string DepartureTime { get; set; }
        public Guid FromLocationId { get; set; }
        public Guid ToLocationId { get; set; }
        public Guid? AirlineId { get; set; }
        public string ValueSort { get; set; }
    }
}

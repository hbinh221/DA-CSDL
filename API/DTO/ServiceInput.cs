using System;

namespace API.DTO
{
    public class ServiceInput
    {
        public string ServiceName { get; set; }
        public float Cost { get; set; }
        public Guid AirlineId { get; set; }
    }
}

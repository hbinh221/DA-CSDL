using System;

namespace API.DTO
{
    public class ServiceDto
    {
        public Guid Id { get; set; }
        public string ServiceName { get; set; }
        public float Cost { get; set; }
        public Guid AirlineId { get; set; }
        public string AirlineName { get; set; }
        public Guid? ParentId { get; set; }
    }
}

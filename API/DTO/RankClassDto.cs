using System;

namespace API.DTO
{
    public class RankClassDto
    {
        public Guid Id { get; set; }
        public Guid FlightId { get; set; }
        public string RankName { get; set; }
        public int BaggageWeight { get; set; }
        public float Price { get; set; }
        public int RemainingSeat { get; set; }
    }
}

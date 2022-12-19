
using System;

namespace API.DTO
{
    public class RemaningTicketDto
    {
        public Guid Id { get; set; }
        public Guid FlightId { get; set; }
        public string Code { get; set; }
        public Guid RankId { get; set; }
        public string RankName { get; set; }
        public float Price { get; set; }
        public int BaggageWeight { get; set; }
        public bool IsReserved { get; set; }
    }
}

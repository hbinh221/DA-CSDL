using System;

namespace API.DTO
{
    public class RankDto
    {
        public Guid Id { get; set; }
        public string RankName { get; set; }
        public float Cost { get; set; }
        public int BaggageWeight { get; set; }
    }
}

using System;

namespace API.DTO
{
    public class PromotionInput
    {
        public string PromotionName { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
        public int Discount { get; set; }
    }
}

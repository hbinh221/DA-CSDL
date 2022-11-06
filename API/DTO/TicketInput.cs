using System;

namespace API.DTO
{
    public class TicketInput
    {
        public string Code { get; set; }
        public float Price { get; set; }
        public string Remark { get; set; }
        public DateTime PaymentDate { get; set; }
        public Guid FlightId { get; set; }
        public Guid? PromotionId { get; set; }
        public Guid ReservationId { get; set; }
        public Guid PassengerId { get; set; }
        public Guid PaymentId { get; set; }
    }
}

using System;

namespace API.DTO
{
    public class TicketInput
    {
        public Guid Id { get; set; }
        public DateTime PaymentDate { get; set; }
        public Guid? PromotionId { get; set; }
        public Guid PassengerId { get; set; }
        public Guid PaymentId { get; set; }
    }
}

﻿using System;

namespace API.DTO
{
    public class GetFlightForPassengerDto
    {
        public Guid Id { get; set; }
        public string FlightNo { get; set; }
        public string PlaneName { get; set; }
        public int SeatQuantity { get; set; }
        public string FromLocation { get; set; }
        public string ToLocation { get; set; }
        public DateTime DepartureTime { get; set; }
        public DateTime LandedTime { get; set; }
        public DateTime FlightTime { get; set; }
        public float Cost { get; set; }
        public string Remark { get; set; }
    }
}
using API.DTO;
using API.Interface;
using Dapper;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Threading.Tasks;

namespace API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TicketController : ControllerBase
    {
        private readonly IConfiguration _config;
        private readonly ISqlDataAccess _db;

        public TicketController(IConfiguration config, ISqlDataAccess db)
        {
            _config = config;
            _db = db;
        }

        [HttpGet("get/remaningticket")]
        public async Task<Response<IEnumerable<RemaningTicketDto>>> GetTicketForPassenger(Guid flightId, Guid rankId)
        {
            var dp_params = new DynamicParameters();
            Response<IEnumerable<RemaningTicketDto>> response = new();
            dp_params.Add("@FlightId", flightId, DbType.Guid);
            dp_params.Add("@RankId", rankId, DbType.Guid);
            var data = await _db.GetAll<RemaningTicketDto>("GetRemaningTicket", dp_params);
            if(data != null)
            {
                response.Code = 200;
                response.Data = data;
            }
            return response;
        }

        [HttpPost("create/ticket")]
        public async Task<Response<List<Guid?>>> CreateTicket(List<TicketInput> input)
        {
            var dp_params = new DynamicParameters();
            Response<List<Guid?>> response = new();
            using (IDbConnection db = new SqlConnection(_config.GetConnectionString("DefaultConnection")))
            {
                foreach (var item in input)
                {
                    // Xử lý trường hợp hành khách không chọn chỗ
                    if (item.Id == null)
                    {
                        string sqlCommand = @"select top 1 t.Id from Ticket t inner join Reservation r on t.ReservationId = r.Id
                            where r.RankId = @RankId and r.IsReserved = 0";
                        dp_params = new DynamicParameters();
                        dp_params.Add("@RankId", item.RankId, DbType.Guid);

                        var ticketId = await db.ExecuteAsync(sqlCommand, dp_params, null, null, CommandType.Text);

                        dp_params.Add("@Id", ticketId, DbType.Guid);
                        dp_params.Add("@PromotionId", item.PromotionId, DbType.Guid);
                        dp_params.Add("@PassengerTmpId", item.PassengerTmpId, DbType.Guid);
                        dp_params.Add("@PaymentId", item.PaymentId, DbType.Guid);
                        dp_params.Add("@PaymentDate", item.PaymentDate, DbType.DateTime2);

                        sqlCommand = "update Ticket set PromotionId = @PromotionId, PassengerTmpId = @PassengerTmpId, " +
                            "PaymentId = @PaymentId, PaymentDate = @PaymentDate where Id = @Id";
                        if (await db.ExecuteAsync(sqlCommand, dp_params, null, null, CommandType.Text) == input.Count)
                        {
                            response.Code = 200;
                            foreach (var ticket in input)
                            {
                                response.Data.Add(ticket.Id);
                            }
                        }
                    }
                    else
                    {
                        dp_params.Add("@Id", item.Id, DbType.Guid);
                        dp_params.Add("@PromotionId", item.PromotionId, DbType.Guid);
                        dp_params.Add("@PassengerTmpId", item.PassengerTmpId, DbType.Guid);
                        dp_params.Add("@PaymentId", item.PaymentId, DbType.Guid);
                        dp_params.Add("@PaymentDate", item.PaymentDate, DbType.DateTime2);

                        string sqlCommand = "update Ticket set PromotionId = @PromotionId, PassengerTmpId = @PassengerTmpId, " +
                            "PaymentId = @PaymentId, PaymentDate = @PaymentDate where Id = @Id";
                        if(await db.ExecuteAsync(sqlCommand, dp_params, null, null, CommandType.Text) == input.Count)
                        {
                            response.Code = 200;
                            foreach(var ticket in input)
                            {

                                response.Data.Add(ticket.Id);
                            }
                        }
                    }
                }    
            };
            return response;
        }
    }
}

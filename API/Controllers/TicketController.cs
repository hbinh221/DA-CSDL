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
        public async Task<IEnumerable<RemaningTicketDto>> GetTicketForPassenger(Guid flightId)
        {
            var dp_params = new DynamicParameters();
            dp_params.Add("@FlightId", flightId, DbType.Guid);
            return await _db.GetAll<RemaningTicketDto>("GetRemaningTicket", dp_params);
        }

        [HttpPost("create/ticket")]
        public async Task<Response<List<Guid>>> CreateTicket(List<TicketInput> input)
        {
            var dp_params = new DynamicParameters();
            Response<List<Guid>> response = new Response<List<Guid>>();
            using (IDbConnection db = new SqlConnection(_config.GetConnectionString("DefaultConnection")))
            {
                foreach (var item in input)
                {
                    dp_params.Add("@Id", item.Id, DbType.Guid);
                    dp_params.Add("@PromotionId", item.PromotionId, DbType.Guid);
                    dp_params.Add("@PassengerId", item.PassengerId, DbType.Guid);
                    dp_params.Add("@PaymentId", item.PaymentId, DbType.Guid);
                    dp_params.Add("@PaymentDate", item.PaymentDate, DbType.DateTime2);

                    string sqlCommand = "update Ticket set PromotionId = @PromotionId, PassengerId = @PassengerId, " +
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
            };

            return response;
        }
    }
}

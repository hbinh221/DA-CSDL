using API.DTO;
using API.Interface;
using Dapper;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
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

        /*[HttpGet("get/ticket")]
        public async Task<IEnumerable> GetTicket()
        {
            var dp_params = new DynamicParameters();

        }*/

        [HttpPost("create/ticket")]
        public async Task<ActionResult> CreateTicket(List<TicketInput> input)
        {
            var dp_params = new DynamicParameters();
            using (IDbConnection db = new SqlConnection(_config.GetConnectionString("DefaultConnection")))
            {
                foreach (var item in input)
                {
                    dp_params.Add("@Code", item.Code, DbType.String);
                    dp_params.Add("@Price", item.Price, DbType.Decimal);
                    dp_params.Add("@Remark", item.Remark, DbType.String);
                    dp_params.Add("@PromotionId", item.PromotionId, DbType.Guid);
                    dp_params.Add("FlightId", item.FlightId, DbType.Guid);
                    dp_params.Add("@ReservationId", item.ReservationId, DbType.Guid);
                    dp_params.Add("@PassengerId", item.PassengerId, DbType.Guid);
                    dp_params.Add("@PaymentId", item.PaymentId, DbType.Guid);
                    dp_params.Add("@PaymentDate", item.PaymentDate, DbType.DateTime2);

               
                    string sqlCommand = "insert into Ticket(Code, Price, Remark, PromotionId, FlightId, ReservationId, PassengerId, PaymentId, PaymentDate)" +
                        "values (@Code, @Price, @Remark, @PromotionId, @FlightId, @ReservationId, @PassengerId, @PaymentId, @PaymentDate)";
                    await db.ExecuteAsync(sqlCommand, dp_params, null, null, CommandType.Text);
                }    
            };

            return Ok("Success");
        }
    }
}

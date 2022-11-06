using API.DTO;
using API.Interface;
using Dapper;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections;
using System.Data;
using System.Data.SqlClient;
using System.Threading.Tasks;

namespace API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class FlightController : ControllerBase
    {
        private readonly IConfiguration _config;
        private readonly ISqlDataAccess _db;

        public FlightController(IConfiguration config, ISqlDataAccess db)
        {
            _config = config;
            _db = db;
        }

        [HttpGet("get/flight")]
        public async Task<IEnumerable> GetFlight(Guid? id, Guid airlineId)
        {
            var dp_params = new DynamicParameters();
            dp_params.Add("@Id", id, DbType.Guid);
            dp_params.Add("@AirlineId", airlineId, DbType.Guid);
            return await _db.GetAll<FlightDto>("GetFlight", dp_params);
        }

        [HttpPost("create/flight")]
        public async Task<ActionResult> CreateService(FlightInput input)
        {
            var dp_params = new DynamicParameters();
            dp_params.Add("@FlightNo", input.FlightNo, DbType.String);
            dp_params.Add("@DepartureTime", input.DepatureTime, DbType.DateTime2);
            dp_params.Add("@LandedTime", input.LandedTime, DbType.DateTime2);
            dp_params.Add("@Cost", input.Cost, DbType.Decimal);
            dp_params.Add("@Remark", input.Cost, DbType.String);
            dp_params.Add("@FromLocationId", input.FromLocationId, DbType.Guid);
            dp_params.Add("@ToLocationId", input.ToLocationId, DbType.Guid);
            dp_params.Add("@PlaneId", input.PlaneId, DbType.Guid);

            using (IDbConnection db = new SqlConnection(_config.GetConnectionString("DefaultConnection")))
            {
                string sqlCommand = "insert into Flight(FlightNo, DepartureTime, LandedTime, Cost, Remark, FromLocationId, ToLocationId, PlaneId)" +
                    "values (@FlightNo, @DepartureTime, @LandedTime, @Cost, @Remark, @FromLocationId, @ToLocationId, @AirlineId)";
                await db.ExecuteAsync(sqlCommand, dp_params, null, null, CommandType.Text);
            };
            return Ok("Success");
        }
    }
}

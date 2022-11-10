using API.DTO;
using API.Interface;
using Dapper;
using Microsoft.AspNetCore.Http;
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
    public class PlaneController : ControllerBase
    {
        private readonly IConfiguration _config;
        private readonly ISqlDataAccess _db;

        public PlaneController(IConfiguration config, ISqlDataAccess db)
        {
            _config = config;
            _db = db;
        }

        [HttpGet("get/plane")]
        public async Task<IEnumerable<PlaneDto>> GetPlane(Guid? id, Guid airlineId)
        {
            var dp_params = new DynamicParameters();
            dp_params.Add("@Id", id, DbType.Guid);
            dp_params.Add("@AirlineId", airlineId, DbType.Guid);
            return await _db.GetAll<PlaneDto>("GetPlane", dp_params);
        }

        [HttpPost("create/plane")]
        public async Task<Response<PlaneDto>> CreatePlane(PlaneInput input)
        {
            var dp_params = new DynamicParameters();
            Response<PlaneDto> response = new Response<PlaneDto>();
            dp_params.Add("@PlaneName", input.PlaneName, DbType.String);
            dp_params.Add("@SeatQuantity", input.SeatQuantity, DbType.Int64);
            dp_params.Add("@AirlineId", input.AirlineId, DbType.Guid);

            using (IDbConnection db = new SqlConnection(_config.GetConnectionString("DefaultConnection")))
            {
                string sqlCommand = "insert into Plane(PlaneName, SeatQuantity, AirlineId)" +
                    "values (@PlaneName, @SeatQuantity, @AirlineId)";
                if(await db.ExecuteAsync(sqlCommand, dp_params, null, null, CommandType.Text) == 1)
                {
                    sqlCommand = "select top 1 * from Plane where AirlineId = @AirlineId order by Id desc";
                    var newData = await db.QueryFirstAsync<PlaneDto>(sqlCommand, dp_params, null, null, CommandType.Text);
                    if(newData != null)
                    {
                        response.Code = 200;
                        response.Data = newData;
                    }
                }
            };
            return response;
        }

        [HttpDelete("delete/plane")]
        public async Task<ActionResult> DeletePlane(Guid id)
        {
            var dp_params = new DynamicParameters();
            dp_params.Add("@Id", id, DbType.Guid);
            using (IDbConnection db = new SqlConnection(_config.GetConnectionString("DefaultConnection")))
            {
                string sqlCommand = "delete from Plane where Id = @Id";
                await db.ExecuteAsync(sqlCommand, dp_params, null, null, CommandType.Text);
            };
            return Ok("Success");
        }
    }
}

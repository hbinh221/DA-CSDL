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
    public class RankController : ControllerBase
    {
        private readonly IConfiguration _config;
        private readonly ISqlDataAccess _db;

        public RankController(IConfiguration config, ISqlDataAccess db)
        {
            _config = config;
            _db = db;
        }

        [HttpGet("get/rank")]
        public async Task<IEnumerable<RankDto>> GetRank(Guid? id)
        {
            var dp_params = new DynamicParameters();
            dp_params.Add("@Id ", id, DbType.Guid);
            return await _db.GetAll<RankDto>("GetRank", dp_params);

        }

        [HttpPost("create/rank")]
        public async Task<Response<RankDto>> CreateRank(RankInput input)
        {
            var dp_params = new DynamicParameters();
            Response<RankDto> response = new Response<RankDto>();
            dp_params.Add("@RankName", input.RankName, DbType.String);
            dp_params.Add("@Cost", input.Cost, DbType.Decimal);
            dp_params.Add("@BaggageWeight", input.BaggageWeight, DbType.Int64);
            using (IDbConnection db = new SqlConnection(_config.GetConnectionString("DefaultConnection")))
            {
                string sqlCommand = "insert into Location(RankName, Cost, BaggageWeight)" +
                    "values (@RankName, @Cost, @BaggageWeight)";
                if(await db.ExecuteAsync(sqlCommand, dp_params, null, null, CommandType.Text) == 1)
                {
                    sqlCommand = "select top 1 * from Rank order by Id desc";
                    var newData = await db.QueryFirstAsync<RankDto>(sqlCommand, null, null, null, CommandType.Text);
                    if(newData != null)
                    {
                        response.Code = 200;
                        response.Data = newData;
                    }    
                }
            };
            return response;
        }

        [HttpDelete("delete/rank")]
        public async Task<ActionResult> DeleteRank(Guid id)
        {
            var dp_params = new DynamicParameters();
            dp_params.Add("@Id", id, DbType.Guid);
            using (IDbConnection db = new SqlConnection(_config.GetConnectionString("DefaultConnection")))
            {
                string sqlCommand = "delete from Rank where Id = @Id";
                await db.ExecuteAsync(sqlCommand, dp_params, null, null, CommandType.Text);
            };
            return Ok("Success");
        }
    }
}

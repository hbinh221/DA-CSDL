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
            dp_params.Add("@RankName", input.RankName.Trim(), DbType.String);
            dp_params.Add("@Cost", input.Cost, DbType.Decimal);
            dp_params.Add("@BaggageWeight", input.BaggageWeight, DbType.Int64);
            using (IDbConnection db = new SqlConnection(_config.GetConnectionString("DefaultConnection")))
            {
                string sqlCommand = "select * from Rank where RankName = @RankName";
                if ((await db.QueryAsync(sqlCommand, dp_params, null, null, CommandType.Text)).AsList().Count == 1)
                {
                    response.Code = 500;
                    response.Data = null;
                    return response;
                }
                else
                {
                    sqlCommand = "insert into Rank(RankName, Cost, BaggageWeight)" +
                        "values (@RankName, @Cost, @BaggageWeight)";
                    if (await db.ExecuteAsync(sqlCommand, dp_params, null, null, CommandType.Text) == 1)
                    {
                        sqlCommand = "select top 1 * from Rank order by Id desc";
                        var newData = await db.QueryFirstAsync<RankDto>(sqlCommand, null, null, null, CommandType.Text);
                        if(newData != null)
                        {
                            response.Code = 200;
                            response.Data = newData;
                        }    
                    }
                }
            };
            return response;
        }

        [HttpPut("update/{id}")]
        public async Task<Response<RankDto>> UpdateRank(Guid id, RankInput input)
        {
            var dp_params = new DynamicParameters();
            Response<RankDto> response = new Response<RankDto>();
            dp_params.Add("@Id", id, DbType.Guid);
            dp_params.Add("@RankName", input.RankName.Trim(), DbType.String);
            dp_params.Add("@Cost", input.Cost, DbType.Decimal);
            dp_params.Add("@BaggageWeight", input.BaggageWeight, DbType.Decimal);
            try
            {
                var newData = await _db.Get<RankDto>("UpdateRank", dp_params);
                if (newData != null)
                {
                    response.Code = 200;
                    response.Data = newData;
                }
            }
            catch (Exception ex)
            {
                response.Code = 500;
                response.Data = null;
                return response;
            }
            return response;
        }

        [HttpDelete("delete/rank")]
        public async Task<Response<RankDto>> DeleteRank(Guid id)
        {
            var dp_params = new DynamicParameters();
            Response<RankDto> response = new Response<RankDto>();
            dp_params.Add("@Id", id, DbType.Guid);
            using (IDbConnection db = new SqlConnection(_config.GetConnectionString("DefaultConnection")))
            {
                string sqlCommand = "select * from Rank where Id = @Id";
                var oldData = await db.QueryFirstAsync<RankDto>(sqlCommand, dp_params, null, null, CommandType.Text);
                if(oldData != null)
                {
                    response.Data = oldData;
                }
                sqlCommand = "delete from Rank where Id = @Id";
                if(await db.ExecuteAsync(sqlCommand, dp_params, null, null, CommandType.Text) == 1)
                {
                    response.Code = 200;
                }
            };
            return response;
        }
    }
}

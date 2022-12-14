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
    public class AirlineController : ControllerBase
    {
        private readonly IConfiguration _config;
        private readonly ISqlDataAccess _db;

        public AirlineController(IConfiguration config, ISqlDataAccess db)
        {
            _config = config;
            _db = db;
        }

        [HttpGet("get/airline")]
        public async Task<Response<IEnumerable<AirlineDto>>> GetAirline(Guid? id, string searchValue)
        {
            var dp_params = new DynamicParameters();
            Response<IEnumerable<AirlineDto>> response = new Response<IEnumerable<AirlineDto>>();
            dp_params.Add("@Id ", id, DbType.Guid);
            dp_params.Add("@SearchValue ", searchValue, DbType.String);
            var newData = await _db.GetAll<AirlineDto>("GetAirline", dp_params);
            if (newData != null)
            {
                response.Code = 200;
                response.Data = newData;
            }
            return response;
        }

        [HttpPost("create/airline")]
        public async Task<Response<AirlineDto>> CreateAirline(string name)
        {
            var dp_params = new DynamicParameters();
            Response<AirlineDto> response = new Response<AirlineDto>();
            dp_params.Add("@AirlineName", name.Trim(), DbType.String);
            using (IDbConnection db = new SqlConnection(_config.GetConnectionString("DefaultConnection")))
            {
                string sqlCommand = "select * from Airline where AirlineName = @AirlineName";
                if ((await db.QueryAsync(sqlCommand, dp_params, null, null, CommandType.Text)).AsList().Count == 1)
                {
                    response.Code = 500;
                    response.Data = null;
                    return response;
                }
                else
                {
                    sqlCommand = "insert into Airline(AirlineName) values (@AirlineName)";
                    if (await db.ExecuteAsync(sqlCommand, dp_params, null, null, CommandType.Text) == 1)
                    {
                        sqlCommand = "select top 1 * from Airline order by Id desc";
                        var newData = await db.QueryFirstAsync<AirlineDto>(sqlCommand, null, null, null, CommandType.Text);
                        if (newData != null)
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
        public async Task<Response<AirlineDto>> UpdatePlane(Guid id, string name)
        {
            var dp_params = new DynamicParameters();
            Response<AirlineDto> response = new Response<AirlineDto>();
            dp_params.Add("@Id", id, DbType.Guid);
            dp_params.Add("@AirlineName", name.Trim(), DbType.String);
            using (IDbConnection db = new SqlConnection(_config.GetConnectionString("DefaultConnection")))
            {
                try
                {
                    var newData = await _db.Get<AirlineDto>("UpdateAirline", dp_params);
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
                
            };
            return response;
        }

        [HttpDelete("delete/airline")]
        public async Task<Response<AirlineDto>> DeleteAirline(Guid id)
        {
            var dp_params = new DynamicParameters();
            Response<AirlineDto> response = new Response<AirlineDto>();
            dp_params.Add("@Id", id, DbType.Guid);
            using (IDbConnection db = new SqlConnection(_config.GetConnectionString("DefaultConnection")))
            {
                string sqlCommand = "select * from Airline where Id = @Id";
                var oldData = await db.QueryFirstAsync<AirlineDto>(sqlCommand, dp_params, null, null, CommandType.Text);

                if (oldData != null)
                {
                    try
                    {

                        sqlCommand = "delete from Airline where Id = @Id";
                        await db.ExecuteAsync(sqlCommand, dp_params, null, null, CommandType.Text);

                        response.Code = 200;
                        response.Data = oldData;
                    }
                    catch
                    {
                        return response;
                    }
                }
            };
            return response;
        }
    }
}

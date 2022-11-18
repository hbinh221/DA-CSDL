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
    public class ServiceController : ControllerBase
    {
        private readonly IConfiguration _config;
        private readonly ISqlDataAccess _db;

        public ServiceController(IConfiguration config, ISqlDataAccess db)
        {
            _config = config;
            _db = db;
        }

        [HttpGet("get/service")]
        public async Task<IEnumerable<ServiceDto>> GetService(Guid? id, Guid airlineId)
        {
            var dp_params = new DynamicParameters();
            dp_params.Add("@Id", id, DbType.Guid); 
            dp_params.Add("@AirlineId", airlineId, DbType.Guid);
            return await _db.GetAll<ServiceDto>("GetService", dp_params);
        }

        [HttpPost("create/service")]
        public async Task<Response<ServiceDto>> CreateService(ServiceInput input)
        {
            var dp_params = new DynamicParameters();
            Response<ServiceDto> response = new Response<ServiceDto>();
            dp_params.Add("@ServiceName", input.ServiceName, DbType.String);
            dp_params.Add("@Cost", input.Cost, DbType.Decimal);
            dp_params.Add("@AirlineId", input.AirlineId, DbType.Guid);

            using (IDbConnection db = new SqlConnection(_config.GetConnectionString("DefaultConnection")))
            {
                string sqlCommand = "insert into Service(ServiceName, Cost, AirlineId)" +
                    "values (@ServiceName, @Cost, @AirlineId)";
                if(await db.ExecuteAsync(sqlCommand, dp_params, null, null, CommandType.Text) == 1)
                {
                    sqlCommand = "select top 1 * from Service order by Id desc";
                    var newData = await db.QueryFirstAsync<ServiceDto>(sqlCommand, null, null, null, CommandType.Text);
                    if(newData != null)
                    {
                        response.Code = 200;
                        response.Data = newData;
                    }
                }
            };
            return response;
        }

        [HttpPut("update/{id}")]
        public async Task<Response<ServiceDto>> UpdateService(Guid id, ServiceInput input)
        {
            var dp_params = new DynamicParameters();
            Response<ServiceDto> response = new Response<ServiceDto>();
            dp_params.Add("@Id", id, DbType.Guid);
            dp_params.Add("@ServiceName", input.ServiceName.Trim(), DbType.String);
            dp_params.Add("@Cost", input.Cost, DbType.Decimal);
            dp_params.Add("@AirlineId", input.AirlineId, DbType.Guid);
            try
            {
                var newData = await _db.Get<ServiceDto>("UpdateService", dp_params);
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

        [HttpDelete("delete/service")]
        public async Task<ActionResult> DeleteService(Guid id)
        {
            var dp_params = new DynamicParameters();
            dp_params.Add("@Id", id, DbType.Guid);
            using (IDbConnection db = new SqlConnection(_config.GetConnectionString("DefaultConnection")))
            {
                string sqlCommand = "delete from Service where Id = @Id";
                await db.ExecuteAsync(sqlCommand, dp_params, null, null, CommandType.Text);
            };
            return Ok("Success");
        }
    }
}

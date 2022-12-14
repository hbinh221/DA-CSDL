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
    public class LocationController : ControllerBase
    {
        private readonly IConfiguration _config;
        private readonly ISqlDataAccess _db;

        public LocationController(IConfiguration config, ISqlDataAccess db)
        {
            _config = config;
            _db = db;
        }


        [HttpGet("get/location")]
        public async Task<Response<IEnumerable<LocationDto>>> GetLocation(Guid? id, string searchValue)
        {
            var dp_params = new DynamicParameters();
            Response<IEnumerable<LocationDto>> response = new();
            dp_params.Add("@Id ", id, DbType.Guid);
            dp_params.Add("@SearchValue ", searchValue, DbType.String);
            var newData = await _db.GetAll<LocationDto>("GetLocation", dp_params);

            if (newData != null)
            {
                response.Code = 200;
                response.Data = newData;
            }
            return response;
        }

        [HttpPost("create/location")]
        public async Task<Response<LocationDto>> CreateLocation(string name)
        {
            var dp_params = new DynamicParameters();
            Response<LocationDto> response = new Response<LocationDto>();
            dp_params.Add("@LocationName", name.Trim(), DbType.String);
            using (IDbConnection db = new SqlConnection(_config.GetConnectionString("DefaultConnection")))
            {

                string sqlCommand = "select * from Location where LocationName = @LocationName";
                if ((await db.QueryAsync(sqlCommand, dp_params, null, null, CommandType.Text)).AsList().Count == 1)
                {
                    response.Code = 500;
                    response.Data = null;
                    return response;
                }
                else
                {
                    sqlCommand = "insert into Location(LocationName) values (@LocationName)";
                    if (await db.ExecuteAsync(sqlCommand, dp_params, null, null, CommandType.Text) == 1)
                    {
                        sqlCommand = "select top 1 * from Location order by Id desc";
                        var newData = await db.QueryFirstAsync<LocationDto>(sqlCommand, dp_params, null, null, CommandType.Text);
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
        public async Task<Response<LocationDto>> UpdateLocation(Guid id, string name)
        {
            var dp_params = new DynamicParameters();
            Response<LocationDto> response = new Response<LocationDto>();
            dp_params.Add("@Id", id, DbType.Guid);
            dp_params.Add("@LocationName", name.Trim(), DbType.String);
            try
            {
                var newData = await _db.Get<LocationDto>("UpdateLocation", dp_params);
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

        [HttpDelete("delete/location")]
        public async Task<Response<LocationDto>> DeleteLocation(Guid id)
        {
            var dp_params = new DynamicParameters();
            Response<LocationDto> response = new Response<LocationDto>();
            dp_params.Add("@Id", id, DbType.Guid);

            using (IDbConnection db = new SqlConnection(_config.GetConnectionString("DefaultConnection")))
            {
                string sqlCommand = "select * from Location where Id = @Id";
                var oldData = await db.QueryFirstAsync<LocationDto>(sqlCommand, dp_params, null, null, CommandType.Text);

                if (oldData != null)
                {
                    sqlCommand = "delete from Location where Id = @Id";
                    await db.ExecuteAsync(sqlCommand, dp_params, null, null, CommandType.Text);

                    response.Code = 200;
                    response.Data = oldData;
                }
            };

            return response;
        }
    }
}

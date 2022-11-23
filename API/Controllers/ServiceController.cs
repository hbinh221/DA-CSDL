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
        public async Task<Response<IEnumerable<ServiceDto>>> GetService(Guid? id, Guid? airlineId, string searchValue)
        {
            var dp_params = new DynamicParameters();
            var response = new Response<IEnumerable<ServiceDto>>();
            dp_params.Add("@Id", id, DbType.Guid); 
            dp_params.Add("@AirlineId", airlineId, DbType.Guid);
            dp_params.Add("@SearchValue ", searchValue, DbType.String);

            var newData = await _db.GetAll<ServiceDto>("GetService", dp_params);
            if(newData != null)
            {
                response.Code = 200;
                response.Data = newData;
            }
            return response;
        }

        [HttpPost("create/service")]
        public async Task<Response<ServiceDto>> CreateService(ServiceInput input)
        {
            var dp_params = new DynamicParameters();
            Response<ServiceDto> response = new();
            dp_params.Add("@ServiceName", input.ServiceName, DbType.String);
            dp_params.Add("@Cost", input.Cost, DbType.Decimal);
            dp_params.Add("@AirlineId", input.AirlineId, DbType.Guid);

            using (IDbConnection db = new SqlConnection(_config.GetConnectionString("DefaultConnection")))
            {
                string sqlCommand = "insert into Service(ServiceName, Cost, AirlineId)" +
                    "values (@ServiceName, @Cost, @AirlineId)";
                try
                {
                    if(await db.ExecuteAsync(sqlCommand, dp_params, null, null, CommandType.Text) == 1)
                    {
                        sqlCommand = "select s.Id, s.ServiceName, s.Cost, s.AirlineId, a.AirlineName from Airline a " +
                            "inner join Service s on a.Id = s.AirlineId order by Id desc";
                        var newData = await db.QueryFirstAsync<ServiceDto>(sqlCommand, null, null, null, CommandType.Text);
                        if(newData != null)
                        {
                            response.Code = 200;
                            response.Data = newData;
                        }
                    }
                } catch(Exception ex)
                {
                    response.Code = 500;
                    response.Data = null;
                    return response;
                }
            };
            return response;
        }

        [HttpPost("add-service-for-passenger")]
        public async Task<Response<IEnumerable<AddServiceForPassengerDto>>> AddServiceForPassenger(AddServiceForPassengerInput input)
        {

            Response<IEnumerable<AddServiceForPassengerDto>> response = new();
            using (IDbConnection db = new SqlConnection(_config.GetConnectionString("DefaultConnection")))
            {
                var sqlCommand = "insert into ServiceDetail(ServiceId, TicketId) values (@ServiceId, @TicketId)";
                try
                {
                    foreach(var serviceId in input.ServiceIdList)
                    {
                        var dp_params = new DynamicParameters();
                        dp_params.Add("TicketId", input.TicketId, DbType.Guid);
                        dp_params.Add("@ServiceId", serviceId, DbType.Guid);
                        await db.ExecuteAsync(sqlCommand, dp_params, null, null, CommandType.Text);
                    }
                    sqlCommand = "select s.Id, s.ServiceName, s.Cost, sd.TicketId from Service s inner join ServiceDetail sd on s.Id = sd.ServiceId";
                    var data = await db.QueryAsync<AddServiceForPassengerDto>(sqlCommand, null, null, null, CommandType.Text);
                    if(data.AsList().Count == input.ServiceIdList.Count)
                    {
                        response.Code = 200;
                        response.Data = data;
                    }
                }
                catch(Exception ex)
                {
                    response.Code = 500;
                    response.Data = null;
                    return response;
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
        public async Task<Response<ServiceDto>> DeleteService(Guid id)
        {
            var dp_params = new DynamicParameters();
            Response<ServiceDto> response = new Response<ServiceDto>();

            dp_params.Add("@Id", id, DbType.Guid);
            using (IDbConnection db = new SqlConnection(_config.GetConnectionString("DefaultConnection")))
            {
                string sqlCommand = "select s.Id, s.ServiceName, s.Cost, s.AirlineId, a.AirlineName from Airline a " +
                            "inner join Service s on a.Id = s.AirlineId order by Id desc";
                var oldData = await db.QueryFirstAsync<ServiceDto>(sqlCommand, dp_params, null, null, CommandType.Text);

                if (oldData != null)
                {
                    try
                    {
                        sqlCommand = "delete from Service where Id = @Id";
                        await db.ExecuteAsync(sqlCommand, dp_params, null, null, CommandType.Text);

                        response.Code = 200;
                        response.Data = oldData;
                    }
                    catch (Exception ex)
                    {
                        response.Code = 500;
                        response.Data = null;
                        return response;
                    }
                }
            };
            return response;
        }
    }
}

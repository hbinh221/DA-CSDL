using API.DTO;
using API.Interface;
using Dapper;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections;
using System.Collections.Generic;
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
        public async Task<Response<IEnumerable<FlightDto>>> GetFlight(Guid? id, Guid airlineId)
        {
            var dp_params = new DynamicParameters();
            Response<IEnumerable<FlightDto>> response = new Response<IEnumerable<FlightDto>>();

            dp_params.Add("@Id", id, DbType.Guid);
            dp_params.Add("@AirlineId", airlineId, DbType.Guid);

            var newData = await _db.GetAll<FlightDto>("GetFlight", dp_params);

            if (newData != null)
            {
                response.Code = 200;
                response.Data = newData;
            }
            return response;
        }

        [HttpGet("get/flight-for-passenger")]
        public async Task<Response<IEnumerable<GetFlightForPassengerDto>>> GetFlightForPassenger(DateTime departureTime ,Guid fromLocationId, Guid toLocationId, Guid airlineId)
        {
            var dp_params = new DynamicParameters();
            Response<IEnumerable<GetFlightForPassengerDto>> response = new Response<IEnumerable<GetFlightForPassengerDto>>();
            dp_params.Add("@DepartureTime", departureTime, DbType.DateTime2);
            dp_params.Add("@FromLocationId", fromLocationId, DbType.Guid);
            dp_params.Add("@ToLocationId", toLocationId, DbType.Guid);
            dp_params.Add("@AirlineId", airlineId, DbType.Guid);

            var newData = await _db.GetAll<GetFlightForPassengerDto>("GetFlightForPassenger", dp_params);

            if (newData != null)
            {
                response.Code = 200;
                response.Data = newData;
            }
            return response;
        }

        [HttpPost("create/flight")]
        public async Task<Response<FlightDto>> CreateFlight(FlightInput input)
        {
            var dp_params = new DynamicParameters();
            Response<FlightDto> response = new Response<FlightDto>();
            dp_params.Add("@FlightNo", input.FlightNo, DbType.String);
            dp_params.Add("@DepartureTime", input.DepartureTime, DbType.DateTime2);
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
                if(await db.ExecuteAsync(sqlCommand, dp_params, null, null, CommandType.Text) == 1)
                {
                    sqlCommand = "select top 1 * from Flight order by Id desc";
                    var newData = await db.QueryFirstAsync<FlightDto>(sqlCommand, null, null, null, CommandType.Text);
                    if(newData != null)
                    {
                        response.Code = 200;
                        response.Data = newData;
                    }
                }
            };
            return response;
        }

        [HttpPost("check/create-flight")]
        public async Task<Response<bool>> CheckCreateFlight(Guid planeId, DateTime departureTime)
        {
            var dp_params = new DynamicParameters();
            Response<bool> response = new Response<bool>();

            dp_params.Add("@PlaneId", planeId, DbType.Guid);
            dp_params.Add("@DepartureTime", departureTime, DbType.DateTime2);
            var newData = await _db.Get<bool>("CheckCreateFlight", dp_params);

            response.Code = 200;
            response.Data = newData;
            return response;
        }
    }
}
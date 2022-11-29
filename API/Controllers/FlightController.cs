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
        public async Task<Response<IEnumerable<FlightDto>>> GetFlight(Guid? id, Guid? airlineId, string valueSort)
        {
            var dp_params = new DynamicParameters();
            Response<IEnumerable<FlightDto>> response = new Response<IEnumerable<FlightDto>>();

            dp_params.Add("@Id", id, DbType.Guid);
            dp_params.Add("@AirlineId", airlineId, DbType.Guid);
            dp_params.Add("@ValueSort", valueSort, DbType.String);

            var newData = await _db.GetAll<FlightDto>("GetFlight", dp_params);
            foreach(var item in newData)
            {
                dp_params = new DynamicParameters();
                dp_params.Add("@FlightId", item.Id, DbType.Guid);
                item.RankClass = await _db.GetAll<RankClassDto>("GetRankForFlight", dp_params);
            }
            if (newData != null)
            {
                response.Code = 200;
                response.Data = newData;
            }
            return response;
        }

        [HttpPost("get/flight-for-passenger")]
        public async Task<Response<IEnumerable<GetFlightForPassengerDto>>> GetFlightForPassenger(GetFlightForPassengerInput input)
        {
            var dp_params = new DynamicParameters();
            Response<IEnumerable<GetFlightForPassengerDto>> response = new();
            dp_params.Add("@DepartureTime", input.DepartureTime, DbType.DateTime2);
            dp_params.Add("@FromLocationId", input.FromLocationId, DbType.Guid);
            dp_params.Add("@ToLocationId", input.ToLocationId, DbType.Guid);
            dp_params.Add("@AirlineId", input.AirlineId, DbType.Guid);
            dp_params.Add("@ValueSort", input.ValueSort, DbType.String);

            var newData = await _db.GetAll<GetFlightForPassengerDto>("GetFlightForPassenger", dp_params);
            foreach(var data in newData)
            {
                dp_params = new DynamicParameters();
                dp_params.Add("@FlightId", data.Id, DbType.Guid);
                data.RankClass = await _db.GetAll<RankClassDto>("GetRankForFlight", dp_params);
            }

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
            dp_params.Add("@DepartureTime", _db.ConvertStringToDate(input.DepartureTime), DbType.DateTime2);
            dp_params.Add("@LandedTime", _db.ConvertStringToDate(input.LandedTime), DbType.DateTime2);
            dp_params.Add("@Cost", input.Cost, DbType.Decimal);
            dp_params.Add("@Remark", input.Remark, DbType.String);
            dp_params.Add("@FromLocationId", input.FromLocationId, DbType.Guid);
            dp_params.Add("@ToLocationId", input.ToLocationId, DbType.Guid);
            dp_params.Add("@PlaneId", input.PlaneId, DbType.Guid);

            using (IDbConnection db = new SqlConnection(_config.GetConnectionString("DefaultConnection")))
            {
                string sqlCommand = "insert into Flight(FlightNo, DepartureTime, LandedTime, Cost, Remark, FromLocationId, ToLocationId, PlaneId)" +
                    "values (@FlightNo, @DepartureTime, @LandedTime, @Cost, @Remark, @FromLocationId, @ToLocationId, @PlaneId)";
                if (await db.ExecuteAsync(sqlCommand, dp_params, null, null, CommandType.Text) > 1)
                {
                    sqlCommand = "select top 1 " +
                            "f.Id, " +
                            "a.Id as AirlineId, " +
                            "a.AirlineName, " +
                            "f.FlightNo, " +
                            "f.PlaneId, " +
                            "p.PlaneName, " +
                            "p.SeatQuantity, " +
                            "f.FromLocationId, " +
                            "f.ToLocationId, " +
                            "fl.LocationName as FromLocation, " +
                            "tl.LocationName as ToLocation, " +
                            "f.DepartureTime, " +
                            "f.LandedTime, " +
                            "f.Cost, " +
                            "f.Remark " +
                        " from Airline a " +
                        " inner join Plane p on a.Id = p.AirlineId" +
                        " inner join Flight f on p.Id = f.PlaneId" +
                        " inner join Location fl on f.FromLocationId = fl.Id" +
                        " inner join Location tl on f.ToLocationId = tl.Id order by f.Id desc";
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
        public async Task<Response<bool>> CheckCreateFlight(CheckCreateFlightInput input)
        {
            var dp_params = new DynamicParameters();
            Response<bool> response = new Response<bool>();

            dp_params.Add("@PlaneId", input.PlaneId, DbType.Guid);
            dp_params.Add("@DepartureTime", _db.ConvertStringToDate(input.DepartureTime), DbType.DateTime2);
            dp_params.Add("@LandedTime", _db.ConvertStringToDate(input.LandedTime), DbType.DateTime2);
            var newData = await _db.Get<bool>("CheckCreateFlight", dp_params);

            response.Code = 200;
            response.Data = newData;
            return response;
        }

        [HttpDelete("delete/flight")]
        public async Task<Response<FlightDto>> DeleteFlight(Guid id)
        {
            var dp_params = new DynamicParameters();
            Response<FlightDto> response = new Response<FlightDto>();
            dp_params.Add("@Id", id, DbType.Guid);

            using (IDbConnection db = new SqlConnection(_config.GetConnectionString("DefaultConnection")))
            {
                string sqlCommand = "select f.Id, a.AirlineName, f.FlightNo, p.PlaneName, p.SeatQuantity, fl.LocationName as FromLocation, " +
                    "tl.LocationName as ToLocation, f.DepartureTime, f.LandedTime, f.Cost, f.Remark from Airline a " +
                    "inner join Plane p on a.Id = p.AirlineId " +
                    "inner join Flight f on p.Id = f.PlaneId " +
                    "inner join Location fl on f.FromLocationId = fl.Id " +
                    "inner join Location tl on f.ToLocationId = tl.Id " +
                    "where f.Id = @Id order by f.Id desc";

                var oldData = await db.QueryFirstAsync<FlightDto>(sqlCommand, dp_params, null, null, CommandType.Text);
                if(oldData != null)
                {
                    response.Data = oldData;
                }
                sqlCommand = "delete from Flight where Id = @Id";
                if (await db.ExecuteAsync(sqlCommand, dp_params, null, null, CommandType.Text) >= 1)
                {
                    response.Code = 200;
                }
            }
            return response;
        }
    }
}
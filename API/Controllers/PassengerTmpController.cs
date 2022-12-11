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
using System.Linq;
using System.Threading.Tasks;

namespace API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PassengerTmpController : ControllerBase
    {
        private readonly IConfiguration _config;
        private readonly ISqlDataAccess _db;

        public PassengerTmpController(IConfiguration config, ISqlDataAccess db)
        {
            _config = config;
            _db = db;
        }

        [HttpPost("add/passengertmp")]
        public async Task<Response<List<PassengerTmpForViewDto>>> InsertPassengerTmp(List<PassengerTmpDto> input)
        {
            Response<List<PassengerTmpForViewDto>> response = new();
            List<PassengerTmpForViewDto> passengerTmpList = new();
            foreach (PassengerTmpDto passenger in input)
            {
                var dp_params = new DynamicParameters();
                dp_params.Add("@FirstName", passenger.FirstName, DbType.String);
                dp_params.Add("@LastName", passenger.LastName, DbType.String);
                dp_params.Add("@IdCard", passenger.IdCard, DbType.String);
                dp_params.Add("@BirthDay", passenger.BirthDay, DbType.DateTime2);
                dp_params.Add("@Gender", passenger.Gender, DbType.Boolean);
                dp_params.Add("@Phone", passenger.Phone, DbType.String);
                dp_params.Add("@Email", passenger.Email, DbType.String);
                //dp_params.Add("@Password", passenger.Password, DbType.String);
                //dp_params.Add("@IsAdmin", false, DbType.Boolean);
                PassengerTmpForViewDto passengerTmp = await _db.Get<PassengerTmpForViewDto>("InsertPassengerTmpList", dp_params);
                if (passengerTmp != null)
                {
                    passengerTmpList.Add(passengerTmp);
                }

            }
            if (passengerTmpList.Count == input.Count)
            {
                response.Code = 200;
                response.Data = passengerTmpList;
            }
            return response;
        }
    }
}

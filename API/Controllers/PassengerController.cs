using API.DTO;
using API.Interface;
using Dapper;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Data;
using System.Threading.Tasks;

namespace API.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class PassengerController : ControllerBase
    {
        private readonly IConfiguration _config;
        private readonly ISqlDataAccess _db;

        public PassengerController(IConfiguration config, ISqlDataAccess db)
        {
            _config = config;
            _db = db;
        }

        [HttpPost("login")]
        public async Task<ActionResult> Login(LoginInput input)
        {
            var dp_params = new DynamicParameters();
            dp_params.Add("@Email", input.Email, DbType.String);
            LoginDto user = await _db.Get<LoginDto>("Signin", dp_params);
            if(user == null)
            {
                return BadRequest("Email invalid");
            }
            else if(user.Password != input.Password)
            {
                return BadRequest("Password invalid");
            }
            return Ok(user);
        }

        [HttpGet("get/location")]
        public async Task<IEnumerable<LocationDto>> GetLocation(Guid? id)
        {
            var dp_params = new DynamicParameters();
            dp_params.Add("@Id ", id, DbType.Guid);
            return await _db.GetAll<LocationDto>("GetLocation", dp_params);

        }
    }
}

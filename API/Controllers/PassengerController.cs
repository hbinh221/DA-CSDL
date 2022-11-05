using API.DTO;
using API.Interface;
using Dapper;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
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
            return Ok("Success");
        }

        [HttpPost("register")]
        public async Task<ActionResult> Register(RegisterDto input)
        {
            var dp_params = new DynamicParameters();
            dp_params.Add("@FirstName", input.FirstName, DbType.String);
            dp_params.Add("@LastName", input.LastName, DbType.String);
            dp_params.Add("@IdCard", input.IdCard, DbType.String);
            dp_params.Add("@BirthDay", input.BirthDay, DbType.DateTime2);
            dp_params.Add("@Gender", input.Gender, DbType.Boolean);
            dp_params.Add("@Phone", input.Phone, DbType.String);
            dp_params.Add("@Email", input.Email, DbType.String);
            dp_params.Add("@Password", input.Password, DbType.String);
            dp_params.Add("@IsAdmin", true, DbType.Boolean);
            using (IDbConnection db = new SqlConnection(_config.GetConnectionString("DefaultConnection")))
            {
                string sqlCommand = "insert into Passenger(FirstName, LastName, IdCard, BirthDay, Gender, Phone, Email, Password, IsAdmin)" +
                    "values (@FirstName, @LastName,@IdCard,@BirthDay,@Gender,@Phone,@Email,@Password,@IsAdmin)";
                await db.ExecuteAsync(sqlCommand, dp_params, null, null, CommandType.Text);
            };
            return Ok("Success");
        }

        [HttpPost("addpassenger")]
        public async Task<ActionResult> InsertPassenger(List<PassengerDto> input)
        {
            var dp_params = new DynamicParameters();
            foreach(PassengerDto passenger in input)
            {
                dp_params.Add("@FirstName", passenger.FirstName, DbType.String);
                dp_params.Add("@LastName", passenger.LastName, DbType.String);
                dp_params.Add("@IdCard", passenger.IdCard, DbType.String);
                dp_params.Add("@BirthDay", passenger.BirthDay, DbType.DateTime2);
                dp_params.Add("@Gender", passenger.Gender, DbType.Boolean);
                dp_params.Add("@Phone", passenger.Phone, DbType.String);
                dp_params.Add("@Email", passenger.Email, DbType.String);
                dp_params.Add("@Password", passenger.Password, DbType.String);
                dp_params.Add("@IsAdmin", false, DbType.Boolean);
                using (IDbConnection db = new SqlConnection(_config.GetConnectionString("DefaultConnection")))
                {
                    string sqlCommand = "insert into Passenger(FirstName, LastName, IdCard, BirthDay, Gender, Phone, Email, Password, IsAdmin)" +
                        "values (@FirstName, @LastName,@IdCard,@BirthDay,@Gender,@Phone,@Email,@Password,@IsAdmin)";
                    await db.ExecuteAsync(sqlCommand, dp_params, null, null, CommandType.Text);
                };
            }
            return Ok("Success");
        }

        [HttpPost("checkemail")]
        public async Task<bool> CheckDuplicateEmail(string email)
        {
            var dp_params = new DynamicParameters();
            dp_params.Add("@Email", email, DbType.String);
            bool isDuplicate = await _db.Get<bool>("CheckDuplicateEmail", dp_params);
            return isDuplicate;
        }

        
    }
}

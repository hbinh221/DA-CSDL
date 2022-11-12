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
    [Route("api/[controller]")]
    public class PassengerController : ControllerBase
    {
        private readonly IConfiguration _config;
        private readonly ISqlDataAccess _db;

        public PassengerController(IConfiguration config, ISqlDataAccess db)
        {
            _config = config;
            _db = db;
        }

        [HttpGet("get/admin")]
        public async Task<Response<IEnumerable<AdminDto>>> GetAdmin(Guid id)
        {
            var dp_params = new DynamicParameters();
            Response<IEnumerable<AdminDto>> response = new Response<IEnumerable<AdminDto>>();
            dp_params.Add("@Id", id, DbType.Guid);
            var data = await _db.GetAll<AdminDto>("GetAdmin", dp_params);
            if(data.Count != 0)
            {
                response.Code = 200;
                response.Data = data;
            }

            return response;
        }

        [HttpPost("login")]
        public async Task<Response<LoginDto>> Login(LoginInput input)
        {
            var dp_params = new DynamicParameters();
            Response<LoginDto> response = new Response<LoginDto>();
            dp_params.Add("@Email", input.Email, DbType.String);
            LoginDto user = await _db.Get<LoginDto>("Signin", dp_params);
            if(user == null)
            {
                response.Code = 400;
                response.Data = null;
                return response;
            }
            else if(user.Password != input.Password)
            {
                response.Code = 400;
                response.Data = null;
                return response;
            }
            response.Code = 200;
            response.Data = user;
            return response;
        }

        [HttpPost("register")]
        public async Task<Response<AdminDto>> Register(RegisterDto input)
        {
            var dp_params = new DynamicParameters();
            Response<AdminDto> response = new Response<AdminDto>();
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
                if(await db.ExecuteAsync(sqlCommand, dp_params, null, null, CommandType.Text) == 1)
                {
                    sqlCommand = "select top 1 * from Passenger where IsAdmin = 1 order by Id desc";
                    var newData = await db.QueryFirstAsync<AdminDto>(sqlCommand, null, null, null, CommandType.Text);
                    if(newData != null)
                    {
                        response.Code = 200;
                        response.Data = newData;
                    }
                }
            };
            return response;
        }

        [HttpPost("add/passenger")]
        public async Task<Response<string>> InsertPassenger(List<PassengerDto> input)
        {
            var dp_params = new DynamicParameters();
            Response<string> response = new Response<string>();
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
                    if(await db.ExecuteAsync(sqlCommand, dp_params, null, null, CommandType.Text) == input.Count)
                    {
                        response.Code = 200;
                        response.Data = "Success";
                    }
                };
            }
            return response;
        }

        [HttpPost("checkemail")]
        public async Task<bool> CheckDuplicateEmail(string email)
        {
            var dp_params = new DynamicParameters();
            dp_params.Add("@Email", email, DbType.String);
            bool isDuplicate = await _db.Get<bool>("CheckDuplicateEmail", dp_params);
            return isDuplicate;
        }

        [HttpDelete("delete/admin")]
        public async Task<Response<AdminDto>> DeleteAdmin(Guid id)
        {
            var dp_params = new DynamicParameters();
            Response<AdminDto> response = new Response<AdminDto>();

            dp_params.Add("@Id", id, DbType.Guid);
            using (IDbConnection db = new SqlConnection(_config.GetConnectionString("DefaultConnection")))
            {

                string sqlCommand = "select * from Passenger where Id = @Id and IsAdmin = 1 ";
                var oldData = await db.QueryFirstAsync<AdminDto>(sqlCommand, dp_params, null, null, CommandType.Text);

                if (oldData != null)
                {
                    sqlCommand = "delete from Passenger where Id = @Id";
                    await db.ExecuteAsync(sqlCommand, dp_params, null, null, CommandType.Text);

                    response.Code = 200;
                    response.Data = oldData;
                }
            };
            return response;
        }
    }
}

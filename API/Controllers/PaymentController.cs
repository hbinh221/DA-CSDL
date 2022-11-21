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
    public class PaymentController : ControllerBase
    {
        private readonly IConfiguration _config;
        private readonly ISqlDataAccess _db;

        public PaymentController(IConfiguration config, ISqlDataAccess db)
        {
            _config = config;
            _db = db;
        }

        [HttpGet("get/payment")]
        public async Task<Response<IEnumerable<PaymentDto>>> GetPayment(Guid? id, string searchValue)
        {
            var dp_params = new DynamicParameters();
            Response<IEnumerable<PaymentDto>> response = new Response<IEnumerable<PaymentDto>>();
            
            dp_params.Add("@Id ", id, DbType.Guid);
            dp_params.Add("@SearchValue ", searchValue, DbType.String);
            var newData = await _db.GetAll<PaymentDto>("GetPayment", dp_params);

            if (newData != null)
            {
                response.Code = 200;
                response.Data = newData;
            }
            return response;
        }

        [HttpPost("create/payment")]
        public async Task<Response<PaymentDto>> CreatePayment(string name)
        {
            var dp_params = new DynamicParameters();
            Response<PaymentDto> response = new Response<PaymentDto>();
            dp_params.Add("@PaymentType", name.Trim(), DbType.String);
            using (IDbConnection db = new SqlConnection(_config.GetConnectionString("DefaultConnection")))
            {
                string sqlCommand = "select * from Payment where PaymentType = @PaymentType";
                if((await db.QueryAsync(sqlCommand, dp_params, null, null, CommandType.Text)).AsList().Count == 1)
                {
                    response.Code = 500;
                    response.Data = null;
                    return response;
                }
                else 
                { 
                    sqlCommand = "insert into Payment(PaymentType)" +
                        "values (@PaymentType)";
                    if (await db.ExecuteAsync(sqlCommand, dp_params, null, null, CommandType.Text) == 1)
                    {
                        sqlCommand = "select top 1 * from Payment order by Id desc";
                        var newData = await db.QueryFirstAsync<PaymentDto>(sqlCommand, null, null, null, CommandType.Text);
                        if(newData != null)
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
        public async Task<Response<PaymentDto>> UpdatePayment(Guid id, string name)
        {
            var dp_params = new DynamicParameters();
            Response<PaymentDto> response = new Response<PaymentDto>();
            dp_params.Add("@Id", id, DbType.Guid);
            dp_params.Add("@PaymentType", name.Trim(), DbType.String);
            try
            {
                var newData = await _db.Get<PaymentDto>("UpdatePayment", dp_params);
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

        [HttpDelete("delete/payment")]
        public async Task<Response<PaymentDto>> DeletePayment(Guid id)
        {
            var dp_params = new DynamicParameters();
            Response<PaymentDto> response = new Response<PaymentDto>();
            dp_params.Add("@Id", id, DbType.Guid);
            using (IDbConnection db = new SqlConnection(_config.GetConnectionString("DefaultConnection")))
            {
                string sqlCommand = "select * from Payment where Id = @Id";
                var oldData = await db.QueryFirstAsync<PaymentDto>(sqlCommand, dp_params, null, null, CommandType.Text);
                if (oldData != null)
                {
                    sqlCommand = "delete from Payment where Id = @Id";
                    await db.ExecuteAsync(sqlCommand, dp_params, null, null, CommandType.Text);

                    response.Code = 200;
                    response.Data = oldData;
                }
            };

            return response;
        }
    }
}

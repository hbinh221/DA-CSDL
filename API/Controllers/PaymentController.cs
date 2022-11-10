﻿using API.DTO;
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
        public async Task<IEnumerable<PaymentDto>> GetPayment(Guid? id)
        {
            var dp_params = new DynamicParameters();
            dp_params.Add("@Id ", id, DbType.Guid);
            return await _db.GetAll<PaymentDto>("GetPayment", dp_params);
        }

        [HttpPost("create/payment")]
        public async Task<ActionResult> CreatePayment(string name)
        {
            var dp_params = new DynamicParameters();
            dp_params.Add("@PaymentName", name, DbType.String);
            using (IDbConnection db = new SqlConnection(_config.GetConnectionString("DefaultConnection")))
            {
                string sqlCommand = "insert into Location(PaymentName)" +
                    "values (@PaymentName)";
                await db.ExecuteAsync(sqlCommand, dp_params, null, null, CommandType.Text);
            };
            return Ok("Success");
        }

        [HttpDelete("delete/payment")]
        public async Task<ActionResult> DeletePayment(Guid id)
        {
            var dp_params = new DynamicParameters();
            dp_params.Add("@Id", id, DbType.Guid);
            using (IDbConnection db = new SqlConnection(_config.GetConnectionString("DefaultConnection")))
            {
                string sqlCommand = "delete from Payment where Id = @Id";
                await db.ExecuteAsync(sqlCommand, dp_params, null, null, CommandType.Text);
            };
            return Ok("Success");
        }
    }
}
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
    public class PromotionController : ControllerBase
    {
        private readonly IConfiguration _config;
        private readonly ISqlDataAccess _db;

        public PromotionController(IConfiguration config, ISqlDataAccess db)
        {
            _config = config;
            _db = db;
        }

        [HttpGet("get/promotion")]
        public async Task<IEnumerable<PromotionDto>> GetPromotion(Guid? id)
        {
            var dp_params = new DynamicParameters();
            dp_params.Add("@Id ", id, DbType.Guid);
            return await _db.GetAll<PromotionDto>("GetPromotion", dp_params);
        }

        [HttpPost("create/promotion")]
        public async Task<ActionResult> CreatePromotion(PromotionInput input)
        {
            var dp_params = new DynamicParameters();
            dp_params.Add("@PromotionName", input.PromotionName, DbType.String); 
            dp_params.Add("@StartDate", input.StartDate, DbType.DateTime2);
            dp_params.Add("@EndDate", input.EndDate, DbType.DateTime2);
            dp_params.Add("@Discount", input.Discount, DbType.Int16);

            using (IDbConnection db = new SqlConnection(_config.GetConnectionString("DefaultConnection")))
            {
                string sqlCommand = "insert into Promotion(PromotionName, StartDate, EndDate, Discount)" +
                    "values (@PromotionName, @StartDate, @EndDate, @Discount)";
                await db.ExecuteAsync(sqlCommand, dp_params, null, null, CommandType.Text);
            };
            return Ok("Success");
        }

        [HttpDelete("delete/promotion")]
        public async Task<ActionResult> DeletePromotion(Guid id)
        {
            var dp_params = new DynamicParameters();
            dp_params.Add("@Id", id, DbType.Guid);
            using (IDbConnection db = new SqlConnection(_config.GetConnectionString("DefaultConnection")))
            {
                string sqlCommand = "delete from Promotion where Id = @Id";
                await db.ExecuteAsync(sqlCommand, dp_params, null, null, CommandType.Text);
            };
            return Ok("Success");
        }
    }
}

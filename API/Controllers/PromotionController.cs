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
        public async Task<Response<IEnumerable<PromotionDto>>> GetPromotion(Guid? id, string searchValue)
        {
            var dp_params = new DynamicParameters();
            Response<IEnumerable<PromotionDto>> response = new();
            dp_params.Add("@Id ", id, DbType.Guid);
            dp_params.Add("@SearchValue ", searchValue, DbType.String);
            var newData = await _db.GetAll<PromotionDto>("GetPromotion", dp_params);
            if (newData != null)
            {
                response.Code = 200;
                response.Data = newData;
            }
            return response;
        }

        [HttpPost("create/promotion")]
        public async Task<Response<PromotionDto>> CreatePromotion(PromotionInput input)
        {
            var dp_params = new DynamicParameters();
            Response<PromotionDto> response = new Response<PromotionDto>();
            dp_params.Add("@PromotionName", input.PromotionName, DbType.String); 
            dp_params.Add("@StartDate", input.StartDate, DbType.DateTime2);
            dp_params.Add("@EndDate", input.EndDate, DbType.DateTime2);
            dp_params.Add("@Discount", input.Discount, DbType.Int16);

            using (IDbConnection db = new SqlConnection(_config.GetConnectionString("DefaultConnection")))
            {
                string sqlCommand = "insert into Promotion(PromotionName, StartDate, EndDate, Discount)" +
                    "values (@PromotionName, @StartDate, @EndDate, @Discount)";
                if(await db.ExecuteAsync(sqlCommand, dp_params, null, null, CommandType.Text) == 1)
                {
                    sqlCommand = "select * from Promotion order by Id desc";
                    var newData = await db.QueryFirstAsync<PromotionDto>(sqlCommand, null, null, null, CommandType.Text);
                    if(newData != null)
                    {
                        response.Code = 200;
                        response.Data = newData;
                    }
                }
            };
            return response;
        }

        [HttpPut("update/{id}")]
        public async Task<Response<PromotionDto>> UpdatePromotion(Guid id, PromotionInput input)
        {
            var dp_params = new DynamicParameters();
            Response<PromotionDto> response = new Response<PromotionDto>();
            dp_params.Add("@Id", id, DbType.Guid);
            dp_params.Add("@PromotionName", input.PromotionName.Trim(), DbType.String);
            dp_params.Add("@StartDate", input.StartDate, DbType.DateTime2);
            dp_params.Add("@EndDate", input.EndDate, DbType.DateTime2);
            dp_params.Add("@Discount", input.Discount, DbType.Decimal);
            try
            {
                var newData = await _db.Get<PromotionDto>("UpdatePromotion", dp_params);
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

        [HttpDelete("delete/promotion")]
        public async Task<Response<PromotionDto>> DeletePromotion(Guid id)
        {
            var dp_params = new DynamicParameters();
            Response<PromotionDto> response = new Response<PromotionDto>();
            dp_params.Add("@Id", id, DbType.Guid);
            using (IDbConnection db = new SqlConnection(_config.GetConnectionString("DefaultConnection")))
            {
                string sqlCommand = "select * from Promotion where Id = @Id";
                var oldData = await db.QueryFirstAsync<PromotionDto>(sqlCommand, dp_params, null, null, CommandType.Text);
                if(oldData != null)
                {
                    response.Data = oldData;
                }
                sqlCommand = "delete from Promotion where Id = @Id";
                if(await db.ExecuteAsync(sqlCommand, dp_params, null, null, CommandType.Text) == 1)
                {
                    response.Code = 200;
                }
            };
            return response;
        }

        [HttpPost("check/expiredpromotion")]
        public async Task<Response<bool>> CheckExpiredPromotion([FromForm] string promotionName)
        {
            var dp_params = new DynamicParameters();
            Response<bool> response = new Response<bool>();
            dp_params.Add("@PromotionName", promotionName, DbType.String);

            using(IDbConnection db = new SqlConnection(_config.GetConnectionString("DefaultConnection")))
            {
                string sqlCommand = "select * from Promotion where PromotionName = @PromotionName and EndDate >= getdate()";
                var data = await db.QueryAsync<PromotionDto>(sqlCommand, dp_params, null, null, CommandType.Text);
                if(data.AsList().Count != 0)
                {
                    response.Code = 200;
                    response.Data = true;
                }
                else
                {
                    response.Code = 200;
                    response.Data = false;
                }
            }
            return response;
        }
    }
}

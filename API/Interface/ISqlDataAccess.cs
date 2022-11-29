using Dapper;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Common;
using System.Threading.Tasks;

namespace API.Interface
{
    public interface ISqlDataAccess
    {
        DbConnection GetDbConnection();
        Task<T> Get<T>(string sp, DynamicParameters parms, CommandType commandType = CommandType.StoredProcedure);
        Task<List<T>> GetAll<T>(string sp, DynamicParameters parms, CommandType commandType = CommandType.StoredProcedure);
        int Execute(string sp, DynamicParameters parms, CommandType commandType = CommandType.StoredProcedure);
        public Task<IEnumerable<T>> LoadData<T, U>(string storedProcedure, U parameters);
        public Task SaveData<T>(string storedProcedure, T parameters);
        public DateTime ConvertStringToDate(string date);
    }
}

using System;
using System.Data;

namespace API.DTO
{
    public class GetAllUserDto
    {
        public GetAllUserDto(DataRow row)
        {
            AppUserId = (Guid)row["AppUserId"];
            FirstName = (string)row["FirstName"];
            LastName = (string)row["LastName"];
            Address = (string)row["Address"];
            Phone = (string)row["Phone"];
            Email = (string)row["Email"];
            Password = (string)row["Password"];
            PermissionCode = (int)row["PermissionCode"];
            DepartmentId = (Guid)row["DepartmentId"];
            PhotoUrl = (string)row["PhotoUrl"];
        }

        public Guid AppUserId { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Address { get; set; }
        public string Phone { get; set; }
        public string Email { get; set; }
        public string Password { get; set; }
        public int PermissionCode { get; set; }
        public Guid DepartmentId { get; set; }
        public string PhotoUrl { get; set; }
    }
}

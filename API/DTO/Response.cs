namespace API.DTO
{
    public class Response<T>
    {
        public int Code { get; set; } = 500;
        public T Data { get; set; }
    }
}

Create or alter proc UpdatePassenger 
	@Id uniqueidentifier, @FirstName nvarchar(30), @LastName nvarchar(10),
	@IdCard nvarchar(12), @Birthday DateTime2, @Gender Bit, @Phone nvarchar(10)
	,@Email nvarchar(50), @Password nvarchar(1000)
as 
begin
	Update Passenger Set FirstName=@FirstName, LastName=@LastName, IdCard=@IdCard,
	BirthDay=@Birthday, Gender=@Gender, Phone=@Phone, Email=@Email, [Password]=@Password
	Where Id=@Id
	SELECT * FROM Passenger Where Id=@Id
end
Go

Create or Alter Proc UpdateAirline
	@Id uniqueidentifier,
	@AirlineName nvarchar(50)
as
begin
	Update Airline Set AirlineName = @AirlineName Where Id=@Id
	Select * From Airline Where Id=@Id
end 
Go

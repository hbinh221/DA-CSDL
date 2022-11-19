create or alter procedure UpdatePassenger 
@Id uniqueidentifier, @FirstName nvarchar(30), @LastName nvarchar(10), @IdCard nvarchar(12), @Birthday DateTime2, @Gender Bit, @Phone nvarchar(10),
@Email nvarchar(50), @Password nvarchar(1000)
as 
begin
	update Passenger set FirstName=@FirstName, LastName=@LastName, IdCard=@IdCard,
	BirthDay=@Birthday, Gender=@Gender, Phone=@Phone, Email=@Email, [Password]=@Password
	where Id=@Id
	select * from Passenger where Id=@Id
end
go
create or alter procedure UpdateAirline
	@Id uniqueidentifier,
	@AirlineName nvarchar(50)
as
begin
	update Airline set AirlineName = @AirlineName where Id=@Id
	select * from Airline where Id=@Id
end
go
create or alter procedure UpdateLocation
@Id uniqueidentifier, @LocationName nvarchar(50)
as
begin
	update Location set LocationName = @LocationName where Id = @Id;
	select Id, LocationName from Location where Id = @Id; 
end
go
create or alter procedure UpdateRank
@Id uniqueidentifier, @RankName nvarchar(20), @Cost money, @BaggageWeight int
as
begin
	update Rank set RankName = @RankName, Cost = @Cost, BaggageWeight = @BaggageWeight where Id = @Id;
	select * from Rank where Id = @Id;
end
go
create or alter procedure UpdatePayment
@Id uniqueidentifier, @PaymentType nvarchar(20)
as
begin
	update Payment set PaymentType = @PaymentType where Id = @Id;	
	select * from Payment where Id = @Id;
end
go
create or alter procedure UpdateService
@Id uniqueidentifier, @ServiceName nvarchar(100), @Cost money, @AirlineId uniqueidentifier
as
begin
	update Service set ServiceName = @ServiceName, Cost = @Cost, AirlineId = @AirlineId where Id = @Id;
	select s.Id, s.ServiceName, s.Cost, s.AirlineId, a.AirlineName from Airline a inner join Service s on a.Id = s.AirlineId where s.Id = @Id;
end
go
create or alter procedure UpdatePlane
@Id uniqueidentifier, @PlaneName nvarchar(20), @SeatQuantity int, @Code nvarchar(8), @AirlineId uniqueidentifier
as
begin
	update Plane set PlaneName = @PlaneName, SeatQuantity = @SeatQuantity, Code = @Code, AirlineId = @AirlineId where Id = @Id;
	select * from Plane where Id = @Id;
end
go
create or alter procedure UpdatePromotion
@Id uniqueidentifier, @PromotionName nvarchar(100), @StartDate datetime2, @EndDate datetime2, @Discount float
as
begin
	update Promotion set PromotionName = @PromotionName, StartDate = @StartDate, EndDate = @EndDate, Discount = @Discount where Id = @Id;
	select * from Promotion where Id = @Id;
end
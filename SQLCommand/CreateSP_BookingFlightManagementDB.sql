-- Create stored procedure
-- After create reservation then create ticket with this reservation
create or alter procedure CrtTicWthRes 
@FlightId uniqueidentifier
with recompile
as
begin
	declare @ReservationList uniqueidentifier, @ReservationQuantity uniqueidentifier;
	set @ReservationList = (select Id from Reservation where FlightId = @FlightId);
	set @ReservationQuantity = count(@ReservationList);
	while @ReservationQuantity > 0
	begin
		insert into Ticket(Code, Price, Remark, PromotionId, FlightId, ReservationId, PassengerId, PaymentId) 
		values ('ASD', 100000)
		set @ReservationQuantity = @ReservationQuantity - 1;
	end;
end;
go
-- SP getall if @Id parameter null or get by Id if @Id parameter is not null
create or alter procedure GetLocation 
@Id uniqueidentifier
with recompile
as
begin
	select * from Location 
	where isnull(@Id, '00000000-0000-0000-0000-000000000000') = '00000000-0000-0000-0000-000000000000' or Id = @Id ;
end;
go
create or alter procedure GetAirline
@Id uniqueidentifier
with recompile
as
begin
	select * from Airline 
	where isnull(@Id, '00000000-0000-0000-0000-000000000000') = '00000000-0000-0000-0000-000000000000' or Id = @Id ;
end;
go
create or alter procedure GetPromotion
@Id uniqueidentifier
with recompile
as
begin
	select * from Promotion 
	where (isnull(@Id, '00000000-0000-0000-0000-000000000000') = '00000000-0000-0000-0000-000000000000')
	or Id = @Id and EndDate <= GETDATE();
end;
go
create or alter procedure GetPayment 
@Id uniqueidentifier
with recompile
as
begin
	select * from Payment 
	where isnull(@Id, '00000000-0000-0000-0000-000000000000') = '00000000-0000-0000-0000-000000000000' or Id = @Id ;
end;
go
-- get plane by airline
create or alter procedure GetPlane 
@Id uniqueidentifier, @AirlineId uniqueidentifier
with recompile
as
begin
	select * from Plane 
	where (isnull(@Id, '00000000-0000-0000-0000-000000000000') = '00000000-0000-0000-0000-000000000000' or Id = @Id)
	and AirlineId = @AirlineId;
end;
go
create or alter procedure GetService
@Id uniqueidentifier, @AirlineId uniqueidentifier
with recompile
as
begin
	select Id, ServiceName, Cost, AirlineId from Service 
	where (isnull(@Id, '00000000-0000-0000-0000-000000000000') = '00000000-0000-0000-0000-000000000000' or Id = @Id)
	and AirlineId = @AirlineId;
end;
go
create or alter procedure Signin
@Email nvarchar(50)
with recompile
as
begin
	select Id, Email, Password, IsAdmin from Passenger 
	where Email = @Email
end;
go
create or alter procedure CheckDuplicateEmail
@Email nvarchar(50)
with recompile
as
begin
	declare @IsDuplicate bit, @DuplicateId uniqueidentifier; 
	set @DuplicateId = (select Id from Passenger where Email = @Email);
	if(isnull(@DuplicateId, '00000000-0000-0000-0000-000000000000') = '00000000-0000-0000-0000-000000000000')
	begin
		set @IsDuplicate = 1;
	end
	else
	begin
		set @IsDuplicate = 0;
	end
	select @IsDuplicate as IsDuplicate;
end;
go
create or alter procedure GetFlight
@Id uniqueidentifier, @AirlineId uniqueidentifier
with recompile
as
begin
	(select f.Id, f.FlightNo, p.PlaneName, p.SeatQuantity, fl.LocationName as FromLocation, tl.LocationName as ToLocation, f.DepartureTime, f.LandedTime, f.Cost, f.Remark 
	from (select * from Airline where Id = @AirlineId) a
	inner join Plane p on a.Id = p.AirlineId
	inner join Flight f on p.Id = f.PlaneId
	inner join Location fl on f.FromLocationId = fl.Id
	inner join Location tl on f.ToLocationId = tl.Id
	where (isnull(@Id, '00000000-0000-0000-0000-000000000000') = '00000000-0000-0000-0000-000000000000' or f.Id = @Id))
end;
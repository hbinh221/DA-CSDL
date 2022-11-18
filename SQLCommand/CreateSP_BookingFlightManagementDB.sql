-- Create stored procedure
-- calculate flight time function
create function dbo.CalcFlightTime(@DepartureDate datetime2, @LandedTime datetime2)
returns nvarchar(8)
as
begin
	declare @FlightTime varchar(8);
	set @FlightTime = convert(varchar(8), dateadd(minute, datediff(minute, convert(time(0), @DepartureDate), convert(time(0), @LandedTime)), 0), 114);
	return @FlightTime;
end
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
create or alter procedure GetRank
@Id uniqueidentifier
with recompile
as
begin
	select * from Rank 
	where isnull(@Id, '00000000-0000-0000-0000-000000000000') = '00000000-0000-0000-0000-000000000000' or Id = @Id ;
end;
go
-- get plane by airline
create or alter procedure GetPlane 
@Id uniqueidentifier, @AirlineId uniqueidentifier
with recompile
as
begin
	select p.Id, p.PlaneName, p.SeatQuantity, p.Code, a.AirlineName, p.AirlineId from Airline a
	inner join Plane p on a.Id = p.AirlineId
	where (isnull(@AirlineId, '00000000-0000-0000-0000-000000000000') = '00000000-0000-0000-0000-000000000000' or a.Id = @AirlineId) 
	and (isnull(@Id, '00000000-0000-0000-0000-000000000000') = '00000000-0000-0000-0000-000000000000' or p.Id = @Id)
end;
go
create or alter procedure GetService
@Id uniqueidentifier, @AirlineId uniqueidentifier
with recompile
as
begin
	select s.Id, s.ServiceName, s.Cost, s.AirlineId, a.AirlineName from Airline a
	inner join Service s on a.Id = s.AirlineId
	where (isnull(@Id, '00000000-0000-0000-0000-000000000000') = '00000000-0000-0000-0000-000000000000' or s.Id = @Id)
	and (isnull(@AirlineId, '00000000-0000-0000-0000-000000000000') = '00000000-0000-0000-0000-000000000000' or s.AirlineId = @AirlineId);
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
	select 
		f.Id, 
		a.Id as AirlineId, 
		a.AirlineName, 
		f.FlightNo, 
		p.Id as PlaneId, 
		p.PlaneName, 
		p.SeatQuantity, 
		fl.Id as FromLocationId, 
		fl.LocationName as FromLocation, 
		tl.Id as ToLocationId, 
		tl.LocationName as ToLocation, 
		f.DepartureTime, 
		f.LandedTime, 
		p.SeatQuantity,
		f.Cost, 
		Remark 
	from (select * from Airline where isnull(@AirlineId, '00000000-0000-0000-0000-000000000000') = '00000000-0000-0000-0000-000000000000' or Id = @AirlineId) a
	inner join Plane p on a.Id = p.AirlineId
	inner join Flight f on p.Id = f.PlaneId
	inner join Location fl on f.FromLocationId = fl.Id
	inner join Location tl on f.ToLocationId = tl.Id
	where isnull(@Id, '00000000-0000-0000-0000-000000000000') = '00000000-0000-0000-0000-000000000000' or f.Id = @Id
end;
go
create or alter procedure GetRemaningTicket
@FlightId uniqueidentifier
with recompile
as
begin
	select t.Code, t.Price, ra.RankName, ra.BaggageWeight from Ticket t 
	inner join Reservation r on t.ReservationId = r.Id
	inner join Rank ra on r.RankId = ra.Id
	where t.FlightId = @FlightId and r.IsReserved = 0
end;
go
-- get all flight in day
create or alter procedure GetFlightForPassenger
@DepartureTime datetime2, @FromLocationId uniqueidentifier, @ToLocationId uniqueidentifier, @AirlineId uniqueidentifier
with recompile
as
begin
	select 
		f.Id, 
		f.FlightNo, 
		p.PlaneName,
		p.SeatQuantity, 
		fl.LocationName as FromLocation, 
		tl.LocationName as ToLocation, 
		f.DepartureTime, 
		f.LandedTime, 
		dbo.CalcFlightTime(f.DepartureTime, f.LandedTime) as FlightTime, 
		--convert(varchar(8),  dateadd(minute, datediff(minute, 
		--convert(time(0), f.DepartureTime), convert(time(0), f.LandedTime)), 0), 114) as FlightTime,
		f.Cost, 
		f.Remark 
	from Airline a
	inner join Plane p on a.Id = p.AirlineId
	inner join (select Id, FlightNo, DepartureTime, LandedTime, Cost, Remark, PlaneId, FromLocationId, ToLocationId
	from Flight where convert(date, DepartureTime) = convert(date, @DepartureTime) 
	--and convert(time, DepartureTime) >= convert(time(0), getdate())
	and FromLocationId = @FromLocationId and ToLocationId = @ToLocationId) f on p.Id = f.PlaneId
	inner join Location fl on f.FromLocationId = fl.Id
	inner join Location tl on f.ToLocationId = tl.Id
	order by Id
end;
go
-- check to create a flight that does not duplicate flight times on one plane
create or alter procedure CheckCreateFlight
@PlaneId uniqueidentifier, @DepartureTime datetime2, @LandedTime datetime2
with recompile
as
begin
	declare @MaxLandedTime datetime2, @IsCreate bit;
	set @MaxLandedTime = (select max(LandedTime) from Flight 
	where PlaneId = @PlaneId and (DepartureTime > @DepartureTime and DepartureTime > @LandedTime) 
	or (LandedTime < @DepartureTime and LandedTime < @LandedTime));
	if (isnull(@MaxLandedTime, '2022-11-13T11:49:46.567Z') = '2022-11-13T11:49:46.567Z')
	begin
		set @IsCreate = 1;
	end;
	else if(@DepartureTime >= @MaxLandedTime)
	begin
		set @IsCreate = 1;
	end
	else
	begin
		set @IsCreate = 0;
	end;
	select @IsCreate as IsCreate;
end
go
create or alter procedure GetAdmin
@Id uniqueidentifier
with recompile
as
begin
	select * from Passenger
	where isnull(@Id, '00000000-0000-0000-0000-000000000000') = '00000000-0000-0000-0000-000000000000' or Id = @Id
	and IsAdmin = 1;
end;
go
create or alter procedure GetTicket
as
begin
	select * from Service
end
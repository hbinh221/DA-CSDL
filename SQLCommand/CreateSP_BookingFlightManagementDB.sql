-- Create stored procedure
-- After create reservation then create ticket with this reservation
create procedure CrtTicWthRes 
@FlightId uniqueidentifier
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

-- SP getall if @Id parameter null or get by Id if @Id parameter is not null
create procedure GetLocation 
@Id uniqueidentifier
as
begin
	select * from Location 
	where isnull(@Id, '00000000-0000-0000-0000-000000000000') = '00000000-0000-0000-0000-000000000000' or Id = @Id ;
end;

create procedure GetAirline
@Id uniqueidentifier
as
begin
	select * from Airline 
	where isnull(@Id, '00000000-0000-0000-0000-000000000000') = '00000000-0000-0000-0000-000000000000' or Id = @Id ;
end;

create procedure GetPromotion
@Id uniqueidentifier
as
begin
	select * from Promotion 
	where (isnull(@Id, '00000000-0000-0000-0000-000000000000') = '00000000-0000-0000-0000-000000000000')
	or Id = @Id and EndDate <= GETDATE();
end;

create procedure GetPayment 
@Id uniqueidentifier
as
begin
	select * from Payment 
	where isnull(@Id, '00000000-0000-0000-0000-000000000000') = '00000000-0000-0000-0000-000000000000' or Id = @Id ;
end;
-- get plane by airline
create procedure GetPlane 
@Id uniqueidentifier, @AirlineId uniqueidentifier
as
begin
	select * from Plane 
	where (isnull(@Id, '00000000-0000-0000-0000-000000000000') = '00000000-0000-0000-0000-000000000000' or Id = @Id)
	and IsChoice = 0 and AirlineId = @AirlineId;
end;

create procedure GetService
@Id uniqueidentifier, @AirlineId uniqueidentifier
as
begin
	select Id, ServiceName, Cost from Service 
	where (isnull(@Id, '00000000-0000-0000-0000-000000000000') = '00000000-0000-0000-0000-000000000000' or Id = @Id)
	and AirlineId = @AirlineId;
end;
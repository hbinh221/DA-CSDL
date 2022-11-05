-- Create stored procedure
-- After create reservation then create ticket with this reservation
create procedure CrtTicWthRes 
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

-- SP getall if @Id parameter null or get by Id if @Id parameter is not null
create procedure GetLocation 
@Id uniqueidentifier
with recompile
as
begin
	select * from Location 
	where isnull(@Id, '00000000-0000-0000-0000-000000000000') = '00000000-0000-0000-0000-000000000000' or Id = @Id ;
end;

exec GetLocation null

create procedure GetAirline
@Id uniqueidentifier
with recompile
as
begin
	select * from Airline 
	where isnull(@Id, '00000000-0000-0000-0000-000000000000') = '00000000-0000-0000-0000-000000000000' or Id = @Id ;
end;

create procedure GetPromotion
@Id uniqueidentifier
with recompile
as
begin
	select * from Promotion 
	where (isnull(@Id, '00000000-0000-0000-0000-000000000000') = '00000000-0000-0000-0000-000000000000')
	or Id = @Id and EndDate <= GETDATE();
end;

create procedure GetPayment 
@Id uniqueidentifier
with recompile
as
begin
	select * from Payment 
	where isnull(@Id, '00000000-0000-0000-0000-000000000000') = '00000000-0000-0000-0000-000000000000' or Id = @Id ;
end;
-- get plane by airline
create procedure GetPlane 
@Id uniqueidentifier, @AirlineId uniqueidentifier
with recompile
as
begin
	select * from Plane 
	where (isnull(@Id, '00000000-0000-0000-0000-000000000000') = '00000000-0000-0000-0000-000000000000' or Id = @Id)
	and AirlineId = @AirlineId;
end;

create procedure GetService
@Id uniqueidentifier, @AirlineId uniqueidentifier
with recompile
as
begin
	select Id, ServiceName, Cost, AirlineId from Service 
	where (isnull(@Id, '00000000-0000-0000-0000-000000000000') = '00000000-0000-0000-0000-000000000000' or Id = @Id)
	and AirlineId = @AirlineId;
end;

drop proc GetService

create procedure Signin
@Email nvarchar(50)
with recompile
as
begin
	select Id, Email, Password, Role from Passenger 
	where Email = @Email
end;

create procedure CheckDuplicateEmail
@Email nvarchar(50)
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

exec CheckDuplicateEmail 'ntdhunter@gmail.co'
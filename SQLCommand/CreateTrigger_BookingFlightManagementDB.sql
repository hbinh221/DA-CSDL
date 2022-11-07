-- Create trigger

-- When create flight then create reservation for this flight base on SeatQuantity of Plane table
create or alter trigger Trg_Flight_Create_Reservation 
	on Flight 
	for insert 
as
begin
	declare @SeatQuantity int, @Index int, @FlightNo nvarchar(10);
	set @SeatQuantity = (select SeatQuantity from Plane where Id = (select PlaneId from inserted));
	set @FlightNo = (select FlightNo from inserted);
	set @Index = 1;
	while (@seatQuantity > 0)
	begin
		insert into Reservation(ReservationNo, ReservationDate, IsReserved, FlightId, RankId)
		values (concat(@FlightNo, '_',cast(@Index as nvarchar(10))), null, 0, (select Id from inserted), null);
		set @Index = @Index + 1;
		set @SeatQuantity = @SeatQuantity - 1;
	end;
end;
go
create or alter trigger Trg_Reservation_Create_Ticket 
	on Reservation 
	after insert 
as
begin
	declare @Alphabet varchar(36) = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789', @Code nvarchar(10), @Price money;
	set @Code = (substring(@Alphabet, convert(int, rand()*36), 1) + 
	substring(@Alphabet, convert(int, rand()*36), 1) +
	substring(@Alphabet, convert(int, rand()*36), 1) +
	substring(@Alphabet, convert(int, rand()*36), 1) +
	substring(@Alphabet, convert(int, rand()*36), 1)); -- make color

	set @Price = (select Cost from Rank where Id = (select RankId from inserted));

	insert into Ticket(Code, Price, Remark, PromotionId, FlightId, ReservationId, PassengerId, PaymentId, PaymentDate)
	values (@Code, @Price, N'', null, (select FlightId from inserted), (select Id from Reservation), null, null, null);
end;

drop trigger Trg_Flight_Create_Reservation





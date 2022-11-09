-- Create trigger

-- When create flight then create reservation for this flight base on SeatQuantity of Plane table
create or alter trigger Trg_Flight_Create_Reservation 
	on Flight 
	after insert 
as
begin
	declare @SeatQuantity int, @Index int, @FlightNo nvarchar(20), @RankId uniqueidentifier;
	set @SeatQuantity = (select SeatQuantity from Plane where Id = (select PlaneId from inserted));
	set @FlightNo = (select FlightNo from inserted);
	--set @SeatQuantity = 250;
	--set @FlightNo = 'FlightNo1';
	set @Index = 1;
	while (@seatQuantity > 0)
	begin
		if @Index <= 20
		begin
			-- 20 first seat with business class
			set @RankId = (select top 1 Id from Rank order by Id desc);
		end;
		else
		begin
			-- remaining seat with economy class
			set @RankId = (select top 1 Id from Rank);
		end;
		insert into Reservation(ReservationNo, ReservationDate, IsReserved, FlightId, RankId)
		values (concat(@FlightNo, '_',cast(@Index as nvarchar(10))), null, 0, (select Id from inserted), @RankId);
		set @Index = @Index + 1;
		set @SeatQuantity = @SeatQuantity - 1;
	end;
end;
go
-- create ticket with reservation
-- After create reservation then create ticket with this reservation
create or alter trigger Trg_Reservation_Create_Ticket 
	on Reservation 
	for insert 
as
begin
	declare @Alphabet varchar(36) = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789', @Code nvarchar(10), @Price money, @Gate nvarchar(10);
	-- make color
	set @Code = (substring(@Alphabet, convert(int, rand()*36), 1) + 
	substring(@Alphabet, convert(int, rand()*36), 1) +
	substring(@Alphabet, convert(int, rand()*36), 1) +
	substring(@Alphabet, convert(int, rand()*36), 1) +
	substring(@Alphabet, convert(int, rand()*36), 1));
	-- make color
	set @Gate = (substring(@Alphabet, convert(int, rand()*36), 1) + 
	substring(@Alphabet, convert(int, rand()*36), 1) +
	substring(@Alphabet, convert(int, rand()*36), 1) +
	substring(@Alphabet, convert(int, rand()*36), 1) +
	substring(@Alphabet, convert(int, rand()*36), 1));
	-- Price = Cost in Rank table + Cost in Flight table
	set @Price = (select Cost from Rank where Id = (select RankId from inserted)) + (select Cost from Flight where Id = (select FlightId from inserted));

	insert into Ticket(Code, Price, Remark, Gate, PromotionId, FlightId, ReservationId, PassengerId, PaymentId, PaymentDate)
	values (@Code, @Price, N'', @Gate, null, (select FlightId from inserted), (select Id from inserted), null, null, null);
end;




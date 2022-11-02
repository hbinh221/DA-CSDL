-- Create trigger

-- When create flight then create reservation for this flight base on SeatQuantity of Plane table
create trigger Trg_Flight_Create_Reservation 
	on Flight 
	after insert 
as
begin
	declare @seatQuantity int, @index int, @flightNo nvarchar(10);
	set @seatQuantity = (select SeatQuantity from Plane where Id = (select Id from inserted));
	set @flightNo = (select FlightNo from inserted);
	set @index = 1;
	while @seatQuantity > 0
	begin
		insert into Reservation(ReservationNo, AcommodationDate, IsReserved, FlightId, RankId)
		values (concat(@flightNo, cast(@index as nvarchar(10))), null, 0, (select Id from inserted), null);
		set @index = @index + 1;
		set @seatQuantity = @seatQuantity - 1;
	end;
end;



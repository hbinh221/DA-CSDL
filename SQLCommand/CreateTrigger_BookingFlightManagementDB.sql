-- Create trigger

-- When create flight then create reservation for this flight base on SeatQuantity of Plane table
create or alter trigger Trg_Flight_Create_Reservation 
	on Flight 
	after insert 
as
begin
	declare @Alphabet varchar(36) = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', @SeatQuantity int, 
		@Row int, @FlightNo nvarchar(20), @RankId uniqueidentifier, @Index int;

	set @SeatQuantity = (select SeatQuantity from Plane where Id = (select PlaneId from inserted));
	set @FlightNo = (select FlightNo from inserted);
	set @Row = 1;

	while (@Row <= @SeatQuantity / 6)
	begin
		while (@Index <= 6)
		begin
			--if @Row = 1
			--begin
			--	-- 6 first seat with business class
			--	set @RankId = (select top 1 Id from Rank order by Id desc);

			--	insert into Reservation(ReservationNo, ReservationDate, IsReserved, FlightId, RankId)
			--	values (concat('A', cast(@Index as nvarchar(10))), null, 0, (select Id from inserted), @RankId);
			--end;
			if @Row = 2
			begin
				-- 6 first seat with business class
				set @RankId = (select top 1 Id from Rank order by Id desc);

				insert into Reservation(ReservationNo, ReservationDate, IsReserved, FlightId, RankId)
				values (concat('A', cast(@Index as nvarchar(10))), null, 0, (select Id from inserted), @RankId);

				insert into Reservation(ReservationNo, ReservationDate, IsReserved, FlightId, RankId)
				values (concat('B', cast(@Index as nvarchar(10))), null, 0, (select Id from inserted), @RankId);
			end;
			if @Row >=3
			begin
				-- remaining seat with economy class
				set @RankId = (select top 1 Id from Rank);
				insert into Reservation(ReservationNo, ReservationDate, IsReserved, FlightId, RankId)
				values (concat(substring(@Alphabet, @Row, 1),cast(@Index as nvarchar(10))), null, 0, (select Id from inserted), @RankId);
			end;

			set @Index = @Index + 1;
		end;

		set @Row = @Row + 1;
		set @Index = 1;
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
	set @Code = substring(@Alphabet, 0, 1)
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

	insert into Ticket(Code, Price, Remark, Gate, PromotionId, FlightId, ReservationId, PassengerTmpId, PaymentId, PaymentDate)
	values (@Code, @Price, N'', @Gate, null, (select FlightId from inserted), (select Id from inserted), null, null, null);
end;
go
create or alter trigger Trg_Delete_Reservation 
	on Flight 
	instead of delete 
as
begin
	delete from Ticket where FlightId = (select Id from deleted);
	delete from Reservation where FlightId = (select Id from deleted);
	delete from Flight where Id = (select Id from deleted);
end;
go
-- update IsReserved in reservation table when ticket have PassengerTmpId
create or alter trigger Trg_Ticket_Update_IsReserved_Reservation 
	on Ticket 
	for update 
as
begin
	if((select IsReserved from Reservation where Id = (select ReservationId from inserted)) <> 1)
	begin 
		update Reservation set IsReserved = 1 where Id = (select ReservationId from inserted);
	end;
end;
go
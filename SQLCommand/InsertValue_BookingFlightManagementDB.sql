-- Insert value

insert into Location(LocationName) values
(N'Hà Nội (HAN), Việt Nam'), 
(N'Tp. Hồ Chí Minh (SGN), Việt Nam'), 
(N'Đà Nẵng (DAD), Việt Nam'),
(N'Phú Quốc (PQC), Việt Nam'),
(N'Nha Trang (CXR), Việt Nam'),
(N'Buôn Ma Thuật (BMV), Việt Nam'),
(N'Cà Mau (CAH), Việt Nam'),
(N'Cần Thơ (VCA), Việt Nam'),
(N'Chu Lai (VCL), Việt Nam'),
(N'Côn Đảo (VCS), Việt Nam'),
(N'Đà Lạt (DLI), Việt Nam');
go
insert into Airline(AirlineName) values
(N'Vietnam Airlines'),
(N'Vietjet Air'),
(N'Pacific Airlines'),
(N'Bamboo Airways'),
(N'Vietstar Airlines');
go
insert into Rank(RankName, Cost, BaggageWeight) values 
(N'Phổ thông', 1000000, 7), 
(N'Thương gia', 2000000, 10);
go
insert into Payment(PaymentType) values 
(N'Thẻ tín dụng'),
(N'Thẻ ghi nợ nội địa'),
(N'Thẻ thanh toán quốc tế'),
(N'Tại nhà');
go
declare @Alphabet varchar(36) = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789', @AirlineId uniqueidentifier,  @Code nvarchar(10);
set @Code = (substring(@Alphabet, convert(int, rand()*36), 1) + 
	substring(@Alphabet, convert(int, rand()*36), 1) +
	substring(@Alphabet, convert(int, rand()*36), 1) +
	substring(@Alphabet, convert(int, rand()*36), 1) +
	substring(@Alphabet, convert(int, rand()*36), 1));
set @AirlineId = (select top 1 Id from Airline);
insert into Plane(PlaneName, SeatQuantity, AirlineId, Code) values 
(N'Plane1', 250, @AirlineId, @Code);
go
insert into Passenger(FirstName, LastName, IdCard, BirthDay, Gender, Phone, Email, Password, IsAdmin) 
values (N'NTD', N'Hunter', N'001201015778', '2001-09-17 16:12:25.113', 1, N'0392047428', N'bykmaimai@gmail.com', N'123456789',1);
go
insert into Passenger(FirstName, LastName, IdCard, BirthDay, Gender, Phone, Email, Password, IsAdmin) 
values (N'An', N'O', N'001201015778', '2001-09-17 16:12:25.113', 1, N'0392047428', N'ano@gmail.com', N'123456789',0);
go
declare @FromLocationId uniqueidentifier, @ToLocationId uniqueidentifier, @PlaneId uniqueidentifier;
set @PlaneId = (select top 1 Id from Plane);
set @FromLocationId = (select top 1 Id from Location);
set @ToLocationId = (select top 1 Id from Location order by Id desc);
insert into Flight(FlightNo, Cost, Remark, DepartureTime, LandedTime, FromLocationId, ToLocationId, PlaneId)
values (N'FlightNo1', 2500000, N'', GETDATE(), DATEADD(HH, 2, GETDATE()), 
@FromLocationId, @ToLocationId, @PlaneId);
go
--set @PlaneId = (select Id from Plane);
--declare @FromLocationId uniqueidentifier, @ToLocationId uniqueidentifier, @PlaneId uniqueidentifier;
--set @FromLocationId = (select top 1 Id from Location);
--set @ToLocationId = (select top 1 Id from Location order by Id desc);
--insert into Flight(FlightNo, Cost, Remark, DepartureTime, LandedTime, FromLocationId, ToLocationId, PlaneId)
--values (N'FlightNo2', 3000000, N'', DATEADD(HH, 6, GETDATE()), DATEADD(HH, 8, GETDATE()), 
--@FromLocationId, @ToLocationId, '58EF1951-7A69-ED11-BE8B-484D7EF0B796');
go
insert into Promotion(PromotionName, StartDate, EndDate, Discount) values
(N'Promotion4',GETDATE(), DATEADD(HH, 2, GETDATE()), 10),
(N'Promotion2',GETDATE(), DATEADD(HH, 2, GETDATE()), 10),
(N'Promotion3',GETDATE(), DATEADD(HH, 2, GETDATE()), 10);
go
insert into Passenger(FirstName, LastName, IdCard, BirthDay, Gender, Phone, Email, IsAdmin) 
values (N'Binh', N'Hoang', N'00120101555', '2001-09-17 16:12:25.113', 1, N'0392047427', N'binhhb@gmail.com', 0);
go
-- get id after insert record but only identity
--SELECT SCOPE_IDENTITY() AS [SCOPE_IDENTITY];  
--GO  
--SELECT @@IDENTITY AS [@@IDENTITY];
select * from Flight
delete from Flight where 
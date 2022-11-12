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
declare @AirlineId uniqueidentifier;
set @AirlineId = (select top 1 Id from Airline);
insert into Plane(PlaneName, SeatQuantity, AirlineId) values 
(N'Plane1', 250, @AirlineId);
go
insert into Passenger(FirstName, LastName, IdCard, BirthDay, Gender, Phone, Email, Password, IsAdmin) 
values (N'NTD', N'Hunter', N'001201015778', '2001-09-17 16:12:25.113', 1, N'0392047428', N'bykmaimai@gmail.com', N'123456789',1);
go
insert into Passenger(FirstName, LastName, IdCard, BirthDay, Gender, Phone, Email, Password, IsAdmin) 
values (N'NTD', N'Hunter', N'001201015778', '2001-09-17 16:12:25.113', 1, N'0392047428', N'ntdhunter@gmail.com', N'123456789',1);
go
declare @FromLocationId uniqueidentifier, @ToLocationId uniqueidentifier, @PlaneId uniqueidentifier;
set @PlaneId = (select top 1 Id from Plane);
set @FromLocationId = (select top 1 Id from Location);
set @ToLocationId = (select top 1 Id from Location order by Id desc);
insert into Flight(FlightNo, Cost, Remark, DepartureTime, LandedTime, FromLocationId, ToLocationId, PlaneId)
values (N'FlightNo2', 2500000, N'', GETDATE(), DATEADD(HH, 2, GETDATE()), 
@FromLocationId, @ToLocationId, @PlaneId);
select * from Passenger
insert into Promotion(PromotionName, StartDate, EndDate, Discount) values
(N'Promotion4',GETDATE(), DATEADD(HH, 2, GETDATE()), 10),
(N'Promotion2',GETDATE(), DATEADD(HH, 2, GETDATE()), 10),
(N'Promotion3',GETDATE(), DATEADD(HH, 2, GETDATE()), 10);

select * from Airline 
select * from Plane 
select * from Location 
select top 1 p.Id, p.PlaneName, p.SeatQuantity, a.AirlineName, p.AirlineId 
from Airline a inner join Plane p on a.Id = p.AirlineId where p.Id = @Id order by p.Id desc
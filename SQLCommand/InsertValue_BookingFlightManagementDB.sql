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

insert into Airline(AirlineName) values
(N'Vietnam Airlines'),
(N'Vietjet Air'),
(N'Pacific Airlines'),
(N'Bamboo Airways'),
(N'Vietstar Airlines');

insert into Passenger(FirstName, LastName, IdCard, BirthDay, Gender, Phone, Email, Password, Role) 
values (N'NTD', N'Hunter', N'001201015778', '2001-09-17 16:12:25.113', 1, N'0392047428', N'bykmaimai@gmail.com', N'123456789',1);
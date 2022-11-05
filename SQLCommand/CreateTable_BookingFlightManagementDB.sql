-- Create table
drop database BookingFlightManagement
go
create database BookingFlightManagement
go
use BookingFlightManagement
go
create table Airline(
	Id uniqueidentifier primary key default newsequentialid(),
	AirlineName nvarchar(50) not null
);
go
create table Location(
	Id uniqueidentifier primary key default newsequentialid(),
	LocationName nvarchar(50) not null
);
go
create table Rank(
	Id uniqueidentifier primary key default newsequentialid(),
	RankName nvarchar(20) not null,
	Cost money not null,
	BaggageWeight int not null
);
go
create table Payment(
	Id uniqueidentifier primary key default newsequentialid(),
	PaymentType nvarchar(20) not null
);
go
create table Passenger(
	Id uniqueidentifier primary key default newsequentialid(),
	FirstName nvarchar(20) not null,
	LastName nvarchar(10) not null,
	IdCard nvarchar(12) not null,
	BirthDay datetime2 not null,
	Gender bit not null, -- 1 male, 0 female
	Phone nvarchar(10) not null,
	Email nvarchar(50) not null,
	Password nvarchar(1000) null,
	IsAdmin bit null -- 1 admin, 0 passenger
);
go
/*create table Baggage(
	Id int identity(1,1) primary key,
	Weight int not null,
	PassengerId int,
	constraint Baggage_Passenger foreign key (PassengerId) references Passenger(Id)
);*/
go
create table Service(
	Id uniqueidentifier primary key default newsequentialid(),
	ServiceName nvarchar(100) not null,
	Cost money not null,
	AirlineId uniqueidentifier not null,
	constraint Service_AirlineId_Foreign foreign key (AirlineId) references Airline(Id)
);
go
create table Plane(
	Id uniqueidentifier primary key default newsequentialid(),
	PlaneName nvarchar(20) not null,
	SeatQuantity int not null,
	Quantity int not null,
	AirlineId uniqueidentifier not null,
	constraint Plane_AirlineId_Foreign foreign key (AirlineId) references Airline(Id)
);
go
create table Flight(
	Id uniqueidentifier primary key default newsequentialid(),
	FlightNo nvarchar(10) not null,
	DepartureTime datetime2 not null,
	LandedTime datetime2 not null,
	Cost money not null,
	Remark nvarchar(max) null,
	FromLocationId uniqueidentifier not null,
	ToLocationId uniqueidentifier not null,
	PlaneId uniqueidentifier not null,
	constraint Flight_FromLocationId_Foreign foreign key (FromLocationId) references Location(Id),
	constraint Flight_ToLocationId_Foreign foreign key (ToLocationId) references Location(Id),
	constraint Flight_PlaneId_Foreign foreign key (PlaneId) references Plane(Id)
);
go
create table Reservation(
	Id uniqueidentifier primary key default newsequentialid(),
	ReservationNo nvarchar(10) not null,
	ReservationDate datetime2 null,
	IsReserved bit not null,
	FlightId uniqueidentifier not null,
	RankId uniqueidentifier null,
	constraint Reservation_FlightId_Foreign foreign key (FlightId) references Flight(Id),
	constraint Reservation_RankId_Foreign foreign key (RankId) references Rank(Id),
);
go
create table Promotion(
	Id uniqueidentifier primary key default newsequentialid(),
	PromotionName nvarchar(100) not null,
	StartDate datetime2 not null,
	EndDate datetime2 not null,
	Discount float not null,
);
go
create table Ticket(
	Id uniqueidentifier primary key default newsequentialid(),
	Code nvarchar(10) not null,
	Price money null,
	Remark nvarchar(max),
	Gate nvarchar(10) null,
	PaymentDate datetime2 not null default getdate(),
	FlightId uniqueidentifier null,
	PassengerId uniqueidentifier null,
	PaymentId uniqueidentifier null,
	ReservationId uniqueidentifier unique null,
	PromotionId uniqueidentifier null,
	constraint Ticket_FlightId_Foreign foreign key (FlightId) references Flight(Id),
	constraint Ticket_PassengerId_Foreign foreign key (PassengerId) references Passenger(Id),
	constraint Ticket_PaymentId_Foreign foreign key (PaymentId) references Payment(Id),
	constraint Ticket_ReservationId_Foreign foreign key (ReservationId) references Reservation(Id),
	constraint Ticket_PromotionId_Foreign foreign key (PromotionId) references Promotion(Id)
);
go
create table ServiceDetail(
	TicketId uniqueidentifier not null,
	ServiceId uniqueidentifier not null,
	constraint ServiceDetail_TicketId_Foreign foreign key (TicketId) references Ticket(Id),
	constraint ServiceDetail_ServiceId_Foreign foreign key (ServiceId) references Service(Id)
);
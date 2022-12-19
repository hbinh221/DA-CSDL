import { RankClassModel } from "./rank-class.model";

export class FlightDataModel {
  airlineName!: string;
  code!: string;
  cost!: number;
  departureTime!: Date;
  flightNo!: string;
  flightTime!: Date;
  fromLocation!: string;
  id!: string;
  landedTime!: Date;
  passengerQuantity!: number;
  planeName!: string;
  rankClass!: RankClassModel[];
  remaningSeat!: number;
  remark!: string;
  seatQuantity!: number;
  toLocation!: string;
}

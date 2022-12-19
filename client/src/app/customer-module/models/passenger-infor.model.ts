import { BaggageModel } from './baggage.model';
import { InsuranceModel } from './insurance.model';
import { MilkTeaModel } from './milk-tea.model';
import { TicketInforModel } from './ticket-infor.model';

export class PassengerInforModel {
  id!: string;
  firstName!: string;
  lastName!: string;
  email!: string;
  phone!: string;
  birthDay!: Date;
  baggageList: BaggageModel[] = [];
  gender: boolean = false;
  idCard!: string;
  insuranceList: InsuranceModel[] = [];
  milkTeaList: MilkTeaModel[] = [];
  ticketInfo: TicketInforModel[] = [];
}

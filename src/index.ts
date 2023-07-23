import { CCompany } from "./Company";
import { COfficer } from "./Officer";
import { Address, AppointmentSearchOptions, Company, CompanyOfficers, Officer, OfficerAppointment, OfficerOrderBy, OfficerRole, OfficerSearchOptions } from "./Types";

export class CompaniesHouse
{
    private _CH_API_KEY: string;
    public Companies: CCompany;
    public Officers: COfficer;

    constructor(CH_API_KEY: string)
    {
        this._CH_API_KEY = CH_API_KEY;
        this.Companies = new CCompany(this._CH_API_KEY);
        this.Officers = new COfficer(this._CH_API_KEY);
    }
}

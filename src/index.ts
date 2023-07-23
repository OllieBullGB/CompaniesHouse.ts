import { getCompany, getRegisteredOfficeAddress } from "./Company";
import { getCompanyOfficer, getCompanyOfficers, getOfficerAppointments, getOfficerAppointmentsByNumber } from "./Officer";
import { Address, AppointmentSearchOptions, Company, CompanyOfficers, Officer, OfficerAppointment, OfficerOrderBy, OfficerRole, OfficerSearchOptions } from "./Types";

export class CompaniesHouse
{
    private _CH_API_KEY: string;
    public Companies: Companies;
    public Officers: Officers;

    constructor(CH_API_KEY: string)
    {
        this._CH_API_KEY = CH_API_KEY;
        this.Companies = new Companies(this._CH_API_KEY);
        this.Officers = new Officers(this._CH_API_KEY);
    }
}

class Companies
{
    private _CH_API_KEY: string;

    constructor(CH_API_KEY: string)
    {
        this._CH_API_KEY = CH_API_KEY;
    }

    async getCompany(companyNumber: string): Promise<Company>
    {
        return await getCompany(companyNumber, this._CH_API_KEY);
    }

    async getRegisteredOfficeAddress(companyNumber: string): Promise<Address>
    {
        return await getRegisteredOfficeAddress(companyNumber, this._CH_API_KEY);
    }
}

class Officers
{
    private _CH_API_KEY: string;

    constructor(CH_API_KEY: string)
    {
        this._CH_API_KEY = CH_API_KEY;
    }

    async getCompanyOfficers(companyNumber: string, options:OfficerSearchOptions = {registerView: false, registerType: OfficerRole.Director, orderBy: OfficerOrderBy.AppointedOn}): Promise<CompanyOfficers>
    {
        return await getCompanyOfficers(companyNumber, this._CH_API_KEY, options);
    }

    async getCompanyOfficer(companyNumber: string, appointmentId: string): Promise<Officer>
    {
        return await getCompanyOfficer(companyNumber, appointmentId, this._CH_API_KEY);
    }

    async getOfficerAppointments(officer: Officer, options: AppointmentSearchOptions = {}): Promise<Array<OfficerAppointment>>
    {
        return await getOfficerAppointments(officer, this._CH_API_KEY, options);
    }

    async getOfficerAppointmentsByNumber(officerNumber: string, options: AppointmentSearchOptions = {}): Promise<Array<OfficerAppointment>>
    {
        return await getOfficerAppointmentsByNumber(officerNumber, this._CH_API_KEY, options);
    }
}
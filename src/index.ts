import { CCompany } from "./Company";
import { useFetch } from "./Fetch";
import { COfficer } from "./Officer";
import { Address, AppointmentSearchOptions, Company, CompanyOfficers, Officer, OfficerAppointment, OfficerOrderBy, OfficerRole, OfficerSearchOptions } from "./Types";

class CompaniesHouse
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

    /**
     * Calls the Companies House API with a given API Key to check if the key is valid
     * @param CH_API_KEY Your Companies House API Key
     * @returns Promise<boolean> - True if the API Key is valid, false if not
     */
    public static async ValidateApiKey(CH_API_KEY: string): Promise<boolean>
    {
        try
        {
            const data: any = await useFetch(`https://api.company-information.service.gov.uk/company/00000006`, CH_API_KEY);

            return true;
        }
        catch(e: any)
        {
            return false;
        }
    }
}

export default CompaniesHouse;
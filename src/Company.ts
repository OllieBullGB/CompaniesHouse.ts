import { Company, Address, Accounts, Charges, Charge, Transaction } from './Types';
import { useFetch } from './Fetch';

export class CCompany
{
    _CH_API_KEY: string;

    constructor(CH_API_KEY: string)
    {
        this._CH_API_KEY = CH_API_KEY;
    }

    public async ValidateCompanyNumber(companyNumber: string): Promise<boolean>
    {
        try
        {
            const data: any = await useFetch(`https://api.company-information.service.gov.uk/company/${companyNumber}`, this._CH_API_KEY);

            return true;
        }
        catch(e: any)
        {
            return false;
        }
    }

    getCompany = async (companyNumber: string): Promise<Company> =>
    {
        const data: any = await useFetch(`https://api.company-information.service.gov.uk/company/${companyNumber}`, this._CH_API_KEY);

        const companyAddress: Address =
        {
            addressLine1: data.registered_office_address.address_line_1,
            addressLine2: data.registered_office_address.address_line_2,
            locality: data.registered_office_address.locality,
            country: data.registered_office_address.country,
            postalCode: data.registered_office_address.postal_code
        }

        const companyAccounts: Accounts =
        {
            accountingReferenceDate:
            {
                day: data.accounts.accounting_reference_date.day,
                month: data.accounts.accounting_reference_date.month,
            },
            lastAccounts:
            {
                madeUpTo: data.accounts.last_accounts.made_up_to,
                type: data.accounts.last_accounts.type,
                periodEndOn: data.accounts.last_accounts.period_end_on,
            }
        }

        const company: Company =
        {
            companyNumber: data.company_number,
            companyName: data.company_name,
            type: data.type,
            dateOfCreation: data.date_of_creation,
            lastFullMembersListDate: data.last_full_members_list_date,
            jurisdiction: data.jurisdiction,
            registeredOfficeAddress: companyAddress,
            accounts: companyAccounts,
            sicCodes: data.sic_codes,
            undeliverableRegisteredOfficeAddress: data.undeliverable_registered_office_address,
            hasInsolvencyHistory: data.has_insolvency_history,
            hasCharges: data.has_charges,
            links: // Link to the current resource
            {
                self: data.links.self,
                filingHistory: data.links.filing_history,
                officers: data.links.officers,
                charges: data.links.charges,
            },
            registeredOfficeIsInDispute: data.registered_office_is_in_dispute,
            dateOfCessation: data.date_of_cessation,
            canFile: data.can_file,
        }

        return company;
    }

    getRegisteredOfficeAddress = async (companyName: string): Promise<Address> =>
    {
        try
        {
            const data: any = await useFetch(`https://api.company-information.service.gov.uk/company/${companyName}/registered-office-address`, this._CH_API_KEY);

            const companyAddress: Address =
            {
                addressLine1: data.address_line_1,
                addressLine2: data.address_line_2,
                locality: data.locality,
                country: data.country,
                postalCode: data.postal_code
            }

            return companyAddress;
        }
        catch(error: any)
        {
            // If the company number is invalid, the API returns a 500 error, instead of an expected 404 error
            if(error.message === 'Error: 500')
            {
                throw new Error('Error: 404');
            }
            else // For all other errors, rethrow the error
            {
                throw error;
            }
        }
    }

    hasRegisters = async (companyName: string): Promise<boolean> =>
    {
        try
        {
            const data: any = await useFetch(`https://api.company-information.service.gov.uk/company/${companyName}/registers`, this._CH_API_KEY);
            return true;
        }
        catch(e: any)
        {
            return false;
        }
    }

    /**
     * I can't find any documentation on this endpoint, so I'm not sure what it's supposed to return
     */
    getRegisters = async (companyName: string): Promise<any> =>
    {
        const data: any = await useFetch(`https://api.company-information.service.gov.uk/company/${companyName}/registers`, this._CH_API_KEY);
        return data;
    }

    getCharges = async (companyName: string): Promise<Charges> =>
    {
        const data: any = await useFetch(`https://api.company-information.service.gov.uk/company/${companyName}/charges`, this._CH_API_KEY);

        const mappedCharges: Array<Charge> = data.items.map((charge: any) => CCompany.dataToCharge(charge));

        const charges: Charges =
        {
            totalCount: data.total_count,
            satisfiedCount: data.satisfied_count,
            partSatisfiedCount: data.part_satisfied_count,
            unfilteredCount: data.unfiltered_count,
            charges: mappedCharges,
        }

        return charges;
    }

    getCharge = async (companyName: string, chargeId: string): Promise<Charge> =>
    {
        const data: any = await useFetch(`https://api.company-information.service.gov.uk/company/${companyName}/charges/${chargeId}`, this._CH_API_KEY);

        const charge: Charge = CCompany.dataToCharge(data);

        return charge;
    }

    private static dataToCharge = (data: any): Charge =>
    {
        const transactions: Array<Transaction> = data.transactions.map((transaction: any) => CCompany.dataToTransaction(transaction));


        const charge: Charge =  
        {
            chargeNumber: data.charge_number,
            personsEntitled: data.persons_entitled,
            status: data.status,
            type: data.classification.type,
            description: data.classification.description,
            deliveredOn: data.delivered_on,
            createdOn: data.created_on,
            self: data.links.self,
            particulars: 
            {
                type: data.particulars.type,
                description: data.particulars.description,
            },
            securedDetails: 
            {
                type: data.secured_details.type,
                description: data.secured_details.description,
            },
            transactions: transactions,
        };

        return charge;
    }

    private static dataToTransaction = (data: any): Transaction =>
    {
        const transaction: Transaction =
        {
            type: data.filing_type,
            deliveredOn: data.delivered_on,
            filing: data.links.filing
        }

        return transaction;
    }
}

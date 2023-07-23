import { Company, Address, Accounts } from './Types';
import { useFetch } from './Fetch';

export const getCompany = async (companyNumber: string, CH_API_KEY: string): Promise<Company> =>
{
    const data: any = await useFetch(`https://api.company-information.service.gov.uk/company/${companyNumber}`, CH_API_KEY);

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

export const getRegisteredOfficeAddress = async (companyName: string, CH_API_KEY: string): Promise<Address> =>
{
    try
    {
        const data: any = await useFetch(`https://api.company-information.service.gov.uk/company/${companyName}/registered-office-address`, CH_API_KEY);

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
export type Company =
{
    companyNumber: string,
    companyName: string,
    type: string,
    dateOfCreation: string,
    lastFullMembersListDate: string,
    jurisdiction: string,
    registeredOfficeAddress: Address,
    accounts: Accounts,
    sicCodes: Array<string>,
    undeliverableRegisteredOfficeAddress: boolean,
    hasInsolvencyHistory: boolean,
    hasCharges: boolean,
    links: // Link to the current resource
    {
        self: string,
        filingHistory: string,
        officers: string,
        charges: string,
    },
    registeredOfficeIsInDispute: boolean,
    dateOfCessation: string,
    canFile: boolean,
}

export type Address =
{
    addressLine1: string,
    addressLine2: string,
    locality: string,
    region?: string,
    country?: string,
    postalCode: string
}

export type Accounts =
{
    accountingReferenceDate:
    {
        day: string,
        month: string,
    },
    lastAccounts:
    {
        madeUpTo: string,
        type: string,
        periodEndOn: string,
    }
}

export type DateOfBirth =
{
    month: number,
    year: number
}

export enum OfficerRole
{
    Director = 'directors',
    Secretary = 'secretaries',
    LLPMember = 'llp-members',
}

export enum OfficerOrderBy
{
    AppointedOn = 'appointed_on',
    ResignedOn = 'resigned_on',
    Surname = 'surname',
}

export type OfficerSearchOptions =
{
    numOfficers?: number,
    registerView?: boolean,
    registerType?: OfficerRole,
    orderBy?: OfficerOrderBy,
}

export type AppointmentSearchOptions =
{
    active?: boolean,
    numAppointments?: number,
}

export type Officer =
{
    links: // Links to the current resource
    {
        self: string, 
        appointments: string,
    },
    name: string,
    address: Address,
    countryOfResidence?: string,
    nationality?: string,
    dateOfBirth?: DateOfBirth,
    occupation?: string,
    appointedOn: string,
    resignedOn?: string,
    role: string,
}

export type OfficerAppointment =
{
    role: string,
    appointedOn: string,
    resignedOn?: string,
    address: Address,
    appointedTo:
    {
        companyNumber: string,
        companyName: string,
        companyStatus: string,
        companyLink: string
    }
}

export type CompanyOfficers =
{
    self: string // Link to the current resource
    activeCount: number,
    inactiveCount: number,
    resignedCount: number,
    totalCount: number,
    officers: Array<Officer>,
}

export type Charges =
{
    totalCount: number,
    satisfiedCount: number,
    partSatisfiedCount: number,
    unfilteredCount: number,
    charges: Array<Charge>
}

export type Charge =
{
    chargeNumber: string,
    personsEntitled: Array<string>,
    status: string,
    type: string,
    description: string,
    deliveredOn: string,
    createdOn: string,
    self: string, // Link to the current resource
    particulars:
    {
        type: string,
        description: string,
    },
    securedDetails:
    {
        type: string,
        description: string,
    },
    transactions: Array<Transaction>
}

export type Transaction =
{
    type: string,
    deliveredOn: string,
    filing: string
}
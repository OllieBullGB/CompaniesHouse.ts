import { Address, CompanyOfficers, DateOfBirth, Officer, OfficerRole, OfficerOrderBy, OfficerSearchOptions, OfficerAppointment, AppointmentSearchOptions } from './Types';
import { useFetch } from './Fetch';

/**
 * List of all company officers
 * @param {string} companyNumber The company number of the officer list being requested.
 * @param {string} CH_API_KEY Your Companies House API key.
 * @param {OfficerSearchOptions} options The options for the officer search.
 * @param {number} options.numOfficers The number of officers to return. default: 10000 (all officers)
 * @param {boolean} options.registerView Display register specific information. If given register is held at Companies House, registerView set to true and correct registerView specified, only active officers will be returned. Those will also have full date of birth.
 * @param {OfficerRole} options.registerType Determines which officer type is returned for the registers view.The field will only work if registerView is set to true
 * @param {OfficerOrderBy} options.orderBy The field by which to order the result set. default: AppointedOn
 * @returns {Promise<CompanyOfficers>} A CompanyOfficers object containing the requested officers.
 */
export const getCompanyOfficers = async (companyNumber: string, CH_API_KEY: string, options: OfficerSearchOptions = {registerView: false, registerType: OfficerRole.Director, orderBy: OfficerOrderBy.AppointedOn}): Promise<CompanyOfficers> =>
{
    const numOfficers: number = options.numOfficers || 10000;
    const registerView: boolean = options.registerView || false;
    const registerType: OfficerRole = options.registerType || OfficerRole.Director;
    const orderBy: OfficerOrderBy = options.orderBy || OfficerOrderBy.AppointedOn;

    if(numOfficers < 0)
    {
        throw new Error('Error: 400 numOfficers must be greater than 0');
    }

    if(registerView && registerType === null)
    {
        throw new Error('Error: 400 registerType must be either \'directors\',  \'secretaries\' or \'llp-members\' if registerView is true');
    }

    const data: any = await useFetch(`https://api.company-information.service.gov.uk/company/${companyNumber}/officers?items_per_page=${numOfficers}&register_view=${registerView}&register_type=${registerType}&order_by=${orderBy}`, CH_API_KEY);
    
    const officers: Array<Officer> = data.items.map((item: any) => dataToCompanyOfficer(item));

    const companyOfficers: CompanyOfficers =
    {
        activeCount: data.active_count,
        inactiveCount: data.inactive_count,
        resignedCount: data.resigned_count,
        totalCount: data.total_results,
        officers: officers,
        self: data.links.self,
    }

    return companyOfficers;
}

/**
 * Get details of an individual company officer appointment
 * @param {string} companyNumber The company number of the officer list being requested.
 * @param {string} appointmentId The appointment id of the company officer appointment being requested.
 * @param {string} CH_API_KEY Your Companies House API key.
 * @returns {Promise<Officer>} An Officer object containing the requested officer.
 */
export const getCompanyOfficer = async (companyNumber: string, appointmentId: string, CH_API_KEY: string): Promise<Officer> =>
{
    const data: any = await useFetch(`https://api.company-information.service.gov.uk/company/${companyNumber}/appointments/${appointmentId}`, CH_API_KEY);

    const companyOfficer: Officer = dataToCompanyOfficer(data);
    return companyOfficer;
}

/**
 * List of all officer appointments
 * @param {Officer} officer The officer whose appointments are being requested.
 * @param {string} CH_API_KEY Your Companies House API key.
 * @param {AppointmentSearchOptions} options The options for the appointment search.
 * @param {boolean} options.active If true, only active appointments will be returned. If false, only resigned appointments will be returned. If not specified, both active and resigned appointments will be returned.
 * @param {number} options.numAppointments The number of appointments to return. default: 10000 (all appointments)
 * @returns {Promise<Array<OfficerAppointment>>} An array of OfficerAppointment objects containing the requested officer appointments.
 */
export const getOfficerAppointments = async (officer: Officer, CH_API_KEY: string, options: AppointmentSearchOptions = {}): Promise<Array<OfficerAppointment>> =>
{
    const officerNumber: string = officer.links.appointments.split('/')[4];
    
    const officerAppointments: Array<OfficerAppointment> = await getOfficerAppointmentsByNumber(officerNumber, CH_API_KEY, options);
    return officerAppointments;
}

/**
 * List of all officer appointments
 * @param {string} officerNumber 	The officer id of the appointment list being requested
 * @param {string} CH_API_KEY Your Companies House API key.
 * @param {AppointmentSearchOptions} options The options for the appointment search.
 * @param {boolean} options.active If true, only active appointments will be returned. If false, only resigned appointments will be returned. If not specified, both active and resigned appointments will be returned.
 * @param {number} options.numAppointments The number of appointments to return. default: 10000 (all appointments)
 * @returns {Promise<Array<OfficerAppointment>>} An array of OfficerAppointment objects containing the requested officer appointments.
 */
export const getOfficerAppointmentsByNumber = async (officerNumber: string, CH_API_KEY: string, options: AppointmentSearchOptions = {}): Promise<Array<OfficerAppointment>> =>
{
    const active: string = options.active ? 'active' : '';
    const numAppointments: number = options.numAppointments || 10000;

    if(numAppointments < 0)
    {
        throw new Error('Error: 400 numAppointments must be greater than 0');
    }

    const data: any = await useFetch(`https://api.company-information.service.gov.uk/officers/${officerNumber}/appointments?filter=${active}&items_per_page=${numAppointments}`, CH_API_KEY);

    const officerAppointments: Array<OfficerAppointment> = data.items.map((item: any) => dataToOfficerAppointment(item));
    return officerAppointments;
}

/**
 * Converts the data returned from the Companies House API into an Officer object
 * @param {any} data The data returned from the Companies House API.
 * @returns {Officer} An Officer object containing the requested officer.
 */
const dataToCompanyOfficer = (data: any): Officer =>
{
    const address: Address =
    {
        addressLine1: data.address.address_line_1,
        addressLine2: data.address.address_line_2,
        locality: data.address.locality,
        country: data.address.country,
        postalCode: data.address.postal_code
    }

    let dateOfBirth: DateOfBirth | undefined = undefined;

    if (data.date_of_birth)
    {
        dateOfBirth =
        {
            month: data.date_of_birth.month,
            year: data.date_of_birth.year,
        }
    }

    const companyOfficer: Officer =
    {
        links: 
        {
            self: data.links.self,
            appointments: data.links.officer.appointments,
        },
        name: data.name,
        address: address,
        countryOfResidence: data.country_of_residence,
        nationality: data.nationality,
        dateOfBirth: dateOfBirth,
        occupation: data.occupation,
        appointedOn: data.appointed_on,
        resignedOn: data.resigned_on,
        role: data.officer_role,
    }

    return companyOfficer;
}

/**
 * Converts the data returned from the Companies House API into an OfficerAppointment object
 * @param data The data returned from the Companies House API.
 * @returns {OfficerAppointment} An OfficerAppointment object containing the requested officer appointment.
 */
const dataToOfficerAppointment = (data: any): OfficerAppointment =>
{
    const address: Address =
    {
        addressLine1: data.address.address_line_1,
        addressLine2: data.address.address_line_2,
        locality: data.address.locality,
        region: data.address.region,
        postalCode: data.address.postal_code
    }

    return {
        role: data.officer_role,
        appointedOn: data.appointed_on,
        resignedOn: data.resigned_on,
        address: address,
        appointedTo:
        {
            companyNumber: data.appointed_to.company_number,
            companyName: data.appointed_to.company_name,
            companyStatus: data.appointed_to.company_status,
            companyLink: data.links.company
        }
    }
}
import * as dotenv from 'dotenv';

import { getCompanyOfficer, getCompanyOfficers, getOfficerAppointments, getOfficerAppointmentsByNumber } from '../Officer';
import { CompanyOfficers, Officer, OfficerAppointment, OfficerSearchOptions } from '../Types';

describe('Officer.getCompanyOfficers', () =>
{
    dotenv.config();
    const CH_API_KEY: string = process.env.CH_API_KEY || '';

    test('Officer.getCompanyOfficers returns a CompanyOfficers object', async () =>
    {
        const data: CompanyOfficers = await getCompanyOfficers('00000006', CH_API_KEY);
    });

    test('Officer.getCompanyOfficers returns a valid CompanyOfficers object', async () =>
    {
        const data: CompanyOfficers = await getCompanyOfficers('00000006', CH_API_KEY);

        expect(data.self).toBeDefined();
        expect(data.activeCount).toBeDefined();
        expect(data.inactiveCount).toBeDefined();
        expect(data.resignedCount).toBeDefined();
        expect(data.totalCount).toBeDefined();
        expect(data.officers).toBeDefined();
    });

    test('Officer.getCompanyOfficers returns the correct CompanyOfficers object', async () =>
    {
        const data: CompanyOfficers = await getCompanyOfficers('00000006', CH_API_KEY);

        expect(data.self).toBe('/company/00000006/officers');
        expect(data.activeCount).toBe(0);
        expect(data.inactiveCount).toBe(3);
        expect(data.resignedCount).toBe(49);
        expect(data.totalCount).toBe(52);
        expect(data.officers).toBeDefined();
        expect(data.officers.length).toBe(52);

        // Check the first officer
        expect(data.officers[0].links).toBeDefined();
        expect(data.officers[0].name).toBeDefined();
        expect(data.officers[0].address).toBeDefined();
        expect(data.officers[0].appointedOn).toBeDefined();
        expect(data.officers[0].role).toBeDefined();
    });
    
    test('Officer.getCompanyOfficers throws an error when the company number is invalid', async () =>
    {
        await expect(getCompanyOfficers('00000000', CH_API_KEY)).rejects.toThrowError('Error: 404');
    });

    test('Officer.getCompanyOfficers throws an error when the API key is invalid', async () =>
    {
        await expect(getCompanyOfficers('00000006', 'INVALID_API_KEY')).rejects.toThrowError('Error: 401');
    });

    test('Officer.getCompanyOfficers returns the correct number of officers when numOfficers is specified', async () =>
    {
        const options: OfficerSearchOptions =
        {
            numOfficers: 2,
        }

        const data: CompanyOfficers = await getCompanyOfficers('00000006', CH_API_KEY, options);

        expect(data.officers.length).toBe(2);
    });

    test('Officer.getCompanyOfficers throws an error when the number of officers is invalid', async () =>
    {
        const options: OfficerSearchOptions =
        {
            numOfficers: -1,
        }

        await expect(getCompanyOfficers('00000006', CH_API_KEY, options)).rejects.toThrowError('Error: 400 numOfficers must be greater than 0');
    });

    test('Officer.getCompanyOfficers throws an error when registerView is active and registerType is invalid', async () =>
    {
        const options: OfficerSearchOptions =
        {
            registerView: true
        }

        await expect(getCompanyOfficers('00000006', CH_API_KEY, options))
    });
});


describe('Officer.getCompanyOfficer', () =>
{
    dotenv.config();
    const CH_API_KEY: string = process.env.CH_API_KEY || '';

    test('Officer.getCompanyOfficer returns an Officer object', async () =>
    {
        const data: Officer = await getCompanyOfficer('00000006', 'XOgtPRCRE8PPQnrxSg_ccYmmR7Y', CH_API_KEY);

        expect(data).toBeDefined();
    });

    /**
     * Weird bug where the second Officer.getCompanyOfficer call fails with a 404 error, needs further investigation
     */

     
    test('Officer.getCompanyOfficer returns a valid Officer object', async () =>
    {
        const data: Officer = await getCompanyOfficer('00000006', 'XOgtPRCRE8PPQnrxSg_ccYmmR7Y', CH_API_KEY);

        expect(data.links).toBeDefined();
        expect(data.links.self).toBeDefined();
        expect(data.links.appointments).toBeDefined();
        expect(data.name).toBeDefined();
        expect(data.address).toBeDefined();
        expect(data.appointedOn).toBeDefined();
        expect(data.role).toBeDefined();
        
    });
    

    test('Officer.getCompanyOfficer returns the correct Officer object', async () =>
    {
        const data: Officer = await getCompanyOfficer('00000006', 'XOgtPRCRE8PPQnrxSg_ccYmmR7Y', CH_API_KEY);

        expect(data.links).toBeDefined();
        expect(data.links.self).toBe('/company/00000006/appointments/XOgtPRCRE8PPQnrxSg_ccYmmR7Y');
        expect(data.links.appointments).toBe('/officers/1UUfj2gDv9ZVoykvoy9hhEhXDcY/appointments');
        expect(data.name).toBe('PRINGLE, Martin');
        expect(data.address).toBeDefined();
        expect(data.address.addressLine1).toBe('Cannon Place');
        expect(data.address.addressLine2).toBe('78 Cannon Street');
        expect(data.address.locality).toBe('London');
        expect(data.address.country).toBe('England');
        expect(data.address.postalCode).toBe('EC4N 6AF');
        expect(data.appointedOn).toBe('2016-09-13');
        expect(data.role).toBe('secretary');
    });
    

    test('Officer.getCompanyOfficer throws an error when the company number is invalid', async () =>
    {
        await expect(getCompanyOfficer('00000000', 'XOgtPRCRE8PPQnrxSg_ccYmmR7Y', CH_API_KEY)).rejects.toThrowError('Error: 404');
    });

    test('Officer.getCompanyOfficer throws an error when the officer ID is invalid', async () =>
    {
        await expect(getCompanyOfficer('00000006', 'INVALID_OFFICER_ID', CH_API_KEY)).rejects.toThrowError('Error: 404');
    });

    test('Officer.getCompanyOfficer throws an error when the API key is invalid', async () =>
    {
        await expect(getCompanyOfficer('00000006', 'XOgtPRCRE8PPQnrxSg_ccYmmR7Y', 'INVALID_API_KEY')).rejects.toThrowError('Error: 401');
    });
});

describe('Officer.getOfficerAppointmentsByNumber', () =>
{
    dotenv.config();
    const CH_API_KEY: string = process.env.CH_API_KEY || '';

    test('Officer.getOfficerAppointmentsByNumber returns an array of OfficerAppointment objects', async () =>
    {
        const data: Array<OfficerAppointment> = await getOfficerAppointmentsByNumber('hNUQLeH2UwFsrvlRkX1fDE07xIY', CH_API_KEY);

        expect(data).toBeDefined();
    });

    test('Officer.getOfficerAppointmentsByNumber returns the correct array of valid OfficerAppointment objects', async () =>
    {
        const data: Array<OfficerAppointment> = await getOfficerAppointmentsByNumber('hNUQLeH2UwFsrvlRkX1fDE07xIY', CH_API_KEY);

        expect(data.length).toBe(5);

        // Check the first appointment
        expect(data[0].role).toBeDefined();
        expect(data[0].appointedOn).toBeDefined();

        expect(data[0].address).toBeDefined();
        expect(data[0].address.addressLine1).toBeDefined();
        expect(data[0].address.addressLine2).toBeDefined();
        expect(data[0].address.locality).toBeDefined();
        expect(data[0].address.region).toBeDefined();
        expect(data[0].address.postalCode).toBeDefined();

        expect(data[0].appointedTo).toBeDefined();
        expect(data[0].appointedTo.companyNumber).toBeDefined();
        expect(data[0].appointedTo.companyName).toBeDefined();
        expect(data[0].appointedTo.companyStatus).toBeDefined();
        expect(data[0].appointedTo.companyLink).toBeDefined();
    });

    test('Officer.getOfficerAppointmentsByNumber throws an error when the officer number is invalid', async () =>
    {
        await expect(getOfficerAppointmentsByNumber('INVALID_OFFICER_NUMBER', CH_API_KEY)).rejects.toThrowError('Error: 404');
    });

    test('Officer.getOfficerAppointmentsByNumber throws an error when the API key is invalid', async () =>
    {
        await expect(getOfficerAppointmentsByNumber('hNUQLeH2UwFsrvlRkX1fDE07xIY', 'INVALID_API_KEY')).rejects.toThrowError('Error: 401');
    });

    test('Officer.getOfficerAppointmentsByNumber returns the correct number of appointments when numAppointments is specified', async () =>
    {
        const data: Array<OfficerAppointment> = await getOfficerAppointmentsByNumber('hNUQLeH2UwFsrvlRkX1fDE07xIY', CH_API_KEY, {numAppointments: 2});

        expect(data.length).toBe(2);
    });

    test('Officer.getOfficerAppointmentsByNumber throws an error when the number of appointments is invalid', async () =>
    {
        await expect(getOfficerAppointmentsByNumber('hNUQLeH2UwFsrvlRkX1fDE07xIY', CH_API_KEY, {numAppointments: -1})).rejects.toThrowError('Error: 400 numAppointments must be greater than 0');
    });

    
});
import * as dotenv from 'dotenv';

import { Company, Address } from '../Types';
import { CompaniesHouse } from '../index';

describe('Company.getCompany', () =>
{
    dotenv.config();
    const CH_API_KEY: string = process.env.CH_API_KEY || '';
    const ch: CompaniesHouse = new CompaniesHouse(CH_API_KEY);
    const invalidCh: CompaniesHouse = new CompaniesHouse('INVALID_API_KEY');

    test('Company.getCompany returns a Company object', async () =>
    {
        const data: Company = await ch.Companies.getCompany('00000006');

        expect(data).toBeDefined();
    });

    test('Company.getCompany returns a valid Company object', async () =>
    {
        const data: Company = await ch.Companies.getCompany('00000006');

        expect(data.companyName).toBeDefined();
        expect(data.companyNumber).toBeDefined();
        expect(data.type).toBeDefined();
        expect(data.dateOfCreation).toBeDefined();
        expect(data.lastFullMembersListDate).toBeDefined();
        expect(data.jurisdiction).toBeDefined();
        expect(data.registeredOfficeAddress).toBeDefined();
        expect(data.accounts).toBeDefined();
        expect(data.sicCodes).toBeDefined();
        expect(data.undeliverableRegisteredOfficeAddress).toBeDefined();
        expect(data.hasInsolvencyHistory).toBeDefined();
        expect(data.hasCharges).toBeDefined();
        expect(data.links).toBeDefined();
        expect(data.links.self).toBeDefined();
        expect(data.links.filingHistory).toBeDefined();
        expect(data.links.officers).toBeDefined();
        expect(data.links.charges).toBeDefined();
        expect(data.registeredOfficeIsInDispute).toBeDefined();
        expect(data.dateOfCessation).toBeDefined();
        expect(data.canFile).toBeDefined();
    })

    test('Company.getCompany returns the correct Company object', async () =>
    {
        const data: Company = await ch.Companies.getCompany('00000006');

        expect(data.companyName).toBe('MARINE AND GENERAL MUTUAL LIFE ASSURANCE SOCIETY');
        expect(data.companyNumber).toBe('00000006');
        expect(data.type).toBe('private-unlimited-nsc');
        expect(data.dateOfCreation).toBe('1862-10-25');
        expect(data.lastFullMembersListDate).toBe('1986-07-02');
        expect(data.jurisdiction).toBe('england-wales');
        expect(data.registeredOfficeAddress).toBeDefined();
        expect(data.registeredOfficeAddress.addressLine1).toBe('Cms Cameron Mckenna Llp Cannon Place');
        expect(data.registeredOfficeAddress.addressLine2).toBe('78 Cannon Street');
        expect(data.registeredOfficeAddress.locality).toBe('London');
        expect(data.registeredOfficeAddress.country).toBe('England');
        expect(data.registeredOfficeAddress.postalCode).toBe('EC4N 6AF');
        expect(data.accounts).toBeDefined();
        expect(data.accounts.accountingReferenceDate).toBeDefined();
        expect(data.accounts.accountingReferenceDate.day).toBe('31');
        expect(data.accounts.accountingReferenceDate.month).toBe('12');
        expect(data.accounts.lastAccounts).toBeDefined();
        expect(data.accounts.lastAccounts.madeUpTo).toBe('2014-12-31');
        expect(data.accounts.lastAccounts.type).toBe('full');
        expect(data.accounts.lastAccounts.periodEndOn).toBe('2014-12-31');
        expect(data.sicCodes).toBeDefined();
        expect(data.sicCodes[0]).toBe('65110');
        expect(data.undeliverableRegisteredOfficeAddress).toBe(false);
        expect(data.hasInsolvencyHistory).toBe(false);
        expect(data.hasCharges).toBe(true);
        expect(data.links).toBeDefined();
        expect(data.links.self).toBe('/company/00000006');
        expect(data.links.filingHistory).toBe('/company/00000006/filing-history');
        expect(data.links.officers).toBe('/company/00000006/officers');
        expect(data.links.charges).toBe('/company/00000006/charges');
        expect(data.registeredOfficeIsInDispute).toBe(false);
        expect(data.dateOfCessation).toBe('2018-07-10');
        expect(data.canFile).toBe(false);
    });

    test('Company.getCompany throws an error when the company number is invalid', async () =>
    {
        await expect(ch.Companies.getCompany('00000000')).rejects.toThrowError('Error: 404');
    });

    test('Company.getCompany throws an error when the API key is invalid', async () =>
    {
        await expect(invalidCh.Companies.getCompany('00000006')).rejects.toThrowError('Error: 401');
    });
})

describe('Company.getRegisteredOfficeAddress', () =>
{
    dotenv.config();
    const CH_API_KEY: string = process.env.CH_API_KEY || '';
    const ch: CompaniesHouse = new CompaniesHouse(CH_API_KEY);
    const invalidCh: CompaniesHouse = new CompaniesHouse('INVALID_API_KEY');

    test('Company.getRegisteredOfficeAddress returns a RegisteredOfficeAddress object', async () =>
    {
        const data: Address = await ch.Companies.getRegisteredOfficeAddress('00000006');

        expect(data).toBeDefined();
    });

    test('Company.getRegisteredOfficeAddress returns a valid RegisteredOfficeAddress object', async () =>
    {
        const data: Address = await ch.Companies.getRegisteredOfficeAddress('00000006');

        expect(data.addressLine1).toBeDefined();
        expect(data.addressLine2).toBeDefined();
        expect(data.locality).toBeDefined();
        expect(data.country).toBeDefined();
        expect(data.postalCode).toBeDefined();
    });

    test('Company.getRegisteredOfficeAddress returns the correct RegisteredOfficeAddress object', async () =>
    {
        const data: Address = await ch.Companies.getRegisteredOfficeAddress('00000006');

        expect(data.addressLine1).toBe('Cms Cameron Mckenna Llp Cannon Place');
        expect(data.addressLine2).toBe('78 Cannon Street');
        expect(data.locality).toBe('London');
        expect(data.country).toBe('England');
        expect(data.postalCode).toBe('EC4N 6AF');
    });

    test('Company.getRegisteredOfficeAddress throws an error when the company number is invalid', async () =>
    {
        await expect(ch.Companies.getRegisteredOfficeAddress('00000000')).rejects.toThrowError('Error: 404');
    });

    test('Company.getRegisteredOfficeAddress throws an error when the API key is invalid', async () =>
    {
        await expect(invalidCh.Companies.getRegisteredOfficeAddress('00000006')).rejects.toThrowError('Error: 401');
    });
});

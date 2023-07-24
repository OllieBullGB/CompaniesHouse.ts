import * as dotenv from 'dotenv';

import CompaniesHouse from '../index';

describe('CompaniesHouse', () =>
{
    dotenv.config();
    const CH_API_KEY: string = process.env.CH_API_KEY || '';

    test('Initialising CompaniesHouse with a valid API key returns a CompaniesHouse object', () =>
    {
        const ch: CompaniesHouse = new CompaniesHouse(CH_API_KEY);
        expect(ch).toBeDefined();
    });

    test('ValidateApiKey() with a valid API key returns true', async () =>
    {
        const valid: boolean = await CompaniesHouse.ValidateApiKey(CH_API_KEY);
        expect(valid).toBe(true);
    });

    test('ValidateApiKey() with an invalid API key returns false', async () =>
    {
        const valid: boolean = await CompaniesHouse.ValidateApiKey('invalid-api-key');
        expect(valid).toBe(false);
    });

    test('ValidateCompanyNumber() with a valid company number returns true', async () =>
    {
        const ch: CompaniesHouse = new CompaniesHouse(CH_API_KEY);
        const valid: boolean = await ch.Companies.ValidateCompanyNumber('00000006');
        expect(valid).toBe(true);
    });

    test('ValidateCompanyNumber() with an invalid company number returns false', async () =>
    {
        const ch: CompaniesHouse = new CompaniesHouse(CH_API_KEY);
        const valid: boolean = await ch.Companies.ValidateCompanyNumber('00000000');
        expect(valid).toBe(false);
    });
});
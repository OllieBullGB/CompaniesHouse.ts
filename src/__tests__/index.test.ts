import * as dotenv from 'dotenv';

import { CompaniesHouse } from '../index';

describe('CompaniesHouse', () =>
{
    dotenv.config();
    const CH_API_KEY: string = process.env.CH_API_KEY || '';

    test('Initialising CompaniesHouse with a valid API key returns a CompaniesHouse object', () =>
    {
        const ch: CompaniesHouse = new CompaniesHouse(CH_API_KEY);
        expect(ch).toBeDefined();
    });
});
import fetch from 'node-fetch';

export const useFetch = async (url: string, CH_API_KEY: string): Promise<any> =>
{
    const options: Object =
    {
        method: 'GET',
        headers: 
        {
            'Authorization': CH_API_KEY
        }
    };

    const res: any = await fetch(url, options);

    if(res.status !== 200)
    {
        throw new Error(`Error: ${res.status}`);
    }

    const data: any = await res.json();
    return data;
}
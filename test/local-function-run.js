import 'dotenv/config';
import main from '../src/function/main.js';
import fs from 'fs';
import path from 'path';

// Mock Appwrite context
const mockContext = {
    req: {
        method: 'POST',
        body: JSON.stringify({
            url: 'https://www.scribd.com/document/346259083/VDG-P201-Englisch' // Use a known working URL
        })
    },
    res: {
        send: (body, status, headers) => {
            console.log(`Response Status: ${status}`);
            if (headers) {
                console.log('Headers:', headers);
            }

            if (status === 200 && Buffer.isBuffer(body)) {
                console.log(`Received PDF Buffer of size: ${body.length} bytes`);
                const outputPath = 'test_output.pdf';
                fs.writeFileSync(outputPath, body);
                console.log(`Saved response to ${outputPath}`);
            } else {
                console.log('Response Body:', body);
            }
        }
    },
    log: (msg) => console.log(`[LOG] ${msg}`),
    error: (msg) => console.error(`[ERROR] ${msg}`)
};

// Run the function
console.log('Starting local function test...');
main(mockContext).then(() => {
    console.log('Test completed.');
}).catch(err => {
    console.error('Test failed:', err);
});

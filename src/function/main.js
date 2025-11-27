import { scribdDownloader } from '../service/ScribdDownloader.js';
import fs from 'fs';
import os from 'os';

export default async ({ req, res, log, error }) => {
    const corsHeaders = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Expose-Headers': 'Content-Disposition'
    };

    if (req.method === 'OPTIONS') {
        return res.send('', 200, corsHeaders);
    }

    if (req.method !== 'POST') {
        return res.send('Method not allowed', 405, corsHeaders);
    }

    try {
        let body = req.body;
        // Handle case where body might already be parsed or is a string
        if (typeof body === 'string') {
            try {
                body = JSON.parse(body);
            } catch (e) {
                return res.send('Invalid JSON body', 400, corsHeaders);
            }
        }

        const { url } = body;

        if (!url) {
            return res.send('Missing URL parameter', 400, corsHeaders);
        }

        log(`Processing URL: ${url}`);

        // Use /tmp directory for Appwrite Functions
        const outputDir = os.tmpdir();

        // Execute download
        // We can pass options here if needed, e.g. filename strategy
        const pdfPath = await scribdDownloader.execute(url, null, {
            output: outputDir,
            // rendertime: 100 // optional override
        });

        log(`PDF generated at: ${pdfPath}`);

        // Read the file buffer
        const pdfBuffer = fs.readFileSync(pdfPath);

        // Clean up file after reading
        try {
            fs.unlinkSync(pdfPath);
        } catch (e) {
            log(`Warning: Failed to delete temp file ${pdfPath}: ${e.message}`);
        }

        // Return the PDF
        return res.send(pdfBuffer, 200, {
            ...corsHeaders,
            'Content-Type': 'application/pdf',
            'Content-Disposition': `attachment; filename="${pdfPath.split('/').pop()}"`
        });

    } catch (err) {
        error(`Error processing request: ${err.message}`);
        return res.send(`Error: ${err.message}`, 500, corsHeaders);
    }
};

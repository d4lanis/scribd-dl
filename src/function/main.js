import { scribdDownloader } from '../service/ScribdDownloader.js';
import fs from 'fs';
import os from 'os';

export default async ({ req, res, log, error }) => {
    if (req.method !== 'POST') {
        return res.send('Method not allowed', 405);
    }

    try {
        const { url } = JSON.parse(req.body);

        if (!url) {
            return res.send('Missing URL parameter', 400);
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
            'Content-Type': 'application/pdf',
            'Content-Disposition': `attachment; filename="${pdfPath.split('/').pop()}"`
        });

    } catch (err) {
        error(`Error processing request: ${err.message}`);
        return res.send(`Error: ${err.message}`, 500);
    }
};

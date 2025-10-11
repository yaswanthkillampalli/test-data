const express = require('express');
const path = require('path');
const fs = require('fs'); // Required for fs.readFileSync if not using require()

const app = express();
const PORT = 3000;

// List of columns that MUST be numeric for flow analysis (taken from your error list)
const NUMERIC_COLUMNS_TO_SANITIZE = [
    'flow_duration', 'tot_fwd_pkts', 'tot_bwd_pkts', 'totlen_fwd_pkts', 
    'totlen_bwd_pkts', 'fwd_pkt_len_max', 'fwd_pkt_len_min', 'fwd_pkt_len_mean', 
    'fwd_pkt_len_std', 'bwd_pkt_len_max', 'bwd_pkt_len_min', 'bwd_pkt_len_mean', 
    'bwd_pkt_len_std', 'flow_byts_s', 'flow_pkts_s', 'flow_iat_mean', 
    'flow_iat_std', 'flow_iat_max', 'flow_iat_min', 'fwd_iat_tot', 
    'fwd_iat_mean', 'fwd_iat_std', 'fwd_iat_max', 'fwd_iat_min', 
    'bwd_iat_tot', 'bwd_iat_mean', 'bwd_iat_std', 'bwd_iat_max', 
    'bwd_iat_min', 'fwd_psh_flags', 'bwd_psh_flags', 'fwd_urg_flags', 
    'bwd_urg_flags', 'fwd_header_len', 'bwd_header_len', 'fwd_pkts_s', 
    'bwd_pkts_s', 'pkt_len_min', 'pkt_len_max', 'pkt_len_mean', 
    'pkt_len_std', 'pkt_len_var', 'fin_flag_cnt', 'syn_flag_cnt', 
    'rst_flag_cnt', 'psh_flag_cnt', 'ack_flag_cnt', 'urg_flag_cnt', 
    'cwe_flag_count', 'ece_flag_cnt', 'down_up_ratio', 'pkt_size_avg', 
    'fwd_seg_size_avg', 'bwd_seg_size_avg', 'fwd_byts_b_avg', 
    'fwd_pkts_b_avg', 'fwd_blk_rate_avg', 'bwd_byts_b_avg', 
    'bwd_pkts_b_avg', 'bwd_blk_rate_avg', 'subflow_fwd_pkts', 
    'subflow_fwd_byts', 'subflow_bwd_pkts', 'subflow_bwd_byts', 
    'init_fwd_win_byts', 'init_bwd_win_byts', 'fwd_act_data_pkts', 
    'fwd_seg_size_min', 'active_mean', 'active_std', 'active_max', 
    'active_min', 'idle_mean', 'idle_std', 'idle_max', 'idle_min'
];

/**
 * Ensures all critical flow metric columns are explicitly converted to numbers.
 * @param {Array<Object>} data 
 */
function sanitizeData(data) {
    return data.map(row => {
        const sanitizedRow = { ...row };
        for (const col of NUMERIC_COLUMNS_TO_SANITIZE) {
            if (sanitizedRow[col] !== undefined) {
                // Use parseFloat for flow metrics, falling back to 0 if NaN/null/invalid
                sanitizedRow[col] = parseFloat(sanitizedRow[col]) || 0;
            }
        }
        // Handle 'protocol' separately, as it might be an integer code or a string like 'TCP'
        if (sanitizedRow.protocol !== undefined) {
             sanitizedRow.protocol = parseFloat(sanitizedRow.protocol) || 0;
        }
        return sanitizedRow;
    });
}

// Load the JSON file and sanitize data upon startup
try {
    const dataPath = path.join(__dirname, 'presentation_data.json');
    // Using fs.readFileSync is safer than require() if you need to intercept and sanitize
    const rawData = fs.readFileSync(dataPath, 'utf8');
    const parsedData = JSON.parse(rawData);

    const presentationData = sanitizeData(parsedData);

    // --- Endpoint ---
    
    // Define the route for the root URL
    app.get('/', (req, res) => {
        console.log('Request received at root URL. Serving presentation_data.json.');
        // Use res.json() to send the data as a JSON response.
        res.json(presentationData);
    });

    // --- Start Server ---
    app.listen(PORT, () => {
        console.log(`✅ Server running at http://localhost:${PORT}`);
        console.log(`Data file loaded and sanitized successfully.`);
    });
    
} catch (error) {
    console.error(`🚨 FATAL ERROR: Could not load or parse 'presentation_data.json'.`);
    // Log detailed parsing error if it's a syntax issue
    if (error.name === 'SyntaxError') {
        console.error('JSON Parsing Error:', error.message);
    }
    console.error('Please ensure the file exists and contains valid JSON syntax.');
    process.exit(1); // Exit if the file cannot be loaded
}

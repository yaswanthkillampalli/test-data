const express = require('express');
const app = express();
const PORT = 3000;

/**
 * Generates a random number within a specified range.
 * @param {number} min - The minimum value (inclusive).
 * @param {number} max - The maximum value (inclusive).
 * @param {number} [decimals=0] - The number of decimal places.
 * @returns {number} A random number.
 */
const getRandom = (min, max, decimals = 0) => {
  const str = (Math.random() * (max - min) + min).toFixed(decimals);
  return parseFloat(str);
};

/**
 * Generates a random IPv4 address.
 * @returns {string} A random IPv4 address string.
 */
const getRandomIp = () => {
    return `${getRandom(1, 255)}.${getRandom(1, 255)}.${getRandom(1, 255)}.${getRandom(1, 255)}`;
}

/**
 * Creates a single, complete network flow object with randomized data.
 * @returns {object} A network flow data object.
 */
const createRandomFlow = () => {
  const tot_fwd_pkts = getRandom(1, 80);
  const tot_bwd_pkts = getRandom(1, 80);

  return {
    // Port and Protocol Info
    "dst_port": getRandom(1, 65535),
    "protocol": [6, 17][getRandom(0, 1)], // 6 for TCP, 17 for UDP
    "src_port": getRandom(1024, 65535),
    "src_ip": getRandomIp(),
    "dst_ip": getRandomIp(),

    // Flow Duration and Packet Counts
    "flow_duration": getRandom(1000, 120000000), // up to 2 mins
    "tot_fwd_pkts": tot_fwd_pkts,
    "tot_bwd_pkts": tot_bwd_pkts,
    "totlen_fwd_pkts": getRandom(0, 65535 * 2),
    "totlen_bwd_pkts": getRandom(0, 65535 * 2),

    // Forward Packet Length Stats
    "fwd_pkt_len_max": getRandom(0, 1500),
    "fwd_pkt_len_min": getRandom(0, 100),
    "fwd_pkt_len_mean": getRandom(50, 800, 6),
    "fwd_pkt_len_std": getRandom(10, 500, 6),

    // Backward Packet Length Stats
    "bwd_pkt_len_max": getRandom(0, 1500),
    "bwd_pkt_len_min": getRandom(0, 100),
    "bwd_pkt_len_mean": getRandom(50, 800, 6),
    "bwd_pkt_len_std": getRandom(10, 500, 6),

    // Flow Rate Stats
    "flow_byts_s": getRandom(100, 100000, 6),
    "flow_pkts_s": getRandom(1, 5000, 6),

    // Flow Inter-Arrival Time (IAT) Stats
    "flow_iat_mean": getRandom(100, 5000, 6),
    "flow_iat_std": getRandom(100, 10000, 6),
    "flow_iat_max": getRandom(5000, 60000000),
    "flow_iat_min": getRandom(1, 50),

    // Forward IAT Stats
    "fwd_iat_tot": getRandom(100, 60000000),
    "fwd_iat_mean": getRandom(100, 5000, 6),
    "fwd_iat_std": getRandom(100, 10000, 6),
    "fwd_iat_max": getRandom(5000, 60000000),
    "fwd_iat_min": getRandom(1, 50),
    
    // Backward IAT Stats
    "bwd_iat_tot": getRandom(100, 60000000),
    "bwd_iat_mean": getRandom(100, 5000, 6),
    "bwd_iat_std": getRandom(100, 10000, 6),
    "bwd_iat_max": getRandom(5000, 60000000),
    "bwd_iat_min": getRandom(1, 50),
    
    // Header and Flag Info
    "fwd_psh_flags": getRandom(0, 1),
    "bwd_psh_flags": getRandom(0, 1),
    "fwd_urg_flags": getRandom(0, 1),
    "bwd_urg_flags": getRandom(0, 1),
    "fwd_header_len": tot_fwd_pkts * 20,
    "bwd_header_len": tot_bwd_pkts * 20,
    "fwd_pkts_s": getRandom(1, 2500, 6),
    "bwd_pkts_s": getRandom(1, 2500, 6),

    // Generic Packet Length Stats
    "pkt_len_min": getRandom(0, 100),
    "pkt_len_max": getRandom(100, 1500),
    "pkt_len_mean": getRandom(50, 800, 6),
    "pkt_len_std": getRandom(10, 500, 6),
    "pkt_len_var": getRandom(100, 250000, 6),
    
    // TCP Flag Counts
    "fin_flag_cnt": getRandom(0, 1),
    "syn_flag_cnt": getRandom(0, 1),
    "rst_flag_cnt": getRandom(0, 1),
    "psh_flag_cnt": getRandom(0, 1),
    "ack_flag_cnt": getRandom(0, 1),
    "urg_flag_cnt": getRandom(0, 1),
    "cwe_flag_count": getRandom(0, 1),
    "ece_flag_cnt": getRandom(0, 1),
    
    // Sizing and Ratio Info
    "down_up_ratio": getRandom(0, 5),
    "pkt_size_avg": getRandom(50, 150, 6),
    "fwd_seg_size_avg": getRandom(50, 800, 6),
    "bwd_seg_size_avg": getRandom(50, 800, 6),
    
    // Bulk Rate Averages (often zero in non-bulk transfers)
    "fwd_byts_b_avg": 0,
    "fwd_pkts_b_avg": 0,
    "fwd_blk_rate_avg": 0,
    "bwd_byts_b_avg": 0,
    "bwd_pkts_b_avg": 0,
    "bwd_blk_rate_avg": 0,

    // Subflow Stats
    "subflow_fwd_pkts": tot_fwd_pkts,
    "subflow_fwd_byts": getRandom(100, 65535 * 2),
    "subflow_bwd_pkts": tot_bwd_pkts,
    "subflow_bwd_byts": getRandom(100, 65535 * 2),
    
    // Window and Segment Size
    "init_fwd_win_byts": getRandom(1, 65535),
    "init_bwd_win_byts": getRandom(1, 65535),
    "fwd_act_data_pkts": getRandom(1, tot_fwd_pkts),
    "fwd_seg_size_min": 20,

    // Active/Idle Time Stats (often zero for short flows)
    "active_mean": 0,
    "active_std": 0,
    "active_max": 0,
    "active_min": 0,
    "idle_mean": 0,
    "idle_std": 0,
    "idle_max": 0,
    "idle_min": 0,
    
    // Metadata
    "flow_id": `flow-${getRandom(100000, 999999)}`,
    "created_at": new Date().toISOString()
  };
};

// API endpoint that returns an array of random traffic data.
// Use ?count=N to specify the number of records, e.g., /traffic?count=50
app.get('/traffic', (req, res) => {
  // Get the 'count' from query parameters, default to 10 if not provided or invalid.
  const count = parseInt(req.query.count, 10) || 10;
  const data = [];
  for (let i = 0; i < count; i++) {
    data.push(createRandomFlow());
  }
  res.json(data);
});

// Start the server
app.listen(PORT, () => {
  console.log(`✅ Network Traffic API server is running.`);
  console.log(`   Access it at: http://localhost:${PORT}/traffic`);
});

# Querying the FlyRank Internship Warehouse (~79M Rows)

- **Dataset:** [`hf://datasets/FlyRank/internship-warehouse`](https://huggingface.co/datasets/FlyRank/internship-warehouse)
- **Build ID:** `flyrank_pseudonymized_warehouse_release_v20260703`
- **Format:** Parquet over HTTP via DuckDB
- **Access:** Gated (click "Request Access" + accept data-use terms; approval is instant)

---

## 1. Table Architecture & Dimensions

| Table | Rows | Grain | Location / Partitioning |
|---|---|---|---|
| `dim_clients` | 104 | One row per pseudonymized client | Flat file: `dim_clients.parquet` |
| `dim_content` | 519,606 | One row per published content item | Flat file: `dim_content.parquet` |
| `fact_content_daily_performance` | 78,835,655 | `report_date` × `client_id` × `content_id` | Partitioned: `fact_content_daily_performance/month=YYYY-MM/*.parquet` |
| `fact_content_daily_performance_sample` | ~11.7M | Same grain — Final month (June 2026) only | Useful for query mechanics; **never for label logic** |
| `fact_content_query_90d` | 2,414,248 | `client_id` × `content_id` × `query_hash` | Fixed 90-day snapshot window |

---

## 2. DuckDB Connection & Token Authentication

> **Security Rule:** Never hardcode your Hugging Face token in public notebook cells. In Google Colab, store it in the **Secrets (🔑)** panel as `HF_TOKEN`.

```python
%pip -q install duckdb pandas pyarrow

import os
import duckdb
from google.colab import userdata

# Retrieve token securely from Colab Secrets
HF_TOKEN = userdata.get('HF_TOKEN')

# Initialize DuckDB connection
con = duckdb.connect()

# Register Hugging Face authentication secret
con.execute(f"CREATE OR REPLACE SECRET hf (TYPE huggingface, TOKEN '{HF_TOKEN}');")
con.execute("INSTALL httpfs; LOAD httpfs;")
```

---

## 3. Remote Query Patterns (Zero Local Download)

The key to processing 79 million rows: **never download the raw files — execute SQL aggregations remotely over Parquet HTTP range requests and pull back only the aggregated dataframe.**

### 3.1 Metadata & Grain Verification Probe (Near-Free Query)

```python
# Verify table availability and row count without scanning full data
con.sql("""
    SELECT 
        COUNT(*) AS total_rows,
        MIN(report_date) AS min_date,
        MAX(report_date) AS max_date
    FROM read_parquet('hf://datasets/FlyRank/internship-warehouse/fact_content_daily_performance/month=2026-03/*.parquet')
""").show()
```

### 3.2 Developing Features on a Mid-Panel Month (Avoid HTTP 429)

> **Iteration Rule:** Develop your query logic on a single mid-panel month partition (e.g. `month=2026-03`). Running full scans of all 78.8M rows repeatedly will trigger Hugging Face rate limits (HTTP 429).

```python
mid_month_query = """
SELECT 
    client_id,
    content_id,
    COUNT(DISTINCT report_date) AS active_days,
    SUM(gsc_impressions) AS total_impressions,
    SUM(gsc_clicks) AS total_clicks,
    AVG(gsc_avg_position) AS mean_position,
    SUM(ga4_sessions) AS total_sessions,
    SUM(ga4_engaged_sessions) AS total_engaged_sessions,
    -- Context columns repeat on every row; use ANY_VALUE to prevent double-counting
    ANY_VALUE(content_type) AS content_type,
    ANY_VALUE(main_intent) AS main_intent
FROM read_parquet('hf://datasets/FlyRank/internship-warehouse/fact_content_daily_performance/month=2026-03/*.parquet')
WHERE ga4_data_available = TRUE
GROUP BY client_id, content_id
HAVING total_impressions >= 100
"""

sample_features = con.sql(mid_month_query).df()
print(f"Aggregated features shape: {sample_features.shape}")
```

### 3.3 Final Full-Table Aggregation & Local Caching

When your SQL logic is finalized, execute the scan across all partitions once and cache the result locally:

```python
full_table_query = """
SELECT 
    client_id,
    content_id,
    SUM(gsc_impressions) AS impressions_90d,
    SUM(gsc_clicks) AS clicks_90d,
    AVG(gsc_avg_position) AS avg_position,
    SUM(ga4_sessions) AS sessions_90d,
    SUM(ga4_engaged_sessions) AS engaged_sessions_90d
FROM read_parquet('hf://datasets/FlyRank/internship-warehouse/fact_content_daily_performance/*/*.parquet')
WHERE report_date BETWEEN DATE '2026-01-01' AND DATE '2026-03-31'
  AND ga4_data_available = TRUE
GROUP BY client_id, content_id
"""

# Execute once and cache locally to Parquet
full_features_df = con.sql(full_table_query).df()
os.makedirs("work/outputs", exist_ok=True)
full_features_df.to_parquet("work/outputs/warehouse_features_cache.parquet", index=False)
print("Features successfully computed and cached locally!")
```

---

## 4. Critical Panel Warnings & Gotchas

1. **Client History Depth Varies Wildly:**
   - Check `dim_clients.gsc_data_start` before picking date boundaries.
   - Roughly one-third of client portfolios have minimal historical data; filter on `gsc_data_available = TRUE`.
2. **GA4 Zero-Filling:**
   - Rows before a client's `ga4_data_start` are zero-filled with `ga4_data_available = FALSE`.
   - Filter `WHERE ga4_data_available = TRUE` so you do not misinterpret uninstrumented periods as "zero reader engagement".
3. **The `_sample` Table Trap:**
   - `fact_content_daily_performance_sample` contains **only June 2026 (the final month)**.
   - If your label evaluates what happens next, developing your label logic on the sample peeks into the future test window. Treat June 2026 as a sealed holdout.
4. **Context Column Aggregation:**
   - Detail tables repeat content metadata on every row. Always wrap non-grain attributes with `ANY_VALUE(col)`, never `SUM(col)`.

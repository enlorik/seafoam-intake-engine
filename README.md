# seafoam-intake-engine

Lead intake and qualification service — receives, validates, deduplicates, enriches, and routes inbound form submissions.

---

## Destinations

### Slack
Set `ENABLE_SLACK=true` and provide `SLACK_WEBHOOK_URL`.

### Airtable
Set `ENABLE_AIRTABLE=true` and provide `AIRTABLE_API_KEY`, `AIRTABLE_BASE_ID`, and `AIRTABLE_TABLE_NAME`.

### Google Sheets

#### 1. Create a Google Cloud service account
1. Go to [Google Cloud Console](https://console.cloud.google.com/) → **IAM & Admin** → **Service Accounts**.
2. Create a new service account (e.g. `seafoam-sheets-writer`).
3. Under **Keys**, add a new JSON key. Download the `.json` file.

#### 2. Enable the Google Sheets API
In the Cloud Console, navigate to **APIs & Services** → **Library** and enable the **Google Sheets API** for your project.

#### 3. Share the spreadsheet with the service account
Open your target Google Sheet, click **Share**, and grant **Editor** access to the service account email (e.g. `seafoam-sheets-writer@your-project.iam.gserviceaccount.com`).

#### 4. Configure environment variables
Copy the values from the downloaded JSON key file into `.env`:

```env
ENABLE_GOOGLE_SHEETS=true
GOOGLE_SHEETS_SPREADSHEET_ID=<spreadsheet ID from the URL>
GOOGLE_SHEETS_SHEET_NAME=Leads          # name of the tab; defaults to "Leads"
GOOGLE_SERVICE_ACCOUNT_EMAIL=<client_email from JSON key>
# Paste the private_key value. Replace literal newlines with \n.
GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY="-----BEGIN RSA PRIVATE KEY-----\nMIIE...\n-----END RSA PRIVATE KEY-----\n"
```

> **Private key tip:** The JSON key file contains a `private_key` field with real newline characters. When pasting into `.env`, replace each newline with the two-character sequence `\n`. The app automatically converts them back at runtime.

#### 5. Column layout
Each processed lead appends one row to the sheet with these columns (A–E):

| A    | B     | C      | D            | E         |
|------|-------|--------|--------------|-----------|
| Name | Email | Source | Submitted At | Lead Score |

#### 6. Test locally
```bash
# 1. Install dependencies (picks up googleapis)
npm install

# 2. Start the server
npm run dev

# 3. POST a test lead
curl -X POST http://localhost:3000/leads \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","source":"web"}'
```

Check the **Leads** tab in your spreadsheet — a new row should appear within seconds.

---

### Notion
Set `ENABLE_NOTION=true` — implementation coming soon.
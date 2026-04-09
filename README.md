# seafoam-intake-engine

Lead intake and qualification service — receives, validates, deduplicates, enriches, and routes inbound form submissions.

---

## Destinations

### Slack

#### 1. Create an incoming webhook
1. Go to [api.slack.com/apps](https://api.slack.com/apps) and create a new app (or open an existing one).
2. Under **Features** → **Incoming Webhooks**, toggle the feature on.
3. Click **Add New Webhook to Workspace**, choose the target channel, and authorise.
4. Copy the generated webhook URL (starts with `https://hooks.slack.com/services/…`).

#### 2. Configure environment variables

```env
ENABLE_SLACK=true
SLACK_WEBHOOK_URL=https://hooks.slack.com/services/YOUR/SLACK/WEBHOOK
```

#### 3. Message format
Each processed lead posts one message to the configured channel:

```
🌊 New Lead — <source>

Name          Email
<name>        <email>

Source        Submitted At
<source>      <submittedAt ISO-8601>

Score         Lead ID
<leadScore>   <uuid>
```

#### 4. Test locally
```bash
npm install
npm run dev

curl -X POST http://localhost:3000/leads \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","source":"web"}'
```

A Slack message should arrive in your channel within seconds. The fanout result will include:
```json
"slack": { "success": true }
```

If the flag is off or the URL is missing, the destination returns `{ skipped: true }` — non-fatal, all other destinations still run.

### Airtable
Set `ENABLE_AIRTABLE=true` and provide `AIRTABLE_API_KEY`, `AIRTABLE_BASE_ID`, and `AIRTABLE_TABLE_NAME`.

### Google Sheets

#### 1. Create a Google Cloud service account
1. Go to [Google Cloud Console](https://console.cloud.google.com/) → **IAM & Admin** → **Service Accounts**.
2. Create a new service account (e.g. `seafoam-sheets-writer`).
3. Under **Keys**, add a new JSON key and download the `.json` file.

#### 2. Enable the Google Sheets API
In the Cloud Console, go to **APIs & Services** → **Library** and enable the **Google Sheets API** for your project.

#### 3. Share the spreadsheet with the service account
Open your target Google Sheet, click **Share**, and grant **Editor** access to the service account email (e.g. `seafoam-sheets-writer@your-project.iam.gserviceaccount.com`).

#### 4. Configure environment variables
Copy the values from the downloaded JSON key file into `.env`:

```env
ENABLE_GOOGLE_SHEETS=true
GOOGLE_SHEETS_SPREADSHEET_ID=<spreadsheet ID from the sheet URL>
GOOGLE_SHEETS_SHEET_NAME=Leads          # tab name; defaults to "Leads"
GOOGLE_SERVICE_ACCOUNT_EMAIL=<client_email from JSON key>
# Paste the private_key value — replace literal newlines with \n
GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY="-----BEGIN RSA PRIVATE KEY-----\nMIIE...\n-----END RSA PRIVATE KEY-----\n"
```

> **Private key tip:** The downloaded JSON key has a `private_key` field with real newline characters. When pasting into `.env`, replace each newline with the two-character sequence `\n`. The app converts them back at runtime automatically.

#### 5. Column layout
Each processed lead appends one row with these columns (A–E):

| A    | B     | C      | D            | E          |
|------|-------|--------|--------------|------------|
| Name | Email | Source | Submitted At | Lead Score |

Add these headers manually to row 1 of your sheet before first use.

#### 6. Test locally
```bash
# Install dependencies (picks up googleapis)
npm install

# Start the server
npm run dev

# POST a test lead
curl -X POST http://localhost:3000/leads \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","source":"web"}'
```

A new row should appear in the sheet within seconds. The fanout result will include:
```json
"googleSheets": { "success": true, "updatedRange": "Leads!A2:E2", "updatedRows": 1 }
```

If credentials are missing or the flag is off, the destination returns `{ skipped: true }` — non-fatal, all other destinations still run.

---

### Notion
Set `ENABLE_NOTION=true` — implementation coming soon.
# gcp

Google Cloud CLI, gsutil, Firebase, and BigQuery

**Category:** Cloud Providers

## Restrictive

Read-only operations safe for exploration and code review.

| Command | Description |
|---------|-------------|
| `gcloud --version` | Check gcloud version |
| `gcloud version` | Check gcloud version |
| `gcloud config list` | List gcloud config |
| `gcloud config get` | Get gcloud config value |
| `gcloud auth list` | List authenticated accounts |
| `gcloud info` | Show gcloud info |
| `gcloud projects list` | List GCP projects |
| `gcloud projects describe` | Describe project |
| `gcloud compute instances list` | List compute instances |
| `gcloud compute instances describe` | Describe instance |
| `gcloud compute zones list` | List zones |
| `gcloud compute regions list` | List regions |
| `gcloud run services list` | List Cloud Run services |
| `gcloud run services describe` | Describe Cloud Run service |
| `gcloud run revisions list` | List Cloud Run revisions |
| `gcloud app describe` | Describe App Engine app |
| `gcloud app versions list` | List App Engine versions |
| `gcloud app services list` | List App Engine services |
| `gcloud functions list` | List Cloud Functions |
| `gcloud functions describe` | Describe function |
| `gsutil --version` | Check gsutil version |
| `gsutil ls` | List GCS buckets/objects |
| `gsutil du` | Show disk usage |
| `gsutil stat` | Show object info |
| `firebase --version` | Check Firebase CLI version |
| `firebase projects:list` | List Firebase projects |
| `firebase apps:list` | List Firebase apps |
| `firebase hosting:sites:list` | List Hosting sites |
| `bq --version` | Check BigQuery CLI version |
| `bq show` | Show dataset/table info |
| `bq ls` | List datasets/tables |

## Standard

Day-to-day development commands. Includes all restrictive commands plus:

| Command | Description |
|---------|-------------|
| `gcloud builds submit` | Submit Cloud Build |
| `gcloud builds list` | List builds |
| `gcloud builds describe` | Describe build |
| `gcloud builds log` | View build logs |
| `gcloud run deploy --dry-run` | Dry-run Cloud Run deploy |
| `gcloud logging read` | Read logs |
| `gcloud functions logs read` | Read function logs |
| `gcloud run services logs read` | Read Cloud Run logs |
| `gsutil cat` | Cat GCS object |
| `firebase emulators:start` | Start Firebase emulators |
| `firebase emulators:exec` | Run command with emulators |
| `firebase serve` | Serve Firebase locally |
| `firebase init` | Initialize Firebase project |
| `bq head` | Preview table rows |
| `bq extract` | Extract table to GCS |
| `gcloud config set` | Set gcloud config |

## Permissive

Broader access for trusted projects. Includes all standard commands plus:

| Command | Description |
|---------|-------------|
| `gcloud run deploy` | Deploy to Cloud Run |
| `gcloud run services delete` | Delete Cloud Run service |
| `gcloud app deploy` | Deploy to App Engine |
| `gcloud app versions delete` | Delete App Engine version |
| `gcloud functions deploy` | Deploy Cloud Function |
| `gcloud functions delete` | Delete Cloud Function |
| `gcloud compute instances create` | Create compute instance |
| `gcloud compute instances delete` | Delete compute instance |
| `gcloud compute instances start` | Start instance |
| `gcloud compute instances stop` | Stop instance |
| `gsutil cp` | Copy to/from GCS |
| `gsutil mv` | Move in GCS |
| `gsutil rm` | Remove from GCS |
| `gsutil rsync` | Sync with GCS |
| `gsutil mb` | Make GCS bucket |
| `gsutil rb` | Remove GCS bucket |
| `firebase deploy` | Deploy to Firebase |
| `firebase hosting:disable` | Disable hosting |
| `firebase functions:delete` | Delete function |
| `bq query` | Run BigQuery query |
| `bq load` | Load data into BigQuery |
| `bq mk` | Create dataset/table |
| `bq rm` | Remove dataset/table |

## Architecture Diagram

<img width="1172" height="559" alt="Screenshot 2025-07-27 140309" src="https://github.com/user-attachments/assets/d2fb8089-3ab5-4bd4-a710-de8778fbf9bc" />


## Sample Output
(![WhatsApp Image 2025-06-20 at 13 19 03_c4ce5821](https://github.com/user-attachments/assets/26df3a74-e613-4b58-9c4c-0fd144604fc9)
)

## Dependent
1. Redis
2. Scrapper Api
3. Bull Mq
4. DB
5. Nodemailer
6. Docker
7. Node Cron

## Getting Started

1. First, Git Clone:

```bash
git clone https://github.com/amish-kumar-07/PriceAlert_System
cd PriceAlert_System
```
2. Then Install Dependecies:

```bash
npm install && npm run dev
```
3. Configure Env:
```bash
SMTP_HOST=smtp.gmail.com
SMTP_PORT=465
SMTP_USER="your email"
SMTP_PASS="your password"
SMTP_SECURE=true
SMTP_FROM=alerts@yourdomain.com  # optional override

DATABASE_URL=""
BASE_URL=http://localhost:3000
API_KEY="Scrapper Api"
REDIS_URL=redis://localhost:6379
```
5. Install Redis Image
```bash
docker pull redis:latest
```
6. Run Redis Container using Docker 

```bash
docker run -itd -p 6379:6379 redis
```
7. Run Your Project
```bash
npm run dev
```

## Query
Contact : rashusingh110@gmail.com

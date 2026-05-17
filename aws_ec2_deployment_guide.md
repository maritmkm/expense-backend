# AWS EC2 Deployment Guide: Full-Stack Expense Tracker

This guide provides a professional, step-by-step workflow to deploy your Next.js frontend and NestJS backend on a single AWS EC2 instance.

---

## Phase 1: Launching the EC2 Instance

1.  **Login to AWS Console**: Navigate to the **EC2 Dashboard**.
2.  **Launch Instance**:
    *   **Name**: `expense-tracker-prod`
    *   **AMI**: Choose **Ubuntu Server 22.04 LTS** (64-bit).
    *   **Instance Type**: `t3.micro` or `t3.small` (Free tier eligible is `t2.micro`).
    *   **Key Pair**: Create a new key pair (e.g., `expense-key.pem`) and download it.
3.  **Network Settings (Security Groups)**:
    *   Allow **SSH** (Port 22) - *From your IP*.
    *   Allow **HTTP** (Port 80) - *From anywhere*.
    *   Allow **HTTPS** (Port 443) - *From anywhere*.

---

## Phase 2: Connecting and Environment Setup

1.  **SSH into Instance**:
    ```bash
    chmod 400 expense-key.pem
    ssh -i "expense-key.pem" ubuntu@your-ec2-public-ip
    ```
2.  **Update System**:
    ```bash
    sudo apt update && sudo apt upgrade -y
    ```
3.  **Install Node.js, PM2, and Nginx**:
    ```bash
    curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
    sudo apt install -y nodejs nginx
    sudo npm install -g pm2
    ```

---

## Phase 3: Installing & Securing MongoDB Locally

1.  **Install MongoDB**:
    ```bash
    sudo apt-get install gnupg curl
    curl -fsSL https://www.mongodb.org/static/pgp/server-7.0.asc | \
       sudo gpg -o /usr/share/keyrings/mongodb-server-7.0.gpg \
       --dearmor
    echo "deb [ [arch=amd64,arm64] signed-by=/usr/share/keyrings/mongodb-server-7.0.gpg ] https://repo.mongodb.org/apt/ubuntu jammy/mongodb-org/7.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-7.0.list
    sudo apt-get update
    sudo apt-get install -y mongodb-org
    sudo systemctl start mongod
    sudo systemctl enable mongod
    ```

2.  **Create Admin & App User**:
    Enter the mongo shell:
    ```bash
    mongosh
    ```
    Inside the shell, create the admin user:
    ```javascript
    use admin
    db.createUser({
      user: "admin",
      pwd: "YourSecureAdminPassword",
      roles: [ { role: "userAdminAnyDatabase", db: "admin" }, "readWriteAnyDatabase" ]
    })
    
    use expense_tracker
    db.createUser({
      user: "expense_user",
      pwd: "YourSecureAppPassword",
      roles: [ { role: "readWrite", db: "expense_tracker" } ]
    })
    exit
    ```

3.  **Enable Authentication**:
    ```bash
    sudo nano /etc/nginx/mongod.conf
    # (Actually edit /etc/mongod.conf)
    sudo nano /etc/mongod.conf
    ```
    Find the `security:` section and change it to:
    ```yaml
    security:
      authorization: enabled
    ```
    Restart MongoDB:
    ```bash
    sudo systemctl restart mongod
    ```

---

## Phase 4: Preparing the Backend (NestJS)

1.  **Clone the Repository**:
    ```bash
    git clone https://github.com/your-username/your-repo.git
    cd your-repo/backend
    ```
2.  **Configure `.env`**:
    ```bash
    nano .env
    ```
    **Update MONGODB_URI**:
    ```env
    MONGODB_URI=mongodb://expense_user:YourSecureAppPassword@127.0.0.1:27017/expense_tracker?authSource=expense_tracker
    ```
3.  **Build and Start**:
    ```bash
    npm install
    npm run build
    pm2 start dist/main.js --name "expense-backend"
    ```

---

## Phase 5: Preparing the Frontend (Next.js)

1.  **Install & Build**:
    ```bash
    cd ../expense-tracker
    npm install
    npm run build
    ```
2.  **Start with PM2**:
    ```bash
    pm2 start npm --name "expense-frontend" -- start
    ```

---

## Phase 6: Configuring Nginx Reverse Proxy

1.  **Create Nginx Config**:
    ```bash
    sudo nano /etc/nginx/sites-available/expense-tracker
    ```
2.  **Paste & Restart**:
    *(Use the Nginx configuration from Phase 5 of the previous guide version)*
    ```bash
    sudo ln -s /etc/nginx/sites-available/expense-tracker /etc/nginx/sites-enabled/
    sudo systemctl restart nginx
    ```

---

> [!IMPORTANT]
> **Firewall Check**: Never open port `27017` in your EC2 Security Group. MongoDB should only be accessible from `127.0.0.1` (localhost) for security.

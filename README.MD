# Bids and Awards Committee - Information System (BAC-IS)

A node.js thin client that allows the BAC personnel to do BAC postings on the GSU website via WP REST API.

# Setup

## Setup Node App

### In Ubuntu
    curl -fsSL https://deb.nodesource.com/setup_16.x | sudo -E bash -
    sudo apt-get install -y nodejs

Prompt only for username once: [https://superuser.com/a/1609300](https://superuser.com/a/1609300)

    git config --global credential.helper cache
    git config --global credential.helper 'cache --timeout=31536000'

Clone repo

    git clone https://github.com/kosinix/bacis.git
    cd bacis


## Setup Reverse Proxy Using Nginx 


Create virtual host file 

    sudo nano /etc/nginx/sites-available/bacis.gsc.edu.ph


Inside `bacis.gsc.edu.ph`:

    server {
        listen 80;
        listen [::]:80;

        server_name bacis.gsc.edu.ph;

        root /home/ubuntu/bacis/data/public;

        index index.html;

        location / {
            proxy_pass http://localhost:9196;
            proxy_http_version 1.1;
            proxy_set_header Upgrade $http_upgrade;
            proxy_set_header Connection 'upgrade';
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_cache_bypass $http_upgrade;
            proxy_read_timeout 600s;
        }
    }

Enable site in Nginx by symlinking the file(s) into sites-enabled dir:

`sudo ln -s /etc/nginx/sites-available/bacis.gsc.edu.ph /etc/nginx/sites-enabled/`

Restart Nginx for changes to take effect

`sudo systemctl restart nginx`


## Setup node process using systemd 

See `bacis.service`
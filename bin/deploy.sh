cd ..
npm install concurrently
npm install pm2
npm install
sudo apt-get purge apache2
sudo rm -rf /etc/apache2
sudo apt autoremove
sudo apt remove apache2.*
sudo apt-get update
sudo apt-get install nginx
sudo ufw enable
sudo ufw allow 'Nginx Full'
sudo ufw allow 'OpenSSH'
sudo rm /etc/nginx/sites-available/default
echo "server {
        listen 80 default_server;
        listen [::]:80 default_server;
        root /var/www/html;
        index index.html index.htm index.nginx-debian.html;
        server_name $1;
        location / {
                try_files \$uri \$uri/ =404;
	            proxy_pass http://localhost:8080;
        }
}" > /etc/nginx/sites-available/default
sudo apt-get install software-properties-common
sudo apt-get update
sudo apt-get install python-certbot-nginx
sudo systemctl reload nginx






git pull origin main

sudo docker build --no-cache -t ghcr.io/ogwen123/table-service:latest .
sleep 2
sudo docker push ghcr.io/ogwen123/table-service:latest
sleep 2
sudo docker compose down -v
sleep 2
sudo docker compose up --pull always -d

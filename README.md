# shvydak.com Website

This is a simple static website serving as a personal dashboard.

## Development

To run the website locally, navigate to this directory and use the `http-server` package.

```bash
cd /home/y.shvydak/website
http-server
```

The site will be available at `http://<your-pi-ip>:8080`.

## Deployment

This site is exposed to the internet via a Cloudflare Tunnel.

The configuration is managed through the Cloudflare Zero Trust Dashboard, not a local `config.yml` file. The `shvydak.com` hostname points to `http://localhost:8080`.

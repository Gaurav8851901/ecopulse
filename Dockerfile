# Use standard, minimal, and secure Nginx base image
FROM nginx:alpine

# Copy custom nginx configuration for Cloud Run environment
COPY nginx.conf /etc/nginx/nginx.conf

# Copy static assets into the default Nginx public directory
COPY index.html /usr/share/nginx/html/
COPY css/ /usr/share/nginx/html/css/
COPY js/ /usr/share/nginx/html/js/

# Cloud Run defaults to exposing traffic on 8080.
# Nginx is configured to listen on 8080 inside nginx.conf.
EXPOSE 8080

# Start Nginx in the foreground
CMD ["nginx", "-g", "daemon off;"]

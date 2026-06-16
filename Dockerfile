# Minimal secure nginx image
FROM nginx:alpine


# Remove default nginx files
RUN rm -rf /usr/share/nginx/html/*


# Copy nginx configuration
COPY nginx.conf /etc/nginx/nginx.conf


# Copy application files
COPY index.html /usr/share/nginx/html/
COPY css/ /usr/share/nginx/html/css/
COPY js/ /usr/share/nginx/html/js/

COPY .well-known/security.txt /usr/share/nginx/html/.well-known/security.txt
COPY robots.txt /usr/share/nginx/html/robots.txt

# Create non-root user
RUN addgroup -S appgroup && \
    adduser -S appuser -G appgroup && \
    mkdir -p /run/nginx && \
    mkdir -p /var/cache/nginx && \
    mkdir -p /var/log/nginx && \
    chown -R appuser:appgroup \
        /usr/share/nginx/html \
        /var/cache/nginx \
        /var/log/nginx \
        /etc/nginx \
        /run/nginx

# Run nginx without root
USER appuser


EXPOSE 8080


CMD ["nginx", "-g", "daemon off;"]

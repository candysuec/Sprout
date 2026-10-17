# Sprout KinCare OS: Canonical Docker Environment
# Canonical Container Architecture: python:3.11-slim
FROM python:3.11-slim

# System invariants & Python optimization
ENV PYTHONUNBUFFERED=1 \
    PYTHONDONTWRITEBYTECODE=1 \
    HOST=0.0.0.0 \
    PORT=5858 \
    CCC_DATA_DIR=/data

# Set official canonical repository location
WORKDIR /home/gemi/projects/Sprout

# Provide compatibility symlink for /app
RUN ln -s /home/gemi/projects/Sprout /app

# Ensure persistent data directory structures exist with appropriate permissions
RUN mkdir -p /data/data /data/uploads /data/exports /data/backups /shared_docs

# Copy dependency definition and install
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy application source tree
COPY . .

# Expose official Sprout port
EXPOSE 5858

# Healthcheck verifying HTTP service availability
HEALTHCHECK --interval=15s --timeout=5s --start-period=5s --retries=3 \
  CMD python -c "import urllib.request; urllib.request.urlopen('http://127.0.0.1:5858/').read()" || exit 1

# Launch Sprout KinCare OS
CMD ["python", "app/server.py"]

#!/usr/bin/env bash
set -Eeuo pipefail

COMMIT_SHA="${1:?Commit SHA is required}"
IMAGE="dorlin-portfolio:${COMMIT_SHA}"
CURRENT="dorlin-portfolio"
PREVIOUS="dorlin-portfolio-previous"
CANDIDATE="dorlin-portfolio-candidate"

echo "Building image: ${IMAGE}"
sudo docker build -t "${IMAGE}" .

echo "Testing candidate container..."
sudo docker rm -f "${CANDIDATE}" >/dev/null 2>&1 || true
sudo docker run -d \
  --name "${CANDIDATE}" \
  -p 127.0.0.1:8081:80 \
  "${IMAGE}"

CANDIDATE_OK=0
for attempt in $(seq 1 20); do
  if curl -fsS http://127.0.0.1:8081/ >/dev/null; then
    CANDIDATE_OK=1
    break
  fi
  sleep 3
done

if [ "${CANDIDATE_OK}" -ne 1 ]; then
  echo "Candidate failed its health check."
  sudo docker logs "${CANDIDATE}" || true
  sudo docker rm -f "${CANDIDATE}" || true
  exit 1
fi

echo "Candidate passed. Preparing production deployment..."

# Remove an older rollback container; the current live container remains untouched.
sudo docker rm -f "${PREVIOUS}" >/dev/null 2>&1 || true

if sudo docker inspect "${CURRENT}" >/dev/null 2>&1; then
  sudo docker stop "${CURRENT}"
  sudo docker rename "${CURRENT}" "${PREVIOUS}"
fi

restore_previous() {
  echo "Restoring previous production container..."
  sudo docker rm -f "${CURRENT}" >/dev/null 2>&1 || true
  if sudo docker inspect "${PREVIOUS}" >/dev/null 2>&1; then
    sudo docker rename "${PREVIOUS}" "${CURRENT}"
    sudo docker start "${CURRENT}"
  fi
}

if ! sudo docker run -d \
  --name "${CURRENT}" \
  --restart unless-stopped \
  -p 80:80 \
  "${IMAGE}"; then
  restore_previous
  exit 1
fi

PRODUCTION_OK=0
for attempt in $(seq 1 20); do
  if curl -fsS http://127.0.0.1/ >/dev/null; then
    PRODUCTION_OK=1
    break
  fi
  sleep 3
done

sudo docker rm -f "${CANDIDATE}" >/dev/null 2>&1 || true

if [ "${PRODUCTION_OK}" -ne 1 ]; then
  echo "Production health check failed."
  sudo docker logs "${CURRENT}" || true
  restore_previous
  exit 1
fi

echo "Deployment passed its local health check."
echo "Image: ${IMAGE}"
echo "Commit: ${COMMIT_SHA}"
sudo docker ps

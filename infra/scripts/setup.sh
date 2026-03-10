#!/bin/bash
set -e

echo "Setting up solo fullstack monorepo..."

if ! command -v pnpm >/dev/null 2>&1; then
  echo "pnpm is required. Install it first: npm i -g pnpm"
  exit 1
fi

pnpm install

if [ ! -f .env ]; then
  cp .env.example .env
  echo "Created .env from .env.example"
fi

( cd infra/docker && docker compose up -d )

pnpm db:generate
pnpm db:push

echo "Setup complete. Run: pnpm dev"

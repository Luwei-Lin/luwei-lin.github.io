.PHONY: help dev up down build rebuild logs shell clean install prod deploy

# Default target
.DEFAULT_GOAL := help

# Colors for output
GREEN  := \033[0;32m
YELLOW := \033[0;33m
NC     := \033[0m # No Color

help: ## Show this help message
	@echo "$(GREEN)Available commands:$(NC)"
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | awk 'BEGIN {FS = ":.*?## "}; {printf "  $(YELLOW)%-15s$(NC) %s\n", $$1, $$2}'

dev: ## Start development server with hot reload (default)
	@echo "$(GREEN)Starting development server...$(NC)"
	docker-compose up blog-dev

up: dev ## Alias for 'make dev'

dev-build: ## Build and start development server
	@echo "$(GREEN)Building and starting development server...$(NC)"
	docker-compose up --build blog-dev

full: dev-build ## Alias for 'make dev-build' (build + run)

build: ## Build Docker images
	@echo "$(GREEN)Building Docker images...$(NC)"
	docker-compose build blog-dev

rebuild: ## Rebuild Docker images from scratch (no cache)
	@echo "$(GREEN)Rebuilding Docker images from scratch...$(NC)"
	docker-compose build --no-cache blog-dev

down: ## Stop and remove containers
	@echo "$(GREEN)Stopping containers...$(NC)"
	docker-compose down

stop: down ## Alias for 'make down'

restart: ## Restart the development server
	@echo "$(GREEN)Restarting development server...$(NC)"
	docker-compose restart blog-dev

logs: ## Show logs from the development server
	docker-compose logs -f blog-dev

shell: ## Open a shell in the development container
	@echo "$(GREEN)Opening shell in container...$(NC)"
	docker-compose exec blog-dev sh

bash: shell ## Alias for 'make shell'

install: ## Install/reinstall npm dependencies
	@echo "$(GREEN)Installing dependencies...$(NC)"
	docker-compose run --rm blog-dev npm install

clean: ## Clean up containers, volumes, and build artifacts
	@echo "$(GREEN)Cleaning up...$(NC)"
	docker-compose down -v
	rm -rf node_modules .next out

# Production commands
prod: ## Build and run production server (port 3001)
	@echo "$(GREEN)Starting production server...$(NC)"
	docker-compose --profile production up blog-prod

prod-build: ## Build production Docker image
	@echo "$(GREEN)Building production image...$(NC)"
	docker-compose --profile production build blog-prod

# Deployment
deploy-build: ## Build static site for deployment
	@echo "$(GREEN)Building static site...$(NC)"
	docker-compose run --rm -e NODE_ENV=production blog-dev npm run build
	@echo "$(GREEN)Static site built in ./out directory$(NC)"

deploy: deploy-build ## Build and prepare for GitHub Pages deployment
	@echo "$(GREEN)Running deployment script...$(NC)"
	bash scripts/deploy.sh

# Utility commands
ps: ## Show running containers
	docker-compose ps

status: ps ## Alias for 'make ps'

npm: ## Run npm command (usage: make npm CMD="install package-name")
	docker-compose run --rm blog-dev npm $(CMD)

lint: ## Run ESLint
	@echo "$(GREEN)Running linter...$(NC)"
	docker-compose run --rm blog-dev npm run lint

# Quick development shortcuts
dev-fresh: clean install dev ## Clean everything, install dependencies, and start dev server

local: ## Run development server locally (without Docker)
	npm run dev

local-install: ## Install dependencies locally (without Docker)
	npm install

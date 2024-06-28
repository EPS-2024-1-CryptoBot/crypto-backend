PURPLE = \033[95m
CYAN = \033[96m
DARKCYAN = \033[36m
BLUE = \033[94m
GREEN = \033[92m
YELLOW = \033[93m
RED = \033[91m
BOLD = \033[1m
UNDERLINE = \033[4m
END = \033[0m

help:
	@echo "$(YELLOW)# ------------------- Makefile commands ------------------- #$(END)"
	@echo ""
	@echo "$(GREEN)## DEV$(END)"
	@printf "$(CYAN)%-20s$(END) %b \n" "sonar-dev:" "Runs SonarQube analysis for development"
	@printf "$(CYAN)%-20s$(END) %b \n" "build-dev:" "Builds the development Docker image"
	@printf "$(CYAN)%-20s$(END) %b \n" "run-dev:" "Runs the development Docker containers"
	@printf "$(CYAN)%-20s$(END) %b \n" "dev:" "Builds and runs the development environment"
	@printf "$(CYAN)%-20s$(END) %b \n" "act:" "Runs all GitHub actions workflows using 'act'"
	@echo ""

	@echo "$(RED)## PRODUCTION$(END)"
	@printf "$(CYAN)%-20s$(END) %b \n" "sonar:" "Runs SonarQube analysis for production"
	@printf "$(CYAN)%-20s$(END) %b \n" "stop-prod:" "Stops the production Docker containers"
	@printf "$(CYAN)%-20s$(END) %b \n" "deploy-prod:" "Deploys the production Docker containers"
	@printf "$(CYAN)%-20s$(END) %b \n" "zip:" "Creates a zip archive of necessary files for production"
	@printf "$(CYAN)%-20s$(END) %b \n" "install:" "Installs npm dependencies"
	@printf "$(CYAN)%-20s$(END) %b \n" "local-build:" "Builds the application locally"
	@printf "$(CYAN)%-20s$(END) %b \n" "build:" "Builds the production Docker image"
	@printf "$(CYAN)%-20s$(END) %b \n" "run-prod:" "Runs the production Docker container locally"
	@printf "$(CYAN)%-20s$(END) %b \n" "debug-prod:" "Runs the production Docker container with interactive shell"
	@echo ""

	@echo "$(BLUE)## TERRAFORM$(END)"
	@printf "$(CYAN)%-20s$(END) %b \n" "tf-init:" "Initializes Terraform in the 'terraform' directory"
	@printf "$(CYAN)%-20s$(END) %b \n" "tf-plan:" "Runs Terraform plan in the 'terraform' directory"
	@printf "$(CYAN)%-20s$(END) %b \n" "tf-apply:" "Applies Terraform changes in the 'terraform' directory"
	@printf "$(CYAN)%-20s$(END) %b \n" "tf-apply-dev:" "Applies Terraform changes with dev environment specifics"
	@echo ""


###########################################################
# DEV
# include ./env/dev.env
# export
sonar-dev:
	clear
	export $$(grep -v '^#' .secrets | xargs) && \
	$(MAKE) sonar
.PHONY: build-dev run-dev
build-dev:
	export $$(grep -v "^#" .secrets | xargs) && \
	docker build -f Dockerfile.old.prod \
	--build-arg PORT=3000 \
	--build-arg JWT_SECRET=$${JWT_SECRET} \
	--build-arg DATABASE_URL="postgres://postgres:postgres@pgsql:5432/cryptobot" \
	--build-arg URL_WALLET=$${URL_WALLET} \
	--build-arg URL_RSA=$${URL_RSA} \
	--build-arg URL_CONSULTANT=$${URL_CONSULTANT} \
	--build-arg SYSTEM_PUB_K=$${SYSTEM_PUB_K} \
	--build-arg SYSTEM_PVT_K=$${SYSTEM_PVT_K} \
	--build-arg STOCK_COMPASS_API_URL=$${STOCK_COMPASS_API_URL} \
	-t backend:dev .
run-dev:
	docker-compose -f docker-compose-dev.yaml --env-file ./env/dev.env up -d --force-recreate
	docker exec -it backend_server sh
bigbang:
	$(MAKE) build-dev
	npm run db:migrate:up
	docker-compose -f docker-compose-dev.yaml --env-file ./env/dev.env up -d --force-recreate
dev:
	$(MAKE) build-dev
	npm run db:migrate:up
	docker-compose -f docker-compose-dev.yaml --env-file ./env/dev.env up --force-recreate
	
act:
	act --container-architecture linux/amd64 --secret-file .secrets --var-file .vars


###########################################################
# PRODUCTION
# include ./env/prod.env
# export
sonar:
	sonar-scanner \
	-Dsonar.projectKey=$$SONAR_PROJECT_KEY \
	-Dsonar.organization=$$SONAR_ORGANIZATION \
	-Dsonar.host.url=https://sonarcloud.io \
	-Dsonar.token=$$SONAR_TOKEN \
	-Dsonar.sources=src \
	-Dsonar.javascript.lcov.reportPaths=$$(pwd)/coverage/lcov.info \
	-Dsonar.language=js \
	-Dsonar.sourceEncoding=UTF-8 \
	-Dsonar.exclusions=node_modules/**,src/consultant/consultant.utils.ts \
	-Dsonar.cpd.exclusions=test/**,terraform/** \
	-Dsonar.coverage.exclusions=test/**,terraform/** \
	# -Dsonar.qualitygate.wait=true \

stop-prod:
	docker stop $(docker ps -aqf "name=server")
deploy-prod:
	docker compose -f docker-compose-prod.yaml up -d --build --force-recreate
zip:
	zip -r backend.zip ./dist ./node_modules ./package*.json ./tsconfig.json ./env/prod/firebase.json
install:
	npm ci
local-build:
	npm run build
build:
	docker build -f Dockerfile.prod \
	--build-arg PORT=$${PORT} \
	--build-arg JWT_SECRET=$${JWT_SECRET} \
	--build-arg DATABASE_URL=$${DATABASE_URL} \
	--build-arg URL_WALLET=$${URL_WALLET} \
	--build-arg URL_RSA=$${URL_RSA} \
	--build-arg URL_CONSULTANT=$${URL_CONSULTANT} \
	--build-arg SYSTEM_PUB_K=$${SYSTEM_PUB_K} \
	--build-arg SYSTEM_PVT_K=$${SYSTEM_PVT_K} \
	-t backend:prod .
run-prod:
	docker run --name crypto-backend --rm -p $${PORT}:$${PORT} backend:prod
debug-prod:
	docker run --name crypto-backend --rm -it backend:prod sh 

###########################################################
# TERRAFORM
tf-init:
	cd terraform && $(MAKE) init
tf-plan:
	cd terraform && $(MAKE) plan
tf-apply:
	cd terraform && $(MAKE) apply
tf-apply-dev:
	cd terraform && $(MAKE) apply-dev

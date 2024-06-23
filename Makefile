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
	@printf "$(CYAN)%-20s$(END) %b \n" "help:" "Shows this message"
	@echo ""

	@echo "$(GREEN)@ DEV$(END)"
	@printf "$(CYAN)%-20s$(END) %b \n" "sonar-dev:" "Uploads coverage and analyses code to SonarQube locally using '.secrets' file for envs."
	@echo ""
	@printf "$(CYAN)%-20s$(END) %b \n" "run-local:" "Runs $(UNDERLINE)docker-compose.yaml$(END) file and runs nest locally"
	@printf "$(CYAN)%-20s$(END) %b \n" "up-dev:" "Runs $(UNDERLINE)docker-compose-dev.yaml$(END) file only"
	@printf "$(CYAN)%-20s$(END) %b \n" "act:" "Runs all ./github/workflows GitHub actions workflows"
	@echo ""
	@printf "$(CYAN)%-20s$(END) %b \n" "tf-apply-dev:" "Runs terraform apply -auto-approve with .secrets and .vars files"
	@echo ""

	@echo "$(RED)@ PROD$(END)"
	@printf "$(CYAN)%-20s$(END) %b \n" "sonar:" "Uploads coverage and analyses code in production using SonarQube."
	@echo ""
	@printf "$(CYAN)%-20s$(END) %b \n" "build:" "Builds a production image as backend:prod"
	@printf "$(CYAN)%-20s$(END) %b \n" "run-prod:" "Runs backend:prod image locally"
	@printf "$(CYAN)%-20s$(END) %b \n" "debug-prod:" "Runs backend:prod image locally with interactive $(UNDERLINE)sh$(END)"

	@echo ""
	@printf "$(CYAN)%-20s$(END) %b \n" "tf-plan:" "Runs terraform plan"
	@printf "$(CYAN)%-20s$(END) %b \n" "tf-apply:" "Runs terraform apply -auto-approve"


###########################################################
# DEV
# include ./env/dev.env
# export
sonar-dev:
	clear
	export $$(grep -v '^#' .secrets | xargs) && \
	$(MAKE) sonar
.PHONY: build-dev up-dev
run-local:
	$(MAKE) up-dev
build-dev:
	export $$(grep -v "^#" .secrets | xargs) && \
	docker build -f Dockerfile.old.prod \
	--build-arg PORT=$${PORT} \
	--build-arg JWT_SECRET=$${JWT_SECRET} \
	--build-arg DATABASE_URL="postgres://postgres:postgres@localhost:5432/cryptobot" \
	--build-arg URL_WALLET=$${URL_WALLET} \
	--build-arg URL_RSA=$${URL_RSA} \
	--build-arg URL_CONSULTANT=$${URL_CONSULTANT} \
	--build-arg SYSTEM_PUB_K=$${SYSTEM_PUB_K} \
	--build-arg SYSTEM_PVT_K=$${SYSTEM_PVT_K} \
	-t backend:dev .
up-dev: build-dev
	docker-compose -f docker-compose-dev.yaml --env-file ./env/dev.env up -d --force-recreate

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

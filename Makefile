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
	@printf "$(CYAN)%-20s$(END) %b \n" "run-local:" "Runs $(UNDERLINE)docker-compose.yaml$(END) file and runs nest locally"
	@printf "$(CYAN)%-20s$(END) %b \n" "up:" "Runs $(UNDERLINE)docker-compose.yaml$(END) file only"
	@printf "$(CYAN)%-20s$(END) %b \n" "act:" "Runs all ./github/workflows GitHub actions workflows"
	@echo ""
	@printf "$(CYAN)%-20s$(END) %b \n" "tf-apply-dev:" "Runs terraform apply -auto-approve with .secrets and .vars files"
	@echo ""

	@echo "$(RED)@ PROD$(END)"
	@printf "$(CYAN)%-20s$(END) %b \n" "build:" "Builds a production image as backend:prod"
	@printf "$(CYAN)%-20s$(END) %b \n" "run-prod:" "Runs backend:prod image locally"
	@printf "$(CYAN)%-20s$(END) %b \n" "debug-prod:" "Runs backend:prod image locally with interactive $(UNDERLINE)sh$(END)"

	@echo ""
	@printf "$(CYAN)%-20s$(END) %b \n" "tf-plan:" "Runs terraform plan"
	@printf "$(CYAN)%-20s$(END) %b \n" "tf-apply:" "Runs terraform apply -auto-approve"


###########################################################
# DEV
run-local:
	$(MAKE) up
	npm run dev
up:
	docker-compose up -d

act:
	act --container-architecture linux/amd64 --secret-file .secrets --var-file .vars


###########################################################
# PRODUCTION
include ./env/prod.env
export
build:
	docker build -f Dockerfile.prod \
	--build-arg PORT=$${PORT} \
	--build-arg JWT_SECRET=$${JWT_SECRET} \
	--build-arg DATABASE_URL=$${DATABASE_URL} \
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
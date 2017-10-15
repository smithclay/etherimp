.PHONY: help
.DEFAULT_GOAL := help

CONTRACT_NAME=EtherImp
CONTRACT_FILE=$(CONTRACT_NAME).sol
CONTRACT_DIR=contracts
CONTRACT_FILE_PATH=$(CONTRACT_DIR)/$(CONTRACT_FILE)

BUILD_DIR=build
BUILD_ABI_PATH=$(BUILD_DIR)/$(CONTRACT_NAME)-abi.json
BUILD_BYTECODE_PATH=$(BUILD_DIR)/$(CONTRACT_NAME).bin

DEPLOYED_ADDRESS_PATH=$(BUILD_DIR)/DEPLOYED_ADDRESS

$(BUILD_ABI_PATH): $(CONTRACT_FILE_PATH) ## compliles solidity contract
	node compile $(CONTRACT_FILE_PATH) $(CONTRACT_NAME)

$(DEPLOYED_ADDRESS_PATH): $(BUILD_ABI_PATH) ## deploys contract to testrpc
	node deploy $(BUILD_ABI_PATH) $(BUILD_BYTECODE_PATH)

clean: ## Remove solidity compiler artifacts
	rm -f build/*.json
	rm -f build/*.bin
	rm -f build/DEPLOYED_ADDRESS

shell: $(DEPLOYED_ADDRESS_PATH) # starts interactive shell with contract loaded
	node shell $(BUILD_ABI_PATH) $(shell cat $(DEPLOYED_ADDRESS_PATH))

test: $(DEPLOYED_ADDRESS_PATH) ## runs tests on deployed contract
	node test $(BUILD_ABI_PATH) $(shell cat $(DEPLOYED_ADDRESS_PATH))

help:
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-30s\033[0m %s\n", $$1, $$2}'
.PHONY: help
help: makefile
	@tail -n +4 makefile | grep ".PHONY"


.PHONY: build
build:
	npx tsc


.PHONY: typecheck
typecheck:
	npx tsc -p tsconfig.test.json


.PHONY: lint
lint:
	npx eslint --max-warnings 0 .


.PHONY: unit-tests
unit-tests:
	find ./tests -iname '*.ts' -exec npx tsx {} \;


.PHONY: test
test: lint typecheck unit-tests

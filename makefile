.PHONY: help
help: makefile
	@tail -n +4 makefile | grep ".PHONY"


.PHONY: lint
lint:
	npx eslint --max-warnings 0 .


.PHONY: unit-tests
unit-tests:
	find ./tests -iname '*.js' -exec node {} \;


.PHONY: test
test: lint unit-tests

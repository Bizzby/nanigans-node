mocha = ./node_modules/.bin/mocha

# Run the tests.
test: node_modules
	@$(mocha) \
		--reporter spec \
		--bail

# Phonies.
.PHONY: test

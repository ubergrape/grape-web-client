OUTPUT := ../chatgrape/static
STATIC := ../chatgrape/templates
JS_FILES := $(shell find lib/ browser/ -name "*.js")
TEMPLATE_FILES := $(shell find templates/ -name "*.jade")
STYLUS_FILES := $(shell find stylus/ -name "*.styl")

all: $(OUTPUT)/index.js $(OUTPUT)/index.css $(STATIC)/chat.html
# $(OUTPUT)/index.html

test: node_modules lint
	NODE_ENV=test ./node_modules/.bin/mocha --harmony

lint:
	-./node_modules/.bin/jshint ./browser ./lib ./test ./index.js

$(STATIC)/chat.html: index.jade
	./node_modules/.bin/jade --pretty --path $< < $< > $@

$(OUTPUT)/index.js: components $(JS_FILES) $(TEMPLATE_FILES)
	@./node_modules/.bin/component build --use component-jade --out $(OUTPUT) --name index
	@touch $(OUTPUT)/index.css
	@mv $(OUTPUT)/index.css $(OUTPUT)/components.css

$(OUTPUT)/index.css: $(OUTPUT)/index.js $(STYLUS_FILES)
	@./node_modules/.bin/stylus --include-css --out $(OUTPUT) stylus/index.styl
	@./node_modules/.bin/autoprefixer $(OUTPUT)/index.css

node_modules: package.json
	npm install
	touch node_modules

components: node_modules component.json
	@./node_modules/.bin/component install --dev
	touch components

clean: clean-cov
	rm -rf components

lib-cov: clean-cov
	./node_modules/.bin/jscoverage lib lib-cov

clean-cov:
	rm -rf lib-cov

test-cov: lib-cov
	CG_COV=1 NODE_ENV=test ./node_modules/.bin/mocha --harmony --reporter html-cov 1> coverage.html

.PHONY: all clean lint test test-cov clean-cov

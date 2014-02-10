OUTPUT := ../chatgrape/static
STATIC := ../chatgrape/templates
JS_FILES := $(shell find lib/ browser/ -name "*.js")
TEMPLATE_FILES := $(shell find templates/ -name "*.jade")
STYLUS_FILES := $(shell find stylus/ -name "*.styl")

all: $(OUTPUT)/app/app.js $(OUTPUT)/app/app.css $(OUTPUT)/site/site.css $(STATIC)/chat.html
# $(OUTPUT)/index.html

test: node_modules lint
	NODE_ENV=test ./node_modules/.bin/mocha --harmony

lint:
	-./node_modules/.bin/jshint ./browser ./lib ./test ./index.js

$(STATIC)/chat.html: index.jade
	./node_modules/.bin/jade --pretty --path $< < $< > $@

$(OUTPUT)/app/app.js: components $(JS_FILES) $(TEMPLATE_FILES)
	@rm -f $(OUTPUT)/app/app.css
	@./node_modules/.bin/component build --use component-jade --out $(OUTPUT)/app --name app
	@touch $(OUTPUT)/app/app.css
	@mv $(OUTPUT)/app/app.css $(OUTPUT)/app/components.css

$(OUTPUT)/app/app.css: $(OUTPUT)/app/app.js $(STYLUS_FILES)
	@./node_modules/.bin/stylus --include-css --out $(OUTPUT)/app stylus/app.styl
	@./node_modules/.bin/autoprefixer $(OUTPUT)/app/app.css

$(OUTPUT)/site/site.css: $(STYLUS_FILES)
	@mkdir -p $(OUTPUT)/site
	@./node_modules/.bin/stylus --include-css --out $(OUTPUT)/site stylus/site.styl
	@./node_modules/.bin/autoprefixer $(OUTPUT)/site/site.css

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

LANGUAGES := de en
LANG_PO := $(addprefix locale/, $(addsuffix /LC_MESSAGES/client.po,$(LANGUAGES)))
LANG_JSON := $(addprefix locale/, $(addsuffix .json,$(LANGUAGES)))

OUTPUT := ../chatgrape/static/app
JS_FILES := index.js $(shell find lib browser local_components -name "*.js")
TEMPLATE_FILES := $(shell find templates -name "*.jade")
STYLUS_FILES := $(shell find stylus -name "*.styl")

JSXGETTEXT := ./node_modules/.bin/jsxgettext

all: $(OUTPUT)/app.js $(OUTPUT)/app.css

locale/%.json: locale/%/LC_MESSAGES/client.po
	node ./po2json.js $< > $@

po: $(JS_FILES) $(TEMPLATE_FILES)
	$(MAKE) -B $(LANG_PO)

locale/%/LC_MESSAGES/client.po:
	mkdir -p $(dir $@)

	$(JSXGETTEXT) --keyword=t --keyword=_ --language=javascript --join-existing --output $@ $(JS_FILES)
	$(JSXGETTEXT) --keyword=_ --language=jade --join-existing --output $@ $(TEMPLATE_FILES)

build/build.js: $(OUTPUT)/app.js
	./build.js --dev

test: build/build.js
	./node_modules/.bin/component-test phantom --coverage && \
	./node_modules/.bin/istanbul report lcov && \
	./node_modules/.bin/istanbul report text-summary

lint:
	./node_modules/.bin/jshint lib local_components browser test index.js

$(OUTPUT)/app.js: components $(JS_FILES) $(TEMPLATE_FILES) $(LANG_JSON)
	rm -f $(OUTPUT)/app.css
	./build.js --dev --prefix /static/app --copy --out $(OUTPUT) --name app
	touch $(OUTPUT)/app.css
	mv $(OUTPUT)/app.css $(OUTPUT)/components.css

$(OUTPUT)/app.css: $(OUTPUT)/app.js $(STYLUS_FILES)
	./node_modules/.bin/stylus -l --include-css --out $(OUTPUT) stylus/app.styl
	./node_modules/.bin/autoprefixer $(OUTPUT)/app.css

mobile: $(OUTPUT)/mobile/mobile.js $(OUTPUT)/mobile/mobile.css

node_modules: package.json
	npm install
	touch node_modules

components: node_modules component.json
	./node_modules/.bin/component install --dev && \
	touch components

clean:
	rm -rf components

.PHONY: all clean lint test po

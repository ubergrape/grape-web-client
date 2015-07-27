LANGUAGES := de en
LANG_PO := $(addprefix locale/, $(addsuffix /LC_MESSAGES/client.po,$(LANGUAGES)))
LANG_JSON := $(addprefix locale/, $(addsuffix .json,$(LANGUAGES)))

OUTPUT := ../chatgrape/static/app
JS_FILES := index.js $(shell find src/browser -name "*.js")
TEMPLATE_FILES := $(shell find src/templates -name "*.jade")
IMAGES_PATH := images

JSXGETTEXT := ./node_modules/.bin/jsxgettext

all: node_modules/.bin
	npm run build-dev
	mkdir -p $(OUTPUT)/cg
	cp -r $(IMAGES_PATH) $(OUTPUT)/cg/$(IMAGES_PATH)

locale/%.json: locale/%/LC_MESSAGES/client.po
	node ./po2json.js $< > $@

po: $(JS_FILES) $(TEMPLATE_FILES)
	$(MAKE) -B $(LANG_PO)

locale/%/LC_MESSAGES/client.po:
	mkdir -p $(dir $@)

	$(JSXGETTEXT) --keyword=t --keyword=_ --language=javascript --join-existing --output $@ $(JS_FILES)
	$(JSXGETTEXT) --keyword=_ --language=jade --join-existing --output $@ $(TEMPLATE_FILES)

node_modules/.bin: package.json
	npm install
	touch node_modules

clean:
	rm -rf node_modules

.PHONY: all clean

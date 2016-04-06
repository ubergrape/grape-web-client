OUTPUT := ../chatgrape/static/app
DIST := ./dist/**

all:
	npm install
	NODE_ENV=production npm run build
	mkdir -p $(OUTPUT)
	cp -r $(DIST) $(OUTPUT)

clean:
	rm -rf node_modules/.bin node_modules/*

.PHONY: all clean

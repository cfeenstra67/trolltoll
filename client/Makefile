
IPNS_URL=/ipns/k51qzi5uqu5dgt69crk35878t2mxbvo9xp4u3wenlvxr8ywgsty9ln3null8ve

ipns-build:
	PUBLIC_URL=$(IPNS_URL) npm run build

ipns-publish:
	ipfs name publish $(shell ipfs add -r build | tail -1 | cut -f2 -d" ")

build:
	npm run build

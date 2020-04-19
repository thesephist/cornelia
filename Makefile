CORNELIA = ./cmd/cornelia.go

all: run


run:
	go run -race ${CORNELIA}


# build for specific OS target
build-%:
	GOOS=$* GOARCH=amd64 go build -o cornelia-$* ${CORNELIA}


build:
	go build -o cornelia ${CORNELIA}


# clean any generated files
clean:
	rm -rvf cornelia cornelia-*

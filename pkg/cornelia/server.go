package cornelia

import (
	"encoding/json"
	"io"
	"log"
	"net/http"
	"os"
	"time"

	"github.com/gorilla/mux"
)

type lineRequestResponse struct {
	Line    string   `json:"line"`
	Title   string   `json:"title"`
	Choices []string `json:"choices"`
}

func getLine(w http.ResponseWriter, r *http.Request) {
	log.Println("New line request!")

	song := randomSong()
	choices := randomUniqueSongs(song, 3)

	resp := lineRequestResponse{
		Line:  song.randomLine(),
		Title: song.title,
		Choices: []string{
			choices[0].title,
			choices[1].title,
			choices[2].title,
		},
	}

	encoded, err := json.Marshal(resp)
	if err != nil {
		w.WriteHeader(500)
	}

	w.WriteHeader(200)
	w.Write(encoded)
}

func handleHome(w http.ResponseWriter, r *http.Request) {
	log.Println("New visit!")

	indexFile, err := os.Open("./static/index.html")
	if err != nil {
		io.WriteString(w, "error reading index")
		return
	}
	defer indexFile.Close()

	io.Copy(w, indexFile)
}

func Start() {
	mustLoadSongs()

	r := mux.NewRouter()

	srv := &http.Server{
		Handler:      r,
		Addr:         "127.0.0.1:1989",
		WriteTimeout: 60 * time.Second,
		ReadTimeout:  60 * time.Second,
	}

	r.HandleFunc("/", handleHome)
	r.Methods("GET").Path("/line").HandlerFunc(getLine)
	r.PathPrefix("/static/").Handler(http.StripPrefix("/static/", http.FileServer(http.Dir("./static"))))

	log.Printf("Cornelia listening on %s\n", srv.Addr)
	log.Fatal(srv.ListenAndServe())
}

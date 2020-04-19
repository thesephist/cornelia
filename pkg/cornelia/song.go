package cornelia

import (
	"io/ioutil"
	"log"
	"math/rand"
	"os"
	"path/filepath"
	"strings"
	"time"
)

const dataDir = "./data"

var songs []song

type song struct {
	title string
	lines []string
}

func (s song) randomLine() string {
	return s.lines[rand.Intn(len(s.lines))]
}

func (s song) hasLine(line string) bool {
	for _, given := range s.lines {
		if line == given {
			return true
		}
	}
	return false
}

func randomSong() song {
	return songs[rand.Intn(len(songs))]
}

func randomUniqueSongs(existing song, n int) []song {
	selection := []song{existing}

chooser:
	for len(selection) < n+1 {
		pick := randomSong()
		for _, selected := range selection {
			// NOTE: assume that if title is equal, songs are the same,
			// which is safe.
			if pick.title == selected.title {
				continue chooser
			}
		}

		selection = append(selection, pick)
	}

	return selection[1:]
}

func mustLoadSongs() {
	// seed RNG
	rand.Seed(time.Now().UnixNano())

	files, err := ioutil.ReadDir(dataDir)
	if err != nil {
		log.Fatal(err)
	}

	for _, fi := range files {
		name := fi.Name()

		lyricFile, err := os.Open(filepath.Join(dataDir, name))
		if err != nil {
			log.Println("Err while reading lyrics for", name)
			log.Fatal(err)
		}
		defer lyricFile.Close()

		lyrics, err := ioutil.ReadAll(lyricFile)
		if err != nil {
			log.Println("Err while reading lyrics for", name)
			log.Fatal(err)
		}

		songs = append(songs, song{
			title: strings.Replace(name, ".txt", "", 1),
			lines: strings.Split(string(lyrics), "\n"),
		})
	}

	log.Printf("%d songs loaded", len(songs))
}

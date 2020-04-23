# Cornelia 🚦

Guess that Taylor Swift line <3

1989.style is made with [Torus](https://github.com/thesephist/torus) and [blocks.css](https://github.com/thesephist/blocks.css). You can try it live at [1989.style](https://1989.style).

![1989.style](static/1989.png)

## Design

Cornelia was a one-night project, so for sake of time I kept the software design pretty simple. There's a Go server which serves static files, in addition to a single dynamic JSON endpoint, `GET /line`, which returns a new random line of lyric along with which song it was pulled from.

The client-side single page app polls this endpoint for each question and renders it, and keeps track of the score per-device, completely locally, with synchronous `localStorage`. The quiz is a single Torus component.

The endpoint returns data of the form

```js
{
    line: "I fell in love with a careless man's careful daughter",
    title: "Mine",
    choices: [
        "Should've Said No",
        "Superman",
        "You Are In Love",
    ],
}
```

i.e. it picks a song at random from the dataset, picks a line at random from that song, and also presents three other unique songs as alternate choices for the question. The server does not verify or keep track of answers.

### Source dataset

The dataset of lyrics is imported into the repository as a fixture and manually vetted for reasonable playability. It's stored as a flat directory of text files in `data/`. Each file is a song with the song title as the file name, and each line in the text file is a discrete lyric line that should be presented to the user in the quiz. This makes it trivial to add and revise the lyrics as needed.

Rather than use a structured database, for simplicity, Cornelia simply imports the dataset from the data directory on startup and commits it to a data structure in memory, from which it polls for new questions. Since there are only 120 songs, this design is just about as efficient as you can get.

## License

This project is licensed under the included MIT License, except the lyrics under `data/`, whose copyright belong to the rights holders of the records.

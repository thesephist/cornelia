# Cornelia

Guess that Taylor Swift line <3

1989.style is made with [Torus](https://github.com/thesephist/torus) and [blocks.css](https://github.com/thesephist/blocks.css). You can try it live at [1989.style](https://1989.style).

![1989.style](static/1989.png)

## Design

Cornelia was a weekend hack project, so for sake of time I kept the software design as simple as I could imagine. There's a Go server which serves static files, in addition to a single dynamic endpoint, `GET /line`, which returns a new random line of lyric along with which song it was pulled from, and 

## License

This project is licensed under the included MIT License, except the lyrics under `data/`, whose copyright belong to the rights holders of the records.

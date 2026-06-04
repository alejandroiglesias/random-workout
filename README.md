# Cast Iron

Strength left to chance — a random workout generator styled like a physical-culture almanac. Cast the die, take what the gods of iron give you.

## Run locally

```bash
npm install
npm start
```

Open [http://localhost:4178](http://localhost:4178).

No build step — vanilla HTML, CSS, and JavaScript served as static files.

## How it works

- On load, the app fetches the exercise catalogue from [yuhonas/free-exercise-db](https://github.com/yuhonas/free-exercise-db) (`dist/exercises.json` on GitHub).
- Each roll picks a random exercise with images and instructions.
- Log sets to start a 90-second rest timer and build a session card.
- Finish to see a session summary.

## Controls

| Action | Input |
|--------|--------|
| Roll / next exercise | Click the die, bottom bar, or press `R` |
| Log a set | **Log set** button or press `S` |
| Finish session | **Finish** in the header |
| Dismiss summary | Click outside or press `Esc` |

## Credits

Exercise data and images from [free-exercise-db](https://github.com/yuhonas/free-exercise-db) by yuhonas.

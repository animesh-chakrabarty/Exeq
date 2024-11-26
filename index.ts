import express, { Request, Response } from 'express';

const app = express();
const port = 3000;

app.get('/', (req: Request, res: Response) => {
  res.send('Hello from TypeScript and Express!');
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
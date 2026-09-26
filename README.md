# Random Block Graph Generator

This application allows users to create, delete, move and resize blocks on the screen. Lines are drawn between a block and its parent block, showing the relationship between blocks.

## Features

- Block Creation: Users can create blocks by clicking the '+' button on any existing block. The new block becomes a child of that block and will be randomly positioned within the window.

- Block Deletion: Users can delete blocks by clicking the '-' button on any block except the root block. The block, all of its descendant blocks and their lines will be removed.

- Block Movement: Users can move blocks around the screen by dragging them with a mouse, pen or finger. Blocks turn red while being dragged and stay inside the window. The lines connected to the block will adjust accordingly to maintain the connection.

- Block Resizing: Users can resize a block by dragging the black handle in its bottom-right corner. Blocks can't be made smaller than 100 × 100 px.

- Line Drawing: Lines are drawn between the centers of a block and its parent block, showing the relationship between blocks.

## Tech Stack

React 19, TypeScript, Vite and Tailwind CSS.

## How to Run the Project

Requires [Node.js](https://nodejs.org/) 20.19+ or 22.13+.

1. **Clone the repository**: First, you need to clone the repository to your local machine. You can do this by running the following command in your terminal:

   ```bash
   git clone https://github.com/salehinafnan/random-block-graph-generator.git
   ```

2. **Install the necessary packages**: Navigate into the project directory and run the following command to install all the necessary packages:

   ```bash
   cd random-block-graph-generator
   npm install
   ```

3. **Start the development server**: Finally, you can start the development server by running the following command:

   ```bash
   npm run dev
   ```

   The application should now be running at `http://localhost:5173`.

## Scripts

- `npm run dev`: Start the development server
- `npm run build`: Type-check and build the project for production into `dist`
- `npm run preview`: Preview the production build locally
- `npm run lint`: Lint the project with ESLint
- `npm run format`: Format the project with Prettier

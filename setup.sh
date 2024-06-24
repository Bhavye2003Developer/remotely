cd server
npm install

cd ../client
npm install

echo "dependencies have been installed"

cd ../
node server/src/index.js &

cd client
npm run dev -- --host
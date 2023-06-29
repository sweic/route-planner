<h1><a href="https://sroutes-client.fly.dev" target="_blank">Live Web App</a></h1>
<h2>📝 Project Description</h2>
<p>I enjoy long distance running and have been primarily using Strava's routes to plan my training loops. After my Strava premium expired, I wanted to make a free, lightweight and minimalistic route planning and sharing web app.</p>
</br>
<h2>✅ Features</h2>
<ul>
<li>Interactive map interface</li>
<li>Ability to add multiple destinations and plan routes</li>
<li>Computes shortest path routes between two points</li>
<li>Calculates and keeps track of route distance</li>
<li>Undo/Redo functionality</li>
<li>Search functionality to find specific address or landmarks</li>
<li>Save and manage favourite routes</li>
<li>Share routes with friends using an encoded shortlink</li>
<li>Responsive web and mobile design</li>
</ul>
</br>
<h2>📚 Development Stack:</h2>
<ul>
<li><a href="https://www.solidjs.com/">SolidJS</a></li>
<li><a href="https://www.rust-lang.org/">Rust</a></li>
<li><a href="https://redis.io/">Redis</a></li>
</ul>
</br>
<h2>🛠 Setting up local development environment:</h2>
<ul>
<li>Install Redis on your local machine.</li>
<li>Start machine's redis server</li>
<li>Create a new folder and <code>git clone https://github.com/sweic/route-planner.git</code></li>
<li>Fill up the <code>.env.example</code> file inside client and server subfolder and rename to <code>.env</code></li>
<li><code>npm install</code> in the client subfolder</li>
<li>To start client, run <code>npm run dev</code> in client subfolder
<li>App should be running on <code>http://localhost:3000/</code></li>
<li>To start server, run <code>cargo watch -x run</code></li>
</ul>
</br>

<h2>🛣️ Roadmap</h2>
<ul>
<li>Elevation profile across route</li>
<li>Hover markers displaying distance along route</li>
</ul>
</br>
<h2>🙏 Map Attribution & Credits</h2>
<ul>
<li>Map Tiles and Data - <a href="https://stadiamaps.com/" target="_blank">Stadia Maps</a> <a href="https://openmaptiles.org/" target="_blank">OpenMapTiles</a><a href="https://openstreetmap.org" target="_blank"> OpenStreetMap</a></li>
<li>Routing Engine - <a href="https://project-osrm.org/" target="_blank">Project OSRM</a></li>
<li>Search Geocoding - <a href="https://www.arcgis.com/index.html/" target="_blank">ArcGIS</a></li>
</ul>
</br>
<h2>🗒️ Notes</h2>
<ul>
<li>It is possible to host your own version of OSRM's routing engine, by containerising it into a Docker image and deploying it to the cloud.</li>
<li>Latency reduction of up to 200ms during production</li>
<li>However, this is extremetly costly due to the significant computation and memory resource required. (from unfortunate experience) </li>
<li>Therefore, it is recommended to use Project OSRM's public and free API</li>
</ul>

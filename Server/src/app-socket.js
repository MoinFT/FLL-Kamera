import express from "express";
import { createServer } from "node:http";
import { Server } from "socket.io";

const app = express();
const server = new createServer(app);
const io = new Server(server, {
    cors: { origin: '*' }
});

let iotDevices = new Map();
let rooms = new Map();

app.get("/", (req, res) => {
    res.sendFile(
        "[PFAD-ZUM-SOURCE-ORDNER]/src/web/index.html"
    );
});

app.get("/:file", (req, res) => {
    var file = req.params.file;

    res.sendFile(
        "[PFAD-ZUM-SOURCE-ORDNER]/src/web/" + file
    );
});

app.get("/img/:file", (req, res) => {
    var file = req.params.file;

    res.sendFile(
        "[PFAD-ZUM-SOURCE-ORDNER]/src/web/img/" + file
    );
});

app.get("/fonts/:file", (req, res) => {
    var file = req.params.file;

    res.sendFile(
        "[PFAD-ZUM-SOURCE-ORDNER]/src/web/fonts/" + file
    );
});

server.listen(3000, '[SERVER-IP-ADRESSE]', () => {
    console.log("server running at http://localhost:3000");
});

io.on("connection", (socket) => {
    let address = socket.handshake.address;
    console.log("New client connection established...", address);

    //=================================================
    // Initialize
    //=================================================
    socket.on("piCamInit", (data) => {
        console.log("Camera " + data + " is now online!");

        if (!iotDevices.has(data)) {
            // Camera socket will join a room given by the id
            let camWebStreamChannel = data + "WebStream";
            socket.join(camWebStreamChannel);

            // Add camera client to a room map for easier maintaining
            if (rooms.has(camWebStreamChannel)) {
                rooms.get(camWebStreamChannel).set(socket.id, socket);
            } else {
                rooms.set(camWebStreamChannel, new Map().set(socket.id, socket));
            }

            // Add camera client to a map for easier maintaining
            iotDevices.set(data, socket);

        } else if (iotDevices.get(data) !== socket) {
            console.log("Camera socket different from map, Adding the new socket into the map.");
            let camWebStreamChannel = data + "WebStream";
            iotDevices.get(data).leave(camWebStreamChannel);
            socket.join(camWebStreamChannel);
            iotDevices.set(data, socket);
        }
    });

    //=================================================
    // Pi Camera Streaming
    //=================================================
    socket.on("piVideoStream", (data, res) => {
        let camWebStreamChannel = data + "WebStream";
        socket.to(camWebStreamChannel).emit("consumerReceiveFeed", data, res);
    });

    //=================================================
    // Consumer Join to Start Watching Stream
    //=================================================
    socket.on("consumerStartViewing", (data, res) => {
        console.log("Start stream from client " + address + " on pi camera ", data);
        let camWebStreamChannel = data + "WebStream";

        if (iotDevices.has(data)) {
            socket.join(camWebStreamChannel);

            // Add web client to a room map for easier maintaining
            if (rooms.has(camWebStreamChannel)) {
                rooms.get(camWebStreamChannel).set(socket.id, socket);
            } else {
                rooms.set(camWebStreamChannel, new Map().set(socket.id, socket));
            }

            res("Connect to " + camWebStreamChannel + " channel");
        } else {
            res("Camera is not online");
        }
    });
});

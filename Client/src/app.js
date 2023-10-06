import io from 'socket.io-client';
import { spawn } from 'child_process';

const socket = io('http://[DEINE-SERVER-IP-ADRESSE]:3000', {
    autoConnect: false,
    transports: ['websocket'],
});

socket.on('connect', () => {
    socket.sendBuffer = [];

    console.log("Connected to the server!");

    socket.emit("piCamInit", "CamX");

    cameraStartCapture().then(() => {
        console.log('Camera is now capturing');
    });
});

async function cameraStartCapture() {
    const defaultCommandArgs = {
        '--codec': 'mjpeg',
        '-q': 80,
        '-o': '-',
        '-t': 0
    }

    const libCamVid = spawn('libcamera-vid', Object.entries(defaultCommandArgs).join(',').split(','))
    // allow the user to detect two types of errors separately
    libCamVid.on('error', (data) => {
        console.log(data);
    })

    let stdoutBuffer = Buffer.alloc(0);
    let streams = [];

    libCamVid.stdout.on('data', (data) => {
        streams.forEach(stream => stream.push(data));

        stdoutBuffer = Buffer.concat([stdoutBuffer, data]);

        // Extract all image frames from the current buffer
        while (true) {
            const signatureIndex = stdoutBuffer.indexOf(Buffer.from([0xff, 0xd8, 0xff, 0xe0, 0x00, 0x10, 0x4a]), 0);
            if (signatureIndex === -1)
                break;
            // Make sure the signature starts at the beginning of the buffer
            if (signatureIndex > 0)
                stdoutBuffer = stdoutBuffer.slice(signatureIndex);
            const nextSignatureIndex = stdoutBuffer.indexOf(Buffer.from([0xff, 0xd8, 0xff, 0xe0, 0x00, 0x10, 0x4a]), Buffer.from([0xff, 0xd8, 0xff, 0xe0, 0x00, 0x10, 0x4a]).length);
            if (nextSignatureIndex === -1)
                break;
            socket.emit('piVideoStream', 'CamX', "data:image/jpeg;base64," + stdoutBuffer.slice(0, nextSignatureIndex).toString("base64"), { buffer: true });
            stdoutBuffer = stdoutBuffer.slice(nextSignatureIndex);
        }
    });
}

socket.connect();

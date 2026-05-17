# FLL Kamera auf dem Raspberry Pi einrichten

## Inhalt

1. [Vorbereitung](#vorbereitung)
    1. [Alle Updates machen](#alle-updates-machen)
    2. [Statische IP-Adresse](#statische-ip-adresse)
    3. [Node.JS installieren](#nodejs-installieren)
2. [FLL Kamera Scripte](#fll-kamera-scripte)
3. [Ausführen](#ausführen)

## Vorbereitung

### Raspberry Pi Image

- Image: Raspberry Pi OS (Legacy, 64-Bit) Lite

### Alle Updates machen

- `sudo apt-get update && sudo apt-get upgrade -y`

### Statische IP-Adresse

1. `sudo nano /etc/network/interfaces`
2. Die follgenden Zeilen unten einfügen:

    ```shell
    # The primary network interface
    auto eth0
    allow-hotplug eth0
    iface eth0 inet static
            address 192.168.2.XXX
            netmask 255.255.255.0
            gateway 192.168.2.1

    dns-nameservers 192.168.2.1 8.8.8.8
    ```

3. Die `XXX` gegen eine
    - `11` bei "Raspberry Pi 1" austauschen
    - `12` bei "Raspberry Pi 2" austauschen
    - `13` bei "Raspberry Pi 3" austauschen (Ersatz)

### Node.JS installieren

1. `sudo apt-get install -y ca-certificates curl gnupg`
2. `sudo mkdir -p /etc/apt/keyrings`
3. `curl -fsSL https://deb.nodesource.com/gpgkey/nodesource-repo.gpg.key | sudo gpg --dearmor -o /etc/apt/keyrings/nodesource.gpg`
4. `NODE_MAJOR=20`
5. `echo "deb [signed-by=/etc/apt/keyrings/nodesource.gpg] https://deb.nodesource.com/node_$NODE_MAJOR.x nodistro main" | sudo tee /etc/apt/sources.list.d/nodesource.list`
6. `sudo apt-get update`
7. `sudo apt-get install nodejs -y`

## FLL Kamera Scripte

1. Einen Ordner `FLL-Cam` im `/home/pi` Verzeichnis erstellen

    ```shell
    cd /home/pi
    ```

    ```shell
    mkdir FLL-Cam
    ```

2. Die Dateien aus dem `Client` Ordner in den Ordner `FLL-Cam` kopieren
3. Die IP-Adresse in der Datei `src/app.js` anpassen

    ```js
    import io from 'socket.io-client';
    import { spawn } from 'child_process';

    var socket = io('http://[DEINE-SERVER-IP-ADRESSE]:3000', {
        autoConnect: false,
        transports: ['websocket'],
    });
    ```

4. `CamX` gegen
    - `Cam1` bei "Raspberry Pi 1" austauschen
    - `Cam2` bei "Raspberry Pi 2" austauschen

    ```js
    socket.on('connect', () => {
        socket.sendBuffer = [];

        console.log("Connected to the server!");

        socket.emit("piCamInit", "CamX");

        cameraStartCapture().then(() => {
            console.log('Camera is now capturing');
        });
    });
    ```

    ```js
    socket.emit('piVideoStream', 'CamX', "data:image/jpeg;base64," + stdoutBuffer.slice(0, nextSignatureIndex).toString("base64"), { buffer: true });
    ```

5. Die Node.JS Dependencies installieren

    ```shell
    cd /home/pi/FLL-Cam
    ```

    ```shell
    npm install
    ```

## Ausführen

1. In das Verzeichnis `FLL-Cam` navigieren
2. Die folgende Zeile ausführen

    ```shell
    npm run start
    ```

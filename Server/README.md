# FLL Kamera Server einrichten

## Inhalt

1. [Vorbereitung](#vorbereitung)
    1. [Statische IP-Adresse](#statische-ip-adresse)
    2. [Node.JS installieren](#nodejs-installieren)
2. [FLL Kamera Scripte](#fll-kamera-scripte)
3. [Ausführen](#ausführen)

## Vorbereitung

### Statische IP-Adresse

1. Die "Systemsteuerung" aufrufen
2. "Netzwerk und Internet" -> "Netzwerk- und Freigabecenter"
3. Auf die aktuelle "Verbindung" klicken
4. Die "Eigenschaften" öffnen
5. Den Punkt "Internetprotokoll, Version 4(TCP/IPv4)" doppel klicken
6. "Folgende IP-Adresse verwenden" auswählen und die folgenden Felder ausfüllen
    - IP-Adresse: 192.168.178.10
    - Subnetzmaske: 255.255.255.0
    - Standardgateway: 192.168.178.1
7. Dann alle Fenster mit "OK" schließen

### Node.JS installieren

1. Auf die Webseite von [Node.JS](https://nodejs.org/de/download/current) aufrufen
2. Das "Windows-Installationsprogramm" herunterladen und ausführen

## FLL Kamera Scripte

1. Den Pfad zum `/src/web/`-Ordner und die IP-Adresse in der Datei `src/app-socket.js` anpassen

    ```js
    app.get("/", (req, res) => {
        res.sendFile(
            "[DEIN-PFAD-ZUM-SOURCE-ORDNER]/src/web/index.html"
        );
    });

    app.get("/:file", (req, res) => {
        var file = req.params.file;

        res.sendFile(
            "[DEIN-PFAD-ZUM-SOURCE-ORDNER]/src/web/" + file
        );
    });

    app.get("/img/:file", (req, res) => {
        var file = req.params.file;

        res.sendFile(
            "[DEIN-PFAD-ZUM-SOURCE-ORDNER]/server/src/web/img/" + file
        );
    });

    server.listen(3000, '[DEINE-SERVER-IP-ADRESSE]', () => {
        console.log("server running at http://localhost:3000");
    });
    ```

2. Die IP-Adresse in der `/src/web/index.js` anpassen

    ```js
    var socket = io("http://[DEINE-SERVER-IP-ADRESSE]:3000", {
        autoConnect: false,
        transports: ["websocket"],
    });
    ```

3. Die IP-Adresse in der `/src/web/style.css` anpassen

    ```css
    body {
        margin: 0;
        background-color: #333333;
        background-image: url("http://[DEINE-SERVER-IP-ADRESSE]:3000/img/background.jpg");
        background-size: 100%;
    }
    ```

4. In das Verzeichnis `FLL-Camera/Server` navigieren
5. Die Node.JS Dependencies installieren

    ```shell
    npm install
    ```

## Ausführen

1. In das Verzeichnis `FLL-Camera/Server` navigieren
2. Die folgende Zeile ausführen

    ```shell
    npm run start
    ```

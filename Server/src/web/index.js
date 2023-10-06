var socket = io("http://[DEINE-SERVER-IP-ADRESSE]:3000", {
    autoConnect: false,
    transports: ["websocket"],
});

socket.on("connect_error", (err) => {
    console.log(`connect_error due to ${err.message}`);
});

socket.on("connect", () => {
    console.log("Socket connected: ", socket.connected);
    socket.sendBuffer = [];

    socket.emit("consumerStartViewing", "Cam1", (data) => {
        console.log(data);
    });

    socket.emit("consumerStartViewing", "Cam2", (data) => {
        console.log(data);
    });

    socket.on("consumerReceiveFeed", (data, res) => {
        if (data == "Cam1") {
            var cam1Image = res;
            $("#playCam1_1").attr("src", cam1Image);
            $("#playCam1_2").attr("src", cam1Image);
        }

        if (data == "Cam2") {
            var cam2Image = res;
            $("#playCam2_1").attr("src", cam2Image);
            $("#playCam2_2").attr("src", cam2Image);
        }
    });
});

socket.connect();

var timer;

function startStopwatch() {
    // 150000 Millisekunden = 150 Sekunden = 2 Minute 30 Sekunden
    var endTime = new Date(new Date().getTime() + 150000);

    timer = setInterval(() => {
        var countDown = new Date(endTime.getTime() - new Date().getTime());
        var countDownText = ("0" + countDown.getMinutes()).slice(-2) + ":" + ("0" + countDown.getSeconds()).slice(-2);

        if (countDown <= 500) {
            clearInterval(timer);
        }

        if (
            (countDown <= 11000 && countDown >= 10000) ||
            (countDown <= 9000 && countDown >= 8000) ||
            (countDown <= 7000 && countDown >= 6000) ||
            (countDown <= 5000 && countDown >= 4000) ||
            (countDown <= 3000 && countDown >= 2000) ||
            (countDown <= 1000)) {
            $("p#stopwatch").css("color", "#B30000")
        } else {
            $("p#stopwatch").css("color", "#EEEEEE")
        }

        $("p#stopwatch").text(countDownText);
    }, 100);
}

function resetStopwatch() {
    $("p#stopwatch").text("02:30");
    $("p#stopwatch").css("color", "#EEEEEE")

    clearInterval(timer);
}

function switchTable(currentCam) {
    if (currentCam == "cam1") {
        $("div#cam1").css("display", "none");
        $("div#cam2").css("display", "block");
    } else if (currentCam == "cam2") {
        $("div#cam1").css("display", "block");
        $("div#cam2").css("display", "none");
    }
}
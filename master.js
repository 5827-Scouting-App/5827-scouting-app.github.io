var data = [];
var usedKeys = [];
var tData;
var stream1;
var sort = new Tablesort(document.getElementById('datTable'));
function launchAddModal() {
    $('#addDataModal').toggleClass('is-active')
    $('#success').html('');

    var video = document.createElement("video");
    var canvasElement = document.getElementById("canvas");
    var canvas = canvasElement.getContext("2d");

    // Use facingMode: environment to attemt to get the front camera on phones
    navigator.mediaDevices.getUserMedia({
        video: {
            facingMode: "environment"
        }
    }).then(function (stream) {
        video.srcObject = stream;
        video.setAttribute("playsinline", true); // required to tell iOS safari we don't want fullscreen
        video.play();
        stream1 = stream;
        requestAnimationFrame(tick);

    });

    function tick() {
        if (video.readyState === video.HAVE_ENOUGH_DATA) {
            canvasElement.hidden = false;

            canvasElement.height = video.videoHeight;
            canvasElement.width = video.videoWidth;
            canvas.drawImage(video, 0, 0, canvasElement.width, canvasElement.height);
            var imageData = canvas.getImageData(0, 0, canvasElement.width, canvasElement.height);
            var code = jsQR(imageData.data, imageData.width, imageData.height, {
                inversionAttempts: "dontInvert",
            });
            if (code) {
                let tmp = JSON.parse(code.data);
                tData = tmp;
                $('#success').html('Found QR code! ' + code.data);

                /*stream1.getTracks().forEach(function (track) {
                    track.stop();
                });*/
            }
        }
        requestAnimationFrame(tick);
    }
}

function lookup() {
    $('#lookupModal').toggleClass('is-active');
}

function exportData() {
    //qr code gen with the data array
}

function importData() {
    var tmp = tData;
    if (usedKeys.includes(tmp.key)) {
        alert("Data has already been entered!")
    }
    var team = tData.teamNum;
    var create = true;
    var index = -1;
    for (var i = 0; i < data.length; i++) {
        if (data[i].team == team) {
            create = false;
            index = i;
            break;
        }
    }

    //What is the average data going to look like?
    /*
    {
        team: 1111,
        drivetrain: "",
        pAccBall: 0,
        pHighBall: 0,
        played: 12,
        tAccBall: 132,
        tHighBall: 110,
    }                
    */
    if (create) {
        var obj = {
            team: tmp.teamNum,
            drivetrain: "",
            pAccBall: 0,
            weight: 0,
            pHighBall: 0,
            pLowBall: 0,
            pClimb: false,
            played: 0,
            tAccBall: 0,
            tHighBall: 0,
            tLowBall: 0,
            fAccBall: 0,
            fHighBall: 0,
            fLowBall: 0,
            aAccBall: 0,
            aHighBall: 0,
            aLowBall: 0,
            pCycles: 0,
            tCycles: 0,
            matches: [],
            mScouts: [],
            pScouts: [],
            wins: 0,
            draw: 0,
            loss: 0,
            aClimbs: [],
            didClimb: 0,
            canClimb: -1,
            bd: 0,
            autoNotes: [],
            notes: [],
            highBall: -1,
            pAccuracy: 0,
            controlwheel: -1
        }
        if (tmp.type == 0) {
            obj.played++;
            obj.mScouts.push(tmp.scoutName)
            obj.matches.push(tmp.matchNum)
            obj.tAccBall += tmp.successfulAccBall
            obj.tHighBall += tmp.successfulHighBall
            obj.fAccBall += tmp.failedAccBall
            obj.fHighBall += tmp.failedHighBall
            obj.tCycles += tmp.cycles
        } else {
            obj.pScouts.push(tmp.scoutName)
            obj.drivetrain = tmp.drivetrain
            obj.highBall = tmp.ballTarget
            obj.canClimb = tmp.p_climb
            obj.pCycles = tmp.p_cycles
            obj.pAccuracy = tmp.p_accuracy
            obj.notes.push(tmp.regNotes)
            obj.autoNotes.push(tmp.autoDescruption)
            obj.controlwheel = tmp.controlwheel

        }
        data.push(obj)
    } else {
        if (tmp.type == 0) {
            data[index].played++;
            data[index].mScouts.push(tmp.scoutName)
            data[index].matches.push(tmp.matchNum)
            data[index].tHighBall += tmp.sHighBall
            data[index].aHighBall += tmp.aHighBall
            data[index].tLowBall += tmp.sLowBall
            data[index].aLowBall += tmp.aLowBall
            data[index].aClimbs.push(tmp.climb);
            data[index].tCycles = ((data[index].tLowBall + data[index].tHighBall) / 5) / data[index].played;
            if (tmp.climb > 2) {
                data[index].didClimb++
            }
            if (tmp.win == 0) {
                data[index].loss++;
            } else if (tmp.win == 1) {
                data[index].draw++;
            } else if (tmp.win == 2) {
                data[index].wins++;
            }
        } else {
            data[index].pScouts.push(tmp.scoutName)
            data[index].pAccBall = tmp.AccBall
            data[index].pHighBall = tmp.HighBall
            data[index].pCycles = tmp.cycles
        }
    }
    $('#addDataModal').toggleClass('is-active')
    refreshTable();
}

function importTxtData() {
    let _dat = document.getElementById('imprtdat').value;
    let parsed = JSON.parse(_dat);
    data = parsed;
    launchAddModal();
    refreshTable();
}

function refreshTable() {
    //clear table
    //add each element to table
    $('#numTableBod').empty();
    $('#datTableBod').empty();

    for (var i = 0; i < data.length; i++) {
        var num = '<tr><td>' + (i + 1) + '</td></tr>'
        $('#numTable').append(num);
        //
        //

        var xx = '<tr><td>' + data[i].team + '</td><td>' + data[i].played + '</td><td>-</td><td>' + data[i].wins + '/' + data[i].draw + '/' + data[i].loss + '</td><td>' + (data[i].aHighBall / data[i].played) + '</td><td>' + (data[i].aLowBall / data[i].played) + '</td><td>' + (data[i].tHighBall / data[i].played) + '</td><td>' + (data[i].tLowBall / data[i].played) + '</td><td>' + data[i].aClimbs.toString() + '</td><td>' + (data[i].didClimb / data[i].played) + '</td><td>-</td>'
        $('#datTable').append(xx);
    }
    //sort = new Tablesort(document.getElementById('datTable'));
    sort.refresh();
}

function download() {
    var element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(JSON.stringify(data)));
    element.setAttribute('download', "data.txt");

    element.style.display = 'none';
    document.body.appendChild(element);

    element.click();

    document.body.removeChild(element);
}

function getTeams() {
    var list = document.getElementById('teams').value.split(',');

    $('#teamList').empty();



    for (var i = 0; i < list.length; i++) {
        var index = 0;
        for (var i = 0; i < data.length; i++) {
            if (data[i].team == list[i]) {
                index = i;
            }
        }
        var tmp = data[index];
        var str = "<div class='column'><table class='table is-striped' style='border-width:1px'><tr><th colspan='2'><strong>" + list[i] + "</strong></th></tr><tr><td>W/D/L</td><td>" + tmp.wins + '/' + tmp.draw + '/' + tmp.loss  + "</td></tr><tr><td>PCycles</td><td></td></tr><tr><td>AH/m</td><td></td></tr><tr><td>AL/m</td><td></td></tr><tr><td>H/m</td><td></td></tr><tr><td>L/m</td><td></td></tr><tr><td>Climb%</td><td></td></tr><tr><td>Notes</td><td></td></tr></table></div>"
        $('#teamList').append(str);
    }
}